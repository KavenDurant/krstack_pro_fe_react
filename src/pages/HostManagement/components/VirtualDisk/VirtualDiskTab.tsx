import React, { useMemo } from "react";
import VirtualDiskTable from "./VirtualDiskTable";
import type { VirtualDiskItem } from "./VirtualDiskTypes";

const VirtualDiskTab: React.FC = () => {
  const disks: VirtualDiskItem[] = useMemo(
    () => [
      {
        key: "1",
        name: "101/vm-101-disk-1.raw",
        usedGB: 45,
        totalGB: 100,
        location: "cluster237/local_lvm",
        category: "系统盘",
      },
      {
        key: "2",
        name: "101/vm-101-disk-2.raw",
        usedGB: 85,
        totalGB: 100,
        location: "cluster237/local_lvm",
        category: "数据盘",
      },
    ],
    []
  );

  return (
    <div>
      <VirtualDiskTable
        data={disks}
        onCreate={() => {}}
        onRefresh={() => {}}
        onSettings={() => {}}
      />
    </div>
  );
};

export default VirtualDiskTab;
