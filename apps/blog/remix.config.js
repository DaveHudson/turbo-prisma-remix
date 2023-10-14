/** @type {import('@remix-run/dev').AppConfig} */
export default {
  assetsBuildDirectory: "./public/build",
  server: "./server.ts",
  ignoredRouteFiles: [".*"],
  devServerBroadcastDelay: 1000,
  // serverBuildTarget: "node-cjs",
  // serverModuleFormat: "esm"
}
