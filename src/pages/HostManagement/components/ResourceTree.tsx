import React from "react";
import { Tree } from "antd";
import { DownOutlined, FolderOutlined, HddOutlined } from "@ant-design/icons";
import type { DataNode } from "antd/es/tree";

const treeData: DataNode[] = [
  {
    title: "全部云主机",
    key: "all",
    icon: <FolderOutlined />,
    children: [
      {
        title: "cluster237",
        key: "cluster237",
        icon: <FolderOutlined />,
        children: [
          {
            title: "host237",
            key: "host237",
            icon: <HddOutlined />,
          },
          {
            title: "KR-VDI",
            key: "kr-vdi",
            icon: (
              <span
                style={{
                  display: "inline-block",
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#52c41a",
                  marginRight: 4,
                }}
              ></span>
            ),
          },
          {
            title: "desktop-101",
            key: "desktop-101",
            icon: (
              <span
                style={{
                  display: "inline-block",
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#52c41a",
                  marginRight: 4,
                }}
              ></span>
            ),
          },
          {
            title: "desktop-102",
            key: "desktop-102",
            icon: (
              <span
                style={{
                  display: "inline-block",
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#faad14",
                  marginRight: 4,
                }}
              ></span>
            ),
          },
          {
            title: "desktop-103",
            key: "desktop-103",
            icon: (
              <span
                style={{
                  display: "inline-block",
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#ff4d4f",
                  marginRight: 4,
                }}
              ></span>
            ),
          },
          {
            title: "desktop-104",
            key: "desktop-104",
            icon: (
              <span
                style={{
                  display: "inline-block",
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#d9d9d9",
                  marginRight: 4,
                }}
              ></span>
            ),
          },
        ],
      },
      {
        title: "host180",
        key: "host180",
        icon: <HddOutlined />,
      },
      {
        title: "host181",
        key: "host181",
        icon: <HddOutlined />,
      },
      {
        title: "cluster223",
        key: "cluster223",
        icon: <FolderOutlined />,
      },
    ],
  },
];

const ResourceTree: React.FC = () => {
  return (
    <div
      style={{
        background: "#fff",
        padding: 12,
        height: "100%",
        borderRight: "1px solid #f0f0f0",
      }}
    >
      <Tree
        showIcon
        defaultExpandAll
        switcherIcon={<DownOutlined />}
        treeData={treeData}
      />
    </div>
  );
};

export default ResourceTree;
