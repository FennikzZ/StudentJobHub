package entity

import (
	"gorm.io/gorm"
)

type WorkType struct {
   gorm.Model   
   	WorkType 	string  	`json:"worktype"`

	Works []Work `gorm:"foreignKey:WorkTypeID" json:"work"`
}