import fs from "node:fs";

export const checkIfValidRoot = (ignoreFloeDir = false) => {
  const gitDir = fs.existsSync(".git");
  const floeDir = fs.existsSync(".floe");

  if (!gitDir) {
    console.log("Floe commands must be run from the root of a git repository.");
    process.exit(0);
  }

  if (!floeDir && !ignoreFloeDir) {
    console.log(
      "No .floe directory found. Are you sure you have initialized Floe?"
    );
    process.exit(0);
  }
};
