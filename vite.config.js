import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",

      manifest: {
        name: "Rahmania Jame Masjid",
        short_name: "Rahmania",
        description: "রহমানিয়া জামে মসজিদ — কুরআন পড়ুন অনলাইন ও অফলাইনে",
        theme_color: "#075c46",
        background_color: "#f5f8f6",
        display: "standalone",
        start_url: "/",
        scope: "/",
        lang: "bn",
      },

      workbox: {
        navigateFallback: "/index.html",
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,woff,woff2}"],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
      },
    }),
  ],
});
