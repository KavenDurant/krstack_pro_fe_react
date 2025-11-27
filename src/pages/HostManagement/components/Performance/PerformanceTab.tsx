import React, { useMemo } from "react";
import PerformanceChart from "./PerformanceChart";

const PerformanceTab: React.FC = () => {
  const mock = useMemo(
    () => ({
      cpu: [12, 25, 18, 32, 28, 44, 36, 30, 26, 20, 22, 18],
      mem: [62, 63, 64, 66, 65, 67, 68, 69, 70, 68, 67, 66],
      netRx: [20, 25, 40, 30, 35, 28, 50, 45, 40, 42, 38, 36],
      netTx: [15, 18, 22, 20, 25, 30, 28, 32, 30, 28, 26, 24],
      diskRead: [120, 140, 110, 150, 130, 160, 155, 145, 135, 125, 115, 105],
      diskWrite: [80, 90, 85, 100, 95, 105, 110, 100, 90, 85, 80, 75],
      times: [
        "12:00",
        "12:05",
        "12:10",
        "12:15",
        "12:20",
        "12:25",
        "12:30",
        "12:35",
        "12:40",
        "12:45",
        "12:50",
        "12:55",
      ],
    }),
    []
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 0, overflow: "auto" }}>
      <PerformanceChart
        title="CPU 使用率"
        unit="%"
        series={[{ name: "CPU", color: "#52c41a", data: mock.cpu }]}
        times={mock.times}
      />
      <PerformanceChart
        title="内存使用情况"
        unit="%"
        series={[{ name: "内存", color: "#1890ff", data: mock.mem }]}
        times={mock.times}
      />
      <PerformanceChart
        title="网络使用情况"
        unit="Mbps"
        series={[
          { name: "接收", color: "#13c2c2", data: mock.netRx },
          { name: "发送", color: "#faad14", data: mock.netTx },
        ]}
        times={mock.times}
      />
      <PerformanceChart
        title="磁盘使用情况"
        unit="MB/s"
        series={[
          { name: "读取", color: "#722ed1", data: mock.diskRead },
          { name: "写入", color: "#f5222d", data: mock.diskWrite },
        ]}
        times={mock.times}
      />
    </div>
  );
};

export default PerformanceTab;
