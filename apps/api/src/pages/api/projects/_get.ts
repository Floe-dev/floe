import { NextApiRequestExtension } from "@/lib/types/privateMiddleware";
import { defaultResponder } from "@/lib/helpers/defaultResponder";
import { getRepositoryContent } from "@floe/utils";

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
      return {
        id: datasource.id,
        branch: datasource.baseBranch,
        owner: datasource.owner,
        repo: datasource.repo,
        name: datasource.name,
        slug: datasource.slug,
      };
    })
  );

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
