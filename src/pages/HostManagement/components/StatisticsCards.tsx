import React from "react";
import { Row, Col, Progress, Card } from "antd";

const StatisticsCards: React.FC = () => {
  return (
    <Card
      style={{
        background:
          "linear-gradient(172deg, #FAFFE8 -13%, rgba(221, 242, 255, 0) 140%)",
        border: "none",
        width: "100%",
      }}
      styles={{ body: { padding: "12px 24px" } }}
    >
      <Row gutter={24} align="middle" wrap={false}>
        {/* 虚拟机总数 */}
        <Col
          flex="0 0 40%"
          style={{
            borderRight: "1px solid #f0f0f0",
            paddingRight: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              whiteSpace: "nowrap",
            }}
          >
            <div style={{ fontSize: 14, color: "#666" }}>
              虚拟机总数 &nbsp;<strong>100 台</strong>
            </div>
            <div
              style={{
                fontSize: 12,
                color: "#999",
                display: "flex",
                gap: 12,
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "#52c41a",
                    display: "inline-block",
                  }}
                />
                运行中 70 台
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "#d9d9d9",
                    display: "inline-block",
                  }}
                />
                已关机 20 台
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "#faad14",
                    display: "inline-block",
                  }}
                />
                未知 10 台
              </div>
            </div>
          </div>
        </Col>

        <Col flex="1">
          <Row gutter={24} align="middle" wrap={false}>
            {/* CPU */}
            <Col flex="1" style={{ borderRight: "1px solid #f0f0f0" }}>
              <Row
                align="middle"
                gutter={16}
                justify="space-between"
                wrap={false}
              >
                <Col>
                  <Progress
                    type="circle"
                    percent={70}
                    size={50}
                    strokeColor="#52c41a"
                    strokeWidth={12}
                  />
                </Col>
                <Col flex="auto">
                  <div style={{ fontSize: 14, color: "#666" }}>
                    CPU总数: 128核
                  </div>
                  <div style={{ fontSize: 12, color: "#999" }}>
                    剩余可用: 100核
                  </div>
                </Col>
              </Row>
            </Col>

            {/* 内存 */}
            <Col flex="1" style={{ borderRight: "1px solid #f0f0f0" }}>
              <Row
                align="middle"
                gutter={16}
                justify="space-between"
                wrap={false}
              >
                <Col>
                  <Progress
                    type="circle"
                    percent={30}
                    size={50}
                    strokeColor="#ff4d4f"
                    strokeWidth={12}
                  />
                </Col>
                <Col flex="auto">
                  <div style={{ fontSize: 14, color: "#666" }}>
                    内存总数: 256GB
                  </div>
                  <div style={{ fontSize: 12, color: "#999" }}>
                    剩余可用: 27GB
                  </div>
                </Col>
              </Row>
            </Col>

            {/* GPU */}
            <Col flex="1">
              <Row
                align="middle"
                gutter={16}
                justify="space-between"
                wrap={false}
              >
                <Col>
                  <Progress
                    type="circle"
                    percent={10}
                    size={50}
                    strokeColor="#52c41a"
                    strokeWidth={12}
                  />
                </Col>
                <Col flex="auto">
                  <div style={{ fontSize: 14, color: "#666" }}>
                    GPU总数: 30张
                  </div>
                  <div style={{ fontSize: 12, color: "#999" }}>
                    剩余可用: 10张
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default StatisticsCards;
