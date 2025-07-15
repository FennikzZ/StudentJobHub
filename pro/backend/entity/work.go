package entity

import (
	"time"

	"gorm.io/gorm"
)

type Work struct {
	gorm.Model
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Place       string    `json:"place"`
	Latitude    float64   `json:"latitude"`
	Longitude   float64   `json:"longitude"`
	WorkCount   int       `json:"workcount"`
	WorkUse  	int       `json:"workuse"`
	WorkTime    time.Time `json:"worktime"`
	Photo       string    `gorm:"type:longtext" json:"photo"`
	Paid        *int      `json:"paid"`
	Volunteer   *int      `json:"volunteer"`

	WorkStatusID uint        `json:"workstatus_id"`
	WorkStatus   *WorkStatus `gorm:"foreignKey: WorkStatusID" json:"workstatus"`

	WorkTypeID uint      `json:"worktype_id"`
	WorkType   *WorkType `gorm:"foreignKey: WorkTypeID" json:"worktype"`

	WorkHistories []WorkHistory `gorm:"foreignKey:WorkID"`
}
