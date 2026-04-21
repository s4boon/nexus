package main

import (
	"log"

	"github.com/abdoumh0/nexus/handlers"
	utils "github.com/abdoumh0/nexus/lib"
	"github.com/google/uuid"
	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
)

func main() {
	PORT := ":1323"

	client := utils.CustomClient()
	FINGERPRINT := uuid.New()
	downloads := utils.NewDownloadStore()

	cl := &utils.CL{
		Client:      client,
		Fingerprint: FINGERPRINT,
	}

	err := utils.WarmCookies(cl.Client)
	if err != nil {
		log.Panic("Error getting fresh cookies:", err)
	}

	// script, err := utils.GetScriptPath(cl)
	// if err != nil {
	// 	log.Panic("Error getting script path")
	// }

	vHosts := make(map[string]*echo.Echo)

	// ---------------------------- Proxy ------------------------------

	proxy := echo.New()
	vHosts["proxy.localhost"+PORT] = proxy
	proxy.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:5173"},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
	}))

	proxy.Any("/*", handlers.Proxy(client))

	// ---------------------------- API ------------------------------
	api := echo.New()
	vHosts["api.localhost"+PORT] = api
	api.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:5173"},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
	}))

	api.GET("edges", handlers.CDNs(cl.Client))
	api.GET("/test_edges", handlers.TestCDNs(cl.Client))
	api.POST("/download", handlers.Download(cl, downloads))

	// ---------------------------- Frontend ------------------------------
	frontend := echo.New()
	vHosts["localhost"+PORT] = frontend
	frontend.File("/*", "static/index.html")

	e := echo.NewVirtualHostHandler(vHosts)
	e.Pre(middleware.RemoveTrailingSlash())
	e.Use(middleware.RequestLogger())
	e.Use(middleware.Recover())

	if err := e.Start(PORT); err != nil {
		e.Logger.Error("failed to start server", "error", err)
	}
}
