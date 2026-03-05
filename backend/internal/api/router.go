package api

import (
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/api/handlers"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/api/middleware"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/config"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRouter(db *gorm.DB, cfg *config.Config) *gin.Engine {
	r := gin.Default()
	h := handlers.NewAppHandler(db, cfg)

	hub := handlers.NewHub()
	handlers.GlobalHub = hub
	go hub.Run()

	mh := &handlers.PackagesHandler{DB: db}

	v1 := r.Group("/api/v1")
	v1.GET("/health", h.HealthCheck)

	auth := v1.Group("/auth")
	{
		auth.POST("/register", h.Register)
		auth.POST("/login", h.Login)
	}

	v1.GET("/regions", h.ListRegions)
	v1.GET("/regions/:id", h.GetRegion)
	v1.GET("/destinations", h.SearchDestinations)
	v1.GET("/destinations/:id", h.GetDestinationDetails)

	v1.GET("/packages", mh.GetPackagesFeed)
	v1.GET("/packages/:id", mh.GetPackage)
	v1.GET("/packages/:id/reviews", mh.GetPackageReviews)
	v1.GET("/packages/:id/chat", mh.GetChatHistory)

	protected := v1.Group("")
	protected.Use(middleware.JWTMiddleware(cfg.JWTSecret))
	{
		regions := protected.Group("/regions")
		{
			regions.POST("", h.CreateRegion)
			regions.PUT("/:id", h.UpdateRegion)
			regions.DELETE("/:id", h.DeleteRegion)
		}

		user := protected.Group("/user")
		{
			user.GET("/preferences", h.GetUserPreferences)
			user.PUT("/preferences", h.UpdateUserPreferences)
		}

		planner := protected.Group("/planner")
		{
			planner.POST("/interview", h.StartAIInterview)
		}

		itineraries := protected.Group("/itineraries")
		{
			itineraries.POST("", h.SaveItinerary)
			itineraries.GET("/:id", h.GetItinerary)
			itineraries.PATCH("/:id/items", h.UpdateItineraryItem)
		}

		packages := protected.Group("/packages")
		{
			packages.POST("", mh.CreatePackage)

			pkg := packages.Group("/:id")
			{
				pkg.PATCH("", mh.UpdatePackage)
				pkg.DELETE("", mh.ArchivePackage)
				pkg.POST("/publish", mh.PublishPackage)
				pkg.PATCH("/status", mh.UpdatePackageStatus)
				pkg.POST("/reviews", mh.SubmitPackageReview)
				pkg.POST("/chat", mh.PostChatMessage)
				pkg.GET("/ws", handlers.ServeWS(hub, db))
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
