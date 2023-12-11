import { Tag as TagModel } from "../models";
import { FC } from "react";
import styles from "./Tag.module.scss";

interface Props {
  tag: TagModel;
}

export const Tag: FC<Props> = ({ tag }) => {
  return <p className={styles.tag}>{tag.name}</p>;
};
