package entity

import "gorm.io/gorm"

type Gender struct {
	gorm.Model
	Name string

	// 1 gender เป็นเจ้าของได้หลาย Playlist
	Users []User `gorm:"foreignKey:GenderID"`
}
