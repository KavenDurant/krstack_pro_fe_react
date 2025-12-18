import React, { useState } from "react";
import { Modal, Form, Input, Select, message } from "antd";
import { clusterApi } from "../../../api";
import type { AddClusterParams } from "../../../api";

interface ClusterAddModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
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

      const params: AddClusterParams = {
        name: values.name,
        ip: values.ip,
        platform_type: values.platformType,
        vt_type: values.vtType,
        username: values.username,
        password: values.password,
      };

      const response = await clusterApi.addCluster(params);

      if (response.code === 200) {
        message.success("集群添加成功");
        form.resetFields();
        onSuccess();
      } else {
        message.error(response.message || "集群添加失败");
      }
    } catch (error) {
      message.error("集群添加失败");
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
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          platformType: "kr_cloud",
          vtType: "KVM",
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
          name="ip"
          label="IP 地址"
          rules={[
            { required: true, message: "请输入 IP 地址" },
            {
              pattern:
                /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
              message: "请输入有效的 IPv4 地址",
            },
          ]}
        >
          <Input placeholder="请输入 IP 地址，例如: 192.168.1.237" />
        </Form.Item>

        <Form.Item
          name="platformType"
          label="平台类型"
          rules={[{ required: true, message: "请选择平台类型" }]}
        >
          <Select
            options={[
              { value: "kr_cloud", label: "KR Cloud" },
              { value: "zstack", label: "ZStack" },
              { value: "vmware", label: "VMware" },
              { value: "openstack", label: "OpenStack" },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="vtType"
          label="虚拟化类型"
          rules={[{ required: true, message: "请选择虚拟化类型" }]}
        >
          <Select
            options={[
              { value: "KVM", label: "KVM" },
              { value: "Xen", label: "Xen" },
              { value: "Hyper-V", label: "Hyper-V" },
            ]}
          />
        </Form.Item>

        <Form.Item name="username" label="用户名">
          <Input placeholder="请输入用户名（可选）" />
        </Form.Item>

        <Form.Item name="password" label="密码">
          <Input.Password placeholder="请输入密码（可选）" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ClusterAddModal;
