package main

import (
	"encoding/json"
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/google/uuid"
)

type INotesRepository interface {
	Init(path string)
	GetAll() []Note
	Add(note Note) CommandResult
	Remove(id string) CommandResult
	Filter(term string, tags []Tag)
	Update(id string, updated *Note) CommandResult
}

type NotesRepository struct {
	notes []Note
	Path  string
}

func (repo *NotesRepository) Init(path string) {
	fmt.Println("INIT")
	fmt.Println(path)
	repo.Path = path

	body, err := os.ReadFile(repo.Path)

	if err != nil {
		//panic("os? noooo")
	}

	var notes []Note
	jsonErr := json.Unmarshal(body, &notes)

	if jsonErr != nil {
		//panic("json? nooo")
	} else {
		fmt.Println("============== READ ==============")
		fmt.Println(notes)
		repo.notes = append(repo.notes, notes...)
	}
}

func (repo NotesRepository) GetAll() []Note {
	return repo.notes
}

func (repo *NotesRepository) Add(note Note) CommandResult {
	id := uuid.New()
	note.Id = id.String()
	note.CreatedOn = time.Now()

	repo.notes = append(repo.notes, note)
	err := repo.Save()

	var result CommandResult
	if err != nil {
		result = CommandResult{Success: false, Feedback: err.Error()}
	} else {
		result = CommandResult{Success: true}
	}

	return result
}

// https://stackoverflow.com/a/57213476
func removeIndex(collection []Note, index int) []Note {
	return append(collection[:index], collection[index+1:]...)
}

func (repo *NotesRepository) Remove(id string) CommandResult {
	for i, note := range repo.notes {
		if note.Id == id {
			repo.notes[i].IsDeleted = true
		}
	}

	err := repo.Save()
	var result CommandResult

	if err != nil {
		result = CommandResult{Success: false, Feedback: err.Error()}
	} else {
		result = CommandResult{Success: true}
	}

	return result
}

func (repo NotesRepository) Filter(term string, tags []Tag) []Note {
	results := make([]Note, 0)
	searchTerm := strings.ToLower(term)
	match := func(trm string) bool {
		return strings.Contains(strings.ToLower(trm), searchTerm)
	}

	for _, note := range repo.notes {
		contentMatch := match(note.Content)
		subjectMatch := match(note.Subject)
		noteTags := Filter(tags, func(x Tag) bool { return Contains(note.TagIds, x.Id) })

		if contentMatch || subjectMatch || Any(noteTags, func(x Tag) bool { return match(x.Name) }) {
			results = append(results, note)
		}
	}

	return results
}

func (repo NotesRepository) Update(id string, updated Note) CommandResult {
	for idx, note := range repo.notes {
		if note.Id == id {
			repo.notes[idx].Subject = updated.Subject
			repo.notes[idx].Content = updated.Content
			repo.notes[idx].TagIds = updated.TagIds
		}
	}
	err := repo.Save()

	var result CommandResult

	if err != nil {
		result = CommandResult{Success: false, Feedback: err.Error()}
	} else {
		result = CommandResult{Success: true}
	}

	return result
}

func (repo *NotesRepository) Save() error {
	data, err := json.Marshal(repo.notes)

	if err != nil {
		return err
	}

	err = os.WriteFile(repo.Path, data, 0644)

	if err != nil {
		return err
	}

	return nil
}
