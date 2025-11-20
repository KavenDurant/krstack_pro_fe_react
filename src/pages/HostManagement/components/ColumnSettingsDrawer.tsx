import React from "react";
import { Drawer, Button, Space, Switch, Checkbox } from "antd";
import { HolderOutlined } from "@ant-design/icons";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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

interface SortableItemProps {
  id: string;
  column: ColumnConfig;
  onToggleVisibility: (key: string, visible: boolean) => void;
}

const SortableItem = ({
  id,
  column,
  onToggleVisibility,
}: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 0",
    background: "#fff",
    borderBottom: "1px solid #f0f0f0",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <HolderOutlined
          style={{ cursor: "grab", marginRight: 12, color: "#999" }}
          {...listeners}
        />
        <Checkbox
          checked={column.visible}
          onChange={e => onToggleVisibility(column.key, e.target.checked)}
          style={{ marginRight: 12 }}
        />
        <span>{column.title}</span>
      </div>
      <Switch
        size="small"
        checked={column.visible}
        onChange={checked => onToggleVisibility(column.key, checked)}
      />
    </div>
  );
};

const ColumnSettingsDrawer: React.FC<ColumnSettingsDrawerProps> = ({
  open,
  onClose,
  columns,
  onColumnsChange,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Separate fixed and draggable columns
  const topFixed = columns.find(c => c.key === "name");
  const bottomFixed = columns.find(c => c.key === "action");
  const middleColumns = columns.filter(
    c => c.key !== "name" && c.key !== "action"
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = middleColumns.findIndex(item => item.key === active.id);
      const newIndex = middleColumns.findIndex(item => item.key === over.id);

      const newMiddle = arrayMove(middleColumns, oldIndex, newIndex);

      // Reconstruct full list
      const newColumns = [
        ...(topFixed ? [topFixed] : []),
        ...newMiddle,
        ...(bottomFixed ? [bottomFixed] : []),
      ];

      onColumnsChange(newColumns);
    }
  };

  const handleToggleVisibility = (key: string, visible: boolean) => {
    const newColumns = columns.map(col =>
      col.key === key ? { ...col, visible } : col
    );
    onColumnsChange(newColumns);
  };

  const handleReset = () => {
    // Reset logic would be handled by parent or we can just set all visible
    const resetColumns = columns.map(c => ({ ...c, visible: true }));
    // Order reset is harder without initial state, but visibility reset is easy
    onColumnsChange(resetColumns);
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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={middleColumns.map(c => c.key)}
            strategy={verticalListSortingStrategy}
          >
            {middleColumns.map(col => (
              <SortableItem
                key={col.key}
                id={col.key}
                column={col}
                onToggleVisibility={handleToggleVisibility}
              />
            ))}
          </SortableContext>
        </DndContext>

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
