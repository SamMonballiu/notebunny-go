import { Note, Tag as TagModel } from "../models";
import { FC } from "react";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import styles from "./NoteDetail.module.scss";
import { Tag } from "./Tag";

interface Props {
  note: Note;
  tags: TagModel[];
}

export const NoteDetail: FC<Props> = ({ note, tags }) => {
  return (
    <div className={styles.container}>
      <h1>{note.subject}</h1>
      <div className={styles.details}>
        <h4>{note.createdOn?.toLocaleDateString()}</h4>
        <div className={styles.tags}>
          {tags.map((t) => (
            <Tag tag={t} key={t.id} />
          ))}
        </div>
      </div>

      <Markdown className={styles.content} rehypePlugins={[rehypeHighlight]}>
        {note.content}
      </Markdown>
    </div>
  );
};
