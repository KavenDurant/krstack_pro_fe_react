import React from "react";
import {
  FormOutlined,
  NumberOutlined,
  CheckSquareOutlined,
} from "@ant-design/icons";

export interface FieldType {
  type: string;
  label: string;
  icon: React.ReactNode;
}

export const fieldTypes: FieldType[] = [
  {
    type: "text",
    label: "单行文本",
    icon: React.createElement(FormOutlined),
  },
  {
    type: "number",
    label: "数字输入",
    icon: React.createElement(NumberOutlined),
  },
  {
    type: "checkbox",
    label: "多选框",
    icon: React.createElement(CheckSquareOutlined),
  },
];
