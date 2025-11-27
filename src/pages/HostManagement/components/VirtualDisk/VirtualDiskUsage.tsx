import React from "react";
import { Progress } from "antd";

interface VirtualDiskUsageProps {
  usedGB: number;
  totalGB: number;
}

const formatGB = (value: number) => `${value.toFixed(2)}GB`;

const VirtualDiskUsage: React.FC<VirtualDiskUsageProps> = ({ usedGB, totalGB }) => {
  const percent = totalGB === 0 ? 0 : Math.min(100, Math.round((usedGB / totalGB) * 100));
  const remain = Math.max(totalGB - usedGB, 0);
  const status = percent >= 80 ? "exception" : "success";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", color: "#555" }}>
        <span>{`${formatGB(usedGB)}/${formatGB(totalGB)}`}</span>
        <span style={{ color: "#999" }}>剩余: {formatGB(remain)}</span>
      </div>
      <Progress percent={percent} status={status} showInfo={false} strokeWidth={10} />
    </div>
  );
};

export default VirtualDiskUsage;
