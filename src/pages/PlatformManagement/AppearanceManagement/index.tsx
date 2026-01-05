import React from "react";
import { Row, Col, Button } from "antd";
import {
  RedoOutlined,
  UploadOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import GrayCard from "@/components/GrayCard";
import LayoutBox from "@/components/LayoutBox";
import BreadcrumbContainer from "@/components/BreadcrumbContainer";

const AppearanceManagement: React.FC = () => {
  return (
    <LayoutBox>
      <BreadcrumbContainer items={[{ label: "平台外观管理" }]} />
      <LayoutBox padding={12} gap={12}>
        <Button type="default" size="small" icon={<RedoOutlined />}>
          重置默认外观
        </Button>
        <GrayCard title="登录页面背景图">
          <Row align="middle" gutter={12} justify="space-between">
            <Col>
              <div>建议使用16:9的图片；支持png，jpg格式的图片。</div>
            </Col>
            <Col>
              <Button type="primary" size="small" icon={<UploadOutlined />}>
                上传
              </Button>
            </Col>
          </Row>
        </GrayCard>

        <GrayCard title="浏览器tab页logo">
          <Row align="middle" gutter={12} justify="space-between">
            <Col>
              <div>仅支持.ico格式，大小16x16px。</div>
            </Col>
            <Col>
              <Button type="primary" size="small" icon={<UploadOutlined />}>
                上传
              </Button>
            </Col>
          </Row>
        </GrayCard>

        <GrayCard title="高级配置">
          <Row align="middle" gutter={12} justify="space-between">
            <Col>
              <div>支持logo、平台名称、页脚自定义。</div>
            </Col>
            <Col>
              <Button type="primary" size="small" icon={<SettingOutlined />}>
                配置
              </Button>
            </Col>
          </Row>
        </GrayCard>
      </LayoutBox>
    </LayoutBox>
  );
};

export default AppearanceManagement;
