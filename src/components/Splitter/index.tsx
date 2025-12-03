import React from "react";
import { Splitter as AntdSplitter } from "antd";

export interface SplitterPanelItem {
  key: string;
  children: React.ReactNode;
  size?: string | number;
  min?: string | number;
  max?: string | number;
}

export interface SplitterProps {
  panels: SplitterPanelItem[];
  style?: React.CSSProperties;
  className?: string;
}

const Splitter: React.FC<SplitterProps> = ({ panels, style, className }) => (
  <AntdSplitter
    style={{
      height: "100%",
      background: "#fff",
      ...style,
    }}
    className={className}
  >
    {panels.map((panel, index) => (
      <AntdSplitter.Panel
        key={panel.key}
        defaultSize={panel.size ?? (index === 0 ? 200 : undefined)}
        min={panel.min ?? (index === 0 ? 200 : undefined)}
        max={panel.max ?? (index === 0 ? 750 : undefined)}
      >
        <div style={{ height: "100%", padding: 0 }}>{panel.children}</div>
      </AntdSplitter.Panel>
    ))}
  </AntdSplitter>
);

export default Splitter;
