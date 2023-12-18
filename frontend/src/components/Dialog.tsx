import { Dialog as HeadlessDialog } from "@headlessui/react";
import React, { FC, useRef } from "react";
import styles from "./Dialog.module.scss";

export interface DialogProps extends React.PropsWithChildren {
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  buttons?: {
    label: string;
    className?: string;
    onClick: () => void;
    disabled?: boolean;
  }[];
}

export const Dialog: FC<DialogProps> = ({
  title,
  isOpen,
  onClose,
  children,
  buttons,
}) => {
  const dialogRef = useRef<HTMLElement | undefined>();
  const backdropRef = useRef<HTMLElement | undefined>();

  const handleClose = () => {
    dialogRef.current?.classList.add(styles.closePanel);
    backdropRef.current?.classList.add(styles.closeBackdrop);
    setTimeout(onClose, 200);
  };

  return (
    <HeadlessDialog
      open={isOpen}
      onClose={handleClose}
      className={styles.dialogRoot}
    >
      {/* @ts-ignore */}
      <div className={styles.backdrop} ref={backdropRef}>
        &nbsp;
      </div>

      <div className={styles.dialog}>
        {/* @ts-ignore */}
        <HeadlessDialog.Panel ref={dialogRef} className={styles.panel}>
          {title && <HeadlessDialog.Title>{title}</HeadlessDialog.Title>}
          {children}
          {buttons && (
            <div className={styles.buttons}>
              {buttons.map((btn) => (
                <button
                  key={btn.label}
                  disabled={btn.disabled ?? false}
                  className={btn.className}
                  onClick={btn.onClick}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          )}
        </HeadlessDialog.Panel>
      </div>
    </HeadlessDialog>
  );
};
