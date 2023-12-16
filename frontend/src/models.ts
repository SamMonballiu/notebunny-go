export interface Note {
  subject: string;
  content: string;
  id: string;
  createdOn: Date;
  tagIds: string[];
}

export interface Tag {
  id: string;
  name: string;
  createdOn: Date;
}

export interface CommandResult {
  Success: boolean;
  Feedback: string;
}

export type NoteSortOption = "name" | "creationDate";
