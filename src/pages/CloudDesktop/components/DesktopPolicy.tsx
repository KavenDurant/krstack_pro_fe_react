/*
 * @Author: KavenDurant luojiaxin888@gmail.com
 * @Date: 2026-01-05 14:00:00
 * @LastEditors: KavenDurant luojiaxin888@gmail.com
 * @LastEditTime: 2026-01-05 14:00:00
 * @FilePath: /krstack_pro_fe_react/src/pages/CloudDesktop/components/DesktopPolicy.tsx
 * @Description: 桌面策略管理组件
 */
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Checkbox,
  Select,
  Radio,
  InputNumber,
  Button,
  Space,
  message,
} from "antd";
import { ReloadOutlined, SaveOutlined } from "@ant-design/icons";
import GrayCard from "@/components/GrayCard";
import {
  getGlobalUsbPolicy,
  updateGlobalUsbPolicy,
  getGlobalDataAccessPolicy,
  updateGlobalDataAccessPolicy,
  getGlobalTransportProtocolPolicy,
  updateGlobalTransportProtocolPolicy,
} from "@/api/modules/cloudDesk";
import type {
  UsbPolicy,
  DataAccessPolicy,
  TransportProtocolPolicy,
} from "@/api/modules/cloudDesk/types";
import styles from "./DesktopPolicy.module.less";

interface DesktopPolicyProps {
  active?: boolean;
}

// USB存储模式选项
const USB_STORAGE_MODE_OPTIONS = [
  { label: "模式1", value: 1 },
  { label: "模式2", value: 2 },
  { label: "模式3", value: 3 },
];

// 剪切板权限选项
const COPY_PERMISSIONS_OPTIONS = [
  { label: "禁止", value: 0 },
  { label: "从云桌面到本地", value: 1 },
  { label: "从本地到云桌面", value: 2 },
  { label: "双向", value: 3 },
];

// 画面质量选项
const QUALITY_OPTIONS = [
  { label: "无损", value: 0 },
  { label: "高", value: 1 },
  { label: "中", value: 2 },
  { label: "低", value: 3 },
];

// 音频质量选项
const AUDIO_QUALITY_OPTIONS = [
  { label: "高", value: 1 },
  { label: "中", value: 2 },
  { label: "低", value: 3 },
];

// 摄像头模式选项
const CAMERA_MODEL_OPTIONS = [
  { label: "模式0", value: 0 },
  { label: "模式1", value: 1 },
  { label: "模式2", value: 2 },
  { label: "模式3", value: 3 },
  { label: "模式4", value: 4 },
];

