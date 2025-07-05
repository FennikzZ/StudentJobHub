package controller

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/tanapon395/sa-67-example/config"
	"github.com/tanapon395/sa-67-example/entity"
)


func GetAllWorkStatus(c *gin.Context) {

   db := config.DB()

   var workstatus []entity.WorkStatus

   db.Find(&workstatus)

   c.JSON(http.StatusOK, &workstatus)

}