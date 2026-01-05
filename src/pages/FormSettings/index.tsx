import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Layout, Card } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import FieldSidebar from "./components/FieldSidebar";
import FormCanvas from "./components/FormCanvas";
import { fieldTypes, type FieldType } from "./constants/fieldTypes";
import { v4 as uuidv4 } from "uuid";

const { Sider, Content } = Layout;

interface FormField {
  id: string;
  type: string;
  label: string;
}

const FormSettings: React.FC = () => {
  const [fields, setFields] = useState<FormField[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<FieldType | FormField | null>(
    null
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);

    if (active.data.current?.isSidebar) {
      const type = active.data.current.type;
      const item = fieldTypes.find(f => f.type === type);
      setActiveItem(item || null);
    } else {
      // Dragging existing field
      const field = fields.find(f => f.id === active.id);
      setActiveItem(field || null);
    }
  };

  const handleDragOver = () => {
    // Optional: Handle complex drag over logic if needed (e.g. inserting placeholder)
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      setActiveItem(null);
      return;
    }

    // Dropped from sidebar to canvas
    if (active.data.current?.isSidebar) {
      if (over.id === "form-canvas" || fields.some(f => f.id === over.id)) {
        const type = active.data.current.type;
        const template = fieldTypes.find(t => t.type === type);
        if (template) {
          const newField: FormField = {
            id: uuidv4(),
            type: template.type,
            label: template.label,
          };

          // If dropped over a specific item, insert after it, otherwise add to end
          if (over.id !== "form-canvas") {
            const overIndex = fields.findIndex(f => f.id === over.id);
            const newFields = [...fields];
            newFields.splice(overIndex + 1, 0, newField);
            setFields(newFields);
          } else {
            setFields([...fields, newField]);
          }
        }
      }
    }
    // Reordering within canvas
    else if (active.id !== over.id) {
      setFields(items => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
    setActiveItem(null);
  };

  const handleRemoveField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const [collapsed, setCollapsed] = useState(false);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Layout
        style={{ height: "calc(100vh - 64px - 48px)", background: "#fff" }}
      >
        <Content style={{ padding: 24, overflowY: "auto" }}>
          <FormCanvas fields={fields} onRemoveField={handleRemoveField} />
        </Content>
        <Sider
          width={200}
          collapsedWidth={80}
          theme="light"
          style={{ borderLeft: "1px solid #f0f0f0" }}
          collapsible
          collapsed={collapsed}
          onCollapse={value => setCollapsed(value)}
          trigger={
            <div
              style={{
                height: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#fff",
                borderTop: "1px solid #f0f0f0",
                cursor: "pointer",
              }}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>
          }
        >
          <FieldSidebar collapsed={collapsed} />
        </Sider>
      </Layout>
      <DragOverlay>
        {activeId ? (
          <Card size="small" style={{ cursor: "grabbing" }}>
            {activeItem?.label || "Field"}
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default FormSettings;
