import React, { useState } from "react";
import { Modal, Form, Input, message } from "antd";
import { authApi } from "@/api";
import type { ChangePasswordParams } from "@/api";

interface ChangePasswordModalProps {
  open: boolean;
  username: string;
  onCancel: () => void;
  onSuccess?: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  open,
  username,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setConfirmLoading(true);

      const params: ChangePasswordParams = {
        old_password: values.oldPassword,
        password: values.newPassword,
        pwd: values.confirmPassword,
      };

      const response = await authApi.changePassword(username, params);

      if (response.code === 200) {
        message.success("密码修改成功，请重新登录");
        form.resetFields();
        onSuccess?.();
        onCancel();

        // 延迟跳转到登录页
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else {
        message.error(response.message || "密码修改失败");
      }
    } catch (error) {
      if (error && typeof error === "object" && "errorFields" in error) {
        // 表单验证错误
        return;
      }
      message.error("密码修改失败");
      console.error("Failed to change password:", error);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="修改密码"
      open={open}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      width={500}
    >
      <Form form={form} layout="vertical" autoComplete="off">
        <Form.Item
          name="oldPassword"
          label="原密码"
          rules={[
            { required: true, message: "请输入原密码" },
            { min: 6, message: "密码至少6位" },
          ]}
        >
          <Input.Password placeholder="请输入原密码" />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="新密码"
          rules={[
            { required: true, message: "请输入新密码" },
            { min: 6, message: "密码至少6位" },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/,
              message: "密码必须包含大小写字母和数字",
            },
          ]}
        >
          <Input.Password placeholder="请输入新密码" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="确认新密码"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "请确认新密码" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("两次输入的密码不一致"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="请再次输入新密码" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangePasswordModal;
