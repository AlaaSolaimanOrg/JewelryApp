import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ""); 

  return {
    plugins: [react()],
    base: env.VITE_ROUTE_PREFIX || "/",
    server: {
      port: 5173,
      // Proxy DYMO Connect service requests in development
      // This prevents CORS errors by routing through the dev server
      proxy: {
        "/DYMO": {
          target: "http://127.0.0.1:41951",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path, // Keep the original path
        },
      },
    },
    define: {
      // Expose the environment to the app
      __DYMO_PROXY_ENABLED__: mode === 'development',
    },
  };
});
