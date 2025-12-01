import React, { useMemo } from "react";
import { Tree } from "antd";
import {
  PlusSquareOutlined,
  MinusSquareOutlined,
  FolderOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import type { DataNode, EventDataNode } from "antd/es/tree";

export type UserGroupSelection =
  | { type: "all" }
  | { type: "group"; groupId: string; groupName: string };

interface UserGroupTreeProps {
  onSelectNode: (info: UserGroupSelection) => void;
  selectedKey?: React.Key;
}

const UserGroupTree: React.FC<UserGroupTreeProps> = ({
  onSelectNode,
  selectedKey,
}) => {
  const treeData = useMemo(() => {
    const groupNodes: DataNode[] = [
      {
        title: "用户组1",
        key: "group-1",
        icon: <FolderOutlined />,
        nodeType: "group",
        groupId: "1",
        groupName: "用户组1",
      },
      {
        title: "用户组2",
        key: "group-2",
        icon: <FolderOutlined />,
        nodeType: "group",
        groupId: "2",
        groupName: "用户组2",
      },
    ];

    return [
      {
        title: "全部用户",
        key: "all",
        icon: <TeamOutlined />,
        nodeType: "all",
        children: groupNodes,
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
    if (node.nodeType === "group") {
      onSelectNode({
        type: "group",
        groupId: node.groupId,
        groupName: node.groupName,
      });
    } else {
      onSelectNode({ type: "all" });
    }
  };

  return (
    <div
      className="user-group-tree-custom"
      style={{
        background: "#fff",
        padding: 12,
        height: "100%",
        borderRight: "1px solid #f0f0f0",
      }}
    >
      <style>
        {`
          .user-group-tree-custom .ant-tree-switcher {
            width: 18px !important;
          }
          .user-group-tree-custom .ant-tree-switcher .anticon {
            font-size: 10px !important;
          }
          .user-group-tree-custom .ant-tree-node-content-wrapper {
            padding-left: 0 !important;
          }
          .user-group-tree-custom .ant-tree-indent-unit {
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

export default UserGroupTree;
