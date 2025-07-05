package entity

import (
	"gorm.io/gorm"
)

type WorkStatus struct {
	gorm.Model
   	WorkStatus 	string  	`json:"workstatus"`

	Works []Work `gorm:"foreignKey:WorkStatusID" json:"work"`
}
