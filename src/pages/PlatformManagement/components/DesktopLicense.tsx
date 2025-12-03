import React, { useState } from "react";
import { Card, Button, Progress, Typography, Modal, Input, Alert } from "antd";
import {
  CopyOutlined,
  DownloadOutlined,
  SyncOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const DesktopLicense: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <Card
        title="基本信息"
        style={{ marginBottom: 12, background: "rgba(245, 245, 245, 0.3)" }}
        styles={{
          header: { borderBottom: "none", background: "transparent" },
          body: { background: "transparent" },
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <Text style={{ color: "#666", marginRight: 8 }}>当前版本：</Text>
            <Text>v6.0.0</Text>
          </div>
          <div>
            <Text style={{ color: "#666", marginRight: 8 }}>
              平台绑定云桌面地址：
            </Text>
            <Text>192.168.1.237:8000</Text>
          </div>
          <div>
            <Text style={{ color: "#666", marginRight: 8 }}>
              云桌面服务地址：
            </Text>
            <Text>192.168.1.106:8443</Text>
            <Button
              type="primary"
              size="small"
              style={{ marginLeft: 12 }}
              icon={<SyncOutlined />}
              onClick={() => setModalOpen(true)}
            >
              地址变更
            </Button>
            <Text style={{ color: "#999", marginLeft: 12, fontSize: 12 }}>
              平台后台地址变更和云桌面服务地址变更后，对应云桌面服会和对应平台重新绑定
            </Text>
          </div>
        </div>
      </Card>

      <Modal
        title="地址变更"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => setModalOpen(false)}
        okText="确定"
        cancelText="取消"
        width={800}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Alert
            title="平台后台地址变更和云桌面服务地址变更后，对应云桌面服会和对应平台重新绑定，该过程需要消耗一定的时间！"
            type="info"
            showIcon
            icon={<InfoCircleOutlined />}
          />
          <Alert
            title="绑定云桌面服务时，如果绑定的云桌面服务已经被其他服务使用，会出现云桌面服务相互挤占的情况，所以在绑定云桌面服务时检查一下绑定的服务是否后被其他服务使用！"
            type="info"
            showIcon
            icon={<InfoCircleOutlined />}
          />
          <div>
            <div style={{ marginBottom: 8 }}>
              <Text style={{ color: "red" }}>* </Text>
              <Text>平台云桌面绑定地址：</Text>
            </div>
            <Input placeholder="默认地址：<服务IP>:8000" />
          </div>
          <div>
            <div style={{ marginBottom: 8 }}>
              <Text style={{ color: "red" }}>* </Text>
              <Text>云桌面服务地址：</Text>
            </div>
            <Input placeholder="默认地址：<服务IP>:8443" />
          </div>
          <div>
            <div style={{ marginBottom: 8 }}>
              <Text>云桌面公网地址：</Text>
            </div>
            <Input />
          </div>
        </div>
      </Modal>

      <div style={{ display: "flex", gap: 12 }}>
        <Card
          title="许可剩余时间"
          style={{ flex: 1, background: "rgba(245, 245, 245, 0.3)" }}
          styles={{
            header: { borderBottom: "none", background: "transparent" },
            body: { background: "transparent" },
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 200,
            }}
          >
            <Text style={{ fontSize: 72, fontWeight: 500, color: "#52c41a" }}>
              90天
            </Text>
          </div>
        </Card>

        <Card
          title="云桌面许可信息"
          style={{ flex: 1, background: "rgba(245, 245, 245, 0.3)" }}
          styles={{
            header: { borderBottom: "none", background: "transparent" },
            body: { background: "transparent" },
          }}
        >
          <div style={{ display: "flex", height: "100%" }}>
            <div
              style={{
                flex: 2,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div>
                <Text style={{ color: "#666", marginRight: 8 }}>申请码：</Text>
                <Text>a2cfd713a39031896043...</Text>
                <Button
                  type="text"
                  size="small"
                  icon={<CopyOutlined />}
                  style={{ marginLeft: 8 }}
                >
                  复制
                </Button>
                <Button
                  type="text"
                  size="small"
                  icon={<DownloadOutlined />}
                  style={{ marginLeft: 8 }}
                >
                  下载
                </Button>
              </div>
              <div>
                <Text style={{ color: "#666", marginRight: 8 }}>
                  激活状态：
                </Text>
                <Text style={{ color: "#52c41a" }}>已激活</Text>
              </div>
              <div>
                <Text style={{ color: "#666", marginRight: 8 }}>
                  许可到期时间：
                </Text>
                <Text>2025-12-31 23:59:59</Text>
              </div>
              <div>
                <div style={{ marginBottom: 8 }}>
                  <Text style={{ color: "#666", marginRight: 8 }}>
                    普通桌面数：
                  </Text>
                  <Text>8/10</Text>
                </div>
                <Progress percent={80} showInfo={false} />
              </div>
              <div>
                <div style={{ marginBottom: 8 }}>
                  <Text style={{ color: "#666", marginRight: 8 }}>
                    GPU桌面并发接入数：
                  </Text>
                  <Text>4/10</Text>
                </div>
                <Progress percent={40} showInfo={false} />
              </div>
            </div>
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                justifyContent: "center",
              }}
            >
              <Button type="primary" size="small">
                上传许可
              </Button>
              <Button type="primary" size="small">
                申请扩容
              </Button>
              <Button type="primary" size="small">
                申请扩容
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DesktopLicense;
