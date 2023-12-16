import { Note } from "../models";
import { FC } from "react";
import styles from "./NoteList.module.scss";
import cx from "classnames";

interface Props {
  className?: string;
  notes: Note[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
}

export const NotesList: FC<Props> = ({
  className,
  notes,
  selectedIndex,
  onSelect,
}) => {
  return (
    <section className={cx(className, styles.container)}>
      {notes.map((x, idx) => (
        <p
          key={x.id}
          onClick={() => onSelect(idx)}
          className={cx(styles.note, {
            [styles.selected]: idx === selectedIndex,
          })}
        >
          {x.subject}
        </p>
      ))}
    </section>
  );
};
