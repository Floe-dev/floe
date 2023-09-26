import {
  NextApiRequestExtension,
  NextApiResponseExtension,
} from "@/lib/types/privateMiddleware";
import { filenameToSlug, getFileTree } from "@floe/utils";
import { defaultResponder } from "@/lib/helpers/defaultResponder";
import { DataSource } from "@floe/db";

type TreeFiles = {
  file: string;
  datasourceId: string;
};

async function handler(
  { query, project, octokit }: NextApiRequestExtension,
  res: NextApiResponseExtension
) {
  const { path, datasourceSlug } = query as {
    path?: string;
    datasourceSlug?: string;
  };

  if (!path) {
    return res.status(400).json({
      error: {
        message: "path parameter is required",
      },
    });
  }

  if (!datasourceSlug) {
    return res.status(400).json({
      error: {
        message: "datasourceSlug parameter is required",
      },
    });
  }

  const datasource = project.datasources.find(
    (d) => d.slug === datasourceSlug
  ) as DataSource;

  let contents: TreeFiles[];

  try {
    const files = await getFileTree(octokit, {
      owner: datasource.owner,
      repo: datasource.repo,
      ref: datasource.baseBranch,
      rules: [`.floe/${path}/**/*.md`],
    });

    contents = files.map((file) => ({
      file: file.split("/").slice(1).join("/"),
      datasourceId: datasource.id,
    }));
  } catch (e: any) {
    return res.status(400).json({
      error: e.message,
    });
  }

  const fileTree = buildFileTree(contents);

  return { data: fileTree };
}

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
            slug: filenameToSlug(treeFile.file),
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
