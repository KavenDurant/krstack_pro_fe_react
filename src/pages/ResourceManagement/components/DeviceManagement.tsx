import React, { useState, useEffect, useMemo, useRef } from "react";
import { Input, Table, Space, Button, Tag, message, Pagination } from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  SettingOutlined,
  LaptopOutlined,
  UsbOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import VerticalTabs from "@/components/VerticalTabs";
import type { TabItem } from "@/components/VerticalTabs";
import { nodeApi } from "@/api";
import type { NetworkInterface, USBDevice, GPUDevice } from "@/api";
import DeviceMoreDoModal from "./DeviceMoreDoModal";

interface DeviceManagementProps {
  nodeUid: string;
}

type DeviceTabKey = "gpu" | "usb" | "network";

// GPU 设备类型
interface GPUDeviceRow {
  uid: string;
  id: string;
  deviceName: string;
  manufacturer: string;
  status: string;
  vmUse: Array<{
    name: string;
    status: string;
    vmUid: string;
    gpuUid: string;
    gpuId: string;
  }>;
}

// USB 设备类型
interface USBDeviceRow {
  uid: string;
  id: string;
  name: string;
  host: string;
  manufacturer: string;
  product: string;
  status: string;
  vmUse: Array<{
    name: string;
    status: string;
    vmUid: string;
    usbUid: string;
    usbId: string;
  }>;
}

// 网卡设备类型
interface NetworkDeviceRow {
  uid: string;
  name: string;
  type: string;
  status: string;
  ports: string; // 从属
  ip: string;
}

type DeviceRow = GPUDeviceRow | USBDeviceRow | NetworkDeviceRow;

// 模态框设备数据类型
interface ModalDeviceData {
  uid: string;
  id: string;
  deviceName?: string;
  name?: string;
  manufacturer?: string;
  status: string;
  vmUse: Array<{
    name: string;
    status: string;
    vmUid: string;
    gpuUid?: string;
    usbUid?: string;
  }>;
}

