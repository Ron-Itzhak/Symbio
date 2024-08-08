package auth

import "github.com/dgrijalva/jwt-go"

type Claims struct {
	UserId   int    `json:"user_id"`
	Username string `json:"username"`
	jwt.StandardClaims
}
