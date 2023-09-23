package models

import (
	"database/sql"
	"html"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/henrilhos/gametrakr/database"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	ID            uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primary_key"`
	Username      string    `gorm:"not null;unique" json:"username"`
	Email         string    `gorm:"not null;unique" json:"email"`
	Password      string    `gorm:"not null" json:"password"`
	Verified      bool      `json:"verified"`
	CreatedAt     time.Time
	UpdatedAt     time.Time
	DeletedAt     gorm.DeletedAt `gorm:"index"`
	Verifications []Verification `gorm:"foreignKey:Email;references:Email"`
}

// Hooks

func (u *User) Create() (*User, error) {
	var err = database.GetDB().Create(&u).Error
	if err != nil {
		return &User{}, err
	}
	return u, nil
}

func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	u.Password = string(hashedPassword)
	u.Username = html.EscapeString(strings.TrimSpace(u.Username))
	u.Email = html.EscapeString(strings.ToLower(strings.ToLower(u.Email)))
	u.Verified = false

	return nil
}

// Other

type UserResponse struct {
	ID        uuid.UUID `json:"id,omitempty"`
	Username  string    `json:"username,omitempty"`
	Email     string    `json:"email,omitempty"`
	Verified  bool      `json:"verified"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type UserPrimaryKeys struct {
	Username string `json:"username"`
	Email    string `json:"email"`
}

func FilterUser(u *User) UserResponse {
	return UserResponse{
		ID:        u.ID,
		Username:  u.Username,
		Email:     u.Email,
		Verified:  u.Verified,
		CreatedAt: u.CreatedAt,
		UpdatedAt: u.UpdatedAt,
	}
}

func SignIn(username, password string) (user User, err error) {
	user = User{}
	err = database.GetDB().Model(User{}).Where("username = @user OR email = @user", sql.Named("user", username)).Take(&user).Error
	if err != nil {
		return user, err
	}

	err = verifyPassword(password, user.Password)
	if err != nil {
		return User{}, err
	}

	return user, err
}

func FindUserById(userId string) (user User, err error) {
	user = User{}
	err = database.GetDB().Model(User{}).Where("id = ?", userId).Take(&user).Error
	return user, err
}

func SetEmailVerified(userId uuid.UUID) error {
	err := database.GetDB().Model(&User{}).Where("id = ?", userId).Update("verified", true).Error
	if err != nil {
		return err
	}
	return nil
}

func FindPrimaryKeysByUsernameOrEmail(user string) (UserPrimaryKeys, error) {
	userPrimaryKeys := UserPrimaryKeys{}
	err := database.GetDB().Model(User{}).Where("username = @user OR email = @user", sql.Named("user", user)).Select("username, email").Take(&userPrimaryKeys).Error
	return userPrimaryKeys, err
}

func UpdatePassword(userId, password string) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	err = database.GetDB().Model(&User{}).Where("id = ?", userId).Update("password", hashedPassword).Error
	if err != nil {
		return err
	}
	return nil
}

func verifyPassword(password, hashedPassword string) (err error) {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
}
