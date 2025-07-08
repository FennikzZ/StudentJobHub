package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tanapon395/sa-67-example/config"
	"github.com/tanapon395/sa-67-example/entity"
)

// GET /dashboards
func GetAllDashboard(c *gin.Context) {
	var dashboards []entity.Dashboard
	db := config.DB()

	result := db.Find(&dashboards)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, dashboards)
}

// GET /dashboard/:id
func GetDashboard(c *gin.Context) {
	id := c.Param("id")
	var dashboard entity.Dashboard

	db := config.DB()
	result := db.First(&dashboard, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, dashboard)
}

// POST /dashboard
func CreateDashboard(c *gin.Context) {
	var dashboard entity.Dashboard

	if err := c.ShouldBindJSON(&dashboard); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	db := config.DB()
	if result := db.Create(&dashboard); result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to create dashboard"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Dashboard created successfully", "dashboard": dashboard})
}

// PATCH /dashboard/:id
func UpdateDashboard(c *gin.Context) {
	id := c.Param("id")
	var dashboard entity.Dashboard

	db := config.DB()
	if err := db.First(&dashboard, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Dashboard not found"})
		return
	}

	if err := c.ShouldBindJSON(&dashboard); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	if err := db.Save(&dashboard).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to update dashboard"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Dashboard updated successfully", "dashboard": dashboard})
}

// DELETE /dashboard/:id
func DeleteDashboard(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()

	if tx := db.Delete(&entity.Dashboard{}, id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dashboard not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Dashboard deleted successfully"})
}
