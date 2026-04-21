package sio

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/coder/websocket"
)

type Client struct {
	server    string
	path      string
	namespace string

	conn *websocket.Conn

	mu sync.RWMutex

	listeners    map[string][]func(any)
	anyListeners []func(string, any)
	callbacks    map[int]func(any)

	store map[string]any

	onConnect []func()

	nextID int

	ctx    context.Context
	cancel context.CancelFunc
}

// -------------------- constructor --------------------

func New(server, path, namespace string) *Client {
	if path == "" {
		path = "/"
	}
	if namespace == "" {
		namespace = "/"
	}

	ctx, cancel := context.WithCancel(context.Background())

	return &Client{
		server:       server,
		path:         path,
		namespace:    namespace,
		listeners:    make(map[string][]func(any)),
		callbacks:    make(map[int]func(any)),
		anyListeners: []func(string, any){},
		store:        make(map[string]any),
		onConnect:    []func(){},
		ctx:          ctx,
		cancel:       cancel,
	}
}

// -------------------- public API --------------------

func (c *Client) Connect(cl *http.Client, q url.Values) error {
	q.Set("EIO", "4")
	q.Set("transport", "websocket")

	u := url.URL{
		Scheme:   "https",
		Host:     c.server,
		Path:     c.path,
		RawQuery: q.Encode(),
	}

	header := http.Header{}
	header.Set("User-Agent", "Mozilla/5.0")
	header.Set("Origin", "https://anime.nexus")

	if jar := cl.Jar; jar != nil {
		cookies := jar.Cookies(&url.URL{Host: "api.anime.nexus", Scheme: "https"})
		if len(cookies) > 0 {
			var b strings.Builder
			for i, ck := range cookies {
				if i > 0 {
					b.WriteString("; ")
				}
				b.WriteString(ck.Name + "=" + ck.Value)
			}
			header.Set("Cookie", b.String())
		}
	}

	conn, _, err := websocket.Dial(c.ctx, u.String(), &websocket.DialOptions{
		HTTPHeader: header,
	})
	if err != nil {
		return err
	}

	c.mu.Lock()
	c.conn = conn
	c.mu.Unlock()

	go c.readLoop()

	return nil
}

func (c *Client) Close() error {
	c.cancel()

	c.mu.Lock()
	defer c.mu.Unlock()

	if c.conn != nil {
		err := c.conn.CloseNow()
		c.conn = nil
		return err
	}
	return nil
}

func (c *Client) Emit(event string, data any, ack func(any)) error {
	c.mu.Lock()

	id := -1
	if ack != nil {
		id = c.nextID
		c.nextID++
		c.callbacks[id] = ack
	}

	ns := c.namespace
	c.mu.Unlock()

	payload := []any{event, data}
	msgData, _ := json.Marshal(payload)

	var msg string
	if ns != "/" {
		if id >= 0 {
			msg = fmt.Sprintf("42%s,%d%s", ns, id, msgData)
		} else {
			msg = fmt.Sprintf("42%s,%s", ns, msgData)
		}
	} else {
		if id >= 0 {
			msg = fmt.Sprintf("42%d%s", id, msgData)
		} else {
			msg = "42" + string(msgData)
		}
	}

	return c.writeText(msg)
}

func (c *Client) On(event string, fn func(any)) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.listeners[event] = append(c.listeners[event], fn)
}

func (c *Client) OnAny(fn func(string, any)) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.anyListeners = append(c.anyListeners, fn)
}

func (c *Client) OnConnect(fn func()) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.onConnect = append(c.onConnect, fn)
}

func (c *Client) Get(key string) (any, bool) {
	c.mu.RLock()
	defer c.mu.RUnlock()
	v, ok := c.store[key]
	return v, ok
}

func (c *Client) Set(key string, val any) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.store[key] = val
}

// -------------------- internals --------------------

func (c *Client) writeText(msg string) error {
	c.mu.RLock()
	conn := c.conn
	c.mu.RUnlock()

	if conn == nil {
		return fmt.Errorf("no connection")
	}

	ctx, cancel := context.WithTimeout(c.ctx, 10*time.Second)
	defer cancel()

	return conn.Write(ctx, websocket.MessageText, []byte(msg))
}

func (c *Client) readLoop() {
	for {
		c.mu.RLock()
		conn := c.conn
		c.mu.RUnlock()

		if conn == nil {
			return
		}

		_, msg, err := conn.Read(c.ctx)
		if err != nil {
			if c.ctx.Err() != nil {
				return // normal shutdown
			}
			log.Println("read error:", err)
			return
		}

		if len(msg) == 0 {
			continue
		}

		switch msg[0] {

		case '0':
			c.handleHandshake(msg[1:])

		case '2':
			_ = c.writeText("3")

		case '4':
			c.handleSocketPacket(msg[1:])
		}
	}
}

// -------------------- handshake --------------------

func (c *Client) handleHandshake(data []byte) {
	var obj map[string]any
	if err := json.Unmarshal(data, &obj); err != nil {
		return
	}

	if sid, ok := obj["sid"]; ok {
		c.Set("engine_sid", sid)
	}

	if c.namespace != "/" {
		_ = c.writeText("40" + c.namespace)
	}
}

// -------------------- socket packet --------------------

func parsePacket(content string) (ns string, id *int, data string) {
	ns = "/"

	if strings.HasPrefix(content, "/") {
		if i := strings.Index(content, ","); i != -1 {
			ns = content[:i]
			content = content[i+1:]
		}
	}

	i := 0
	for i < len(content) && content[i] >= '0' && content[i] <= '9' {
		i++
	}

	if i > 0 {
		v, _ := strconv.Atoi(content[:i])
		id = &v
		content = content[i:]
	}

	data = content
	return
}

func (c *Client) handleSocketPacket(msg []byte) {
	if len(msg) == 0 {
		return
	}

	packetType := msg[0]
	content := string(msg[1:])

	ns, id, data := parsePacket(content)

	switch packetType {

	case '0':
		c.Set("socket_sid", data)

		log.Println("Namespace connected:", ns)

		c.mu.RLock()
		handlers := append([]func(){}, c.onConnect...)
		c.mu.RUnlock()

		for _, fn := range handlers {
			go fn()
		}

	case '2':
		var payload []any
		if err := json.Unmarshal([]byte(data), &payload); err != nil {
			return
		}

		if len(payload) == 0 {
			return
		}

		event, _ := payload[0].(string)
		eventData := payload[1:]

		c.mu.RLock()
		handlers := append([]func(any){}, c.listeners[event]...)
		anyHandlers := append([]func(string, any){}, c.anyListeners...)
		c.mu.RUnlock()

		for _, fn := range handlers {
			go fn(eventData)
		}

		for _, fn := range anyHandlers {
			go fn(event, eventData)
		}

	case '3':
		if id == nil {
			return
		}

		var payload []any
		if err := json.Unmarshal([]byte(data), &payload); err != nil {
			return
		}

		c.mu.Lock()
		cb := c.callbacks[*id]
		delete(c.callbacks, *id)
		c.mu.Unlock()

		if cb != nil {
			go func() {
				if len(payload) > 0 {
					cb(payload[0])
				} else {
					cb(nil)
				}
			}()
		}
	}
}
