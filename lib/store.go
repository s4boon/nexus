package utils

import (
	"sync"

	sio "github.com/abdoumh0/nexus/socket.io"
)

// type WSStore struct {
// 	clients map[string]*sio.Client
// 	mu      sync.RWMutex
// }

// func NewWSStore() *WSStore {
// 	return &WSStore{
// 		clients: make(map[string]*sio.Client),
// 	}
// }

// func (s *WSStore) Add(id string, c *sio.Client) {
// 	s.mu.Lock()
// 	defer s.mu.Unlock()
// 	s.clients[id] = c
// }

// func (s *WSStore) Remove(id string) {
// 	s.mu.Lock()
// 	defer s.mu.Unlock()
// 	delete(s.clients, id)
// }

// func (s *WSStore) Get(id string) (*sio.Client, bool) {
// 	s.mu.RLock()
// 	defer s.mu.RUnlock()
// 	c, ok := s.clients[id]
// 	return c, ok
// }

type Download struct {
	filepath string
	filename string
	size     uint64
	conn     *sio.Client

	mu       sync.RWMutex
	dsize    uint64
	finished bool
	progress int
}

func NewDownload(path, name string, size uint64) *Download {
	return &Download{
		filepath: path,
		filename: name,
		size:     size,
		dsize:    0,
		finished: false,
		progress: 0,
	}
}

func (d *Download) Path() string { return d.filepath }
func (d *Download) Name() string { return d.filename }
func (d *Download) Size() uint64 { return d.size }

func (d *Download) DownloadedSize() uint64 {
	d.mu.RLock()
	defer d.mu.RUnlock()
	return d.dsize
}

func (d *Download) AppendDSize(agg uint64) {
	d.mu.Lock()
	defer d.mu.Unlock()
	d.dsize += agg
}

func (d *Download) Finished() bool {
	d.mu.RLock()
	defer d.mu.RUnlock()
	return d.finished
}

func (d *Download) SetFinished(f bool) {
	d.mu.Lock()
	defer d.mu.Unlock()
	d.finished = f
}

func (d *Download) Progress() int {
	d.mu.RLock()
	defer d.mu.RUnlock()
	return d.progress
}

func (d *Download) SetProgress(p int) {
	d.mu.Lock()
	defer d.mu.Unlock()
	d.progress = p
}

func (d *Download) SetClient(c *sio.Client) {
	d.mu.Lock()
	defer d.mu.Unlock()
	d.conn = c
}

func (d *Download) Client() *sio.Client {
	d.mu.RLock()
	defer d.mu.RUnlock()
	return d.conn
}

func (d *Download) Close() error {
	d.mu.Lock()
	defer d.mu.Unlock()

	if d.conn != nil {
		err := d.conn.Close()
		d.conn = nil
		return err
	}
	return nil
}

type CurrentDownloads struct {
	store map[string]*Download
	mu    sync.RWMutex
}

func NewDownloadStore() *CurrentDownloads {
	return &CurrentDownloads{
		store: map[string]*Download{},
	}
}

func (d *CurrentDownloads) Add(id string, do *Download) {
	d.mu.Lock()
	defer d.mu.Unlock()
	d.store[id] = do
}

func (d *CurrentDownloads) Remove(id string) {
	d.mu.Lock()
	defer d.mu.Unlock()
	delete(d.store, id)
}

func (d *CurrentDownloads) Size() (total, downloaded uint64) {
	d.mu.RLock()
	defer d.mu.RUnlock()

	for _, do := range d.store {
		total += do.Size()
		downloaded += do.DownloadedSize()
	}
	return
}

func (d *CurrentDownloads) Get(id string) (*Download, bool) {
	d.mu.RLock()
	defer d.mu.RUnlock()
	do, ok := d.store[id]
	return do, ok
}
