import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { Card, Space, Typography } from "antd";
import {
  FormOutlined,
  NumberOutlined,
  CheckSquareOutlined,
} from "@ant-design/icons";

// Field types definition
export const fieldTypes = [
  { type: "text", label: "单行文本", icon: <FormOutlined /> },
  { type: "number", label: "数字输入", icon: <NumberOutlined /> },
  { type: "checkbox", label: "多选框", icon: <CheckSquareOutlined /> },
];

interface DraggableSidebarItemProps {
  type: string;
  label: string;
  icon: React.ReactNode;
}

const DraggableSidebarItem: React.FC<DraggableSidebarItemProps> = ({
  type,
  label,
  icon,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `sidebar-${type}`,
    data: {
      type,
      isSidebar: true,
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <Card size="small" hoverable style={{ cursor: "move", marginBottom: 8 }}>
        <Space>
          {icon}
          <span>{label}</span>
        </Space>
      </Card>
    </div>
  );
};

const FieldSidebar: React.FC = () => {
  return (
    <div style={{ padding: 16, background: "#fff", height: "100%" }}>
      <Typography.Title level={5}>字段控件</Typography.Title>
      {fieldTypes.map(item => (
        <DraggableSidebarItem key={item.type} {...item} />
      ))}
    </div>
  );
};

export default FieldSidebar;
