package main

import (
	"context"
)

// App struct
type App struct {
	ctx       context.Context
	notesRepo NotesRepository
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	a.notesRepo = NotesRepository{}
	a.notesRepo.Init("notes.json")
}

func (a *App) Test() []Note {
	return a.notesRepo.GetAll()
}
