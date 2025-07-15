package entity

import (

	"gorm.io/gorm"
)

type WorkHistory struct {
	gorm.Model

	UserID uint
	User   User `gorm:"foreignKey:UserID"`

	WorkID uint
	Work   Work `gorm:"foreignKey:WorkID"`

	PaidAmount     *int `json:"paid_amount"`      // nullable สำหรับกรณี volunteer
	VolunteerHour  *int `json:"volunteer_hour"`   // nullable สำหรับกรณี paid
}
