import { FC, useState } from "react";
import styles from "./NoteEdit.module.scss";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { Note } from "../models";
import { Button } from "./Button";

interface Props {
  note: Note;
  onCancel: () => void;
  onSave: () => void;
}

export const NoteEdit: FC<Props> = ({ note, onCancel, onSave }) => {
  const [subject, setSubject] = useState<string>(note.subject);
  const [content, setContent] = useState<string>(note.content);
  return (
    <div className={styles.container}>
      <div className={styles.subject}>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>
      <div className={styles.edit}>
        <div className={styles.left}>
          <div className={styles.content}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.preview}>
          <Markdown rehypePlugins={[rehypeHighlight, remarkGfm]}>
            {content}
          </Markdown>
        </div>
      </div>
      <div className={styles.buttons}>
        <Button label="Cancel" action={onCancel} />
        <Button label="Save" action={onSave} />
      </div>
    </div>
  );
};
