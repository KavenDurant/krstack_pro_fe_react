import React from "react";
import { Breadcrumb } from "antd";

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

export interface BreadcrumbContainerProps {
  items: BreadcrumbItem[];
  className?: string;
  style?: React.CSSProperties;
}

const BreadcrumbContainer: React.FC<BreadcrumbContainerProps> = ({
  items,
  className,
  style,
}) => {
  return (
    <Breadcrumb
      className={className}
      style={{
        padding: "12px 24px",
        backgroundColor: "#fff",
        borderBottom: "1px solid #f0f0f0",
        width: "100%",
        ...style,
      }}
    >
      {items.map((item, index) => (
        <Breadcrumb.Item key={index} onClick={item.onClick}>
          {item.label}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

export default BreadcrumbContainer;
