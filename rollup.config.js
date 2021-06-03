import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/index.ts",
  output: {
    file: "dist/videojs-plugin-audio-switch.js",
    format: "umd",
    globals: {
      "video.js": "videojs",
    },
    sourcemap: true,
  },
  plugins: [typescript()],
  external: ["video.js"],
};
