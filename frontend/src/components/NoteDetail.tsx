import { Note } from "../models";
import { FC } from "react";

interface Props {
  note: Note;
}

export const NoteDetail: FC<Props> = ({ note }) => {
  return (
    <>
      {note.content.split("\n").map((chunk) => (
        <p>{chunk}</p>
      ))}
    </>
  );
};
