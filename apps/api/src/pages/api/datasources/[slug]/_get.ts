import {
  NextApiRequestExtension,
  NextApiResponseExtension,
} from "@/lib/types/privateMiddleware";
import prisma from "@floe/db";
import { getRepositoryContent } from "@floe/utils";
import { defaultResponder } from "@/lib/helpers/defaultResponder";

async function handler(
  { query, project, octokit }: NextApiRequestExtension,
  res: NextApiResponseExtension
) {
  const { slug } = query as {
    slug?: string;
  };

  if (!slug) {
    return res.status(400).json({
      error: {
        message: "slug parameter is required",
      },
    });
  }

  const datasource = await prisma.dataSource.findUnique({
    where: {
      projectId_slug: {
        projectId: project.id,
        slug,
      },
    },
  });

  if (!datasource) {
    return res.status(400).json({
      error: {
        message: "datasource not found",
      },
    });
  }

  const response = await getRepositoryContent(octokit, {
    owner: datasource.owner,
    repo: datasource.repo,
    path: `.floe/config.json`,
    ref: datasource.baseBranch,
  });

  const content = JSON.parse(response);

  return {
    data: {
      sections: content.sections,
      id: datasource.id,
      branch: datasource.baseBranch,
      owner: datasource.owner,
      repo: datasource.repo,
      name: datasource.name,
      slug: datasource.slug,
    },
  };
}

export default defaultResponder(handler);
