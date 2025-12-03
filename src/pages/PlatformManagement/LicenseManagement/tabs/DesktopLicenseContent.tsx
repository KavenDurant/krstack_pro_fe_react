import React from "react";
import { Button, Progress } from "antd";
import {
  CopyOutlined,
  DownloadOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  SendOutlined,
} from "@ant-design/icons";
import LayoutBox from "../../../../components/LayoutBox";
import GrayCard from "../../../../components/GrayCard";
import styles from "../License.module.css";

const DesktopLicenseContent: React.FC = () => {
  const licenseCode = "示例申请码";

  const handleReserve = () => {
    alert("预留功能，暂无实际操作");
  };

  return (
    <LayoutBox gap={12}>
      <GrayCard title="基本信息">
        <div>
          <div className={styles.infoRow}>
            <span
              className={styles.infoLabel}
              style={{ width: 180, display: "inline-block" }}
            >
              当前版本：
            </span>
            <span
              className={styles.infoValue}
              style={{ width: 180, display: "inline-block" }}
            >
              v6.0.0
            </span>
          </div>
          <div className={styles.infoRow}>
            <span
              className={styles.infoLabel}
              style={{ width: 180, display: "inline-block" }}
            >
              平台绑定云桌面前端地址：
            </span>
            <span className={styles.infoValue}>192.168.1.237:8000</span>
          </div>
          <div className={styles.infoRow}>
            <span
              className={styles.infoLabel}
              style={{ width: 180, display: "inline-block" }}
            >
              云桌面服务地址：
            </span>
            <span className={styles.infoValue}>192.168.1.106:8443</span>
            <Button type="primary" size="small" style={{ marginTop: 8 }}>
              地址变更
            </Button>
          </div>
          <div
            style={{
              color: "#888",
              fontSize: 12,
              marginTop: 4,
              textAlign: "right",
            }}
          >
            平台后台地址或云桌面服务地址变更后，对应云桌面服务和对应平台需重新绑定
          </div>
        </div>
      </GrayCard>

      <LayoutBox direction="row" childWidth="auto" padding={0} gap={12}>
        <GrayCard title="许可剩余天数" className={styles.leftCard}>
          <div className={styles.daysRemaining}>
            <span className={styles.daysValue}>永久有效</span>
          </div>
        </GrayCard>

        <GrayCard title="云管理平台许可信息" className={styles.rightCard}>
          <div className={styles.licenseInfo}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>申请码：</span>
              <span className={styles.infoValue}>{licenseCode}</span>
              <div className={styles.infoActions}>
                <Button
                  type="default"
                  size="small"
                  icon={<CopyOutlined />}
                  onClick={handleReserve}
                >
                  复制
                </Button>
                <Button
                  type="default"
                  size="small"
                  icon={<DownloadOutlined />}
                  onClick={handleReserve}
                >
                  下载
                </Button>
              </div>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>激活状态：</span>
              <span className={styles.infoValue}>
                <CheckCircleOutlined className={styles.statusActive} />
                <span className={styles.statusActive}>已激活</span>
              </span>
              <div className={styles.infoActions}>
                <Button
                  type="primary"
                  size="small"
                  icon={<UploadOutlined />}
                  onClick={handleReserve}
                >
                  上传许可
                </Button>
              </div>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>激活版本：</span>
              <span className={styles.infoValue}>v5.6.13</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>许可到期时间：</span>
              <span className={styles.infoValue}>—</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>节点数量限制：</span>
              <div className={styles.progressRow}>
                <Progress
                  percent={100}
                  size="small"
                  className={styles.progressBar}
                  showInfo={false}
                  strokeColor="#1890ff"
                />
                <span className={styles.progressText}>10/10</span>
              </div>
              <div className={styles.infoActions}>
                <Button
                  type="primary"
                  size="small"
                  icon={<SendOutlined />}
                  onClick={handleReserve}
                >
                  申请扩容
                </Button>
              </div>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>GPU数量限制：</span>
              <div className={styles.progressRow}>
                <Progress
                  percent={40}
                  size="small"
                  className={styles.progressBar}
                  showInfo={false}
                  strokeColor="#1890ff"
                />
                <span className={styles.progressText}>40/100</span>
              </div>
              <div className={styles.infoActions}>
                <Button
                  type="primary"
                  size="small"
                  icon={<SendOutlined />}
                  onClick={handleReserve}
                >
                  申请扩容
                </Button>
              </div>
            </div>
          </div>
        </GrayCard>
      </LayoutBox>
    </LayoutBox>
  );
};

export default DesktopLicenseContent;
