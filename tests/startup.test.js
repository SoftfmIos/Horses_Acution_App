import release from "../package.json" with { type: "json" };
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";

for (const passenger of [false, true]) {
  test(`CommonJS startup serves health with ${passenger ? "Passenger socket" : "standalone TCP"}`, async (t) => {
    const child = spawn(
      process.execPath,
      [
        "-e",
        `
      const assert = require('node:assert/strict');
      const http = require('node:http');
      let configured = false;
      ${passenger ? `global.PhusionPassenger = { configure(options) { assert.equal(options.autoInstall, false); configured = true; } };` : ""}
      const listen = http.Server.prototype.listen;
      http.Server.prototype.listen = function (...args) {
        ${passenger ? `assert.ok(configured); assert.equal(args[0], 'passenger'); args[0] = 0; args.splice(1, 0, '127.0.0.1');` : ""}
        this.once('listening', () => console.log('TEST_PORT=' + this.address().port));
        return listen.apply(this, args);
      };
      require('./passenger.cjs');
    `,
      ],
      {
        cwd: new URL("..", import.meta.url),
        env: {
          ...process.env,
          NODE_ENV: "production",
          PUBLIC_ORIGIN: "https://horsesacutionapp.vercel.app",
          DATABASE_PATH: ":memory:",
          PORT: "0",
          HOST: "127.0.0.1",
        },
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
    let stderr = "";
    child.stderr.on("data", (data) => (stderr += data));
    t.after(async () => {
      if (child.exitCode === null) {
        const exit = once(child, "exit");
        child.kill("SIGTERM");
        await exit;
      }
    });
    const port = await new Promise((resolve, reject) => {
      const timeout = setTimeout(
        () => reject(new Error("Startup timeout: " + stderr)),
        15000,
      );
      let output = "";
      child.stdout.on("data", (data) => {
        output += data;
        const match = output.match(/TEST_PORT=(\d+)/);
        if (match) {
          clearTimeout(timeout);
          resolve(match[1]);
        }
      });
      child.once("exit", (code) => {
        clearTimeout(timeout);
        reject(new Error("Startup exited " + code + ": " + stderr));
      });
    });
    const response = await fetch("http://127.0.0.1:" + port + "/api/health");
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
      status: "ok",
      database: true,
      version: release.version,
      schedulingVersion: 2,
    });
    assert.ok(!stderr.includes("ERR_REQUIRE_ASYNC_MODULE"));
  });
}

test("CommonJS startup reports asynchronous import failures", async () => {
  const child = spawn(process.execPath, ["-e", "require('./passenger.cjs')"], {
    cwd: new URL("..", import.meta.url),
    env: { ...process.env, NODE_ENV: "production", PUBLIC_ORIGIN: "invalid" },
    stdio: ["ignore", "ignore", "pipe"],
  });
  let stderr = "";
  child.stderr.on("data", (data) => (stderr += data));
  const [code] = await once(child, "exit");
  assert.equal(code, 1);
  assert.match(stderr, /Academy startup failed/);
  assert.match(stderr, /PUBLIC_ORIGIN/);
});
