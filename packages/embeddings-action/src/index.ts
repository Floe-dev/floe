import { getInput, setOutput, setFailed } from "@actions/core";
import { context } from "@actions/github";
import { walk } from "./utils/walk";

async function generateEmbeddings({ docsRootPath }: { docsRootPath: string }) {
  const embeddingSources = (await walk(docsRootPath)).filter(({ path }) =>
    /\.(md|mdx|mdoc)$/i.test(path)
  );

  console.log(333333, embeddingSources);
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
