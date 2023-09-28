import { NextApiRequestExtension } from "@/lib/types/privateMiddleware";
import { defaultResponder } from "@/lib/helpers/defaultResponder";
import { getRepositoryContent } from "@floe/utils";

async function handler({ project, octokit }: NextApiRequestExtension) {
  const {
    name,
    description,
    slug,
    logo,
    favicon,
    appearance,
    homepageURL,
    datasources,
    primary,
    primaryDark,
    background,
    backgroundDark,
    backgroundPattern,
    customBackground,
    githubURL,
    twitterURL,
    facebookURL,
    linkedinURL,
    instagramURL,
    youtubeURL,
    discordURL,
    slackURL,
    twitchURL,
  } = project;

  const datasourceFields = await Promise.all(
    datasources.map(async (datasource) => {
      const config = await getRepositoryContent(octokit, {
        owner: datasource.owner,
        repo: datasource.repo,
        path: `.floe/config.json`,
        ref: datasource.baseBranch,
      });

      return {
        id: datasource.id,
        branch: datasource.baseBranch,
        owner: datasource.owner,
        repo: datasource.repo,
        config: JSON.parse(config),
      };
    })
  );

  if (datasourceFields.some((d) => !d.config)) {
    throw new Error("A datasource does not contain a .floe/config.json file");
  }

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
      primary,
      primaryDark,
      background,
      backgroundDark,
      backgroundPattern,
      customBackground,
      githubURL,
      twitterURL,
      facebookURL,
      linkedinURL,
      instagramURL,
      youtubeURL,
      discordURL,
      slackURL,
      twitchURL,
    },
  };
}

export default defaultResponder(handler);
