/*
 * @Author: KavenDurant luojiaxin888@gmail.com
 * @Date: 2025-12-03 11:27:01
 * @LastEditors: KavenDurant luojiaxin888@gmail.com
 * @LastEditTime: 2025-12-03 11:27:43
 * @FilePath: /krstack_pro_fe_react/src/components/VerticalTabs/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from "react";
import { Tabs } from "antd";
import type { TabsProps } from "antd";
import styles from "./VerticalTabs.module.css";

export interface TabItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
}

export interface VerticalTabsProps {
  items: TabItem[];
  defaultActiveKey?: string;
  activeKey?: string;
  onChange?: (key: string) => void;
  className?: string;
  style?: React.CSSProperties;
  tabBarStyle?: React.CSSProperties;
  tabWidth?: number;
}

const VerticalTabs: React.FC<VerticalTabsProps> = ({
  items,
  defaultActiveKey,
  activeKey,
  onChange,
  className,
  style,
  tabBarStyle,
  tabWidth = 160,
}) => {
  const tabItems: TabsProps["items"] = items.map(item => ({
    key: item.key,
    label: (
      <span className={styles.tabLabel}>
        {item.icon && <span className={styles.tabIcon}>{item.icon}</span>}
        <span>{item.label}</span>
      </span>
    ),
    children: item.children,
    disabled: item.disabled,
  }));

  return (
    <div className={`${styles.container} ${className ?? ""}`} style={style}>
      <Tabs
        tabPlacement="start"
        items={tabItems}
        defaultActiveKey={defaultActiveKey}
        activeKey={activeKey}
        onChange={onChange}
        className={styles.tabs}
        tabBarStyle={{
          width: tabWidth,
          ...tabBarStyle,
        }}
      />
    </div>
  );
};

export default VerticalTabs;
