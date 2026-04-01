package handlers

import (
	"encoding/json"
	"io"
	"log"
	"net/http"

	"github.com/abdoumh0/nexus/types"
	"github.com/labstack/echo/v5"
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

func Download(client *http.Client) echo.HandlerFunc {
	return func(c *echo.Context) error {

		data, err := getDownloadRequest(c)

		if err != nil {
			return c.JSON(http.StatusBadRequest, map[string]string{
				"error": err.Error(),
			})
		}

		log.Printf("Parsed: episode_id=%s, hls=%s",
			data.EpisodeID, data.Stream.Hls)

		return c.JSON(http.StatusOK, map[string]interface{}{
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
