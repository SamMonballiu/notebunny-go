import { Note } from "../models";
import { FC } from "react";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import styles from "./NoteDetail.module.scss";

interface Props {
  note: Note;
}

export const NoteDetail: FC<Props> = ({ note }) => {
  return (
    <div className={styles.container}>
      <h1>{note.subject}</h1>
      <h4>{note.createdOn?.toLocaleDateString()}</h4>

      <Markdown className={styles.content} rehypePlugins={[rehypeHighlight]}>
        {note.content}
      </Markdown>
    </div>
  );
};
