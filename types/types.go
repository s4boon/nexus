package types

import "net/http"

type Nexus struct {
	Client      *http.Client
	Fingerprint string
}

type NexusCDNs struct {
	CurrentRegion string `json:"current_region"`
	Edges         []Edge `json:"edges"`
}

type Edge struct {
	ID       string  `json:"id"`
	Name     string  `json:"name"`
	Host     string  `json:"host"`
	Location string  `json:"location"`
	Lat      float64 `json:"lat"`
	Lon      float64 `json:"lon"`
	PingURL  string  `json:"ping_url"`
}
