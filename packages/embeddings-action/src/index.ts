import { getInput, setOutput, setFailed } from "@actions/core";
import { context } from "@actions/github";
import { walk } from "./utils/walk";

async function generateEmbeddings({ docsRootPath }: { docsRootPath: string }) {
  console.log(1111, docsRootPath);
}

async function run(): Promise<void> {
  const docsRootPath: string = getInput("docs-root-path");

  try {
    await generateEmbeddings({
      docsRootPath,
    });
  } catch (error) {
    if (error instanceof Error) setFailed(error.message);
  }
}

run();
