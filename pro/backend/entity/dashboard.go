package entity

import (
	"time"
	"gorm.io/gorm"
)

type Dashboard struct {
	gorm.Model
	Subject     	string   `json:"subject"`
	Information 	string    `json:"information"`
	DashboardTime   time.Time `json:"dashboardtime"`
	Image       	string    `gorm:"type:longtext" json:"image"`
}
