const { spawnSync } = require("node:child_process");
const { writeFileSync, rmSync } = require("node:fs");
exports.verify = function verify(code) {
  // console.log(code);
  // console.log("-----------")
  const file = `${__dirname}/play/code.ts`;
  writeFileSync(file, code);
  try {
    const result = spawnSync(`npx tsc --noEmit`, {
      cwd: `${__dirname}/play`,
      shell: true,
      encoding: "utf-8",
      timeout: 10_000,
    });
    // console.log(result)
    return {
      exitCode: result.status,
      stdout: result.stdout,
      stderr: result.stderr,
      error: result.error,
    };
  } finally {
    rmSync(file);
  }
};
