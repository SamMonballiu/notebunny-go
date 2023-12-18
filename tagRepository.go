package main

import (
	"encoding/json"
	"fmt"
	"os"
	"time"

	"github.com/google/uuid"
)

type ITagsRepository interface {
	Init(path string)
	GetAll() []Tag
	Get(name string) Tag
	Has(name string) bool
	AddRange(names []string)
}

type TagsRepository struct {
	tags []Tag
	Path string
}

func (repo TagsRepository) GetAll() []Tag {
	return repo.tags
}

func (repo TagsRepository) Get(name string) *Tag {
	for _, tag := range repo.tags {
		if name == tag.Name {
			return &tag
		}
	}

	return nil
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

func (repo *TagsRepository) Has(name string) bool {
	for _, tag := range repo.tags {
		if tag.Name == name {
			return true
		}
	}

	return false
}

func (repo *TagsRepository) AddRange(names []string) []Tag {
	added := make([]Tag, 0)

	for _, name := range names {
		if !repo.Has(name) {
			tag := Tag{Name: name, Id: uuid.NewString(), CreatedOn: time.Now()}
			repo.tags = append(repo.tags, tag)
			added = append(added, tag)
		}
	}

	// repo.tags = append(repo.tags, added...)
	err := repo.Save()

	if err != nil {
		panic("AddRange: error saving")
	}

	return added
}

func (repo *TagsRepository) Save() error {
	data, err := json.Marshal(repo.tags)

	if err != nil {
		return err
	}

	err = os.WriteFile(repo.Path, data, 0644)

	if err != nil {
		return err
	}

	return nil
}
