/**
 * Design Tokens - 统一的设计系统变量
 * 用于保持整个应用的视觉一致性
 */

export const tokens = {
  // 颜色系统
  colors: {
    primary: "#1890ff",
    success: "#52c41a",
    warning: "#faad14",
    error: "#ff4d4f",
    info: "#1890ff",

    // 文本颜色
    text: {
      primary: "#000000d9",
      secondary: "#00000073",
      tertiary: "#00000045",
      disabled: "#00000040",
    },

    // 背景颜色
    background: {
      page: "#f0f2f5",
      container: "#ffffff",
      hover: "#fafafa",
      disabled: "#f5f5f5",
    },

    // 边框颜色
    border: {
      base: "#d9d9d9",
      light: "#f0f0f0",
      split: "#f0f0f0",
    },
  },

  // 间距系统 (8px 基准)
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },

  // 字体系统
  typography: {
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.8,
    },
  },

  // 圆角
  borderRadius: {
    sm: 2,
    md: 4,
    lg: 8,
    xl: 12,
  },

  // 阴影
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)",
    md: "0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09)",
    lg: "0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)",
  },

  // 布局尺寸
  layout: {
    headerHeight: 48,
    siderWidth: {
      collapsed: 80,
      expanded: 200,
    },
    contentPadding: 12,
    cardPadding: 16,
  },

  // 组件尺寸
  components: {
    input: {
      width: {
        sm: 200,
        md: 240,
        lg: 300,
      },
    },
    button: {
      height: {
        sm: 24,
        md: 32,
        lg: 40,
      },
    },
  },

  // 动画
  animation: {
    duration: {
      fast: 100,
      normal: 200,
      slow: 300,
    },
    easing: {
      easeInOut: "cubic-bezier(0.645, 0.045, 0.355, 1)",
      easeOut: "cubic-bezier(0.215, 0.61, 0.355, 1)",
      easeIn: "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
    },
  },
} as const;

// 类型导出
export type Tokens = typeof tokens;
export type ColorToken = keyof typeof tokens.colors;
export type SpacingToken = keyof typeof tokens.spacing;
