package auth

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"wdd/api/internal/types"
)

const COGNITOAPPCLIENTID = "4jt4a1nk1llqr70par8gce0h2e"

type Handler struct {
	Cognito types.Cognito
}

func computeSecretHash(clientSecret, username, clientID string) string {
	mac := hmac.New(sha256.New, []byte(clientSecret))
	mac.Write([]byte(username + clientID))
	return base64.StdEncoding.EncodeToString(mac.Sum(nil))
}
