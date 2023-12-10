export interface Note {
  subject: string;
  content: string;
  id: string;
  createdOn: Date;
  tagIds: string[];
}
