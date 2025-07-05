package controller


import (
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/tanapon395/sa-67-example/config"
	"github.com/tanapon395/sa-67-example/entity"
)


func GetAllWorkType(c *gin.Context) {

   db := config.DB()

   var worktype []entity.WorkType

   db.Find(&worktype)

   c.JSON(http.StatusOK, &worktype)

}