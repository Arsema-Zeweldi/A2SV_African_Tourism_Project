package api

import (
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/api/handlers"
	"github.com/Arsema-Zeweldi/africa-tourism-platform/backend/internal/api/middleware"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	// CORS and basic middleware can be added here

	api := r.Group("/api/v1")
	{
		// 🔓 UNPROTECTED: Identity & Access Module (IAM)
		auth := api.Group("/auth")
		{
			auth.POST("/register", handlers.Register)
			auth.POST("/login", handlers.Login)
		}

		// 🔓 UNPROTECTED: Discovery Module (Browse-only)
		api.GET("/regions", handlers.ListRegions)
		api.GET("/destinations", handlers.SearchDestinations)
		api.GET("/destinations/:id", handlers.GetDestinationDetails)

		// 🔐 PROTECTED ROUTES
		protected := api.Group("")
		protected.Use(middleware.JWTMiddleware())
		{
			// User Profile & Preferences
			user := protected.Group("/user")
			{
				user.GET("/preferences", handlers.GetUserPreferences)
				user.PUT("/preferences", handlers.UpdateUserPreferences)
			}

			// AI Planning & Itinerary Module
			planner := protected.Group("/planner")
			{
				planner.POST("/interview", handlers.StartAIInterview)
			}
			itineraries := protected.Group("/itineraries")
			{
				itineraries.POST("", handlers.SaveItinerary)
				itineraries.GET("/:id", handlers.GetItinerary)
				itineraries.PATCH("/:id/items", handlers.UpdateItineraryItem)
			}

			// Community & Marketplace Module
			marketplace := protected.Group("/marketplace")
			{
				marketplace.GET("/packages", handlers.ListPackages)
			}
			packages := protected.Group("/packages")
			{
				packages.POST("/:id/publish", handlers.PublishPackage)
				packages.POST("/:id/review", handlers.ReviewPackage)
				packages.GET("/:id/chat", handlers.GetPackageChat)
			}

			// Intelligence & Safety Module
			intelligence := protected.Group("/intelligence")
			{
				intelligence.GET("/visa", handlers.GetVisaRequirements)
				intelligence.GET("/safety", handlers.GetSafetyAlerts)
			}
		}
	}

	return r
}
