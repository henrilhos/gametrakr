package utils

import (
	"crypto/rand"
	"math/big"
	"strings"
)

const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

func RandomString(n int) string {
	sb := strings.Builder{}
	sb.Grow(n)
	charsetLen := big.NewInt(int64(len(charset)))

	for i := 0; i < n; i++ {
		randomIndex, _ := rand.Int(rand.Reader, charsetLen)
		idx := int(randomIndex.Int64())
		sb.WriteByte(charset[idx])
	}

	return sb.String()
}
