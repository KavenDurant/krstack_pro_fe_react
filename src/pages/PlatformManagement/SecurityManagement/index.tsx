import React from "react";
import { Switch, Row, Col } from "antd";
import GrayCard from "@/components/GrayCard";
import LayoutBox from "@/components/LayoutBox";
import BreadcrumbContainer from "@/components/BreadcrumbContainer";

const SecurityManagement: React.FC = () => {
  return (
    <LayoutBox>
      <BreadcrumbContainer items={[{ label: "平台安全设置" }]} />
      <LayoutBox padding={12} gap={12}>
        <GrayCard title="控制台访问密码">
          <Row align="middle" gutter={12} justify="space-between">
            <Col>
              <div>开启后访问控制台就需要通过密码访问。</div>
            </Col>
            <Col>
              <Switch />
            </Col>
          </Row>
        </GrayCard>
      </LayoutBox>
    </LayoutBox>
  );
};

export default SecurityManagement;
