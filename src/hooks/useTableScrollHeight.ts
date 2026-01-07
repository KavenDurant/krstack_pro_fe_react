import { useMemo } from "react";

interface UseTableScrollHeightOptions {
  pageSize: number;
  extraOffset?: number;
}

/**
 * 动态计算 Table 的 scroll.y 值
 * @param pageSize - 每页显示条数
 * @param extraOffset - 额外空间偏移量（默认 150）
 * @returns 当数据量少时返回 undefined，否则返回计算的最大高度
 */
export function useTableScrollHeight({
  pageSize,
  extraOffset = 150,
}: UseTableScrollHeightOptions) {
  return useMemo(() => {
    const rowHeight = 54; // 单行高度
    const toolbarHeight = 60; // 顶部工具栏高度
    const paginationHeight = 64; // 分页器高度
    const wrapperPadding = 24; // 容器内边距
    const extraSpace = 20; // 额外空间

    // 内容区域最大可用高度
    const maxContentHeight =
      window.innerHeight -
      toolbarHeight -
      paginationHeight -
      wrapperPadding -
      extraSpace -
      extraOffset;

    // 当前页数据需要的表格体高度
    const neededHeight = rowHeight * pageSize;

    // 如果所需高度小于最大可用高度，不需要滚动条
    if (neededHeight < maxContentHeight) {
      return undefined;
    }

    return maxContentHeight;
  }, [pageSize, extraOffset]);
}
