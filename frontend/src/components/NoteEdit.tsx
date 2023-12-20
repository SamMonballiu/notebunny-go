import { FC, useState } from "react";
import styles from "./NoteEdit.module.scss";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Note, Tag } from "../models";
import { Button } from "./Button";
import { ConfirmDialog } from "./ConfirmDialog";
import { MdCheck, MdClose } from "react-icons/md";
import { Sidebar } from "./Sidebar";
import { IconButton } from "./IconButton";

interface Props {
  note?: Note;
  onCancel: () => void;
  onSave: (subject: string, content: string, tags: string) => void;
  tags: Tag[];
}

export const NoteEdit: FC<Props> = ({ note, tags, onCancel, onSave }) => {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const header = note ? "Edit note" : "New note";
  const unsavedMsg = "Are you sure? Unsaved changes will be lost.";
  const initial = {
    subject: note?.subject ?? "",
    content: note?.content ?? "",
    tags: note
      ? tags
          .filter((x) => note.tagIds.includes(x.id))
          .map((x) => x.name)
          .join(", ")
      : "",
  };
  const [subject, setSubject] = useState<string>(initial.subject);
  const [content, setContent] = useState<string>(initial.content);
  const [noteTags, setNoteTags] = useState<string>(initial.tags);

  const isDirty = () =>
    subject !== initial.subject ||
    content !== initial.content ||
    noteTags !== initial.tags;

  const handleCancel = () => {
    if (isDirty()) {
      setShowCancelDialog(true);
    } else {
      onCancel();
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar>
        <IconButton icon={<MdClose />} action={handleCancel} />
        <IconButton
          icon={<MdCheck />}
          disabled={!isDirty() || subject === ""}
          action={() => onSave(subject, content, noteTags)}
        />
      </Sidebar>
      <div className={styles.main}>
        <ConfirmDialog
          isOpen={showCancelDialog}
          onClose={() => setShowCancelDialog(false)}
          title="Cancel"
          message={unsavedMsg}
          onConfirm={() => onCancel()}
        />
        <h1>{header}</h1>
        <section className={styles.subject}>
          <input
            type="text"
            autoFocus
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </section>
        <section className={styles.tags}>
          <input
            type="text"
            value={noteTags}
            onChange={(e) => setNoteTags(e.target.value)}
          />
        </section>
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
      </div>
    </div>
  );
};
