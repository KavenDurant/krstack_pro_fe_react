import React, { useState } from "react";
import { Modal, Form, Input, Select, message } from "antd";
import { clusterApi } from "@/api";
import type { AddClusterParams } from "@/api";

interface ClusterAddModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

interface FormValues {
  url: string;
  password: string;
  platform_type: string;
}

const ClusterAddModal: React.FC<ClusterAddModalProps> = ({
  open,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm<FormValues>();
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleOk = async () => {
    try {
      // 验证表单
      const values = await form.validateFields();
      setConfirmLoading(true);

      // 根据平台类型构建完整的 URL
      let url: string;
      if (values.platform_type === "kr_cloud") {
        url = `https://${values.url}:8006`;
      } else {
        url = `http://${values.url}:8080`;
      }

      // 构建请求参数
      const params: AddClusterParams = {
        url,
        password: values.password,
        platform_type: values.platform_type,
      };

      // 调用 API
      const response = await clusterApi.addCluster(params);

      if (response.code === 200) {
        message.success("集群添加成功");
        form.resetFields();
        onSuccess();
      } else {
        message.error(response.message || "集群添加失败");
      }
    } catch (error) {
      // 错误已经在 axios 拦截器中显示了，这里不需要再显示
      console.error("Failed to add cluster:", error);
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
      title="添加集群"
      open={open}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      width={600}
      okText="确定"
      cancelText="取消"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          platform_type: "kr_cloud",
        }}
      >
        <Form.Item
          name="url"
          label="集群地址"
          rules={[
            { required: true, message: "请输入集群地址" },
            {
              pattern:
                /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
              message: "请输入有效的 IPv4 地址",
            },
          ]}
          extra="请输入 IP 地址，系统将根据平台类型自动添加协议和端口"
        >
          <Input placeholder="例如: 192.168.1.237" />
        </Form.Item>

        <Form.Item
          name="platform_type"
          label="平台类型"
          rules={[{ required: true, message: "请选择平台类型" }]}
          extra="KR Cloud 使用 https://IP:8006，其他平台使用 http://IP:8080"
        >
          <Select
            options={[
              { value: "kr_cloud", label: "KR Cloud" },
              { value: "zstack", label: "ZStack" },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="密码"
          rules={[{ required: true, message: "请输入密码" }]}
        >
          <Input.Password placeholder="请输入集群管理密码" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ClusterAddModal;
