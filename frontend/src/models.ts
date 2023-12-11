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
