import React from "react";
import { Button, Input } from "antd";
import { InfoCircleFilled } from "@ant-design/icons";
import "./ConsoleView.css";

const KeyboardIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
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
      <div className="console-view__alert">
        <InfoCircleFilled style={{ marginRight: 8, fontSize: 16 }} />
        虚拟机挂载GPU运行后不支持查看虚拟机画面。
      </div>

      <div className="console-view__content">
        <button
          type="button"
          aria-label="打开虚拟键盘"
          className="console-view__keyboard"
        >
          <KeyboardIcon />
        </button>

        <div className="console-view__modal">
          <div className="console-view__modal-title">访问密码</div>
          <div className="console-view__form-item">
            <label className="console-view__label">
              <span style={{ color: "#ff4d4f", marginRight: 4 }}>*</span>
              密码 :
            </label>
            <Input.Password placeholder="请输入控制台访问密码" size="large" />
          </div>
          <div className="console-view__footer">
            <Button type="primary">确定</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsoleView;
