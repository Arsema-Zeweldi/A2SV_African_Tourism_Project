package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	// Initialize Gin router
	router := gin.Default()

	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "success",
			"message": "African Tourism Platform API is running",
		})
	})

	// API version 1 group
	v1 := router.Group("/api/v1")
	{
		// Routes will be registered here
		v1.GET("/", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"message": "Welcome to African Tourism Platform API v1",
			})
		})
	}

	// Start server
	port := ":8080"
	fmt.Printf("Server starting on port %s...\n", port)
	if err := router.Run(port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
