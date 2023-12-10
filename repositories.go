package main

import (
	"encoding/json"
	"fmt"
	"os"
)

type INotesRepository interface {
	Init(path string)
	GetAll() []Note
	Add(note Note)
	Remove(note Note)
	Filter(term string)
}

type NotesRepository struct {
	notes []Note
	Path  string
}

func (repo NotesRepository) GetAll() []Note {
	return repo.notes
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
