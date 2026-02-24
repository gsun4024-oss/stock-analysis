/**
 * GitHub Pages 专用 Vite 构建配置
 * 使用方式：pnpm run build:github
 * 注意：GitHub Pages 部署时需要设置正确的 base 路径
 * 如果仓库名为 stock-analysis，则 base 为 /stock-analysis/
 * 如果使用自定义域名或 username.github.io，则 base 为 /
 */

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

// 修改此处为你的 GitHub 仓库名（如果使用 username.github.io 则改为 "/"）
const REPO_NAME = "stock-analysis";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
    },
  },
  // GitHub Pages 需要设置 base 路径
  base: `/${REPO_NAME}/`,
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist-github"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          charts: ["lightweight-charts"],
          motion: ["framer-motion"],
        },
      },
    },
  },
  define: {
    // 在 GitHub Pages 构建时注入空的 API 密钥（数据通过公共 API 获取）
    "import.meta.env.VITE_FRONTEND_FORGE_API_KEY": JSON.stringify(process.env.VITE_FRONTEND_FORGE_API_KEY || ""),
    "import.meta.env.VITE_FRONTEND_FORGE_API_URL": JSON.stringify(process.env.VITE_FRONTEND_FORGE_API_URL || ""),
  },
});
