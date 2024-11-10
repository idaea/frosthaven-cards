import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { imagetools } from "vite-imagetools";

import characterDataPlugin from "./rollup-plugin-character-data";

// https://vite.dev/config/
export default defineConfig({
	base: "/frosthaven-cards",
	plugins: [
		react(),
		characterDataPlugin(),
		imagetools({
			defaultDirectives: (url) => {
				if (url.pathname.endsWith("-bw-icon.png")) {
					return new URLSearchParams({
						grayscale: "true",
						format: "webp",
						h: "64",
					});
				}
				if (url.pathname.endsWith("-sticker.png")) {
					return new URLSearchParams({
						format: "webp",
						h: "64",
					});
				}
				if (url.pathname.endsWith(".png")) {
					return new URLSearchParams({
						format: "webp",
					});
				}
				return new URLSearchParams();
			},
		}),
	],
});
