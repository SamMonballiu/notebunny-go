import { Note, Tag as TagModel } from "../models";
import { FC } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./NoteDetail.module.scss";
import { Tag } from "./Tag";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

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

      <div className={styles.content}>
        <Markdown
          components={{
            code(props) {
              const { children, className, node, ...rest } = props;
              const match = /language-(\w+)/.exec(className || "");
              return match ? (
                //@ts-ignore
                <SyntaxHighlighter
                  {...rest}
                  PreTag="div"
                  children={String(children).replace(/\n$/, "")}
                  language={match[1]}
                  // style={light}
                />
              ) : (
                <code {...rest} className={className}>
                  {children}
                </code>
              );
            },
          }}
          rehypePlugins={[remarkGfm]}
        >
          {note.content}
        </Markdown>
      </div>
    </div>
  );
};
