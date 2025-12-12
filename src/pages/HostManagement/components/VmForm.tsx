import React, { useState } from "react";
import {
  Form,
  Input,
  Select,
  InputNumber,
  Radio,
  Button,
  Space,
  Card,
  Row,
  Col,
  Tabs,
  Breadcrumb,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";

const { Option } = Select;
const { TabPane } = Tabs;

interface VmFormValues {
  name?: string;
  node?: string;
  resourcePool?: string;
  platform?: string;
  tags?: string[];
  cpuNum?: number;
  memSize?: number;
  [key: string]: unknown;
}

interface VmFormProps {
  onSubmit?: (values: VmFormValues) => void;
  onCancel?: () => void;
}

const VmForm: React.FC<VmFormProps> = ({ onSubmit, onCancel }) => {
  const [form] = Form.useForm();
  const [diskType, setDiskType] = useState("scsi");

  const handleSubmit = (values: VmFormValues) => {
    console.log("Form values:", values);
    onSubmit?.(values);
  };

  return (
    <div
      style={{
        padding: "16px",
        background: "#fff",
        height: "100%",
        overflow: "auto",
      }}
    >
      {/* Breadcrumb */}
      <div style={{ marginBottom: 16 }}>
        <Breadcrumb
          items={[
            { title: "虚拟机管理" },
            { title: "全部虚拟机" },
            { title: "cluster237" },
            { title: "创建虚拟机" },
          ]}
        />
      </div>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          cpuNum: 2,
          memSize: 2,
          busType: "scsi",
          scsiController: "lsi53c810",
          ioThread: false,
          virtio: false,
          bootOrder: ["disk", "cdrom"],
          machineType: "pc",
          bios: "seabios",
        }}
      >
        <Row gutter={24}>
          {/* 左侧面板 - 基本信息 */}
          <Col span={12}>
            <Card title="基本信息" size="small" style={{ marginBottom: 16 }}>
              <Form.Item
                label="名称"
                name="name"
                rules={[{ required: true, message: "请输入虚拟机名称" }]}
              >
                <Input placeholder="请输入虚拟机名称" />
              </Form.Item>

              <Form.Item
                label="节点"
                name="node"
                rules={[{ required: true, message: "请选择节点" }]}
              >
                <Select placeholder="请选择节点">
                  <Option value="host180">host180</Option>
                  <Option value="host181">host181</Option>
                  <Option value="host237">host237</Option>
                </Select>
              </Form.Item>

              <Form.Item label="资源池" name="resourcePool">
                <Select placeholder="请选择资源池">
                  <Option value="pool1">资源池1</Option>
                  <Option value="pool2">资源池2</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="所属平台"
                name="platform"
                rules={[{ required: true, message: "请选择所属平台" }]}
              >
                <Select placeholder="请选择所属平台">
                  <Option value="kr_cloud">KR Cloud</Option>
                  <Option value="zstack">ZStack</Option>
                </Select>
              </Form.Item>

              <Form.Item label="标签" name="tags">
                <Select mode="tags" placeholder="请选择标签">
                  <Option value="云桌面">云桌面</Option>
                  <Option value="生产环境">生产环境</Option>
                  <Option value="测试环境">测试环境</Option>
                </Select>
              </Form.Item>
            </Card>

            <Card title="附加设备" size="small" style={{ marginBottom: 16 }}>
              <Form.List name="additionalDevices">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <div key={key} style={{ marginBottom: 8 }}>
                        <Space.Compact style={{ width: "100%" }}>
                          <Form.Item
                            {...restField}
                            name={[name, "type"]}
                            style={{ flex: 1, marginBottom: 0 }}
                          >
                            <Select
                              placeholder="设备类型"
                              style={{ width: 120 }}
                            >
                              <Option value="usb">USB</Option>
                              <Option value="pci">PCI</Option>
                            </Select>
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, "device"]}
                            style={{ flex: 2, marginBottom: 0 }}
                          >
                            <Select placeholder="设备名称">
                              <Option value="tablet">tablet</Option>
                              <Option value="mouse">mouse</Option>
                              <Option value="keyboard">keyboard</Option>
                            </Select>
                          </Form.Item>
                          <MinusCircleOutlined onClick={() => remove(name)} />
                        </Space.Compact>
                      </div>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        添加设备
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Card>

            <Card title="TPM与EFI" size="small">
              <Form.Item label="TPM/E">
                <Radio.Group>
                  <Radio value={1}>0.1.2版本</Radio>
                  <Radio value={2}>2.0版本</Radio>
                </Radio.Group>
              </Form.Item>
            </Card>
          </Col>

          {/* 右侧面板 - 硬件配置 */}
          <Col span={12}>
            <Card title="硬件配置" size="small" style={{ marginBottom: 16 }}>
              <Tabs defaultActiveKey="1">
                <TabPane tab="CPU" key="1">
                  <Form.Item label="vCPU数量">
                    <Row gutter={8}>
                      <Col span={16}>
                        <Form.Item name="cpuNum" noStyle>
                          <InputNumber
                            min={1}
                            max={128}
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <span style={{ lineHeight: "32px" }}>核</span>
                      </Col>
                    </Row>
                  </Form.Item>
                  <Form.Item label="CPU类型">
                    <Select defaultValue="host">
                      <Option value="host">host</Option>
                      <Option value="qemu64">qemu64</Option>
                      <Option value="kvm64">kvm64</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="套接字">
                    <Row gutter={8}>
                      <Col span={8}>
                        <Form.Item name="sockets" noStyle>
                          <InputNumber
                            min={1}
                            max={64}
                            defaultValue={1}
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item name="cores" noStyle>
                          <InputNumber
                            min={1}
                            max={64}
                            defaultValue={1}
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item name="threads" noStyle>
                          <InputNumber
                            min={1}
                            max={64}
                            defaultValue={1}
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <div style={{ fontSize: 12, color: "#666" }}>
                      插槽/核心/线程
                    </div>
                  </Form.Item>
                </TabPane>

                <TabPane tab="内存" key="2">
                  <Form.Item label="内存">
                    <Row gutter={8}>
                      <Col span={16}>
                        <Form.Item name="memSize" noStyle>
                          <InputNumber
                            min={0.5}
                            max={1024}
                            step={0.5}
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <span style={{ lineHeight: "32px" }}>GB</span>
                      </Col>
                    </Row>
                  </Form.Item>
                </TabPane>

                <TabPane tab="CD/DVD驱动器" key="3">
                  <Form.Item label="CD/DVD驱动器">
                    <Input placeholder="云镜像-centos7.9" />
                  </Form.Item>
                  <Form.Item label="介质">
                    <Select defaultValue="cloudimage-centos7.9">
                      <Option value="cloudimage-centos7.9">
                        云镜像-centos7.9
                      </Option>
                      <Option value="ubuntu-20.04">ubuntu-20.04</Option>
                      <Option value="windows-2019">windows-2019</Option>
                    </Select>
                  </Form.Item>
                </TabPane>

                <TabPane tab="硬盘" key="4">
                  <Form.Item label="总线/设备">
                    <Row gutter={8}>
                      <Col span={12}>
                        <Select
                          value={diskType}
                          onChange={setDiskType}
                          style={{ width: "100%" }}
                        >
                          <Option value="scsi">scsi</Option>
                          <Option value="virtio">virtio</Option>
                          <Option value="sata">sata</Option>
                        </Select>
                      </Col>
                      <Col span={12}>
                        {diskType === "scsi" && (
                          <Select
                            defaultValue="lsi53c810"
                            style={{ width: "100%" }}
                          >
                            <Option value="lsi53c810">lsi53c810</Option>
                            <Option value="virtio-scsi-pci">
                              virtio-scsi-pci
                            </Option>
                          </Select>
                        )}
                      </Col>
                    </Row>
                  </Form.Item>
                  <Form.Item label="磁盘大小">
                    <Row gutter={8}>
                      <Col span={16}>
                        <InputNumber
                          min={1}
                          max={10240}
                          defaultValue={32}
                          style={{ width: "100%" }}
                        />
                      </Col>
                      <Col span={8}>
                        <span style={{ lineHeight: "32px" }}>GB</span>
                      </Col>
                    </Row>
                  </Form.Item>
                  <Form.Item label="缓存">
                    <Radio.Group defaultValue="none">
                      <Radio value="none">无缓存</Radio>
                      <Radio value="writeback">回写</Radio>
                      <Radio value="writethrough">直写</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item label="IO线程">
                    <Radio.Group defaultValue={false}>
                      <Radio value={false}>无</Radio>
                      <Radio value={true}>启用</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item label="启用">
                    <Radio.Group defaultValue={true}>
                      <Radio value={true}>是</Radio>
                      <Radio value={false}>否</Radio>
                    </Radio.Group>
                  </Form.Item>
                </TabPane>

                <TabPane tab="网络设备" key="5">
                  <Form.Item label="型号">
                    <Select defaultValue="virtio">
                      <Option value="virtio">VirtIO (paravirtualized)</Option>
                      <Option value="e1000">Intel E1000</Option>
                      <Option value="rtl8139">Realtek RTL8139</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="桥接">
                    <Select defaultValue="vmbr0">
                      <Option value="vmbr0">Linux Bridge (vmbr0)</Option>
                      <Option value="vmbr1">Linux Bridge (vmbr1)</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="VLAN Tag">
                    <Input placeholder="VLAN Tag" />
                  </Form.Item>
                  <Form.Item label="防火墙">
                    <Radio.Group defaultValue={false}>
                      <Radio value={true}>启用</Radio>
                      <Radio value={false}>禁用</Radio>
                    </Radio.Group>
                  </Form.Item>
                </TabPane>
              </Tabs>
            </Card>

            <Card title="其他" size="small">
              <Form.Item label="Qemu Guest Agent">
                <Radio.Group defaultValue={true}>
                  <Radio value={true}>启用</Radio>
                  <Radio value={false}>禁用</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item label="启动顺序">
                <Select mode="multiple" defaultValue={["disk", "cdrom"]}>
                  <Option value="floppy">软盘</Option>
                  <Option value="disk">硬盘</Option>
                  <Option value="cdrom">光驱</Option>
                  <Option value="network">网络</Option>
                </Select>
              </Form.Item>

              <Form.Item label="机器类型">
                <Select defaultValue="pc">
                  <Option value="pc">PC</Option>
                  <Option value="q35">Q35</Option>
                </Select>
              </Form.Item>

              <Form.Item label="BIOS">
                <Radio.Group defaultValue="seabios">
                  <Radio value="seabios">SeaBIOS</Radio>
                  <Radio value="ovmf">OVMF (UEFI)</Radio>
                </Radio.Group>
              </Form.Item>
            </Card>
          </Col>
        </Row>

        {/* 底部按钮 */}
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Space size="large">
            <Button size="large" onClick={onCancel}>
              取消
            </Button>
            <Button type="primary" size="large" htmlType="submit">
              确定
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  );
};

export default VmForm;
