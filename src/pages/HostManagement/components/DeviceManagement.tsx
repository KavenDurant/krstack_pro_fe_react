import React, { useMemo, useState } from "react";
import {
  Table,
  Button,
  Space,
  Input,
  Tabs,
  Modal,
  Form,
  message,
  Select,
  Checkbox,
  Tag,
} from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  SettingOutlined,
  SearchOutlined,
  LaptopOutlined,
  UsbOutlined,
  HddOutlined,
  PlayCircleOutlined,
  QuestionCircleOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

// Mock Data Types
interface NetworkDevice {
  key: string;
  name: string;
  bridge: string;
  port: string;
  mac: string;
  mountTime: string;
}

interface USBDevice {
  key: string;
  name: string;
  vendor: string;
  id: string;
  usbVersion: string;
  mountTime: string;
  status: "active" | "pending_add" | "pending_remove";
  vmName: string;
}

interface GPUDevice {
  key: string;
  name: string;
  vendor: string;
  id: string;
  mountTime: string;
  status: "active" | "pending_add" | "pending_remove";
  vmName: string;
}

interface CdromItem {
  key: string;
  name: string;
  iso: string;
  size: string;
  mountTime: string;
  location: string;
  status: "active" | "pending_remove";
}

type DeviceRow = NetworkDevice | USBDevice | GPUDevice | CdromItem;
type TabKey = "network" | "usb" | "gpu" | "cdrom";

// Mock Data
const networkData: NetworkDevice[] = [
  {
    key: "1",
    name: "net0",
    bridge: "vmbr0",
    port: "enp2s1",
    mac: "46:70:B4:39:62:30",
    mountTime: "2025-04-07 15:36:43",
  },
];

const usbData: USBDevice[] = [
  {
    key: "1",
    name: "USB_Keyboard",
    vendor: "192.168.1.101",
    id: "China Resource Sem...",
    usbVersion: "1a2c:5014",
    mountTime: "2025-04-07 15:36:43",
    status: "active",
    vmName: "desktop-101",
  },
  {
    key: "2",
    name: "USB_Keyboard",
    vendor: "192.168.1.101",
    id: "China Resource Sem...",
    usbVersion: "1a2c:5014",
    mountTime: "2025-04-07 15:36:43",
    status: "pending_add",
    vmName: "desktop-101",
  },
  {
    key: "3",
    name: "USB_Keyboard",
    vendor: "192.168.1.101",
    id: "China Resource Sem...",
    usbVersion: "1a2c:5014",
    mountTime: "2025-04-07 15:36:43",
    status: "pending_remove",
    vmName: "desktop-101",
  },
];

const gpuData: GPUDevice[] = [
  {
    key: "1",
    name: "... 2 [GeForce RTX 2080 Ti]",
    vendor: "NVIDIA Corporation",
    id: "08:00",
    mountTime: "2025-04-07 15:36:43",
    status: "active",
    vmName: "desktop-101",
  },
  {
    key: "2",
    name: "NVIDIA Corporation TU10...",
    vendor: "NVIDIA Corporation",
    id: "08:00",
    mountTime: "2025-04-07 15:36:43",
    status: "pending_add",
    vmName: "desktop-101",
  },
  {
    key: "3",
    name: "NVIDIA Corporation TU10...",
    vendor: "NVIDIA Corporation",
    id: "08:00",
    mountTime: "2025-04-07 15:36:43",
    status: "pending_remove",
    vmName: "desktop-101",
  },
];

