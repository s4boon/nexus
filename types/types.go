package types

import "net/http"

type Nexus struct {
	Client      *http.Client
	Fingerprint string
}

type DownloadRequest struct {
	AnimeID       string    `json:"anime_id"`
	AnimeName     string    `json:"anime_name"`
	AnimeAltName  string    `json:"anime_alt_name"`
	EpisodeID     string    `json:"episode_id"`
	EpisodeNumber int       `json:"episode_number"`
	EpisodeSlug   string    `json:"slug"`
	Filename      string    `json:"filename"`
	Audio         []string  `json:"dubs"`
	Subtitles     []string  `json:"subs"`
	Quality       string    `json:"quality"`
	Segments      bool      `json:"segments"`
	Stream        StreamRes `json:"stream"`
	Edge          string    `json:"edge"`
}

type StreamRes struct {
	Subtitles []struct {
		ID      string  `json:"id"`
		Src     string  `json:"src"`
		Label   string  `json:"label"`
		SrcLang *string `json:"srcLang"`
	} `json:"subtitles"`
	VideoMeta struct {
		Duration        int               `json:"duration"`
		AudioLanguages  []string          `json:"audio_languages"`
		Status          string            `json:"status"`
		Qualities       map[string]int    `json:"qualities"`
		FileSizeStreams map[string]uint64 `json:"file_size_streams"`
	} `json:"video_meta"`
	Hls        string `json:"hls"`
	Thumbnails string `json:"thumbnails"`
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
