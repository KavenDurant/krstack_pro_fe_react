export type SelectionInfo =
  | { type: "all" }
  | { type: "cluster"; clusterId: number; clusterName: string }
  | {
      type: "host";
      clusterId: number;
      clusterName: string;
      hostName: string;
    }
  | {
      type: "vm";
      clusterId: number;
      clusterName: string;
      hostName: string;
      vmId: string;
      vmName: string;
    };
