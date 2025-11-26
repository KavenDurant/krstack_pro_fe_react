import React from "react";
import { Button, Input, Typography } from "antd";
import { LockOutlined } from "@ant-design/icons";
import "./ConsoleView.css";

const { Text } = Typography;

const KeyboardIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <rect
      x="2.5"
      y="7"
      width="19"
      height="10"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M5.5 10H7M8.5 10H10M11.5 10H13M14.5 10H16M17.5 10H19"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M6 13H9M10.5 13H13.5M15 13H18"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M8 16H16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const ConsoleView: React.FC = () => {
  return (
    <div className="console-view">
      <button
        type="button"
        aria-label="打开虚拟键盘"
        className="console-view__keyboard"
      >
        <KeyboardIcon />
      </button>

      <div className="console-view__alert" role="status">
        虚拟机性能CPU运行在不支持虚拟机扩展的主机上
      </div>

      <div className="console-view__modal" role="dialog" aria-modal="true">
        <div className="console-view__modal-header">
          <LockOutlined />
          <span>访问密码</span>
        </div>
        <Text type="secondary" className="console-view__modal-desc">
          请输入访问密码以唤醒该虚拟机控制台
        </Text>
        <Input.Password
          placeholder="请输入访问密码"
          size="large"
          className="console-view__password"
        />
        <Button type="primary" size="large" block>
          确定
        </Button>
      </div>
    </div>
  );
};

export default ConsoleView;
