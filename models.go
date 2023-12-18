package main

import "time"

type Note struct {
	Id        string
	CreatedOn time.Time
	Subject   string
	Content   string
	TagIds    []string
}

type Tag struct {
	Id        string
	CreatedOn time.Time
	Name      string
}

type NotesResponse struct {
	Success bool
	Notes   []Note
}

type CommandResult struct {
	Success  bool
	Feedback string
}
