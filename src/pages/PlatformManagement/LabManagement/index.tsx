import React from "react";
import { Row, Col, Alert, Switch } from "antd";
import GrayCard from "@/components/GrayCard";
import LayoutBox from "@/components/LayoutBox";
import BreadcrumbContainer from "@/components/BreadcrumbContainer";

const LabManagement: React.FC = () => {
  return (
    <LayoutBox>
      <BreadcrumbContainer items={[{ label: "实验室" }]} />
      <LayoutBox padding={12} gap={12}>
        <Alert
          title="实验室内的功能都为beta版功能，需要开启后才能使用！"
          type="info"
          showIcon
          style={{ width: "100%" }}
        />
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

export default LabManagement;
