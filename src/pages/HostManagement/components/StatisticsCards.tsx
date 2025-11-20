import React from "react";
import { Row, Col, Progress } from "antd";

const StatisticsCards: React.FC = () => {
  return (
    <div style={{ padding: "20px 24px", borderBottom: "1px solid #f0f0f0" }}>
      <Row gutter={24} align="middle">
        <Col span={6} style={{ borderRight: "1px solid #f0f0f0" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: 14, color: "#666" }}>虚拟机总数</div>
              <div style={{ fontSize: 24, fontWeight: "bold" }}>100 台</div>
            </div>
            <div style={{ fontSize: 12, color: "#999" }}>
              <div>● 运行中 70 台</div>
              <div>● 已关机 20 台</div>
              <div>● 未知 10 台</div>
            </div>
          </div>
        </Col>
        <Col span={6} style={{ borderRight: "1px solid #f0f0f0" }}>
          <Row align="middle" gutter={16}>
            <Col>
              <Progress
                type="circle"
                percent={70}
                size={50}
                strokeColor="#52c41a"
              />
            </Col>
            <Col>
              <div style={{ fontSize: 14, color: "#666" }}>CPU总数: 128核</div>
              <div style={{ fontSize: 12, color: "#999" }}>剩余可用: 100核</div>
            </Col>
          </Row>
        </Col>
        <Col span={6} style={{ borderRight: "1px solid #f0f0f0" }}>
          <Row align="middle" gutter={16}>
            <Col>
              <Progress
                type="circle"
                percent={30}
                size={50}
                strokeColor="#ff4d4f"
              />
            </Col>
            <Col>
              <div style={{ fontSize: 14, color: "#666" }}>内存总数: 256GB</div>
              <div style={{ fontSize: 12, color: "#999" }}>剩余可用: 27GB</div>
            </Col>
          </Row>
        </Col>
        <Col span={6}>
          <Row align="middle" gutter={16}>
            <Col>
              <Progress
                type="circle"
                percent={10}
                size={50}
                strokeColor="#52c41a"
              />
            </Col>
            <Col>
              <div style={{ fontSize: 14, color: "#666" }}>GPU总数: 30张</div>
              <div style={{ fontSize: 12, color: "#999" }}>剩余可用: 10张</div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default StatisticsCards;
