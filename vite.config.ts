/*
 * @Author: KavenDurant luojiaxin888@gmail.com
 * @Date: 2025-11-26 08:50:37
 * @LastEditors: KavenDurant luojiaxin888@gmail.com
 * @LastEditTime: 2025-12-01 14:23:50
 * @FilePath: /krstack_pro_fe_react/vite.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // allow access via local network IP
    port: 5173,
  },
  preview: {
    host: "0.0.0.0",
    port: 4173,
  },
});
