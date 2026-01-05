/*
 * @Author: KavenDurant luojiaxin888@gmail.com
 * @Date: 2025-12-11 15:57:50
 * @LastEditors: KavenDurant luojiaxin888@gmail.com
 * @LastEditTime: 2026-01-05 13:30:16
 * @FilePath: /krstack_pro_fe_react/src/components/ResizableTreePanel/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from "react";
import { Tree } from "antd";
import type { DataNode, AntTreeNodeProps, TreeProps } from "antd/es/tree";
import { PlusSquareOutlined, MinusSquareOutlined } from "@ant-design/icons";
import Splitter from "../Splitter";

interface ResizableTreePanelProps<T extends DataNode = DataNode> {
  treeData: T[];
  selectedKey?: React.Key;
  onSelect: TreeProps<T>["onSelect"];
  children: React.ReactNode;
  treeWidth?: number;
  treeMinWidth?: number;
  treeMaxWidth?: number;
  // Tree 配置选项
  showIcon?: boolean;
  showLine?: TreeProps<T>["showLine"];
  defaultExpandAll?: boolean;
  defaultExpandedKeys?: React.Key[];
  // 左侧工具栏内容（可选）
  treeToolbar?: React.ReactNode;
  // 自定义 Tree 容器样式
  treeContainerStyle?: React.CSSProperties;
}

const ResizableTreePanel = <T extends DataNode = DataNode>({
  treeData,
  selectedKey,
  onSelect,
  children,
  treeWidth = 280,
  treeMinWidth = 280,
  treeMaxWidth = 350,
  showIcon = true,
  showLine = true,
  defaultExpandAll,
  defaultExpandedKeys,
  treeToolbar,
  treeContainerStyle,
}: ResizableTreePanelProps<T>) => {
  const panels = [
    {
      key: "tree",
      size: treeWidth,
      min: treeMinWidth,
      max: treeMaxWidth,
      children: (
        <div
          className="resource-tree-custom"
          style={{
            background: "#fff",
            padding: 12,
            height: "100%",
            borderRight: "1px solid #f0f0f0",
            display: "flex",
            flexDirection: "column",
            ...treeContainerStyle,
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
          {treeToolbar && <div style={{ marginBottom: 12 }}>{treeToolbar}</div>}
          <div style={{ flex: 1, overflow: "auto" }}>
            <Tree<T>
              showIcon={showIcon}
              showLine={showLine}
              defaultExpandAll={
                defaultExpandedKeys !== undefined
                  ? undefined
                  : (defaultExpandAll ?? true)
              }
              defaultExpandedKeys={defaultExpandedKeys}
              switcherIcon={(props: AntTreeNodeProps) =>
                props.expanded ? (
                  <MinusSquareOutlined />
                ) : (
                  <PlusSquareOutlined />
                )
              }
              treeData={treeData}
              onSelect={onSelect}
              selectedKeys={selectedKey ? [selectedKey] : []}
            />
          </div>
        </div>
      ),
    },
    {
      key: "content",
      children,
    },
  ];

  return <Splitter panels={panels} />;
};

export default ResizableTreePanel;
