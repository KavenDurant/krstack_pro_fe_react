import React, { useState } from "react";
import { Modal, Form, Input, Select, message } from "antd";
import type { ClusterDataType } from "./ClusterTable";

interface ClusterAddModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: (newCluster: ClusterDataType) => void;
}

const ClusterAddModal: React.FC<ClusterAddModalProps> = ({
  open,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setConfirmLoading(true);

      // Simulate API call delay
      setTimeout(() => {
        const newCluster: ClusterDataType = {
          key: Date.now().toString(),
          name: values.name,
          status: "syncing", // Default status for new cluster
          controlAddress: values.controlAddress,
          platform: values.platform,
          technology: values.technology,
          hostCount: 0, // Initial count
          lastSyncTime: new Date().toLocaleString(),
        };

        message.success("集群添加成功");
        onSuccess(newCluster);
        setConfirmLoading(false);
        form.resetFields();
      }, 1000);
    } catch (error) {
      console.error("Validate Failed:", error);
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
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          platform: "KRCloud",
          technology: "KVM",
        }}
      >
        <Form.Item
          name="name"
          label="集群名称"
          rules={[{ required: true, message: "请输入集群名称" }]}
        >
          <Input placeholder="请输入集群名称" />
        </Form.Item>

        <Form.Item
          name="controlAddress"
          label="控制台地址"
          rules={[
            { required: true, message: "请输入控制台地址" },
            {
              pattern:
                /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
              message: "请输入有效的IPv4地址",
            },
          ]}
        >
          <Input placeholder="请输入IP地址，例如: 192.168.1.100" />
        </Form.Item>

        <Form.Item
          name="platform"
          label="虚拟化平台"
          rules={[{ required: true, message: "请选择虚拟化平台" }]}
        >
          <Select
            options={[
              { value: "KRCloud", label: "KRCloud" },
              { value: "ZStack", label: "ZStack" },
              { value: "Vmware", label: "Vmware" },
              { value: "OpenStack", label: "OpenStack" },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="technology"
          label="虚拟化技术"
          rules={[{ required: true, message: "请选择虚拟化技术" }]}
        >
          <Select
            options={[
              { value: "KVM", label: "KVM" },
              { value: "Xen", label: "Xen" },
              { value: "Hyper-V", label: "Hyper-V" },
            ]}
          />
        </Form.Item>

        <Form.Item name="authInfo" label="认证信息 (Token/密码)">
          <Input.Password placeholder="请输入认证Token或密码" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ClusterAddModal;
