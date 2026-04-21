package handlers

import (
	"context"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"sort"
	"strings"
	"sync"
	"time"

	"github.com/abdoumh0/nexus/types"
	"github.com/labstack/echo/v5"
)

func Proxy(client *http.Client) echo.HandlerFunc {
	return func(c *echo.Context) error {
		path := c.Param("*")
		target := "https://api.anime.nexus/" + path
		if query := c.Request().URL.RawQuery; query != "" {
			target += "?" + query
		}

		req, err := http.NewRequest(c.Request().Method, target, c.Request().Body)
		if err != nil {
			log.Print("Error creating upstream request:", err)
			return echo.ErrInternalServerError
		}

		res, err := client.Do(req)
		if err != nil {
			log.Print("Error performing upstream request:", err)
			return err
		}
		defer res.Body.Close()
		for k, v := range res.Header {
			for _, vv := range v {
				c.Response().Header().Add(k, vv)
			}
		}
		return c.Stream(res.StatusCode, res.Header.Get("Content-Type"), res.Body)
	}
}

func getCDNs(client *http.Client) ([]types.Edge, error) {
	req, err := http.NewRequest("GET", "https://eu1.cdn.nexus/api/edges", nil)
	if err != nil {
		log.Print("Error creating upstream request:", err)
		return nil, err
	}

	res, err := client.Do(req)
	if err != nil {
		log.Print("Error fetching CDNs:", err)
		return nil, err
	}
	defer res.Body.Close()

	var cdns types.NexusCDNs
	if err := json.NewDecoder(res.Body).Decode(&cdns); err != nil {
		log.Print("Error decoding CDN response:", err)
		return nil, err
	}
	return cdns.Edges, nil
}

func CDNs(client *http.Client) echo.HandlerFunc {
	return func(c *echo.Context) error {
		cdns, err := getCDNs(client)
		if err != nil {
			return echo.ErrInternalServerError
		}
		return c.JSON(http.StatusOK, cdns)
	}
}

func TestCDNs(client *http.Client) echo.HandlerFunc {
	return func(c *echo.Context) error {

		cdns, err := getCDNs(client)
		if err != nil {
			return echo.ErrInternalServerError
		}
		results := testCDNs(cdns, client)

		return c.JSON(http.StatusOK, results)
	}
}

// CDNTestResult holds the result of testing one CDN edge
type CDNTestResult struct {
	ID           string `json:"id"`
	Name         string `json:"name"`
	Location     string `json:"location"`
	PingURL      string `json:"ping_url"`
	Latency      int64  `json:"avg_latency_ms"` // Average
	MinLatency   int64  `json:"min_latency_ms"` // Best case
	MaxLatency   int64  `json:"max_latency_ms"` // Worst case
	StatusCode   int    `json:"status_code"`
	Error        string `json:"error,omitempty"`
	Success      bool   `json:"success"`
	RequestCount int    `json:"request_count"` // How many succeeded
}

func testCDNs(edges []types.Edge, client *http.Client) []CDNTestResult {
	var (
		wg      sync.WaitGroup
		results = make(chan CDNTestResult, len(edges))
		timeout = 3 * time.Second
	)

	for _, edge := range edges {
		wg.Add(1)
		go func(e types.Edge) {
			defer wg.Done()
			results <- testSingleCDN(e, client, timeout, 5)
		}(edge)
	}

	go func() {
		wg.Wait()
		close(results)
	}()

	var final []CDNTestResult
	for res := range results {
		final = append(final, res)
	}

	// Sort by average latency
	sort.Slice(final, func(i, j int) bool {
		if final[i].Success && !final[j].Success {
			return true
		}
		if !final[i].Success && final[j].Success {
			return false
		}
		return final[i].Latency < final[j].Latency
	})

	return final
}

// testSingleCDN now takes multiple measurements
func testSingleCDN(edge types.Edge, client *http.Client, timeout time.Duration, numRequests int) CDNTestResult {
	result := CDNTestResult{
		ID: edge.ID, Name: edge.Name, Location: edge.Location, PingURL: edge.PingURL,
	}

	var latencies []time.Duration
	var errors []string

	for i := 0; i < numRequests; i++ {
		ctx, cancel := context.WithTimeout(context.Background(), timeout)
		req, err := http.NewRequestWithContext(ctx, "GET", edge.PingURL, nil)
		if err != nil {
			errors = append(errors, err.Error())
			cancel()
			continue
		}

		start := time.Now()
		resp, err := client.Do(req)
		if err != nil {
			errors = append(errors, err.Error())
			cancel()
			continue
		}

		latency := time.Since(start)
		latencies = append(latencies, latency)

		// Discard body
		_, _ = io.Copy(io.Discard, resp.Body)
		resp.Body.Close()
		cancel()

		// Small delay between requests (optional, prevents rate limiting)
		if i < numRequests-1 {
			time.Sleep(100 * time.Millisecond)
		}
	}

	// Calculate average latency
	if len(latencies) > 0 {
		var total time.Duration
		for _, l := range latencies {
			total += l
		}

		avg := total / time.Duration(len(latencies))
		result.Latency = avg.Milliseconds()
		result.MinLatency = (min(latencies) / time.Millisecond).Milliseconds()
		result.MaxLatency = (max(latencies) / time.Millisecond).Milliseconds()
		result.Success = true
		result.StatusCode = 200
	}

	// Record error if all requests failed
	if len(latencies) == 0 {
		result.Error = strings.Join(errors, "; ")
		result.Success = false
	}

	// Optional: Include stats for debugging
	result.MinLatency = min(latencies).Milliseconds()
	result.MaxLatency = max(latencies).Milliseconds()
	result.RequestCount = len(latencies)

	return result
}

// Helper functions
func min(latencies []time.Duration) time.Duration {
	if len(latencies) == 0 {
		return 0
	}
	m := latencies[0]
	for _, l := range latencies[1:] {
		if l < m {
			m = l
		}
	}
	return m
}

func max(latencies []time.Duration) time.Duration {
	if len(latencies) == 0 {
		return 0
	}
	m := latencies[0]
	for _, l := range latencies[1:] {
		if l > m {
			m = l
		}
	}
	return m
}
