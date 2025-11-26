import React, { useState } from "react";
import { Drawer, Button, Space, Switch, Checkbox } from "antd";
import { HolderOutlined } from "@ant-design/icons";

export interface ColumnConfig {
  key: string;
  title: string;
  visible: boolean;
  fixed?: boolean; // If true, cannot be hidden or reordered (or at least pinned to top/bottom)
}

interface ColumnSettingsDrawerProps {
  open: boolean;
  onClose: () => void;
  columns: ColumnConfig[];
  onColumnsChange: (newColumns: ColumnConfig[]) => void;
}

const ColumnSettingsDrawer: React.FC<ColumnSettingsDrawerProps> = ({
  open,
  onClose,
  columns,
  onColumnsChange,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Separate fixed and draggable columns
  const topFixed = columns.find(c => c.key === "name");
  const bottomFixed = columns.find(c => c.key === "action");
  const middleColumns = columns.filter(
    c => c.key !== "name" && c.key !== "action"
  );

  const handleToggleVisibility = (key: string, visible: boolean) => {
    const newColumns = columns.map(col =>
      col.key === key ? { ...col, visible } : col
    );
    onColumnsChange(newColumns);
  };

  const handleReset = () => {
    const resetColumns = columns.map(c => ({ ...c, visible: true }));
    onColumnsChange(resetColumns);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    // Reorder middle columns
    const newMiddleColumns = [...middleColumns];
    const [draggedItem] = newMiddleColumns.splice(draggedIndex, 1);
    newMiddleColumns.splice(dropIndex, 0, draggedItem);

    // Reconstruct full columns array
    const newColumns = [
      ...(topFixed ? [topFixed] : []),
      ...newMiddleColumns,
      ...(bottomFixed ? [bottomFixed] : []),
    ];

    onColumnsChange(newColumns);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <Drawer
      title="列设置"
      placement="right"
      onClose={onClose}
      open={open}
      styles={{ wrapper: { width: 320 } }}
      extra={
        <Space>
          <Button onClick={handleReset}>重置</Button>
          <Button type="primary" onClick={onClose}>
            确定
          </Button>
        </Space>
      }
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        {/* Top Fixed Column */}
        {topFixed && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 0",
              borderBottom: "1px solid #f0f0f0",
              background: "#fafafa",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <HolderOutlined
                style={{
                  marginRight: 12,
                  color: "#d9d9d9",
                  cursor: "not-allowed",
                }}
              />
              <Checkbox
                checked={topFixed.visible}
                disabled
                style={{ marginRight: 12 }}
              />
              <span>{topFixed.title}</span>
              <span
                style={{
                  marginLeft: 8,
                  fontSize: 12,
                  color: "#999",
                  background: "#f5f5f5",
                  padding: "0 4px",
                  borderRadius: 2,
                }}
              >
                固定
              </span>
            </div>
            <Switch size="small" checked={topFixed.visible} disabled />
          </div>
        )}

        {/* Draggable Middle Columns */}
        {middleColumns.map((col, index) => (
          <div
            key={col.key}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={e => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={e => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 0",
              background: draggedIndex === index ? "#f0f5ff" : "#fff",
              borderBottom: "1px solid #f0f0f0",
              borderTop:
                dragOverIndex === index && draggedIndex !== index
                  ? "2px solid #1890ff"
                  : "none",
              opacity: draggedIndex === index ? 0.5 : 1,
              cursor: "move",
              transition: "all 0.2s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <HolderOutlined
                style={{
                  cursor: "grab",
                  marginRight: 12,
                  color: "#8c8c8c",
                }}
              />
              <Checkbox
                checked={col.visible}
                onChange={e =>
                  handleToggleVisibility(col.key, e.target.checked)
                }
                style={{ marginRight: 12 }}
              />
              <span>{col.title}</span>
            </div>
            <Switch
              size="small"
              checked={col.visible}
              onChange={checked => handleToggleVisibility(col.key, checked)}
            />
          </div>
        ))}

        {/* Bottom Fixed Column */}
        {bottomFixed && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 0",
              borderBottom: "1px solid #f0f0f0",
              background: "#fafafa",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <HolderOutlined
                style={{
                  marginRight: 12,
                  color: "#d9d9d9",
                  cursor: "not-allowed",
                }}
              />
              <Checkbox
                checked={bottomFixed.visible}
                disabled
                style={{ marginRight: 12 }}
              />
              <span>{bottomFixed.title}</span>
              <span
                style={{
                  marginLeft: 8,
                  fontSize: 12,
                  color: "#999",
                  background: "#f5f5f5",
                  padding: "0 4px",
                  borderRadius: 2,
                }}
              >
                固定
              </span>
            </div>
            <Switch size="small" checked={bottomFixed.visible} disabled />
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default ColumnSettingsDrawer;
