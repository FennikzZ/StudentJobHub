package config

import (
	"fmt"
	"time"

	"github.com/tanapon395/sa-67-example/entity"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {
	return db
}

func ConnectionDB() {
	database, err := gorm.Open(sqlite.Open("sa.db?cache=shared"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	fmt.Println("connected database")
	db = database
}

func IntPtr(i int) *int {
	return &i
}

func SetupDatabase() {

	db.AutoMigrate(
		&entity.User{},
		&entity.Gender{},
		//work
		&entity.Work{},
		&entity.WorkType{},
		&entity.WorkStatus{},
	)

	//WorkStatus
	WorStatusActive := entity.WorkStatus{WorkStatus: "Active"}
	WorkStatusInactive := entity.WorkStatus{WorkStatus: "Inactive"}
	db.FirstOrCreate(&WorStatusActive, &entity.WorkStatus{WorkStatus: "Active"})
	db.FirstOrCreate(&WorkStatusInactive, &entity.WorkStatus{WorkStatus: "Inactive"})

	//WorkType
	WorkTypePaid := entity.WorkType{WorkType: "Paid"}
	WorkTypeVounteer := entity.WorkType{WorkType: "Volunteer"}
	db.FirstOrCreate(&WorkTypePaid, &entity.WorkType{WorkType: "Paid"})
	db.FirstOrCreate(&WorkTypeVounteer, &entity.WorkType{WorkType: "Volunteer"})

	//Work
	work := []entity.Work{
		{
			Title:        "กิจกรรมจิตอาสาทำความสะอาด",
			Description:  "ชวนเพื่อนๆ มาร่วมกันทำความสะอาดบริเวณมหาวิทยาลัย",
			Place:        "ลานหน้าคณะวิทยาศาสตร์",
			Latitude:     13.736717,
			Longitude:    100.523186,
			WorkCount:    8,
			WorkTime:     time.Date(2025, 7, 20, 9, 0, 0, 0, time.UTC),
			Photo:        "https://i.pinimg.com/736x/ce/5f/a0/ce5fa0a6d07dc75d1cc6281945450294.jpg",
			WorkStatusID: 1, // Active
			WorkTypeID:   2, // Volunteer
			Volunteer:    IntPtr(3), // 3 ชั่วโมง
		},
	}

	// บันทึกข้อมูลโปรโมชั่นตัวอย่างลงในฐานข้อมูล
	for _, w := range work {
		db.FirstOrCreate(&w, entity.Work{Title: w.Title})
	}

	//gender
	GenderMale := entity.Gender{Name: "Male"}
	GenderFemale := entity.Gender{Name: "Female"}
	db.FirstOrCreate(&GenderMale, &entity.Gender{Name: "Male"})
	db.FirstOrCreate(&GenderFemale, &entity.Gender{Name: "Female"})

	hashedPassword, _ := HashPassword("123456")
	BirthDay, _ := time.Parse("2006-01-02", "1988-11-12")
	User := &entity.User{
		FirstName: "Software",
		LastName:  "Analysis",
		Email:     "sa@gmail.com",
		Password:  hashedPassword,
		BirthDay:  BirthDay,
		Profile:   "https://i.pinimg.com/736x/76/b2/ab/76b2abcc22f272d3cd03d4e63f2b75b5.jpg",
		GenderID:  1,
	}
	db.FirstOrCreate(User, &entity.User{
		Email: "sa@gmail.com",
	})

}
