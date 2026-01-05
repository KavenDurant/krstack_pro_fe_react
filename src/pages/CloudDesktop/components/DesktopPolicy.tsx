/*
 * @Author: KavenDurant luojiaxin888@gmail.com
 * @Date: 2026-01-05 14:00:00
 * @LastEditors: KavenDurant luojiaxin888@gmail.com
 * @LastEditTime: 2026-01-05 14:00:00
 * @FilePath: /krstack_pro_fe_react/src/pages/CloudDesktop/components/DesktopPolicy.tsx
 * @Description: 桌面策略管理组件
 */
import React from "react";
import { Checkbox, Select, Radio, InputNumber } from "antd";
import GrayCard from "../../../components/GrayCard";
import styles from "./DesktopPolicy.module.css";

const DesktopPolicy: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* 桌面配置 */}
      <GrayCard title="桌面配置">
        <div className={styles.section}>
          <div className={styles.sectionDesc}>
            配置接入桌面的USB设备的访问控制
          </div>

          <div className={styles.configItem}>
            <Checkbox>全选</Checkbox>
          </div>

          <div className={styles.configItem}>
            <Checkbox defaultChecked>允许USB存储盘</Checkbox>
            <Select defaultValue="读写模式">
              <Select.Option value="读写模式">读写模式</Select.Option>
              <Select.Option value="只读模式">只读模式</Select.Option>
            </Select>
            <span className={styles.hint}>
              开启该策略模式后，允许将接入USB存储盘映射至云桌面
            </span>
          </div>

          <div className={styles.configItem}>
            <Checkbox>允许USB打印机</Checkbox>
          </div>
          <div className={styles.configItem}>
            <Checkbox>允许USB鼠标</Checkbox>
          </div>
          <div className={styles.configItem}>
            <Checkbox>允许USB音频设备</Checkbox>
          </div>
          <div className={styles.configItem}>
            <Checkbox>允许USB视频设备</Checkbox>
          </div>
          <div className={styles.configItem}>
            <Checkbox>允许USB其他设备</Checkbox>
          </div>
        </div>
      </GrayCard>

      {/* 数据访问 */}
      <GrayCard title="数据访问">
        <div className={styles.section}>
          <div className={styles.sectionDesc}>
            配置是否复制本地数据到云桌面，确保数据安全性和访问控制
          </div>

          <div className={styles.configItem}>
            <Checkbox defaultChecked>允许PC剪切板</Checkbox>
            <Select defaultValue="双向">
              <Select.Option value="双向">双向</Select.Option>
              <Select.Option value="单向">单向</Select.Option>
            </Select>
            <span className={styles.hint}>
              开启该策略模式后，允许将接入数据复制到云桌面或从云桌面复制数据
            </span>
          </div>

          <div className={styles.configItem}>
            <Checkbox>
              允许PC文件拖拽：允许本地拖拽文件或作拖拽至云桌面或从云桌面拖拽文件至本地
            </Checkbox>
          </div>
        </div>
      </GrayCard>

      {/* 传输协议 */}
      <GrayCard title="传输协议">
        <div className={styles.section}>
          <div className={styles.sectionDesc}>
            配置显示器、GPU设备、桌面的音频协议、屏幕共享等传输协议
          </div>

          {/* 云桌面画面质量 */}
          <div className={styles.subSection}>
            <div className={styles.subTitle}>云桌面画面质量</div>
            <div className={styles.qualityRow}>
              <span className={styles.label}>普通桌面</span>
              <span>无损</span>
              <Radio.Group defaultValue="low">
                <Radio value="high">高</Radio>
                <Radio value="medium">中</Radio>
                <Radio value="low">低</Radio>
              </Radio.Group>
            </div>

            <div className={styles.qualityRow}>
              <span className={styles.label}>普通桌面</span>
              <span>高</span>
              <Radio.Group defaultValue="low">
                <Radio value="high">高</Radio>
                <Radio value="medium">中</Radio>
                <Radio value="low">低</Radio>
              </Radio.Group>
            </div>
          </div>

          {/* 音频传输质量 */}
          <div className={styles.subSection}>
            <div className={styles.subTitle}>音频传输质量</div>
            <div className={styles.qualityRow}>
              <span className={styles.label}>音频质量</span>
              <span>高</span>
              <Radio.Group defaultValue="low">
                <Radio value="high">高</Radio>
                <Radio value="medium">中</Radio>
                <Radio value="low">低</Radio>
              </Radio.Group>
            </div>
          </div>

          {/* 视频通话质量 */}
          <div className={styles.subSection}>
            <div className={styles.subTitle}>视频通话质量</div>
            <div className={styles.qualityRow}>
              <span className={styles.label}>视频质量</span>
              <span>高</span>
              <Radio.Group defaultValue="low">
                <Radio value="high">高</Radio>
                <Radio value="medium">中</Radio>
                <Radio value="low">低</Radio>
              </Radio.Group>
            </div>
          </div>

          {/* 摄像头设置 */}
          <div className={styles.subSection}>
            <div className={styles.subTitle}>摄像头设置</div>
            <div className={styles.cameraRow}>
              <span className={styles.label}>摄像头压缩图像分块数：</span>
              <Radio.Group defaultValue="auto">
                <Radio value="normal">常规模式</Radio>
                <Radio value="auto">终端自适应</Radio>
              </Radio.Group>
            </div>

            <div className={styles.cameraRow}>
              <span className={styles.label}>摄像头压缩图像质量</span>
              <InputNumber
                defaultValue={85}
                min={10}
                max={100}
                style={{ width: 80 }}
              />
              <span className={styles.range}>(10%-100%)</span>
            </div>
          </div>
        </div>
      </GrayCard>
    </div>
  );
};

export default DesktopPolicy;
