import { FC, useState } from "react";
import styles from "./NoteEdit.module.scss";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Note } from "../models";
import { Button } from "./Button";

interface Props {
  note?: Note;
  onCancel: () => void;
  onSave: (subject: string, content: string) => void;
}

export const NoteEdit: FC<Props> = ({ note, onCancel, onSave }) => {
  const header = note ? "Edit note" : "New note";
  const unsavedMsg = "Are you sure? Unsaved changes will be lost.";
  const initial = {
    subject: note?.subject ?? "",
    content: note?.content ?? "",
  };
  const [subject, setSubject] = useState<string>(initial.subject);
  const [content, setContent] = useState<string>(initial.content);

  const isDirty = () =>
    subject !== initial.subject || content !== initial.content;

  const handleCancel = () => {
    if (!isDirty() || (isDirty() && confirm(unsavedMsg))) {
      onCancel();
    }
  };

  return (
    <div className={styles.container}>
      <h1>{header}</h1>
      <div className={styles.subject}>
        <input
          type="text"
          autoFocus
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
          <Markdown rehypePlugins={[remarkGfm]}>{content}</Markdown>
        </div>
      </div>
      <div className={styles.buttons}>
        <Button label="Cancel" action={handleCancel} />
        <Button
          label="Save"
          variant="primary"
          disabled={!isDirty() || subject === ""}
          action={() => onSave(subject, content)}
        />
      </div>
    </div>
  );
};
