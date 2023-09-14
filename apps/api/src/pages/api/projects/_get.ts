import { NextApiRequestExtension } from "@/lib/types/privateMiddleware";
import { defaultResponder } from "@/lib/helpers/defaultResponder";

async function handler({ project }: NextApiRequestExtension) {
  const {
    name,
    description,
    slug,
    logo,
    favicon,
    appearance,
    homepageURL,
    datasources,
  } = project;

  const datasourceFields = datasources.map((datasource) => ({
    id: datasource.id,
    branch: datasource.baseBranch,
    owner: datasource.owner,
    repo: datasource.repo,
  }));

  return {
    data: {
      name,
      description,
      slug,
      logo,
      favicon,
      appearance,
      homepageURL,
      datasources: datasourceFields,
    },
  };
}

export default defaultResponder(handler);
