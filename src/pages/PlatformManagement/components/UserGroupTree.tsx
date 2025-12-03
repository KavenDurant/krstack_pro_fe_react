import React from "react";
import { Tree } from "antd";
import type { TreeDataNode, TreeProps } from "antd";

const styles = `
  .ant-tree-node-content-wrapper {
    padding-inline: 0px !important;
  }
`;

export interface UserGroupTreeProps {
  treeData: TreeDataNode[];
  onSelect?: TreeProps["onSelect"];
  defaultExpandedKeys?: React.Key[];
  showLine?: boolean;
  showIcon?: boolean;
  showLeafIcon?: React.ReactNode;
}

const UserGroupTree: React.FC<UserGroupTreeProps> = ({
  treeData,
  onSelect,
  defaultExpandedKeys = [],
  showLine = true,
  showIcon = true,
  showLeafIcon = false,
}) => {
  const handleSelect: TreeProps["onSelect"] = (selectedKeys, info) => {
    onSelect?.(selectedKeys, info);
  };

  return (
    <>
      <style>{styles}</style>
      <div style={{ padding: "0 16px", height: "100%" }}>
        <Tree
          showLine={showLine ? { showLeafIcon } : false}
          showIcon={showIcon}
          defaultExpandedKeys={defaultExpandedKeys}
          onSelect={handleSelect}
          treeData={treeData}
          style={{ paddingInline: "0px" }}
        />
      </div>
    </>
  );
};

export default UserGroupTree;