const DesktopPolicy: React.FC<DesktopPolicyProps> = ({ active = true }) => {
  // USB策略
  const [usbPolicy, setUsbPolicy] = useState<UsbPolicy>();
  const [usbLoading, setUsbLoading] = useState(false);
  const [usbSaving, setUsbSaving] = useState(false);

  // 数据访问策略
  const [dataAccessPolicy, setDataAccessPolicy] = useState<DataAccessPolicy>();
  const [dataAccessLoading, setDataAccessLoading] = useState(false);
  const [dataAccessSaving, setDataAccessSaving] = useState(false);

  // 传输协议策略
  const [transportPolicy, setTransportPolicy] =
    useState<TransportProtocolPolicy>();
  const [transportLoading, setTransportLoading] = useState(false);
  const [transportSaving, setTransportSaving] = useState(false);

  // 追踪上次的 active 状态，只在从 false 变为 true 时加载
  const prevActiveRef = useRef(false);

  // 加载USB策略
  const loadUsbPolicy = async () => {
    setUsbLoading(true);
    try {
      const res = await getGlobalUsbPolicy();
      console.log("USB policy response:", res);
      if (res?.data) {
        setUsbPolicy(res.data);
      } else {
        console.warn("USB policy response data is empty");
      }
    } catch (err) {
      console.error("加载USB策略失败:", err);
      message.error("加载USB策略失败");
    } finally {
      setUsbLoading(false);
    }
  };

  // 保存USB策略
  const saveUsbPolicy = async () => {
    if (!usbPolicy) {
      message.warning("USB策略数据未加载，请先刷新");
      return;
    }
    setUsbSaving(true);
    try {
      const res = (await updateGlobalUsbPolicy({
        covered: true,
        usb_policy: usbPolicy,
      })) as unknown as { data: { message: string } };
      message.success(res.data.message || "USB策略保存成功");
    } catch {
      message.error("USB策略保存失败");
    } finally {
      setUsbSaving(false);
    }
  };

  // 加载数据访问策略
  const loadDataAccessPolicy = async () => {
    setDataAccessLoading(true);
    try {
      const res = await getGlobalDataAccessPolicy();
      console.log("Data access policy response:", res);
      if (res?.data) {
        setDataAccessPolicy(res.data);
      } else {
        console.warn("Data access policy response data is empty");
      }
    } catch (err) {
      console.error("加载数据访问策略失败:", err);
      message.error("加载数据访问策略失败");
    } finally {
      setDataAccessLoading(false);
    }
  };

  // 保存数据访问策略
  const saveDataAccessPolicy = async () => {
    if (!dataAccessPolicy) {
      message.warning("数据访问策略数据未加载，请先刷新");
      return;
    }
    setDataAccessSaving(true);
    try {
      const res = (await updateGlobalDataAccessPolicy({
        covered: true,
        data_access_policy: dataAccessPolicy,
      })) as unknown as { data: { message: string } };
      message.success(res.data.message || "数据访问策略保存成功");
    } catch {
      message.error("数据访问策略保存失败");
    } finally {
      setDataAccessSaving(false);
    }
  };

  // 加载传输协议策略
  const loadTransportPolicy = async () => {
    setTransportLoading(true);
    try {
      const res = await getGlobalTransportProtocolPolicy();
      console.log("Transport policy response:", res);
      if (res?.data) {
        setTransportPolicy(res.data);
      } else {
        console.warn("Transport policy response data is empty");
      }
    } catch (err) {
      console.error("加载传输协议策略失败:", err);
      message.error("加载传输协议策略失败");
    } finally {
      setTransportLoading(false);
    }
  };

  // 保存传输协议策略
  const saveTransportPolicy = async () => {
    if (!transportPolicy) {
      message.warning("传输协议策略数据未加载，请先刷新");
      return;
    }
    setTransportSaving(true);
    try {
      const res = (await updateGlobalTransportProtocolPolicy({
        covered: true,
        transport_protocol_policy: transportPolicy,
      })) as unknown as { data: { message: string } };
      message.success(res.data.message || "传输协议策略保存成功");
    } catch {
      message.error("传输协议策略保存失败");
    } finally {
      setTransportSaving(false);
    }
  };

  // 全部保存
  const saveAll = async () => {
    await Promise.all([
      saveUsbPolicy(),
      saveDataAccessPolicy(),
      saveTransportPolicy(),
    ]);
  };

  // 全部刷新
  const refreshAll = useCallback(async () => {
    await Promise.all([
      loadUsbPolicy(),
      loadDataAccessPolicy(),
      loadTransportPolicy(),
    ]);
  }, []);

  // tab 激活时加载数据 - 只在从 inactive 变为 active 时加载
  useEffect(() => {
    if (active && !prevActiveRef.current) {
      refreshAll();
    }
    // 更新 ref 为当前 active 状态
    prevActiveRef.current = active;
  }, [active, refreshAll]);

  return (
    <div className={styles.container}>
      {/* 操作栏 */}
      <div style={{ marginBottom: 16, textAlign: "right" }}>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={refreshAll}>
            刷新
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={saveAll}
            loading={usbSaving || dataAccessSaving || transportSaving}
          >
            保存全部
          </Button>
        </Space>
      </div>

      {/* USB配置 */}
      <GrayCard
        title="USB 配置"
        extra={
          <Button
            type="link"
            onClick={saveUsbPolicy}
            loading={usbSaving}
            disabled={usbLoading}
          >
            保存
          </Button>
        }
        loading={usbLoading}
      >
        <div className={styles.section}>
          <div className={styles.sectionDesc}>
            配置接入桌面的 USB 设备的访问控制
          </div>

          <div className={styles.configItem}>
            <Checkbox
              checked={usbPolicy?.usb_storage}
              onChange={e => {
                if (usbPolicy) {
                  setUsbPolicy({
                    ...usbPolicy,
                    usb_storage: e.target.checked,
                  });
                }
              }}
            >
              允许 USB 存储盘
            </Checkbox>
            <Select
              value={usbPolicy?.usb_storage_model}
              onChange={value => {
                if (usbPolicy) {
                  setUsbPolicy({ ...usbPolicy, usb_storage_model: value });
                }
              }}
              style={{ width: 120, marginLeft: 8 }}
              disabled={!usbPolicy?.usb_storage}
            >
              {USB_STORAGE_MODE_OPTIONS.map(opt => (
                <Select.Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Select.Option>
              ))}
            </Select>
            <span className={styles.hint}>
              开启该策略后，允许将接入 USB 存储盘映射至云桌面
            </span>
          </div>

          <div className={styles.configItem}>
            <Checkbox
              checked={usbPolicy?.usb_printer}
              onChange={e => {
                if (usbPolicy) {
                  setUsbPolicy({
                    ...usbPolicy,
                    usb_printer: e.target.checked,
                  });
                }
              }}
            >
              允许 USB 打印机
            </Checkbox>
          </div>

          <div className={styles.configItem}>
            <Checkbox
              checked={usbPolicy?.usb_smart_card}
              onChange={e => {
                if (usbPolicy) {
                  setUsbPolicy({
                    ...usbPolicy,
                    usb_smart_card: e.target.checked,
                  });
                }
              }}
            >
              允许 USB 智能卡读卡器
            </Checkbox>
          </div>

          <div className={styles.configItem}>
            <Checkbox
              checked={usbPolicy?.usb_audio}
              onChange={e => {
                if (usbPolicy) {
                  setUsbPolicy({
                    ...usbPolicy,
                    usb_audio: e.target.checked,
                  });
                }
              }}
            >
              允许 USB 音频设备
            </Checkbox>
          </div>

          <div className={styles.configItem}>
            <Checkbox
              checked={usbPolicy?.usb_video}
              onChange={e => {
                if (usbPolicy) {
                  setUsbPolicy({
                    ...usbPolicy,
                    usb_video: e.target.checked,
                  });
                }
              }}
            >
              允许 USB 视频设备
            </Checkbox>
          </div>

          <div className={styles.configItem}>
            <Checkbox
              checked={usbPolicy?.usb_other}
              onChange={e => {
                if (usbPolicy) {
                  setUsbPolicy({
                    ...usbPolicy,
                    usb_other: e.target.checked,
                  });
                }
              }}
            >
              允许 USB 其他设备
            </Checkbox>
          </div>
        </div>
      </GrayCard>

      {/* 数据访问 */}
      <GrayCard
        title="数据访问"
        extra={
          <Button
            type="link"
            onClick={saveDataAccessPolicy}
            loading={dataAccessSaving}
            disabled={dataAccessLoading}
          >
            保存
          </Button>
        }
        loading={dataAccessLoading}
      >
        <div className={styles.section}>
          <div className={styles.sectionDesc}>
            配置是否复制本地数据到云桌面，确保数据安全性和访问控制
          </div>

          <div className={styles.configItem}>
            <Checkbox
              checked={dataAccessPolicy?.cut_plate}
              onChange={e => {
                if (dataAccessPolicy) {
                  setDataAccessPolicy({
                    ...dataAccessPolicy,
                    cut_plate: e.target.checked,
                  });
                }
              }}
            >
              允许 PC 剪切板
            </Checkbox>
            <Select
              value={dataAccessPolicy?.copy_permissions}
              onChange={value => {
                if (dataAccessPolicy) {
                  setDataAccessPolicy({
                    ...dataAccessPolicy,
                    copy_permissions: value,
                  });
                }
              }}
              style={{ width: 120, marginLeft: 8 }}
              disabled={!dataAccessPolicy?.cut_plate}
            >
              {COPY_PERMISSIONS_OPTIONS.map(opt => (
                <Select.Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Select.Option>
              ))}
            </Select>
            <span className={styles.hint}>
              开启该策略后，允许将数据复制到云桌面或从云桌面复制数据
            </span>
          </div>

          <div className={styles.configItem}>
            <Checkbox
              checked={dataAccessPolicy?.file_drag}
              onChange={e => {
                if (dataAccessPolicy) {
                  setDataAccessPolicy({
                    ...dataAccessPolicy,
                    file_drag: e.target.checked,
                  });
                }
              }}
            >
              允许 PC 文件拖拽
            </Checkbox>
            <span className={styles.hint}>
              允许本地拖拽文件至云桌面或从云桌面拖拽文件至本地
            </span>
          </div>
        </div>
      </GrayCard>

      {/* 传输协议 */}
      <GrayCard
        title="传输协议"
        extra={
          <Button
            type="link"
            onClick={saveTransportPolicy}
            loading={transportSaving}
            disabled={transportLoading}
          >
            保存
          </Button>
        }
        loading={transportLoading}
      >
        <div className={styles.section}>
          <div className={styles.sectionDesc}>
            配置显示器、GPU 设备、桌面的音频协议、屏幕共享等传输协议
          </div>

          {/* 云桌面画面质量 */}
          <div className={styles.subSection}>
            <div className={styles.subTitle}>云桌面画面质量</div>

            <div className={styles.qualityRow}>
              <span className={styles.label}>普通桌面</span>
              <Radio.Group
                value={transportPolicy?.normal_desktop_graphics_quality}
                onChange={e => {
                  if (transportPolicy) {
                    setTransportPolicy({
                      ...transportPolicy,
                      normal_desktop_graphics_quality: e.target.value,
                    });
                  }
                }}
              >
                {QUALITY_OPTIONS.map(opt => (
                  <Radio key={opt.value} value={opt.value}>
                    {opt.label}
                  </Radio>
                ))}
              </Radio.Group>
            </div>

            <div className={styles.qualityRow}>
              <span className={styles.label}>GPU 桌面</span>
              <Radio.Group
                value={transportPolicy?.gpu_desktop_graphics_quality}
                onChange={e => {
                  if (transportPolicy) {
                    setTransportPolicy({
                      ...transportPolicy,
                      gpu_desktop_graphics_quality: e.target.value,
                    });
                  }
                }}
              >
                {QUALITY_OPTIONS.map(opt => (
                  <Radio key={opt.value} value={opt.value}>
                    {opt.label}
                  </Radio>
                ))}
              </Radio.Group>
            </div>
          </div>

          {/* 音频传输质量 */}
          <div className={styles.subSection}>
            <div className={styles.subTitle}>音频传输质量</div>
            <div className={styles.qualityRow}>
              <span className={styles.label}>音频质量</span>
              <Radio.Group
                value={transportPolicy?.audio_quality}
                onChange={e => {
                  if (transportPolicy) {
                    setTransportPolicy({
                      ...transportPolicy,
                      audio_quality: e.target.value,
                    });
                  }
                }}
              >
                {AUDIO_QUALITY_OPTIONS.map(opt => (
                  <Radio key={opt.value} value={opt.value}>
                    {opt.label}
                  </Radio>
                ))}
              </Radio.Group>
            </div>
          </div>

          {/* 摄像头设置 */}
          <div className={styles.subSection}>
            <div className={styles.subTitle}>摄像头设置</div>

            <div className={styles.cameraRow}>
              <span className={styles.label}>摄像头压缩图像质量</span>
              <InputNumber
                value={transportPolicy?.camera_quality}
                onChange={value => {
                  if (transportPolicy) {
                    setTransportPolicy({
                      ...transportPolicy,
                      camera_quality: value || 85,
                    });
                  }
                }}
                min={10}
                max={100}
                style={{ width: 80 }}
              />
              <span className={styles.range}>(10%-100%)</span>
            </div>

            <div className={styles.cameraRow}>
              <span className={styles.label}>摄像头模式</span>
              <Select
                value={transportPolicy?.camera_model}
                onChange={value => {
                  if (transportPolicy) {
                    setTransportPolicy({
                      ...transportPolicy,
                      camera_model: value,
                    });
                  }
                }}
                style={{ width: 120 }}
              >
                {CAMERA_MODEL_OPTIONS.map(opt => (
                  <Select.Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </GrayCard>
    </div>
  );
};

export default DesktopPolicy;
