import { FC } from "react";
import styles from "./Button.module.scss";
import cx from "classnames";

type Variant = "default" | "primary" | "danger";

interface Props {
  label: string;
  action?: () => void;
  disabled?: boolean;
  variant?: Variant;
  autoFocus?: boolean;
}

export const Button: FC<Props> = ({
  label,
  action,
  disabled,
  variant = "default",
  autoFocus,
}) => {
  return (
    <button
      autoFocus={autoFocus}
      className={cx(styles.button, {
        [styles.primary]: variant === "primary",
        [styles.default]: variant === "default",
        [styles.danger]: variant === "danger",
        [styles.disabled]: disabled,
      })}
      onClick={disabled ? undefined : action}
    >
      {label}
    </button>
  );
};
