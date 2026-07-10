import path from "node:path";
import { fileURLToPath } from "node:url";
import netlify from "@netlify/vite-plugin-tanstack-start";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ isSsrBuild }) => ({
  envPrefix: ["VITE_"],
  plugins: [
    tanstackStart({
      server: { entry: "server" },
    }),
    netlify(),
    tailwindcss(),
    viteReact(),
    tsConfigPaths(),
  ],
  resolve: {
    alias: isSsrBuild
      ? {
          gsap: path.resolve(rootDir, "src/lib/gsap-stub.ts"),
          "gsap/ScrollTrigger": path.resolve(rootDir, "src/lib/gsap-stub.ts"),
          lenis: path.resolve(rootDir, "src/lib/lenis-stub.ts"),
        }
      : undefined,
    dedupe: ["react", "react-dom", "@tanstack/react-router", "@tanstack/react-start"],
  },
}));
