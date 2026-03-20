package utils

import (
	"net/http"
)

func WarmCookies(client *http.Client) error {
	req, err := http.NewRequest("GET", "https://api.anime.nexus/api/anime/popular?period=day", nil)
	req.Header.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0")

	resp, err := client.Do(req)
	resp.Body.Close()
	return err
}
