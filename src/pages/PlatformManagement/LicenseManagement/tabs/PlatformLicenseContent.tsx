import React from "react";
import { Button, Progress } from "antd";
import {
  CopyOutlined,
  DownloadOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  SendOutlined,
} from "@ant-design/icons";
import LayoutBox from "@/components/LayoutBox";
import GrayCard from "@/components/GrayCard";
import styles from "@/pages/PlatformManagement/LicenseManagement/License.module.less";

const PlatformLicenseContent: React.FC = () => {
  const licenseCode = "示例申请码";

  const handleReserve = () => {
    alert("预留功能，暂无实际操作");
  };

  return (
    <LayoutBox direction="row" childWidth="auto" gap={12}>
      <GrayCard title="许可剩余天数" className={styles.leftCard}>
        <div className={styles.daysRemaining}>
          <span className={styles.daysValue}>永久有效</span>
        </div>
      </GrayCard>

      <GrayCard title="云管理平台许可信息" className={styles.rightCard}>
        <div className={styles.licenseInfo}>
          <div className={styles.infoLeft}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>申请码：</span>
              <div className={styles.infoValue}>
                <span>{licenseCode}</span>
                <Button
                  type="text"
                  size="small"
                  icon={<CopyOutlined />}
                  onClick={handleReserve}
                >
                  复制
                </Button>
                <Button
                  type="text"
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
            </div>
          </div>

          <div className={styles.infoRight}>
            <Button
              type="primary"
              icon={<UploadOutlined />}
              onClick={handleReserve}
            >
              上传许可
            </Button>
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleReserve}
            >
              申请扩容
            </Button>
          </div>
        </div>
      </GrayCard>
    </LayoutBox>
  );
};

export default PlatformLicenseContent;
