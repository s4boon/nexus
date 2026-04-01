package types

import "net/http"

type Nexus struct {
	Client      *http.Client
	Fingerprint string
}

type DownloadRequest struct {
	EpisodeID string    `json:"episode_id"`
	Audio     []string  `json:"dubs"`
	Subtitles []string  `json:"subs"`
	Quality   string    `json:"quality"`
	Segments  bool      `json:"segments"`
	Stream    StreamRes `json:"stream"`
}

type StreamRes struct {
	Subtitles []struct {
		ID      string  `json:"id"`
		Src     string  `json:"src"`
		Label   string  `json:"label"`
		SrcLang *string `json:"srcLang"`
	} `json:"subtitles"`
	VideoMeta struct {
		Duration       int      `json:"duration"`
		AudioLanguages []string `json:"audio_languages"`
		Status         string   `json:"status"`
		Qualities      struct {
			P1920X1080 int `json:"1920x1080"`
			P1280X720  int `json:"1280x720"`
			P848X480   int `json:"848x480"`
		} `json:"qualities"`
		FileSizeStreams struct {
			P848X480   int `json:"848x480"`
			P1280X720  int `json:"1280x720"`
			P1920X1080 int `json:"1920x1080"`
		} `json:"file_size_streams"`
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
