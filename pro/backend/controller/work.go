package controller

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/tanapon395/sa-67-example/config"
	"github.com/tanapon395/sa-67-example/entity"
)

func GetAllWork(c *gin.Context) {
	var work []entity.Work
	db := config.DB()

	result := db.Preload("WorkStatus").Preload("WorkType").Find(&work)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, work)
}

func GetWork(c *gin.Context) {
	ID := c.Param("id")
	var work entity.Work

	db := config.DB()

	result := db.Preload("WorkStatus").Preload("WorkType").First(&work, ID)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, work)
}

func CreateWork(c *gin.Context) {
	var work entity.Work

	// รับข้อมูล JSON ที่ส่งมาจาก client
	if err := c.ShouldBindJSON(&work); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	// บันทึกโปรโมชั่นใหม่ลงในฐานข้อมูล
	db := config.DB()
	if result := db.Create(&work); result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to create work"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Work created successfully", "work": work})
}

func UpdateWork(c *gin.Context) {
	var work entity.Work
	id := c.Param("id")

	db := config.DB()
	result := db.First(&work, id)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "work not found"})
		return
	}

	if err := c.ShouldBindJSON(&work); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}
	if work.WorkTypeID == 1 && work.Paid == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Paid is required for paid work"})
		return
	}
	if work.WorkTypeID == 2 && work.Volunteer == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Volunteer is required for volunteer work"})
		return
	}

	result = db.Save(&work)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to update work"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Work updated successfully"})
}

func DeleteWork(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()

	// ลบโปรโมชั่นจากฐานข้อมูล
	if tx := db.Exec("DELETE FROM works WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Work not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Work deleted successfully"})
}