const DeviceManagement: React.FC<DeviceManagementProps> = ({ nodeUid }) => {
  const [activeTab, setActiveTab] = useState<DeviceTabKey>("gpu");
  const [searchValue, setSearchValue] = useState("");
  const [gpuList, setGpuList] = useState<GPUDeviceRow[]>([]);
  const [usbList, setUsbList] = useState<USBDeviceRow[]>([]);
  const [networkList, setNetworkList] = useState<NetworkDeviceRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 模态框状态
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDeviceType, setModalDeviceType] = useState<"gpu" | "usb">("gpu");
  const [modalDeviceData, setModalDeviceData] =
    useState<ModalDeviceData | null>(null);

  const requestIdRef = useRef<Record<DeviceTabKey, number>>({
    gpu: 0,
    usb: 0,
    network: 0,
  });

  const createRequestGuard = (tabKey: DeviceTabKey) => {
    requestIdRef.current[tabKey] += 1;
    const currentId = requestIdRef.current[tabKey];
    const isLatest = () =>
      requestIdRef.current[tabKey] === currentId && activeTab === tabKey;
    return { isLatest };
  };

  // 打开更多操作模态框
  const openMoreDoModal = (
    device: GPUDeviceRow | USBDeviceRow,
    type: "gpu" | "usb"
  ) => {
    const modalData: ModalDeviceData = {
      uid: device.uid,
      id: device.id,
      status: device.status,
      vmUse: device.vmUse.map(item => ({
        name: item.name,
        status: item.status,
        vmUid: item.vmUid,
        gpuUid:
          type === "gpu"
            ? (item as GPUDeviceRow["vmUse"][0]).gpuUid
            : undefined,
        usbUid:
          type === "usb"
            ? (item as USBDeviceRow["vmUse"][0]).usbUid
            : undefined,
      })),
    };

    if (type === "gpu") {
      modalData.deviceName = (device as GPUDeviceRow).deviceName;
      modalData.manufacturer = (device as GPUDeviceRow).manufacturer;
    } else {
      modalData.name = (device as USBDeviceRow).name;
      modalData.manufacturer = (device as USBDeviceRow).manufacturer;
    }

    setModalDeviceType(type);
    setModalDeviceData(modalData);
    setModalOpen(true);
  };

  // 关闭模态框
  const closeModal = () => {
    setModalOpen(false);
    setModalDeviceData(null);
  };

  // 卸载成功后刷新列表
  const handleUnmountSuccess = () => {
    closeModal();
    if (modalDeviceType === "gpu") {
      loadGPUList();
    } else {
      loadUSBList();
    }
  };

  // 加载 GPU 设备
  const loadGPUList = async () => {
    const { isLatest } = createRequestGuard("gpu");
    try {
      setLoading(true);
      const response = await nodeApi.getGPUList(nodeUid);
      if (!isLatest()) return;
      if (response.code === 200) {
        const gpuRows: GPUDeviceRow[] = (response.data || []).map(
          (gpu: GPUDevice) => ({
            uid: gpu.uid,
            id: gpu.id,
            deviceName: gpu.deviceName || "",
            manufacturer: gpu.manufacturer || "",
            status: gpu.status || "",
            vmUse: (gpu.vmUse || []).map(item => ({
              name: item.name,
              status: item.status,
              vmUid: item.vmUid,
              gpuUid: item.gpuUid,
              gpuId: item.gpuId,
            })),
          })
        );
        setGpuList(gpuRows);
      } else {
        message.error(response.message || "获取 GPU 设备失败");
      }
    } catch (error) {
      if (isLatest()) {
        message.error("获取 GPU 设备失败");
        console.error("Failed to load GPU list:", error);
      }
    } finally {
      if (isLatest()) {
        setLoading(false);
      }
    }
  };

  // 加载 USB 设备
  const loadUSBList = async () => {
    const { isLatest } = createRequestGuard("usb");
    try {
      setLoading(true);
      const response = await nodeApi.getUSBList(nodeUid);
      if (!isLatest()) return;
      if (response.code === 200) {
        const usbRows: USBDeviceRow[] = (response.data || []).map(
          (usb: USBDevice) => ({
            uid: usb.uid || "",
            id: usb.id || "",
            name: usb.name || "",
            host: usb.host || "",
            manufacturer: usb.manufacturer || "",
            product: usb.product || "",
            status: usb.status || "",
            vmUse: (usb.vmUse || []).map(item => ({
              name: item.name,
              status: item.status,
              vmUid: item.vmUid,
              usbUid: item.usbUid,
              usbId: item.usbId,
            })),
          })
        );
        setUsbList(usbRows);
      } else {
        message.error(response.message || "获取 USB 设备失败");
      }
    } catch (error) {
      if (isLatest()) {
        message.error("获取 USB 设备失败");
        console.error("Failed to load USB list:", error);
      }
    } finally {
      if (isLatest()) {
        setLoading(false);
      }
    }
  };

  // 加载网卡设备
  const loadNetworkList = async () => {
    const { isLatest } = createRequestGuard("network");
    try {
      setLoading(true);
      const response = await nodeApi.getNetworkList(nodeUid);
      if (!isLatest()) return;
      if (response.code === 200) {
        const networkRows: NetworkDeviceRow[] = (response.data || []).map(
          (net: NetworkInterface) => ({
            uid: net.uid || "",
            name: net.name || "",
            type: net.type || "",
            status: net.status || "",
            ports: net.ports || "",
            ip: net.ip || "",
          })
        );
        setNetworkList(networkRows);
      } else {
        message.error(response.message || "获取网卡设备失败");
      }
    } catch (error) {
      if (isLatest()) {
        message.error("获取网卡设备失败");
        console.error("Failed to load network list:", error);
      }
    } finally {
      if (isLatest()) {
        setLoading(false);
      }
    }
  };

  // Tab 切换时按需加载数据 - 每次切换都重新加载
  useEffect(() => {
    if (activeTab === "gpu") {
      loadGPUList();
    } else if (activeTab === "usb") {
      loadUSBList();
    } else if (activeTab === "network") {
      loadNetworkList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, nodeUid]);

  // 刷新当前 tab 数据
  const handleRefresh = () => {
    if (activeTab === "gpu") {
      loadGPUList();
    } else if (activeTab === "usb") {
      loadUSBList();
    } else if (activeTab === "network") {
      loadNetworkList();
    }
  };

  // 渲染状态标签
  const renderStatusTag = (status: string) => {
    let color = "default";
    let text = status;

    switch (status) {
      case "normal":
        color = "success";
        text = "正常";
        break;
      case "occupied":
        color = "processing";
        text = "占用";
        break;
      case "pending":
        color = "warning";
        text = "待处理";
        break;
      case "deleting":
        color = "error";
        text = "删除中";
        break;
    }

    return <Tag color={color}>{text}</Tag>;
  };

  // GPU 设备列定义
  const gpuColumns: ColumnsType<GPUDeviceRow> = [
    {
      title: "设备ID",
      dataIndex: "id",
      key: "id",
      width: 120,
      render: (text: string) => text || <Tag color="default">暂未提供</Tag>,
    },
    {
      title: "名称",
      dataIndex: "deviceName",
      key: "deviceName",
      render: (text: string) => text || <Tag color="default">暂未提供</Tag>,
    },
    {
      title: "制造商",
      dataIndex: "manufacturer",
      key: "manufacturer",
      render: (text: string) => text || <Tag color="default">暂未提供</Tag>,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: renderStatusTag,
    },
    {
      title: "关联虚拟机",
      dataIndex: "vmUse",
      key: "vmUse",
      render: (vmUse: GPUDeviceRow["vmUse"]) =>
        vmUse.length > 0 ? (
          <Space size={4} wrap>
            {[...vmUse]
              .sort((a, b) => {
                if (a.status === "normal" && b.status !== "normal") return -1;
                if (a.status !== "normal" && b.status === "normal") return 1;
                return 0;
              })
              .slice(0, 2)
              .map(item => (
                <Tag
                  key={item.vmUid}
                  color={item.status === "normal" ? "success" : "default"}
                >
                  {item.name}
                </Tag>
              ))}
            {vmUse.length > 2 && <span>...</span>}
          </Space>
        ) : (
          <Tag color="default">未使用</Tag>
        ),
    },
    {
      title: "操作",
      key: "action",
      width: 100,
      render: (_: unknown, record: GPUDeviceRow) => {
        // pending 或 deleting 状态显示提示
        if (record.status === "pending") {
          return <Tag color="warning">已加载，请重启后生效</Tag>;
        }
        if (record.status === "deleting") {
          return <Tag color="error">已卸载，请重启后生效</Tag>;
        }
        return (
          <Button
            type="link"
            size="small"
            onClick={() => openMoreDoModal(record, "gpu")}
          >
            更多操作
          </Button>
        );
      },
    },
  ];

  // USB 设备列定义
  const usbColumns: ColumnsType<USBDeviceRow> = [
    {
      title: "设备ID",
      dataIndex: "id",
      key: "id",
      width: 120,
      render: (text: string) => text || <Tag color="default">暂未提供</Tag>,
    },
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      render: (text: string) => text || <Tag color="default">暂未提供</Tag>,
    },
    {
      title: "主机端口",
      dataIndex: "host",
      key: "host",
      render: (text: string) => text || <Tag color="default">暂未提供</Tag>,
    },
    {
      title: "制造商",
      dataIndex: "manufacturer",
      key: "manufacturer",
      render: (text: string) => text || <Tag color="default">暂未提供</Tag>,
    },
    {
      title: "产品",
      dataIndex: "product",
      key: "product",
      render: (text: string) => text || <Tag color="default">暂未提供</Tag>,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: renderStatusTag,
    },
    {
      title: "关联虚拟机",
      dataIndex: "vmUse",
      key: "vmUse",
      render: (vmUse: USBDeviceRow["vmUse"]) =>
        vmUse.length > 0 ? (
          <Space size={4} wrap>
            {[...vmUse]
              .sort((a, b) => {
                if (a.status === "normal" && b.status !== "normal") return -1;
                if (a.status !== "normal" && b.status === "normal") return 1;
                return 0;
              })
              .slice(0, 2)
              .map(item => (
                <Tag
                  key={item.vmUid}
                  color={item.status === "normal" ? "success" : "default"}
                >
                  {item.name}
                </Tag>
              ))}
            {vmUse.length > 2 && <span>...</span>}
          </Space>
        ) : (
          <Tag color="default">未使用</Tag>
        ),
    },
    {
      title: "操作",
      key: "action",
      width: 100,
      render: (_: unknown, record: USBDeviceRow) => {
        // pending 或 deleting 状态显示提示
        if (record.status === "pending") {
          return <Tag color="warning">已加载，请重启后生效</Tag>;
        }
        if (record.status === "deleting") {
          return <Tag color="error">已卸载，请重启后生效</Tag>;
        }
        return (
          <Button
            type="link"
            size="small"
            onClick={() => openMoreDoModal(record, "usb")}
          >
            更多操作
          </Button>
        );
      },
    },
  ];

  // 网卡设备列定义
  const networkColumns: ColumnsType<NetworkDeviceRow> = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      render: (text: string) => text || <Tag color="default">暂未提供</Tag>,
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
      render: (text: string) => text || <Tag color="default">暂未提供</Tag>,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: renderStatusTag,
    },
    {
      title: "从属",
      dataIndex: "ports",
      key: "ports",
      render: (text: string) => text || <Tag color="default">暂未提供</Tag>,
    },
    {
      title: "IP",
      dataIndex: "ip",
      key: "ip",
      render: (text: string) => text || <Tag color="default">暂未提供</Tag>,
    },
  ];

  // 过滤数据
  const filteredData = useMemo(() => {
    if (activeTab === "gpu") {
      return gpuList.filter(
        item =>
          item.deviceName?.toLowerCase().includes(searchValue.toLowerCase()) ??
          false
      );
    } else if (activeTab === "usb") {
      return usbList.filter(
        item =>
          item.name?.toLowerCase().includes(searchValue.toLowerCase()) ?? false
      );
    } else {
      return networkList.filter(
        item =>
          item.name?.toLowerCase().includes(searchValue.toLowerCase()) ?? false
      );
    }
  }, [activeTab, gpuList, usbList, networkList, searchValue]);

  // 分页数据
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, currentPage, pageSize]);

  // 获取当前 tab 的列定义
  const getCurrentColumns = (): ColumnsType<DeviceRow> => {
    if (activeTab === "gpu") {
      return gpuColumns as ColumnsType<DeviceRow>;
    } else if (activeTab === "usb") {
      return usbColumns as ColumnsType<DeviceRow>;
    } else {
      return networkColumns as ColumnsType<DeviceRow>;
    }
  };

  // 获取当前 tab 的 rowKey
  const getRowKey = (): string => {
    if (activeTab === "gpu") {
      return "id";
    } else {
      return "uid";
    }
  };


  // 渲染表格内容（公共部分）
  const renderTableContent = () => (
    <div style={{ padding: "0 0" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Input
          placeholder="搜索名称"
          prefix={<SearchOutlined />}
          value={searchValue}
          onChange={e => {
            setSearchValue(e.target.value);
            setCurrentPage(1);
          }}
          style={{ width: 240 }}
        />
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={loading}
          />
          <Button icon={<SettingOutlined />} />
        </Space>
      </div>
      <div
        style={{
          fontSize: 12,
          color: "#666",
          margin: "0 0 8px 0",
          lineHeight: 1.4,
        }}
      >
        共计 {filteredData.length} 条数据
      </div>
      <Table
        columns={getCurrentColumns()}
        dataSource={paginatedData}
        rowKey={getRowKey()}
        pagination={false}
        size="small"
        loading={loading}
      />
      {filteredData.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: 16,
          }}
        >
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredData.length}
            onChange={(page, size) => {
              setCurrentPage(page);
              if (size) {
                setPageSize(size);
              }
            }}
            showSizeChanger
            showTotal={total => `共 ${total} 条`}
            pageSizeOptions={["10", "20", "50", "100"]}
          />
        </div>
      )}
    </div>
  );

  const tabItems: TabItem[] = [
    {
      key: "gpu",
      label: "GPU设备",
      icon: <LaptopOutlined />,
      children: renderTableContent(),
    },
    {
      key: "usb",
      label: "USB设备",
      icon: <UsbOutlined />,
      children: renderTableContent(),
    },
    {
      key: "network",
      label: "网卡设备",
      icon: <GlobalOutlined />,
      children: renderTableContent(),
    },
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <VerticalTabs
        items={tabItems}
        activeKey={activeTab}
        onChange={key => {
          setActiveTab(key as DeviceTabKey);
          setSearchValue("");
          setCurrentPage(1);
        }}
        tabWidth={160}
      />

      {/* 更多操作模态框 */}
      <DeviceMoreDoModal
        open={modalOpen}
        deviceType={modalDeviceType}
        deviceData={modalDeviceData}
        onClose={closeModal}
        onSuccess={handleUnmountSuccess}
      />
    </div>
  );
};

export default DeviceManagement;
