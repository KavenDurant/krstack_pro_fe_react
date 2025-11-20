import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, Form, Input, InputNumber, Checkbox, Button } from "antd";
import { DeleteOutlined, DragOutlined } from "@ant-design/icons";

interface SortableFieldProps {
  id: string;
  type: string;
  label: string;
  onRemove: (id: string) => void;
}

const SortableField: React.FC<SortableFieldProps> = ({
  id,
  type,
  label,
  onRemove,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    marginBottom: 16,
  };

  const renderInput = () => {
    switch (type) {
      case "text":
        return <Input placeholder="请输入" disabled />;
      case "number":
        return (
          <InputNumber
            style={{ width: "100%" }}
            placeholder="请输入"
            disabled
          />
        );
      case "checkbox":
        return <Checkbox disabled>选项</Checkbox>;
      default:
        return null;
    }
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        size="small"
        title={
          <div
            style={{ display: "flex", alignItems: "center", cursor: "move" }}
            {...attributes}
            {...listeners}
          >
            <DragOutlined style={{ marginRight: 8, color: "#999" }} />
            <span>{label}</span>
          </div>
        }
        extra={
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => onRemove(id)}
            danger
          />
        }
      >
        <Form.Item label={label} style={{ marginBottom: 0 }}>
          {renderInput()}
        </Form.Item>
      </Card>
    </div>
  );
};

export default SortableField;