const cdromData: CdromItem[] = [
  {
    key: "1",
    name: "sata0",
    iso: "virtio-win-0.1.217.iso",
    size: "507MB",
    mountTime: "2025-04-07 15:36:43",
    location: "cluster237/host237/local",
    status: "pending_remove",
  },
  {
    key: "2",
    name: "sata0",
    iso: "virtio-win-0.1.217.iso",
    size: "507MB",
    mountTime: "2025-04-07 15:36:43",
    location: "cluster237/host237/local",
    status: "active",
  },
  {
    key: "3",
    name: "sata0",
    iso: "/Users/luojiaxin/Library/Containers/com.tencent.xinWeChat/Data/Library/Application Support/com.tencent.xinWeChat/2.0b4.0.9/e6adeef87893e9412ee251d36e502986/Message/MessageTemp/9e20f478899dc29eb19741386f9343c8/Image/1711764140745_.pic.jpg",
    size: "507MB",
    mountTime: "2025-04-07 15:36:43",
    location: "cluster237/host237/local",
    status: "pending_remove",
  },
];

const DeviceManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("network");
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [linkModalVisible, setLinkModalVisible] = useState(false);
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<string | null>(null);
  const [form] = Form.useForm();

  const linkVmData = useMemo(
    () => [
      { key: "1", name: "desktop-10x", status: "active" },
      { key: "2", name: "desktop-10x", status: "active" },
      { key: "3", name: "desktop-10x", status: "active" },
      { key: "4", name: "desktop-10x", status: "pending_remove" },
    ],
    []
  );

  // Columns Definitions
  const networkColumns: ColumnsType<NetworkDevice> = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      width: 150,
      fixed: "left",
    },
    { title: "虚拟网桥", dataIndex: "bridge", key: "bridge", width: 150 },
    { title: "物理端口", dataIndex: "port", key: "port", width: 150 },
    { title: "MAC 地址", dataIndex: "mac", key: "mac", width: 200 },
    { title: "挂载时间", dataIndex: "mountTime", key: "mountTime", width: 200 },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      render: () => (
        <Space size="middle">
          <Button type="link" style={{ padding: 0 }}>
            编辑
          </Button>
          <Button type="link" danger style={{ padding: 0 }}>
            卸载
          </Button>
        </Space>
      ),
    },
  ];

  const usbColumns: ColumnsType<USBDevice> = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      width: 150,
      fixed: "left",
    },
    { title: "厂商", dataIndex: "vendor", key: "vendor", width: 150 },
    { title: "ID", dataIndex: "id", key: "id", width: 200 },
    {
      title: "USB版本",
      dataIndex: "usbVersion",
      key: "usbVersion",
      width: 120,
    },
    { title: "加载时间", dataIndex: "mountTime", key: "mountTime", width: 180 },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: status => {
        if (status === "active") {
          return (
            <Tag
              color="success"
              style={{
                color: "#52c41a",
                background: "#f6ffed",
                borderColor: "#b7eb8f",
              }}
            >
              使用中
            </Tag>
          );
        }
        if (status === "pending_add") {
          return (
            <Tag
              color="error"
              style={{
                color: "#ff4d4f",
                background: "#fff1f0",
                borderColor: "#ffa39e",
              }}
            >
              已加载，重启后生效
            </Tag>
          );
        }
        if (status === "pending_remove") {
          return (
            <Tag
              color="error"
              style={{
                color: "#ff4d4f",
                background: "#fff1f0",
                borderColor: "#ffa39e",
              }}
            >
              已卸载，重启后生效
            </Tag>
          );
        }
        return null;
      },
    },
    {
      title: "关联虚拟机",
      dataIndex: "vmName",
      key: "vmName",
      width: 200,
      render: text => (
        <Space>
          <Tag>{text}</Tag>
          <Tag>{text}</Tag>
        </Space>
      ),
    },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      render: () => (
        <Space size="middle">
          <Button
            type="link"
            style={{ padding: 0 }}
            onClick={() => {
              setRemoveTarget("GPU设备");
              setRemoveModalVisible(true);
            }}
          >
            卸载
          </Button>
          <Button
            type="link"
            style={{ padding: 0 }}
            onClick={() => setLinkModalVisible(true)}
          >
            关联虚拟机
          </Button>
        </Space>
      ),
    },
  ];

  const gpuColumns: ColumnsType<GPUDevice> = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      width: 200,
      fixed: "left",
    },
    { title: "厂商", dataIndex: "vendor", key: "vendor", width: 150 },
    { title: "ID", dataIndex: "id", key: "id", width: 100 },
    { title: "加载时间", dataIndex: "mountTime", key: "mountTime", width: 180 },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: status => {
        if (status === "active") {
          return (
            <Tag
              color="success"
              style={{
                color: "#52c41a",
                background: "#f6ffed",
                borderColor: "#b7eb8f",
              }}
            >
              使用中
            </Tag>
          );
        }
        if (status === "pending_add") {
          return (
            <Tag
              color="error"
              style={{
                color: "#ff4d4f",
                background: "#fff1f0",
                borderColor: "#ffa39e",
              }}
            >
              已加载，重启后生效
            </Tag>
          );
        }
        if (status === "pending_remove") {
          return (
            <Tag
              color="error"
              style={{
                color: "#ff4d4f",
                background: "#fff1f0",
                borderColor: "#ffa39e",
              }}
            >
              已卸载，重启后生效
            </Tag>
          );
        }
        return null;
      },
    },
    {
      title: "关联虚拟机",
      dataIndex: "vmName",
      key: "vmName",
      width: 200,
      render: text => (
        <Space>
          <Tag>{text}</Tag>
          <Tag>{text}</Tag>
        </Space>
      ),
    },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      render: () => (
        <Space size="middle">
          <Button
            type="link"
            style={{ padding: 0 }}
            onClick={() => {
              setRemoveTarget("GPU设备");
              setRemoveModalVisible(true);
            }}
          >
            卸载
          </Button>
          <Button
            type="link"
            style={{ padding: 0 }}
            onClick={() => setLinkModalVisible(true)}
          >
            关联加载
          </Button>
        </Space>
      ),
    },
  ];

  const cdromColumns: ColumnsType<CdromItem> = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      width: 120,
      fixed: "left",
    },
    {
      title: "ISO 镜像",
      dataIndex: "iso",
      key: "iso",
      ellipsis: true,
      render: text => <span title={text}>{text}</span>,
    },
    { title: "大小", dataIndex: "size", key: "size", width: 100 },
    { title: "加载时间", dataIndex: "mountTime", key: "mountTime", width: 200 },
    { title: "存储位置", dataIndex: "location", key: "location", width: 200 },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 180,
      render: status =>
        status === "active" ? (
          <Tag
            color="success"
            style={{
              color: "#52c41a",
              background: "#f6ffed",
              borderColor: "#b7eb8f",
            }}
          >
            可用
          </Tag>
        ) : (
          <Tag
            color="error"
            style={{
              color: "#ff4d4f",
              background: "#fff1f0",
              borderColor: "#ffa39e",
            }}
          >
            已卸载，重启后生效
          </Tag>
        ),
    },
    {
      title: "操作",
      key: "action",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <Button
          type="link"
          style={{ padding: 0 }}
          disabled={record.status !== "active"}
          onClick={() => {
            setRemoveTarget("虚拟光驱");
            setRemoveModalVisible(true);
          }}
        >
          卸载
        </Button>
      ),
    },
  ];

  const handleAdd = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(() => {
      setIsModalVisible(false);
      form.resetFields();
      message.success("添加成功");
    });
  };

  const renderTabContent = (key: TabKey) => {
    let columns: ColumnsType<DeviceRow> = [];
    let data: DeviceRow[] = [];

    switch (key) {
      case "network":
        columns = networkColumns as unknown as ColumnsType<DeviceRow>;
        data = networkData;
        break;
      case "usb":
        columns = usbColumns as unknown as ColumnsType<DeviceRow>;
        data = usbData;
        break;
      case "gpu":
        columns = gpuColumns as unknown as ColumnsType<DeviceRow>;
        data = gpuData;
        break;
      case "cdrom":
        columns = cdromColumns as unknown as ColumnsType<DeviceRow>;
        data = cdromData;
        break;
      default:
        return (
          <div style={{ padding: 24, textAlign: "center", color: "#999" }}>
            暂无数据
          </div>
        );
    }

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "0 0 0 12px",
        }}
      >
        {/* Toolbar */}
        <div
          style={{
            padding: "0 0 16px 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Input
            placeholder="名称"
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            style={{ width: 300 }}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              添加
            </Button>
            <Button icon={<ReloadOutlined />} />
            <Button icon={<SettingOutlined />} />
          </Space>
        </div>

        {/* Table Area */}
        <div style={{ flex: 1, overflow: "auto" }}>
          {(key === "network" || key === "cdrom") && (
            <div style={{ marginBottom: 8, color: "#666" }}>
              共计 {data.length} 条数据
            </div>
          )}
          <Table<NetworkDevice | USBDevice | GPUDevice | CdromItem>
            columns={columns}
            dataSource={data}
            pagination={false}
            rowKey="key"
            scroll={{ x: 1200 }}
          />
        </div>
      </div>
    );
  };

  const items: {
    key: TabKey;
    label: React.ReactNode;
    children: React.ReactNode;
  }[] = [
    {
      key: "network",
      label: (
        <span>
          <LaptopOutlined />
          网卡设备
        </span>
      ),
      children: renderTabContent("network"),
    },
    {
      key: "usb",
      label: (
        <span>
          <UsbOutlined />
          USB设备
        </span>
      ),
      children: renderTabContent("usb"),
    },
    {
      key: "gpu",
      label: (
        <span>
          <HddOutlined />
          GPU设备
        </span>
      ),
      children: renderTabContent("gpu"),
    },
    {
      key: "cdrom",
      label: (
        <span>
          <PlayCircleOutlined />
          虚拟光驱
        </span>
      ),
      children: renderTabContent("cdrom"),
    },
  ];

  const renderModalContent = () => {
    if (activeTab === "network") {
      return (
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            model: "VirtIO",
            firewall: true,
            bridge: "vmbr0",
            disconnect: false,
          }}
        >
          <Form.Item
            name="bridge"
            label="虚拟网桥"
            rules={[{ required: true, message: "请选择虚拟网桥" }]}
          >
            <Select placeholder="请选择虚拟网桥">
              <Select.Option value="vmbr0">vmbr0</Select.Option>
              <Select.Option value="vmbr1">vmbr1</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="vlan" label="VLAN 标签">
            <Input placeholder="no VLAN" />
          </Form.Item>
          <Form.Item
            name="model"
            label="模型"
            rules={[{ required: true, message: "请选择模型" }]}
          >
            <Select>
              <Select.Option value="VirtIO">
                VirtIO (paravirtualized)
              </Select.Option>
              <Select.Option value="E1000">Intel E1000</Select.Option>
              <Select.Option value="RTL8139">Realtek RTL8139</Select.Option>
              <Select.Option value="VMXNET3">VMware vmxnet3</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="mac" label="MAC 地址">
            <Input placeholder="auto" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 24 }}>
            <Space size="large">
              <Form.Item name="firewall" valuePropName="checked" noStyle>
                <Checkbox>防火墙</Checkbox>
              </Form.Item>
              <Form.Item name="disconnect" valuePropName="checked" noStyle>
                <Checkbox>断开</Checkbox>
              </Form.Item>
            </Space>
          </Form.Item>
          <Form.Item name="rate" label="速率限制 (MB/s)">
            <Input placeholder="unlimited" suffix="MB/s" />
          </Form.Item>
        </Form>
      );
    }

    if (activeTab === "gpu") {
      return (
        <Form form={form} layout="vertical">
          <Form.Item
            name="gpu"
            label={
              <span>
                选择GPU
                <span
                  style={{
                    marginLeft: 4,
                    color: "rgba(0, 0, 0, 0.45)",
                    cursor: "help",
                  }}
                >
                  <QuestionCircleOutlined />
                </span>
              </span>
            }
            rules={[{ required: true, message: "请选择GPU" }]}
          >
            <Select placeholder="请选择GPU">
              <Select.Option value="gpu1">GeForce RTX 2080 Ti</Select.Option>
              <Select.Option value="gpu2">
                NVIDIA Corporation TU102
              </Select.Option>
            </Select>
          </Form.Item>
        </Form>
      );
    }

    // Default form for other tabs
    return (
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="名称"
          rules={[{ required: true, message: "请输入名称" }]}
        >
          <Input placeholder="请输入名称" />
        </Form.Item>
      </Form>
    );
  };

  return (
    <div style={{ height: "100%", background: "#fff" }}>
      <style>
        {`
          .device-tabs .ant-tabs-content-holder {
            padding: 0;
          }
          .device-tabs .ant-tabs-content {
            padding: 0;
          }
          .device-tabs .ant-tabs-tabpane {
            padding-left: 0 !important;
            padding-right: 0;
          }
        `}
      </style>
      <Tabs
        items={items}
        style={{ height: "100%" }}
        activeKey={activeTab}
        onChange={key => setActiveTab(key as TabKey)}
        className="device-tabs"
      />

      {/* Add Modal */}
      <Modal
        title={
          activeTab === "network"
            ? "添加: 网卡设备"
            : activeTab === "gpu"
              ? "加载GPU设备"
              : "添加设备"
        }
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        width={500}
      >
        {renderModalContent()}
      </Modal>

      {/* Link VM Modal */}
      <Modal
        title="关联虚拟机"
        open={linkModalVisible}
        footer={null}
        onCancel={() => setLinkModalVisible(false)}
        width={720}
      >
        <div style={{ marginBottom: 8, color: "#666" }}>
          共计 {linkVmData.length} 条数据
        </div>
        <Table
          columns={[
            { title: "名称", dataIndex: "name", key: "name" },
            {
              title: "使用GPU状态",
              dataIndex: "status",
              key: "status",
              width: 180,
              render: status =>
                status === "active" ? (
                  <Tag
                    color="success"
                    style={{
                      color: "#52c41a",
                      background: "#f6ffed",
                      borderColor: "#b7eb8f",
                    }}
                  >
                    使用中
                  </Tag>
                ) : (
                  <Tag
                    color="error"
                    style={{
                      color: "#ff4d4f",
                      background: "#fff1f0",
                      borderColor: "#ffa39e",
                    }}
                  >
                    已卸载，重启后生效
                  </Tag>
                ),
            },
            {
              title: "操作",
              key: "action",
              width: 120,
              render: (_, record) => (
                <Button
                  type="link"
                  style={{ padding: 0 }}
                  disabled={record.status !== "active"}
                >
                  卸载
                </Button>
              ),
            },
          ]}
          dataSource={linkVmData}
          pagination={false}
          rowKey="key"
          size="middle"
        />
      </Modal>

      {/* Remove confirm */}
      <Modal
        open={removeModalVisible}
        footer={null}
        closable={false}
        onCancel={() => setRemoveModalVisible(false)}
        width={380}
        styles={{ body: { padding: "24px 24px 16px" } }}
      >
        <Space
          align="start"
          size={12}
          style={{ width: "100%", marginBottom: 12 }}
        >
          <ExclamationCircleFilled style={{ color: "#faad14", fontSize: 20 }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 6 }}>
              卸载
            </div>
            <div style={{ color: "#595959" }}>
              是否卸载{removeTarget || "GPU设备"}？
            </div>
          </div>
        </Space>
        <div style={{ textAlign: "right" }}>
          <Space>
            <Button onClick={() => setRemoveModalVisible(false)}>取消</Button>
            <Button type="primary" onClick={() => setRemoveModalVisible(false)}>
              确认
            </Button>
          </Space>
        </div>
      </Modal>
    </div>
  );
};

export default DeviceManagement;
