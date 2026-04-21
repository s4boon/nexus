package handlers

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"net/url"
	"sort"
	"strings"

	utils "github.com/abdoumh0/nexus/lib"
	sio "github.com/abdoumh0/nexus/socket.io"
	"github.com/abdoumh0/nexus/types"
	"github.com/labstack/echo/v5"
	"github.com/shirou/gopsutil/v4/disk"
)

// func Download(client *http.Client) echo.HandlerFunc {
// 	return func(c *echo.Context) error {
// 		// log.Printf("=== Incoming Request ===")
// 		// log.Printf("Method: %s", c.Request().Method)
// 		// log.Printf("Path: %s", c.Request().URL.Path)
// 		// log.Printf("Content-Type: %s", c.Request().Header.Get("Content-Type"))
// 		// log.Printf("Content-Length: %s", c.Request().Header.Get("Content-Length"))

// 		// bodyBytes, err := io.ReadAll(c.Request().Body)
// 		// if err != nil {
// 		// 	log.Printf("Error reading body: %v", err)
// 		// 	return c.JSON(http.StatusInternalServerError, map[string]string{
// 		// 		"error": "Failed to read request body",
// 		// 	})
// 		// }
// 		// log.Printf("Raw Body (%d bytes):\n%s", len(bodyBytes), string(bodyBytes))

// 		// var prettyJSON bytes.Buffer
// 		// if err := json.Indent(&prettyJSON, bodyBytes, "", "  "); err == nil {
// 		// 	log.Printf("Pretty JSON:\n%s", prettyJSON.String())
// 		// } else {
// 		// 	log.Printf("Body is not valid JSON: %v", err)
// 		// }

// 		// c.Request().Body = io.NopCloser(bytes.NewBuffer(bodyBytes))

// 		// log.Printf("=== End Request ===\n")

// 		// return c.JSON(http.StatusOK, map[string]string{
// 		// 	"status":  "logged",
// 		// 	"message": "Request logged to server console",
// 		// })
// 		var downloadReq types.DownloadRequest

// 		if err := c.Bind(&downloadReq); err != nil {
// 			return c.JSON(http.StatusBadRequest, map[string]string{
// 				"error": "Invalid JSON",
// 			})
// 		}

// 		if err := c.Validate(&downloadReq); err != nil {
// 			return c.JSON(http.StatusBadRequest, map[string]string{
// 				"error": err.Error(),
// 			})
// 		}

// 		log.Printf("Received download request: %+v\n", downloadReq)

// 		return c.JSON(http.StatusOK, map[string]interface{}{
// 			"message": "success",
// 			"user":    downloadReq,
// 		})
// 	}
// }

type AuthPayload struct {
	Ref         string `json:"ref"`
	Fingerprint string `json:"fingerprint"`
}

func Download(cl *utils.CL, downloads *utils.CurrentDownloads) echo.HandlerFunc {
	return func(c *echo.Context) error {

		data, err := getDownloadRequest(c)

		// path := fmt.Sprintf("./downloads/%s(%s)", data.AnimeName, data.AnimeAltName)

		if err != nil {
			return c.JSON(http.StatusBadRequest, map[string]string{
				"error": err.Error(),
			})
		}

		sort.Strings(data.Audio)
		DOWNLOAD_KEY := data.EpisodeID + "/" + data.Quality + "/" + strings.Join(data.Audio, ".")

		if d, ok := downloads.Get(DOWNLOAD_KEY); ok && d.Client() != nil {
			return c.JSON(http.StatusOK, map[string]any{
				"message": "download already exists",
				"data":    data,
			})
		}

		// log.Printf("%+v\n", *data)

		go func() {
			size, ok := data.Stream.VideoMeta.FileSizeStreams[data.Quality]
			if !ok {
				log.Println("quality does not exist")
				return
			}
			stats, err := disk.Usage("./")
			if err != nil {
				log.Println("error getting disk stats")
				return
			}
			total, downloaded := downloads.Size()
			remaining := total - downloaded
			needed := size + size/20
			if stats.Free < remaining+needed {
				log.Println("not enough space")
				return
			}

			log.Printf("%s: %.2f Mb\n", data.Quality, float64(size)/1024/1024)
			log.Printf("free space: %.2f Gb\n", float64(stats.Free)/1024/1024/1024)

			key := data.EpisodeID + "/" + data.Quality
			path := "./Downloads/" + data.AnimeName
			downloads.Add(key, utils.NewDownload(path, data.Filename, size))

			log.Println("Starting socket flow")
			defer log.Println("Socket goroutine ended")

			err = utils.Viewable(cl, data.EpisodeID)
			if err != nil {
				log.Println("error in viewable ", err)
			}

			// sstoken, err := utils.GetServerSideToken(cl, data.EpisodeID, script)
			// log.Printf("EXTRACTED SS TOKEN: %s\n", sstoken)
			// if err != nil {
			// 	log.Printf("failed to get ss token: %v\n", err)
			// }

			token, err := utils.GetToken(cl.Client, data.EpisodeID, data.EpisodeSlug)
			if err != nil {
				log.Printf("Error fetching token: %v", err)
				return
			} else {
				log.Printf("Fetched token: %s", token)
			}

			SIO := sio.New("prd-socket.anime.nexus", "/api/socket/", "/video")

			SIO.OnConnect(func() {
				log.Println("Connected: sending auth")
				payload := AuthPayload{
					Ref:         token,
					Fingerprint: cl.Fingerprint.String(),
				}

				SIO.Emit("auth", payload, nil)
			})

			SIO.OnAny(func(s string, a any) {
				log.Printf("%s: %s", s, a)
			})

			err = SIO.Connect(cl.Client, url.Values{
				"videoId":     {data.EpisodeID},
				"fingerprint": {cl.Fingerprint.String()},
				"m3u8Url":     {data.Stream.Hls},
			})

			if err != nil {
				log.Printf("Error connecting to Socket.IO: %v", err)
				return
			}
		}()

		return c.JSON(http.StatusOK, map[string]any{
			"message": "success",
			"data":    data,
		})
	}
}

func getDownloadRequest(c *echo.Context) (*types.DownloadRequest, error) {
	body, err := io.ReadAll(c.Request().Body)
	if err != nil {
		return nil, err
	}

	var downloadReq types.DownloadRequest
	if err := json.Unmarshal(body, &downloadReq); err != nil {
		return nil, err
	}
	return &downloadReq, nil
}
