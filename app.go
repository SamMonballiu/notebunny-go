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

func (a *App) GetNotes(searchTerm string) []Note {
	if searchTerm == "" {
		return a.notesRepo.GetAll()
	}
	return a.notesRepo.Filter(searchTerm)
}

func (a *App) UpdateNote(id string, updated Note) CommandResult {
	result := a.notesRepo.Update(id, updated)
	return result
}

func (a *App) GetTags() []Tag {
	return a.tagsRepo.GetAll()
}
