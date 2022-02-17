/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  server: "./server.ts",
  ignoredRouteFiles: [".*"],
  devServerBroadcastDelay: 1000,
  serverBuildTarget: "node-cjs"
}
