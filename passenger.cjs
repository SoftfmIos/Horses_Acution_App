// Passenger's CommonJS loader cannot require an ES module with top-level await.
// Import the backend asynchronously and register its server explicitly.
if (global.PhusionPassenger) {
  global.PhusionPassenger.configure({ autoInstall: false });
}

import("./server/index.js").catch((error) => {
  console.error("Academy startup failed:", error);
  process.exit(1);
});
