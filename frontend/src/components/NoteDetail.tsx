import { Note } from "../models";
import { FC } from "react";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

interface Props {
  note: Note;
}

export const NoteDetail: FC<Props> = ({ note }) => {
  return <Markdown rehypePlugins={[rehypeHighlight]}>{note.content}</Markdown>;
};
