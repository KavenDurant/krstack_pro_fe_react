import React, { useMemo } from "react";
import BackupTable from "./BackupTable";
import type { BackupItem } from "./BackupTypes";

const BackupTab: React.FC = () => {
  const data: BackupItem[] = useMemo(
    () => [
      {
        key: "1",
        name: "vzdump-qemu-101-2025_04_07-15_36_43.vma.zst",
        format: "zst",
        location: "cluster237/data112",
        backupTime: "2025-04-07 15:36:43",
        note: "Table cell text",
      },
      {
        key: "2",
        name: "vzdump-qemu-101-2025_04_07-15_36_44.vma.zst",
        format: "zst",
        location: "cluster237/data112",
        backupTime: "2025-04-07 15:36:43",
        note: "Table cell text",
      },
    ],
    []
  );

  return (
    <div>
      <BackupTable
        data={data}
        onCreate={() => {}}
        onRefresh={() => {}}
        onSettings={() => {}}
      />
    </div>
  );
};

export default BackupTab;
