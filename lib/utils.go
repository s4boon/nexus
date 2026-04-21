package utils

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"regexp"
	"strings"

	"golang.org/x/net/html"
)

func WarmCookies(client *http.Client) error {
	req, err := http.NewRequest("GET", "https://api.anime.nexus/api/anime/popular?period=day", nil)
	req.Header.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0")

	if err != nil {
		log.Println("error making request @WarmCookies()")
		return err
	}

	_, err = client.Do(req)

	return err
}

type VBody struct {
	ID string `json:"id"`
}

func Viewable(cl *CL, id string) error {
	body, err := json.Marshal(&VBody{ID: id})
	if err != nil {
		log.Println("could not marshal json")
		return err
	}
	log.Printf("post req body: %s\n", body)
	req, err := http.NewRequest("POST", "https://api.anime.nexus/api/anime/details/episode/view", bytes.NewBuffer(body))
	if err != nil {
		log.Panicln("could not create request")
		return err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Client-Fingerprint", cl.Fingerprint.String())
	req.Header.Set("X-Fingerprint", cl.Fingerprint.String())

	req.Header.Set("Referer", "https://anime.nexus")
	req.Header.Set("Origin", "https://anime.nexus")

	_, err = cl.Client.Do(req)
	if err != nil {
		return err
	}
	return nil
}

func GetToken(client *http.Client, EpisodeID string, EpisodeSlug string) (string, error) {
	req, err := http.NewRequest("GET", "https://anime.nexus/watch/"+EpisodeID+"/"+EpisodeSlug, nil)
	if err != nil {
		log.Println("Error creating a request @GetToken()")
		return "", err
	}

	res, err := client.Do(req)
	if err != nil {
		log.Println("Error making a request @GetToken()")
		return "", err
	}

	defer res.Body.Close()

	doc, err := html.Parse(res.Body)
	if err != nil {
		panic(err)
	}

	script := getScriptByID(doc, "$tsr-stream-barrier")
	re, err := regexp.Compile(`attestRef\s*:\s*"([^"]+)"`)
	if err != nil {
		log.Println("Error compiling regex @GetToken()")
		return "", err
	}

	match := re.FindStringSubmatch(script)

	return match[1], err
}

func getScriptByID(n *html.Node, id string) string {
	if n.Type == html.ElementNode && n.Data == "script" {
		for _, a := range n.Attr {
			if a.Key == "id" && a.Val == id {
				return getText(n)
			}
		}
	}
	for c := n.FirstChild; c != nil; c = c.NextSibling {
		if res := getScriptByID(c, id); res != "" {
			return res
		}
	}
	return ""
}

func getText(n *html.Node) string {
	if n.Type == html.TextNode {
		return n.Data
	}
	var result strings.Builder
	for c := n.FirstChild; c != nil; c = c.NextSibling {
		result.WriteString(getText(c))
	}
	return result.String()
}

func GetServerSideToken(cl *CL, id string, script string) (string, error) {

	payload, err := GenerateServerFnPayload(id)
	if err != nil {
		return "", err
	}
	req, err := http.NewRequest("GET", "https://anime.nexus/_serverFn/"+script+"?payload="+url.QueryEscape(payload), nil)
	req.Header.Set("Accept", "application/x-tss-framed, application/x-ndjson, application/json")
	req.Header.Set("x-tsr-serverFn", "true")

	res, err := cl.Client.Do(req)
	if err != nil {
		return "", err
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	log.Printf("SCRIPT RES BODY: %s\n", body)
	var data map[string]any
	json.Unmarshal(body, &data)

	attestRef, err := ExtractSSToken(data)
	if err != nil {
		return "", err
	}

	return attestRef, nil

}

func ExtractSSToken(root map[string]any) (string, error) {
	// root["p"]
	p, ok := root["p"].(map[string]any)
	if !ok {
		return "", errors.New("invalid root.p")
	}

	// root.p.v[0] → result
	vRoot, ok := p["v"].([]any)
	if !ok || len(vRoot) == 0 {
		return "", errors.New("invalid root.p.v")
	}

	result, ok := vRoot[0].(map[string]any)
	if !ok {
		return "", errors.New("invalid result")
	}

	// result.p
	resultP, ok := result["p"].(map[string]any)
	if !ok {
		return "", errors.New("invalid result.p")
	}

	keys, ok := resultP["k"].([]any)
	if !ok {
		return "", errors.New("invalid keys")
	}

	values, ok := resultP["v"].([]any)
	if !ok {
		return "", errors.New("invalid values")
	}

	for i, k := range keys {
		if k.(string) == "attestRef" {
			vMap, ok := values[i].(map[string]any)
			if !ok {
				return "", errors.New("invalid attestRef value")
			}

			s, ok := vMap["s"].(string)
			if !ok {
				return "", errors.New("attestRef is not string")
			}

			return s, nil
		}
	}

	return "", fmt.Errorf("attestRef not found")
}

func GenerateServerFnPayload(id string) (string, error) {
	payload := map[string]interface{}{
		"t": map[string]interface{}{
			"t": 10,
			"i": 0,
			"p": map[string]interface{}{
				"k": []string{"data"},
				"v": []map[string]interface{}{
					{
						"t": 10,
						"i": 1,
						"p": map[string]interface{}{
							"k": []string{"id"},
							"v": []map[string]interface{}{
								{
									"t": 1,
									"s": id,
								},
							},
						},
						"o": 0,
					},
				},
			},
			"o": 0,
		},
		"f": 63,
		"m": []interface{}{},
	}

	b, err := json.Marshal(payload)
	if err != nil {
		return "", err
	}

	return string(b), nil
}

func GetScriptPath(cl *CL) (string, error) {
	mainBundle, err := GetMainBundle(cl)
	if err != nil {
		return "", err
	}
	req, err := http.NewRequest("GET", "https://anime.nexus"+mainBundle, nil)
	if err != nil {
		return "", err
	}
	res, err := cl.Client.Do(req)
	if err != nil {
		return "", err
	}
	defer res.Body.Close()

	scriptContent, err := io.ReadAll(res.Body)
	if err != nil {
		return "", err
	}

	reFunc := regexp.MustCompile(`tt\("/_root/watch/\$id/\$"\)[\s\S]*?Promise\.all\(\[\s*([A-Za-z0-9_]+)\(`)

	match := reFunc.FindStringSubmatch(string(scriptContent))
	if len(match) < 2 {
		return "", errors.New("function not found")
	}

	fnName := match[1] // "JN"
	reHash := regexp.MustCompile(fnName + `\s*=\s*jt\([^)]*\)\.handler\(qt\("([a-f0-9]{64})"\)\)`)

	match2 := reHash.FindStringSubmatch(string(scriptContent))
	if len(match2) < 2 {
		return "", errors.New("hash not found")
	}

	return match2[1], nil
}

func GetMainBundle(cl *CL) (string, error) {
	req, err := http.NewRequest("GET", "https://anime.nexus/", nil)
	if err != nil {
		return "", err
	}
	res, err := cl.Client.Do(req)
	if err != nil {
		return "", err
	}
	defer res.Body.Close()

	html, err := io.ReadAll(res.Body)
	if err != nil {
		return "", err
	}
	re := regexp.MustCompile(`<link[^>]+rel=["']modulepreload["'][^>]+href=["']([^"']*main\.[^"']+)["']`)
	match := re.FindStringSubmatch(string(html))
	if len(match) > 1 {
		mainBundle := match[1]
		return mainBundle, nil
	} else {
		return "", errors.New("main bundle not found")
	}
}
