import React, { useMemo } from "react";
import { Tree } from "antd";
import {
  PlusSquareOutlined,
  MinusSquareOutlined,
  FolderOutlined,
  HddOutlined,
} from "@ant-design/icons";
import type { DataNode, EventDataNode } from "antd/es/tree";
import { mockVMData } from "../../../api/mockData";

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

interface ResourceTreeProps {
  onSelectNode: (info: SelectionInfo) => void;
  selectedKey?: React.Key;
}

const statusColor: Record<string, string> = {
  running: "#52c41a",
  stopped: "#d9d9d9",
  offline: "#bfbfbf",
  backup: "#faad14",
  starting: "#1890ff",
  restarting: "#1890ff",
  migrating: "#1890ff",
  unknown: "#faad14",
};

const dot = (color: string) => (
  <span
    style={{
      display: "inline-block",
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: color,
      marginRight: 4,
    }}
  />
);

const ResourceTree: React.FC<ResourceTreeProps> = ({
  onSelectNode,
  selectedKey,
}) => {
  const treeData = useMemo(() => {
    const { ancestor_trees, vms } = mockVMData;

    const clusterNodes: DataNode[] = ancestor_trees.map(cluster => {
      const clusterKey = `cluster-${cluster.value}`;
      const hostNodes: DataNode[] =
        cluster.children?.map(host => {
          const hostKey = `host-${cluster.value}-${host.label}`;
          const vmNodes: DataNode[] = vms
            .filter(
              vm =>
                vm.cluster_id === cluster.value && vm.node_name === host.label
            )
            .map(vm => {
              const vmKey = `vm-${vm.id}`;
              const color = statusColor[vm.status] || statusColor.unknown;
              return {
                title: vm.name,
                key: vmKey,
                icon: dot(color),
                nodeType: "vm",
                clusterId: vm.cluster_id,
                clusterName: vm.cluster_name,
                hostName: vm.node_name,
                vmId: vm.id,
                vmName: vm.name,
              } as DataNode;
            });

          return {
            title: host.label,
            key: hostKey,
            icon: <HddOutlined />,
            nodeType: "host",
            clusterId: cluster.value as number,
            clusterName: cluster.label,
            hostName: host.label,
            children: vmNodes,
          } as DataNode;
        }) || [];

      return {
        title: cluster.label,
        key: clusterKey,
        icon: <FolderOutlined />,
        nodeType: "cluster",
        clusterId: cluster.value as number,
        clusterName: cluster.label,
        children: hostNodes,
      } as DataNode;
    });

    return [
      {
        title: "全部云主机",
        key: "all",
        icon: <FolderOutlined />,
        nodeType: "all",
        children: clusterNodes,
      },
    ];
  }, []);

  const handleSelect = (
    _: React.Key[],
    info: {
      node: EventDataNode<DataNode> & any;
    }
  ) => {
    const node = info.node as any;
    switch (node.nodeType) {
      case "cluster":
        onSelectNode({
          type: "cluster",
          clusterId: node.clusterId,
          clusterName: node.clusterName,
        });
        break;
      case "host":
        onSelectNode({
          type: "host",
          clusterId: node.clusterId,
          clusterName: node.clusterName,
          hostName: node.hostName,
        });
        break;
      case "vm":
        onSelectNode({
          type: "vm",
          clusterId: node.clusterId,
          clusterName: node.clusterName,
          hostName: node.hostName,
          vmId: node.vmId,
          vmName: node.vmName,
        });
        break;
      default:
        onSelectNode({ type: "all" });
    }
  };

  return (
    <div
      className="resource-tree-custom"
      style={{
        background: "#fff",
        padding: 12,
        height: "100%",
        borderRight: "1px solid #f0f0f0",
      }}
    >
      <style>
        {`
          .resource-tree-custom .ant-tree-switcher {
            width: 18px !important;
          }
          .resource-tree-custom .ant-tree-switcher .anticon {
            font-size: 10px !important;
          }
          .resource-tree-custom .ant-tree-node-content-wrapper {
            padding-left: 0 !important;
          }
          .resource-tree-custom .ant-tree-indent-unit {
            width: 16px !important;
          }
        `}
      </style>
      <Tree
        showIcon
        showLine
        defaultExpandAll
        switcherIcon={(props: any) => {
          if (props.expanded) {
            return <MinusSquareOutlined />;
          }
          return <PlusSquareOutlined />;
        }}
        treeData={treeData}
        onSelect={handleSelect}
        selectedKeys={selectedKey ? [selectedKey] : []}
      />
    </div>
  );
};

export default ResourceTree;
