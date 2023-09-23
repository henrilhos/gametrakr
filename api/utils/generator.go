package utils

import (
	"math/rand"
	"strings"
)

const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

func RandomString(n int) string {
	sb := strings.Builder{}
	sb.Grow(n)
	for i := 0; i < n; i++ {
		idx := rand.Int63() % int64(len(charset))
		sb.WriteByte(charset[idx])
	}
	return sb.String()
}
