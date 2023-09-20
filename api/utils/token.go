package utils

import (
	"encoding/base64"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

type TokenDetails struct {
	Token     *string `json:"token"`
	TokenUuid string  `json:"tokenUuid"`
	UserID    string  `json:"userId"`
	ExpiresIn *int64  `json:"expiresIn"`
}

// Access token
func CreateAccessToken(userID string) (*TokenDetails, error) {
	expiresIn := GetenvDuration("ACCESS_TOKEN_EXPIRED_IN")
	privateKey := GetenvString("ACCESS_TOKEN_PRIVATE_KEY")
	return createToken(userID, expiresIn, privateKey)
}

func ValidateAccessToken(token string) (*TokenDetails, error) {
	privateKey := GetenvString("ACCESS_TOKEN_PUBLIC_KEY")
	return validateToken(token, privateKey)
}

// Refresh token
func CreateRefreshToken(userID string) (*TokenDetails, error) {
	expiresIn := GetenvDuration("REFRESH_TOKEN_EXPIRED_IN")
	privateKey := GetenvString("REFRESH_TOKEN_PRIVATE_KEY")
	return createToken(userID, expiresIn, privateKey)
}

func ValidateRefreshToken(token string) (*TokenDetails, error) {
	privateKey := GetenvString("REFRESH_TOKEN_PUBLIC_KEY")
	return validateToken(token, privateKey)
}

// Private
func createToken(userID string, ttl time.Duration, privateKey string) (*TokenDetails, error) {
	now := time.Now().UTC()
	td := &TokenDetails{
		Token:     new(string),
		ExpiresIn: new(int64),
	}
	*td.ExpiresIn = now.Add(ttl).Unix()
	td.TokenUuid = uuid.NewString()
	td.UserID = userID

	decodedPrivateKey, err := base64.StdEncoding.DecodeString(privateKey)
	if err != nil {
		return nil, fmt.Errorf("could not decode token private key: %w", err)
	}

	key, err := jwt.ParseRSAPrivateKeyFromPEM(decodedPrivateKey)
	if err != nil {
		return nil, fmt.Errorf("create: parse token private key: %w", err)
	}

	*td.Token, err = jwt.NewWithClaims(jwt.SigningMethodRS256, jwt.MapClaims{
		"sub":        userID,
		"token_uuid": td.TokenUuid,
		"exp":        td.ExpiresIn,
		"iat":        now.Unix(),
		"nbf":        now.Unix(),
	}).SignedString(key)
	if err != nil {
		return nil, fmt.Errorf("create: sign token: %w", err)
	}

	return td, nil
}

func validateToken(token, publicKey string) (*TokenDetails, error) {
	decodedPublicKey, err := base64.StdEncoding.DecodeString(publicKey)
	if err != nil {
		return nil, fmt.Errorf("could not decode: %w", err)
	}

	key, err := jwt.ParseRSAPublicKeyFromPEM(decodedPublicKey)
	if err != nil {
		return nil, fmt.Errorf("validate: parse key: %w", err)
	}

	parsedToken, err := jwt.Parse(token, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodRSA); !ok {
			return nil, fmt.Errorf("unexpected method: %s", t.Header["alg"])
		}
		return key, nil
	})
	if err != nil {
		return nil, fmt.Errorf("validate: %w", err)
	}

	claims, ok := parsedToken.Claims.(jwt.MapClaims)
	if !ok || !parsedToken.Valid {
		return nil, fmt.Errorf("validate: invalid token")
	}

	return &TokenDetails{
		TokenUuid: fmt.Sprint(claims["token_uuid"]),
		UserID:    fmt.Sprint(claims["sub"]),
	}, nil
}
