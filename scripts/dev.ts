import type { SpawnOptions } from "bun";

const spawnOptions: SpawnOptions.OptionsObject = {
  stdin: "inherit",
  stdout: "inherit",
  stderr: "inherit",
};

const run = async () => {
  Bun.spawn(["bun", "run", "tailwind"], spawnOptions);
  Bun.spawn(["bun", "run", "start"], spawnOptions);

  process.on("SIGINT", async () => {
    console.log("Cleaning up...");
  });
};

run();
