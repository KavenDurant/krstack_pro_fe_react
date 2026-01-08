import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Radio,
  Select,
  Input,
  Button,
  Upload,
  message,
  Space,
} from "antd";
import { UploadOutlined, CloseOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd/es/upload";
import { storageApi } from "@/api";
import { useUploadProgressStore } from "@/stores/uploadProgress";
import { executeUpload } from "@/utils/uploadService";

interface UploadImageModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

interface FormValues {
  format: string;
  system: string;
  storage_type: "internal" | "external";
  storage_path: string;
  imageFire: string;
}

interface StorageOption {
  label: string;
  value: string;
  disabled?: boolean;
}

const UploadImageModal: React.FC<UploadImageModalProps> = ({
  open,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm<FormValues>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [storageOptions, setStorageOptions] = useState<StorageOption[]>([]);
  const [loadingStorage, setLoadingStorage] = useState(false);
  const { addTask } = useUploadProgressStore();

  // 获取存储路径列表
  const fetchStorageList = async (shared: boolean) => {
    try {
      setLoadingStorage(true);
      const response = await storageApi.getStorageContent({
        usage: ["iso"],
        shared,
      });

      if (response.code === 200 && response.data?.cluster_storages) {
        const options: StorageOption[] = response.data.cluster_storages.map(
          item => ({
            label: item.overview,
            value: item.storage_uid,
            disabled: item.platform_type === "zstack",
          })
        );
        setStorageOptions(options);
      } else {
        setStorageOptions([]);
      }
    } catch (error) {
      console.error(
        `获取存储路径数据失败 (${shared ? "外挂存储" : "内置存储"}):`,
        error
      );
      setStorageOptions([]);
      message.error("获取存储路径失败");
    } finally {
      setLoadingStorage(false);
    }
  };

  // 监听存储方式字段变化
  const handleStorageTypeChange = (value: "internal" | "external") => {
    form.setFieldValue("storage_path", undefined);
    fetchStorageList(value === "external");
  };

  // 监听镜像格式变化
  const handleFormatChange = () => {
    // 格式变化时重新获取存储列表
    const storageType = form.getFieldValue("storage_type");
    if (storageType) {
      form.setFieldsValue({
        storage_path: undefined,
      });
      fetchStorageList(storageType === "external");
    }
  };

  // 文件选择前的验证
  const beforeUpload: UploadProps["beforeUpload"] = file => {
    const isIso = file.name.toLowerCase().endsWith(".iso");
    if (!isIso) {
      message.error("只能上传 ISO 文件！");
      return Upload.LIST_IGNORE;
    }
    if (file.size === 0) {
      message.error("文件大小不能为 0KB！");
      return Upload.LIST_IGNORE;
    }

    // 设置文件名
    form.setFieldValue("imageFire", file.name);
    setFileList([file as UploadFile]);

    return false; // 阻止自动上传
  };

  // 执行上传
  const handleUpload = async () => {
    try {
      await form.validateFields();
    } catch {
      return;
    }

    if (fileList.length === 0) {
      message.error("请先选择镜像文件");
      return;
    }

    const file = fileList[0];
    const actualFile = file.originFileObj || file;

    if (!(actualFile instanceof File)) {
      message.error("请上传正确的镜像文件");
      return;
    }

    if (actualFile.size === 0) {
      message.error("无法上传大小为 0KB 的文件");
      return;
    }

    const storagePath = form.getFieldValue("storage_path");
    if (!storagePath) {
      message.error("请选择有效的存储路径");
      return;
    }

    const storageType = form.getFieldValue("storage_type");
    const system = form.getFieldValue("system");

    // 创建上传任务
    const taskId = addTask({
      fileName: actualFile.name,
      fileSize: actualFile.size,
    });

    // 关闭弹窗
    handleCancel();

    // 在后台执行上传
    executeUpload({
      taskId,
      file: actualFile,
      storageType,
      storageUid: storagePath,
      system,
    }).then(() => {
      // 上传完成后刷新列表
      onSuccess();
    });
  };

  // 关闭模态框
  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    onCancel();
  };

  // 初始化表单
  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        format: ".iso",
        system: "windows",
        storage_type: "internal",
        storage_path: undefined,
        imageFire: undefined,
      });
      setFileList([]);
      fetchStorageList(false); // 默认加载内置存储
    }
  }, [open, form]);

  return (
    <Modal
      title={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: "bold", fontSize: 16 }}>上传镜像</span>
          <Space>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={handleCancel}
            />
          </Space>
        </div>
      }
      open={open}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          取消
        </Button>,
        <Button key="upload" type="primary" onClick={handleUpload}>
          上传
        </Button>,
      ]}
      width={610}
      centered
      closable={false}
      maskClosable={false}
      styles={{
        body: {
          padding: "12px",
        },
      }}
    >
      <Form
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        labelAlign="right"
      >
        <Form.Item label="镜像格式" name="format" style={{ marginBottom: 20 }}>
          <Radio.Group buttonStyle="solid" onChange={handleFormatChange}>
            <Radio.Button value=".iso">ISO</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="操作系统" name="system" style={{ marginBottom: 20 }}>
          <Radio.Group buttonStyle="solid">
            <Radio.Button value="windows">Microsoft Windows</Radio.Button>
            <Radio.Button value="linux">Linux</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="存储方式"
          name="storage_type"
          style={{ marginBottom: 20 }}
        >
          <Radio.Group
            buttonStyle="solid"
            onChange={e => {
              const value = e.target.value as "internal" | "external";
              handleStorageTypeChange(value);
            }}
          >
            <Radio.Button value="internal">内置存储</Radio.Button>
            <Radio.Button value="external">外挂存储</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="存储路径"
          name="storage_path"
          rules={[{ required: true, message: "请选择存储路径！" }]}
          style={{ marginBottom: 20 }}
        >
          <Select
            placeholder="请选择存储路径"
            disabled={loadingStorage}
            loading={loadingStorage}
            options={storageOptions}
          />
        </Form.Item>

        <Form.Item
          label="镜像文件"
          name="imageFire"
          rules={[{ required: true, message: "请选择镜像文件！" }]}
          style={{ marginBottom: 0 }}
        >
          <Space style={{ width: "100%", display: "flex" }}>
            <Input disabled placeholder="请选择镜像文件" style={{ flex: 1 }} />
            <Upload
              fileList={fileList}
              beforeUpload={beforeUpload}
              accept=".iso"
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>选择镜像</Button>
            </Upload>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UploadImageModal;
