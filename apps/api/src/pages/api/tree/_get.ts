import {
  NextApiRequestExtension,
  NextApiResponseExtension,
} from "@/lib/types/privateMiddleware";
import { DataSource } from "@floe/db";
import { capitalize, getRepositoryContent } from "@floe/utils";
import { defaultResponder } from "@/lib/helpers/defaultResponder";

type PageOptions = {
  [key: string]: {
    title: string;
  };
};

type Pages = (
  | string
  | {
      title: string;
      pages: Pages;
    }
)[];

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
  console.log(99999, !section, !section.stack);

  if (!section) {
    return res.status(404).json({
      error: {
        message: "Section not found",
      },
    });
  }

  if (!section.stack) {
    return res.status(400).json({
      error: {
        message: "Section must contain a stack",
      },
    });
  }

  const pages = section.map;

  return { data: fillPages(pages, content.pageOptions) };
}

export default defaultResponder(handler);

const fillPages = (pages: Pages, pageOptions: PageOptions): any[] => {
  return pages.map((page) => {
    if (typeof page === "string") {
      return {
        title: transformTitle(page, pageOptions),
        page,
      };
    }

    return {
      title: page.title,
      pages: fillPages(page.pages, pageOptions),
    };
  });
};

const transformTitle = (path: string, pageOptions: PageOptions) => {
  if (pageOptions[path]) {
    return pageOptions[path].title;
  }

  const splitPath = path.split("/");
  return capitalize(splitPath[splitPath.length - 1]);
};
