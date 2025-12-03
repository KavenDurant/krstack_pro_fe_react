import React from "react";
import styles from "./GrayCard.module.css";

export interface GrayCardProps {
  title?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const GrayCard: React.FC<GrayCardProps> = ({
  title,
  children,
  className,
  style,
}) => {
  return (
    <div className={`${styles.card} ${className ?? ""}`} style={style}>
      {title && <div className={styles.title}>{title}</div>}
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default GrayCard;
