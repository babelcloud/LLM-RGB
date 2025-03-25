const { spawnSync } = require("node:child_process");
const { writeFileSync, rmSync } = require("node:fs");
exports.verify = function verify(code, action = "compile") {
  // console.log(code);
  // console.log("-----------")
  const random = Math.random().toString(36).substring(2, 15);
  const file = `${__dirname}/play/code_${random}.ts`;
  writeFileSync(file, code);
  let command = `npx tsc --noEmit`;
  if (action == "run"){
    command = `npx ts-node ${file}`;
  }
  try {
    const result = spawnSync(command, {
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
