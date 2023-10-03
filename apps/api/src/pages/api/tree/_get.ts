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
  const { datasourceSlug } = query as {
    path?: string;
    datasourceSlug?: string;
  };

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

  return { data: content.sections };
}

export default defaultResponder(handler);
