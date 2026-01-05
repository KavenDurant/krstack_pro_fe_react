import React from "react";
import { Form, type FormProps } from "antd";
import { tokens } from "@/styles/tokens";

interface StandardFormProps extends FormProps {
  width?: "sm" | "md" | "lg" | "full";
}

/**
 * 标准化的表单组件
 * 提供统一的布局和输入框宽度
 */
const StandardForm = ({
  width = "md",
  layout = "vertical",
  ...restProps
}: StandardFormProps) => {
  const getMaxWidth = () => {
    switch (width) {
      case "sm":
        return 400;
      case "md":
        return 600;
      case "lg":
        return 800;
      case "full":
        return "100%";
      default:
        return 600;
    }
  };

  return (
    <div
      style={{
        background: tokens.colors.background.container,
        padding: tokens.spacing.xl,
        borderRadius: tokens.borderRadius.md,
      }}
    >
      <Form
        layout={layout}
        style={{ maxWidth: getMaxWidth() }}
        {...restProps}
      />
    </div>
  );
};

export default StandardForm;
