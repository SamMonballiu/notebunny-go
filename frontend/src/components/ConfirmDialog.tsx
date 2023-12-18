import { FC } from "react";
import styles from "./ConfirmDialog.module.scss";
import { Dialog } from "./Dialog";
import { Button } from "./Button";

interface Props {
  title: string;
  message?: string;
  onConfirm: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const ConfirmDialog: FC<Props> = ({
  title,
  message = "Are you sure?",
  onConfirm,
  ...props
}) => {
  return (
    <Dialog {...props}>
      <div className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>
        <div className={styles.buttons}>
          <Button label="Confirm" action={onConfirm} />
          <Button
            label="Cancel"
            autoFocus
            variant="primary"
            action={props.onClose}
          />
        </div>
      </div>
    </Dialog>
  );
};
