package main

import (
	"context"
	"strings"
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
	var collection []Note
	if searchTerm == "" {
		collection = a.notesRepo.GetAll()
	} else {
		tags := a.tagsRepo.GetAll()
		collection = a.notesRepo.Filter(searchTerm, tags)
	}

	return Filter(collection, func(note Note) bool { return !note.IsDeleted })
}

func (a *App) UpdateNote(id string, updated *Note, tags string) CommandResult {
	(*updated).TagIds = getUpsertedTagIds(&a.tagsRepo, tags)
	result := a.notesRepo.Update(id, *updated)
	return result
}

func (a *App) RemoveNote(id string) CommandResult {
	return a.notesRepo.Remove(id)
}

func (a *App) CreateNote(subject string, content string, tags string) CommandResult {
	note := Note{Subject: subject, Content: content, TagIds: getUpsertedTagIds(&a.tagsRepo, tags)}
	return a.notesRepo.Add(note)
}

func (a *App) GetTags() []Tag {
	return a.tagsRepo.GetAll()
}

func getUpsertedTagIds(tagsRepo *TagsRepository, tags string) []string {
	if tags == "" {
		return make([]string, 0)
	}

	split := strings.Split(tags, ", ")
	existing := make([]Tag, 0)
	toCreate := make([]string, 0)

	// Split tags up into existing or toCreate
	for _, tagName := range split {
		if tagsRepo.Has(tagName) {
			existing = append(existing, *tagsRepo.Get(tagName))
		} else {
			toCreate = append(toCreate, tagName)
		}
	}

	// Create tags
	created := tagsRepo.AddRange(toCreate)

	// Get IDs for newly created and existing tags
	createdIds := make([]string, 0)
	for _, tag := range created {
		createdIds = append(createdIds, tag.Id)
	}

	existingIds := make([]string, 0)
	for _, tag := range existing {
		existingIds = append(existingIds, tag.Id)
	}

	return append(createdIds, existingIds...)
}
