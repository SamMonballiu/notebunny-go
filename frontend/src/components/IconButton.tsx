import { FC } from "react";
import styles from "./IconButton.module.scss";
import cx from "classnames";

interface Props {
  action: () => void;
  disabled?: boolean;
  icon: React.ReactNode;
}

export const IconButton: FC<Props> = ({ icon, action, disabled }) => {
  return (
    <button
      onClick={disabled ? undefined : action}
      className={cx(styles.icon, {
        [styles.disabled]: disabled,
      })}
    >
      {icon}
    </button>
  );
};
