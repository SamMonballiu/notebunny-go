package main

import (
	"encoding/json"
	"fmt"
	"os"
	"strings"
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

func (repo NotesRepository) Filter(term string) []Note {
	searchTerm := strings.ToLower(term)

	results := make([]Note, 0)
	for _, note := range repo.notes {
		match := func(trm string) bool {
			return strings.Contains(strings.ToLower(trm), searchTerm)
		}
		contentMatch := match(note.Content)
		subjectMatch := match(note.Subject)

		if contentMatch || subjectMatch {
			results = append(results, note)
		}
	}

	return results
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

type ITagsRepository interface {
	Init(path string)
	GetAll() []Tag
}

type TagsRepository struct {
	tags []Tag
	Path string
}

func (repo TagsRepository) GetAll() []Tag {
	return repo.tags
}

func (repo *TagsRepository) Init(path string) {
	fmt.Println("INIT")
	fmt.Println(path)
	repo.Path = path

	body, err := os.ReadFile(repo.Path)

	if err != nil {
		//panic("os? noooo")
	}

	var tags []Tag
	jsonErr := json.Unmarshal(body, &tags)

	if jsonErr != nil {
		//panic("json? nooo")
	} else {
		fmt.Println("============== READ TAGS ==============")
		repo.tags = append(repo.tags, tags...)
	}
}
