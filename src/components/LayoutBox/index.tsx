/*
 * @Author: KavenDurant luojiaxin888@gmail.com
 * @Date: 2025-12-03 11:26:42
 * @LastEditors: KavenDurant luojiaxin888@gmail.com
 * @LastEditTime: 2025-12-03 11:26:52
 * @FilePath: /krstack_pro_fe_react/src/components/LayoutBox/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from "react";

export interface LayoutBoxProps {
  direction?: "row" | "column";
  gap?: number;
  justify?: React.CSSProperties["justifyContent"];
  align?: React.CSSProperties["alignItems"];
  padding?: number | string | (number | string)[];
  childWidth?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const LayoutBox: React.FC<LayoutBoxProps> = ({
  direction = "column",
  gap = 0,
  justify = "flex-start",
  align = "flex-start",
  padding = 0,
  childWidth = "100%",
  className,
  style,
  children,
}) => {
  const getSpacingValue = (
    value: number | string | (number | string)[] | undefined
  ): string | undefined => {
    if (value === undefined) return undefined;
    if (typeof value === "number") return `${value}px`;
    if (typeof value === "string") return value;
    if (Array.isArray(value)) {
      return value.map(v => (typeof v === "number" ? `${v}px` : v)).join(" ");
    }
    return undefined;
  };

  const customStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: direction === "row" ? "row" : "column",
    gap: gap,
    justifyContent: justify,
    alignItems: align,
    padding: getSpacingValue(padding),
    width: "100%",
    flex: 1,
    ...style,
  };

  interface ChildProps {
    style?: React.CSSProperties;
  }

  const renderChildren = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      const childStyle: React.CSSProperties = {
        ...(child.props as ChildProps).style,
      };
      if (childWidth !== "auto") {
        childStyle.width = childWidth;
      }
      return React.cloneElement(child as React.ReactElement<ChildProps>, {
        style: childStyle,
      });
    }
    return child;
  });

  return (
    <div className={className} style={customStyle}>
      {renderChildren}
    </div>
  );
};

export default LayoutBox;
