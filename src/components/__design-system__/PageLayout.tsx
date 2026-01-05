import { type ReactNode } from "react";
import { Layout } from "antd";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import { tokens } from "@/styles/tokens";

const { Content } = Layout;

interface PageLayoutProps {
  children: ReactNode;
  breadcrumbItems?: { title: string }[];
  showBreadcrumb?: boolean;
  contentPadding?: number;
  background?: string;
}

/**
 * 统一的页面布局组件
 * 提供标准的页面结构：面包屑 + 内容区域
 */
const PageLayout = ({
  children,
  breadcrumbItems,
  showBreadcrumb = true,
  contentPadding = tokens.layout.contentPadding,
  background = tokens.colors.background.page,
}: PageLayoutProps) => {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background,
      }}
    >
      {showBreadcrumb && <PageBreadcrumb customItems={breadcrumbItems} />}
      <Content
        style={{
          padding: contentPadding,
          overflow: "auto",
          flex: 1,
        }}
      >
        {children}
      </Content>
    </div>
  );
};

export default PageLayout;
