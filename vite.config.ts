/*
 * @Author: KavenDurant luojiaxin888@gmail.com
 * @Date: 2025-11-26 08:50:37
 * @LastEditors: KavenDurant luojiaxin888@gmail.com
 * @LastEditTime: 2025-12-17 11:40:23
 * @FilePath: /krstack_pro_fe_react/vite.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@/components": path.resolve(__dirname, "./src/components"),
        "@/pages": path.resolve(__dirname, "./src/pages"),
        "@/layouts": path.resolve(__dirname, "./src/layouts"),
        "@/api": path.resolve(__dirname, "./src/api"),
        "@/utils": path.resolve(__dirname, "./src/utils"),
        "@/hooks": path.resolve(__dirname, "./src/hooks"),
        "@/types": path.resolve(__dirname, "./src/types"),
        "@/assets": path.resolve(__dirname, "./src/assets"),
        "@/config": path.resolve(__dirname, "./src/config"),
      },
    },
    server: {
      host: "0.0.0.0",
      port: 5173,
      open: true,
      proxy: {
        "/api": {
          target: env.VITE_API_BASE_URL || "http://192.168.1.248:8000",
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ""),
          configure: proxy => {
            proxy.on("error", err => {
              console.log("proxy error", err);
            });
            proxy.on("proxyReq", (_proxyReq, req) => {
              console.log("Sending Request:", req.method, req.url);
            });
            proxy.on("proxyRes", (proxyRes, req) => {
              console.log("Received Response:", proxyRes.statusCode, req.url);
            });
          },
        },
      },
    },
    preview: {
      host: "0.0.0.0",
      port: 4173,
    },
  };
});
