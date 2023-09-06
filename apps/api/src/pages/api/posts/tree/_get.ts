import {
  NextApiRequestExtension,
  NextApiResponseExtension,
} from "@/lib/types/privateMiddleware";
import { getFileTree } from "@floe/utils";
import { defaultResponder } from "@/lib/helpers/defaultResponder";

type TreeFiles = {
  file: string;
  datasourceId: string;
};

async function handler(
  { query, project, octokit }: NextApiRequestExtension,
  res: NextApiResponseExtension
) {
  const { path } = query as { path?: string };

  if (!path) {
    return res.status(400).json({
      error: {
        message: "path parameter is required",
      },
    });
  }

  const contents = Promise.all(
    project.datasources.map(async (datasource) => {
      try {
        const files = await getFileTree(octokit, {
          owner: datasource.owner,
          repo: datasource.repo,
          ref: datasource.baseBranch,
          rules: [`.floe/${path}/**/*.md`],
        });

        return files.map((file) => ({
          file: file.split("/").slice(1).join("/"),
          datasourceId: datasource.id,
        }));
      } catch (e: any) {
        return res.status(400).json({
          error: e.message,
        });
      }
    })
  );

  const files = (await contents).flat() as TreeFiles[];

  const fileTree = buildFileTree(files);

  return { data: fileTree };
}

// @ts-ignore
function buildFileTree(treeFiles: TreeFiles[]) {
  return treeFiles.reduce((tree, treeFile) => {
    const fileSegments = treeFile.file.split("/");

    // recursively walk tree
    // @ts-ignore
    function deepWrite(treeSegment = {}, fileSegments) {
      if (fileSegments.length === 0) {
        return treeSegment;
      }

      const firstSegment = fileSegments.shift();

      const isNode = firstSegment.endsWith(".md");

      if (isNode) {
        return {
          ...treeSegment,
          [firstSegment]: {
            filename: treeFile.file,
            datasourceId: treeFile.datasourceId,
          },
        };
      }

      return {
        ...treeSegment,
        // @ts-ignore
        [firstSegment]: deepWrite(treeSegment[firstSegment], fileSegments),
      };
    }

    return deepWrite(tree, fileSegments);
  }, {});
}

export default defaultResponder(handler);
