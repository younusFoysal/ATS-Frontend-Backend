import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["jquery", "datatables.net", "datatables.net-dt"],
  },
  resolve: {
    alias: {
      $: "jquery",
      jquery: "jquery",
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  //   worker: { format: "es" },
  //   assetsInclude: ["**/*.worker.js"],
  //   server: {
  // fs: {
  //   allow: [".."], // Allow serving files from parent directories
  // },
  //   },
});
