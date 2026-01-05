import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { Card, Space, Typography } from "antd";
import { fieldTypes } from "@/pages/FormSettings/constants/fieldTypes";

interface DraggableSidebarItemProps {
  type: string;
  label: string;
  icon: React.ReactNode;
  collapsed?: boolean;
}

const DraggableSidebarItem: React.FC<DraggableSidebarItemProps> = ({
  type,
  label,
  icon,
  collapsed,
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
      <Card
        size="small"
        hoverable
        style={{
          cursor: "move",
          marginBottom: 8,
          display: "flex",
          justifyContent: collapsed ? "center" : "flex-start",
        }}
        bodyStyle={{ padding: collapsed ? 8 : 12 }}
      >
        <Space>
          {icon}
          {!collapsed && <span>{label}</span>}
        </Space>
      </Card>
    </div>
  );
};

interface FieldSidebarProps {
  collapsed?: boolean;
}

const FieldSidebar: React.FC<FieldSidebarProps> = ({ collapsed }) => {
  return (
    <div style={{ padding: 16, background: "#fff", height: "100%" }}>
      {!collapsed && (
        <Typography.Title level={5} style={{ marginBottom: 16 }}>
          字段控件
        </Typography.Title>
      )}
      {collapsed && <div style={{ height: 16 }}></div>}
      {fieldTypes.map(item => (
        <DraggableSidebarItem key={item.type} {...item} collapsed={collapsed} />
      ))}
    </div>
  );
};

export default FieldSidebar;
