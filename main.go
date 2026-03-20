package main

import (
	"log"

	"github.com/abdoumh0/nexus/handlers"
	utils "github.com/abdoumh0/nexus/lib"
	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
)

func main() {
	PORT := ":1323"

	client := utils.CustomClient()

	err := utils.WarmCookies(client)
	if err != nil {
		log.Panic("Error getting fresh cookies:", err)
	}

	vHosts := make(map[string]*echo.Echo)

	proxy := echo.New()
	vHosts["proxy.localhost"+PORT] = proxy
	proxy.Any("/*", handlers.Proxy(client))
	proxy.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:5173"},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
	}))

	api := echo.New()
	vHosts["api.localhost"+PORT] = api
	api.GET("/edges", handlers.CDNs(client))

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
