import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Empty } from "antd";
import SortableField from "./SortableField";

interface FormField {
  id: string;
  type: string;
  label: string;
}

interface FormCanvasProps {
  fields: FormField[];
  onRemoveField: (id: string) => void;
}

const FormCanvas: React.FC<FormCanvasProps> = ({ fields, onRemoveField }) => {
  const { setNodeRef } = useDroppable({
    id: "form-canvas",
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        background: "#f0f2f5",
        padding: 24,
        minHeight: "100%",
        border: "2px dashed #d9d9d9",
        borderRadius: 8,
      }}
    >
      <SortableContext
        items={fields.map(f => f.id)}
        strategy={verticalListSortingStrategy}
      >
        {fields.length === 0 ? (
          <Empty
            description="从左侧拖拽组件到此处"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          fields.map(field => (
            <SortableField
              key={field.id}
              id={field.id}
              type={field.type}
              label={field.label}
              onRemove={onRemoveField}
            />
          ))
        )}
      </SortableContext>
    </div>
  );
};

export default FormCanvas;
