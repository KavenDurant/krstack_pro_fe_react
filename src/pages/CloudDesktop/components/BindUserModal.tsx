import React, { useEffect, useState } from "react";
import { Modal, Form, Select, Button, Space, message, Alert } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import {
  getCloudDeskUserSelect,
  synchronizeUser,
  relatedUser,
} from "@/api/modules/cloudDesk";
import type { SynchronousUser } from "@/api/modules/cloudDesk/types";

interface BindUserModalProps {
  open: boolean;
  desktopUid: string;
  desktopName: string;
  currentUser?: string;
  onCancel: () => void;
  onSuccess: () => void;
}

const BindUserModal: React.FC<BindUserModalProps> = ({
  open,
  desktopUid,
  desktopName: _desktopName,
  currentUser: _currentUser,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [userList, setUserList] = useState<SynchronousUser[]>([]);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | undefined>();

  // 加载用户列表
  const loadUserList = async () => {
    setLoading(true);
    try {
      const res = await getCloudDeskUserSelect();
      setUserList(res.data || []);
    } catch {
      message.error("获取用户列表失败");
    } finally {
      setLoading(false);
    }
  };

  // 弹窗打开时加载数据
  useEffect(() => {
    if (open) {
      loadUserList();
      form.resetFields();
      setSelectedUser(undefined);
    }
  }, [open, form]);

  // 同步用户
  const handleSync = async () => {
    setSyncLoading(true);
    try {
      await synchronizeUser();
      message.success("同步成功");
      await loadUserList();
    } catch {
      message.error("同步失败");
    } finally {
      setSyncLoading(false);
    }
  };

  // 确认关联
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setConfirmLoading(true);

      await relatedUser({
        user: values.user,
        desktop: desktopUid,
      });

      message.success("关联用户成功");
      form.resetFields();
      onSuccess();
    } catch {
      message.error("关联用户失败");
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
      title="关联用户"
      open={open}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      width={600}
      okText="确定"
      cancelText="取消"
      destroyOnHidden
      okButtonProps={{ disabled: !selectedUser }}
    >
      <Alert
        title="关联用户后该用户将可以使用此桌面"
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />

      <Space style={{ marginBottom: 16 }}>
        <Button
          icon={<ReloadOutlined />}
          loading={syncLoading}
          onClick={handleSync}
        >
          同步用户
        </Button>
      </Space>

      <Form form={form} layout="vertical">
        <Form.Item
          name="user"
          label="用户"
          rules={[{ required: true, message: "请选择用户" }]}
        >
          <Select
            placeholder="请选择用户"
            loading={loading}
            showSearch
            onChange={setSelectedUser}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={userList.map(user => ({
              label: `${user.name} (${user.login_name})`,
              value: user.uuid,
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BindUserModal;
