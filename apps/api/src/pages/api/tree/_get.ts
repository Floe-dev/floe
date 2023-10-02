import {
  NextApiRequestExtension,
  NextApiResponseExtension,
} from "@/lib/types/privateMiddleware";
import { DataSource } from "@floe/db";
import { getRepositoryContent } from "@floe/utils";
import { defaultResponder } from "@/lib/helpers/defaultResponder";

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

  const response = await getRepositoryContent(octokit, {
    owner: datasource.owner,
    repo: datasource.repo,
    path: `.floe/config.json`,
    ref: datasource.baseBranch,
  });

  const content = JSON.parse(response);

  const section = content.sections.find((s: any) => s.url === path);

  const pages = section.pages;

  return { data: pages };
}

export default defaultResponder(handler);
