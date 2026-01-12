import React from "react";
import { Spin } from "antd";
import styles from "./GrayCard.module.less";

export interface GrayCardProps {
  title?: React.ReactNode;
  extra?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  loading?: boolean;
}

const GrayCard: React.FC<GrayCardProps> = ({
  title,
  extra,
  children,
  className,
  style,
  loading,
}) => {
  return (
    <div className={`${styles.card} ${className ?? ""}`} style={style}>
      {(title || extra) && (
        <div className={styles.title}>
          {title && <span>{title}</span>}
          {extra && <span className={styles.extra}>{extra}</span>}
        </div>
      )}
      <div className={styles.content}>
        <Spin spinning={loading}>{children}</Spin>
      </div>
    </div>
  );
};

export default GrayCard;
