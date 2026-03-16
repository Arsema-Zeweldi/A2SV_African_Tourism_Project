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
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/service/discovery"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/service/intelligence"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRouter(db *gorm.DB, cfg *config.Config) *gin.Engine {
	// Set Gin to release mode if not development
	if cfg.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

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
	destRepo := repository.NewGormDestinationRepository(db)
	visaRepo := repository.NewGormVisaRequirementRepository(db)
	safetyRepo := repository.NewGormSafetyAlertRepository(db)

	// 3. Initialize Services
	searchService := discovery.NewDestinationSearchService(destRepo)
	visaService := intelligence.NewVisaService(visaRepo)
	safetyService := intelligence.NewSafetyService(safetyRepo)

	var plannerService ai_planner.PlannerService
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
	r.Use(gin.Recovery())
	r.Use(middleware.RequestIDMiddleware())
	r.Use(middleware.LoggerMiddleware())
	r.Use(middleware.MaxBodySize(1 << 20)) // 1 MB limit

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

	h := handlers.NewAppHandler(db, cfg, plannerService, searchService, visaService, safetyService)

	hub := handlers.NewHub()
	handlers.GlobalHub = hub
	go hub.Run()

	mh := &handlers.PackagesHandler{DB: db, Cfg: cfg}

	v1 := r.Group("/api/v1")
	v1.GET("/health", h.HealthCheck)

	// Auth group
	auth := v1.Group("/auth")
	auth.Use(middleware.RateLimiter("10-M")) // 10 requests per minute
	{
		auth.POST("/register", h.Register)
		auth.POST("/login", h.Login)
	}

	// Public discovery
	v1.GET("/regions", h.ListRegions)
	v1.GET("/regions/:id", h.GetRegion)
	v1.GET("/destinations", h.SearchDestinations)
	v1.GET("/destinations/:id", h.GetDestinationDetails)

	v1.GET("/packages", mh.GetPackagesFeed)
	v1.GET("/packages/:id", mh.GetPackage)
	v1.GET("/packages/:id/reviews", mh.GetPackageReviews)
	v1.GET("/packages/:id/chat", mh.GetChatHistory)

	// Protected routes
	protected := v1.Group("")
	protected.Use(middleware.JWTMiddleware(cfg.JWTSecret))
	{
		// Admin only
		regions := protected.Group("/regions")
		regions.Use(middleware.RequireRole("admin"))
		{
			regions.POST("", h.CreateRegion)
			regions.PUT("/:id", h.UpdateRegion)
			regions.DELETE("/:id", h.DeleteRegion)
		}

		destinations := protected.Group("/destinations")
		destinations.Use(middleware.RequireRole("admin"))
		{
			destinations.POST("", h.CreateDestination)
			destinations.PUT("/:id", h.UpdateDestination)
			destinations.DELETE("/:id", h.DeleteDestination)
		}

		user := protected.Group("/user")
		{
			user.GET("/preferences", h.GetUserPreferences)
			user.PUT("/preferences", h.UpdateUserPreferences)
		}

		// AI target limit
		planner := protected.Group("/planner")
		planner.Use(middleware.RateLimiter("5-M"))
		{
			planner.POST("/generate", h.GenerateItinerary)
		}

		itineraries := protected.Group("/itineraries")
		{
			itineraries.POST("", h.SaveItinerary)
			itineraries.GET("/:id", h.GetItinerary)
			itineraries.POST("/:id/items", h.AddItineraryItem)
			itineraries.PATCH("/:id/items", h.UpdateItineraryItem)
		}

		packages := protected.Group("/packages")
		{
			packages.POST("", mh.CreatePackage)

			pkg := packages.Group("/:id")
			{
				pkg.PATCH("", mh.UpdatePackage)
				pkg.DELETE("", mh.ArchivePackage)
				pkg.POST("/publish", middleware.RequireRole("admin", "verified_creator"), mh.PublishPackage)
				pkg.PATCH("/status", middleware.RequireRole("admin", "verified_creator"), mh.UpdatePackageStatus)
				pkg.POST("/reviews", mh.SubmitPackageReview)
				pkg.POST("/chat", mh.PostChatMessage)

				// Keep ServeWS public in router but authenticate in handler itself? No, ServeWS extracts token from query params or header there. But since it's under protected, it needs header.
				pkg.GET("/ws", handlers.ServeWS(hub, db, cfg.AllowedOrigins))
			}
		}

		intelligence := protected.Group("/intelligence")
		{
			intelligence.GET("/visa", h.GetVisaRequirements)
			intelligence.GET("/safety", h.GetSafetyAlerts)
		}
	}

	return r
}
