import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

// Demo build only (`npm run build:demo`, served from /simmer-demo/ on the
// portfolio site): drop the manifest and home-screen tags so the demo can't
// be installed as an app, and keep it out of search results.
function demoHtml(): Plugin {
  return {
    name: "demo-html",
    transformIndexHtml(html) {
      return html
        .replace(/\s*<link rel="manifest"[^>]*>/g, "")
        .replace(/\s*<meta name="(apple-)?mobile-web-app-[^"]*"[^>]*>/g, "")
        .replace(/<title>/, '<meta name="robots" content="noindex" />\n    <title>');
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), ...(mode === "demo" ? [demoHtml()] : [])],
  server: {
    host: true,
    port: 5173,
    allowedHosts: true,
    proxy: {
      "/api": {
        target: "http://backend:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
}));