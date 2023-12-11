package main

import (
	"context"
)

// App struct
type App struct {
	ctx       context.Context
	notesRepo NotesRepository
	tagsRepo  TagsRepository
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
	a.tagsRepo.Init("tags.json")
}

func (a *App) GetNotes() []Note {
	return a.notesRepo.GetAll()
}

func (a *App) GetTags() []Tag {
	return a.tagsRepo.GetAll()
}
