package utils

import (
	"log"
	"net/http"
	"net/http/cookiejar"

	"github.com/google/uuid"
)

type headerRoundTripper struct {
	transport http.RoundTripper
	headers   map[string]string
}

func (h *headerRoundTripper) RoundTrip(req *http.Request) (*http.Response, error) {
	reqCopy := req.Clone(req.Context())
	for key, value := range h.headers {
		reqCopy.Header.Set(key, value)
	}

	return h.transport.RoundTrip(reqCopy)
}

func newClient(headers map[string]string, jar *cookiejar.Jar) *http.Client {
	return &http.Client{
		Jar: jar,
		Transport: &headerRoundTripper{
			transport: http.DefaultTransport,
			headers:   headers,
		},
	}
}

func CustomClient() *http.Client {
	jar, err := cookiejar.New(nil)
	if err != nil {
		log.Panic("Error creating cookie jar:", err)
	}

	client := newClient(map[string]string{
		"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0",
	}, jar)

	return client
}

type CL struct {
	Client      *http.Client
	Fingerprint uuid.UUID
}
