package api

import (
	"context"
	"log/slog"
	"net/http"

	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/api/handlers"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/api/middleware"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/cache"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/config"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/repository"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/service/ai_planner"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/service/community"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/service/itinerary"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/service/packages"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/service/upload"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/service/user"
	"github.com/gin-gonic/gin"
	"github.com/ulule/limiter/v3"
	"github.com/ulule/limiter/v3/drivers/store/redis"
	"gorm.io/gorm"
)

func SetupRouter(db *gorm.DB, cfg *config.Config, uploadService upload.UploadService) *gin.Engine {
	// Force release mode to suppress verbose route logs
	gin.SetMode(gin.ReleaseMode)

	// 1. Initialize Redis Cache
	var redisClient cache.Client
	if redisImpl, err := cache.NewGoRedisClient(cfg.RedisURL); err == nil {
		redisClient = redisImpl
		slog.Info("✅ Redis connected successfully")
	} else {
		slog.Warn("⚠️ Failed to connect to Redis — using Noop runtime", "error", err)
		redisClient = &cache.NoopClient{}
	}

	// 2. Initialize Repositories
	userRepo := repository.NewGormUserRepository(db)
	packageRepo := repository.NewGormPackageRepository(db)
	itineraryRepo := repository.NewGormItineraryRepository(db)
	communityRepo := repository.NewGormCommunityRepository(db)

	// Distributed Rate Limiter Store
	var limiterStore limiter.Store
	if redisImpl, ok := redisClient.(*cache.GoRedisClient); ok {
		s, err := redis.NewStore(redisImpl.GetRawClient())
		if err == nil {
			limiterStore = s
		}
	}

	// 3. Initialize Services
	var plannerService ai_planner.PlannerService
	userService := user.NewService(userRepo, cfg.JWTSecret)
	packageService := packages.NewPackageService(packageRepo)
	itineraryService := itinerary.NewService(itineraryRepo)
	communityService := community.NewCommunityService(communityRepo)
	geminiClient, err := ai_planner.NewGeminiClientImpl(context.Background(), cfg.GeminiAPIKey, cfg.GeminiModel)
	if err == nil {
		// We use new GenerateItinerary interface, so InterviewService wrapping is fine
		// because we added GenerateItinerary method to InterviewService.
		plannerService = ai_planner.NewInterviewService(geminiClient, redisClient)
		slog.Info("✅ AI Planner service (Gemini) initialised")
	} else {
		slog.Error("❌ Failed to initialize Gemini API client", "error", err)
	}

	// 4. Initialize Handlers
	r := gin.New()
	registerDocs(r)

	// Global Middlewares
	r.Use(middleware.CORSMiddleware(cfg.AllowedOrigins))
	r.Use(gin.Recovery())
	r.Use(middleware.RequestIDMiddleware())
	r.Use(middleware.LoggerMiddleware())

	// Health Check
	r.GET("/health", func(c *gin.Context) {
		sqlDB, _ := db.DB()
		if err := sqlDB.Ping(); err != nil {
			c.JSON(http.StatusServiceUnavailable, gin.H{"status": "error", "message": "database ping failed"})
			return
		}
		if err := redisClient.Ping(c.Request.Context()); err != nil {
			c.JSON(http.StatusOK, gin.H{"status": "degraded", "message": "redis ping failed", "database": "ok"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	h := handlers.NewAppHandler(db, cfg, plannerService, userService, itineraryService, communityService, uploadService, redisClient)

	mh := &handlers.PackagesHandler{DB: db, Cfg: cfg, PackageService: packageService, ItinerarySvc: itineraryService, UploadSvc: uploadService}

	v1 := r.Group("/api/v1")
	v1.GET("/health", h.HealthCheck)

	// Auth group
	auth := v1.Group("/auth")
	auth.Use(middleware.RateLimiter("10-M", limiterStore)) // 10 requests per minute
	{
		auth.POST("/register", h.Register)
		auth.POST("/login", h.Login)
		auth.GET("/verify-email", h.VerifyEmail)
		auth.POST("/resend-verification", h.ResendVerification)
		auth.POST("/forgot-password", h.ForgotPassword)
		auth.POST("/reset-password", h.ResetPassword)
		auth.POST("/logout", h.Logout)
	}

	v1.GET("/packages", mh.GetPackagesFeed)
	v1.GET("/packages/:id", mh.GetPackage)
	v1.GET("/packages/:id/reviews", mh.GetPackageReviews)
	v1.GET("/packages/:id/chat", mh.GetChatHistory)
	v1.GET("/posts", h.ListPosts)
	v1.GET("/posts/:id", h.GetPost)
	v1.GET("/posts/:id/comments", h.ListComments)

	// Protected routes
	protected := v1.Group("")
	protected.Use(middleware.JWTMiddleware(cfg.JWTSecret, redisClient))
	{
		user := protected.Group("/user")
		{
			user.GET("/profile", h.GetProfile)
			user.PATCH("/profile", h.UpdateProfile)
			user.GET("/preferences", h.GetUserPreferences)
			user.PATCH("/preferences", h.UpdateUserPreferences)
			user.POST("/change-password", h.ChangePassword)
		}

		// AI target limit
		planner := protected.Group("/planner")
		planner.Use(middleware.RateLimiter("5-M", limiterStore))
		{
			planner.POST("/generate", h.GenerateItinerary)
		}

		itineraries := protected.Group("/itineraries")
		{
			itineraries.GET("", h.ListUserItineraries)
			itineraries.POST("", h.SaveItinerary)
			itineraries.GET("/:id", h.GetItinerary)
			itineraries.DELETE("/:id", h.DeleteItinerary)
			itineraries.PATCH("/:id/activities", h.UpdateItineraryActivity)
		}

		packages := protected.Group("/packages")
		{
			packages.GET("/me", mh.GetMyPackages)
			packages.POST("", mh.CreatePackage)

			pkg := packages.Group("/:id")
			{
			pkg.PATCH("", mh.UpdatePackage)
				pkg.DELETE("", mh.ArchivePackage)
				pkg.PATCH("/status", mh.UpdatePackageStatus)
				pkg.POST("/reviews", mh.SubmitPackageReview)
				pkg.DELETE("/reviews/:reviewId", mh.DeleteReview)
				pkg.POST("/chat", mh.PostChatMessage)
			}
		}

		posts := protected.Group("/posts")
		{
			posts.POST("", h.CreatePost)
			posts.POST("/:id/comments", h.AddComment)
			posts.DELETE("/comments/:commentId", h.DeleteComment)
			posts.POST("/:id/like", h.ToggleLikePost)
		}

		upload := protected.Group("/upload")
		{
			uploadH := handlers.NewUploadHandler(uploadService)
			upload.POST("/image", middleware.ImageUploadMiddleware(), uploadH.UploadImage)
			upload.POST("/video", middleware.VideoUploadMiddleware(), uploadH.UploadVideo)
		}
	}

	return r
}
