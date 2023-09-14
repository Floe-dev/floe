import { getFloeClient } from "@/app/floe-client";
import { capitalize } from "@floe/utils";
import { Metadata } from "next";

type Props = {
  params: { subdomain: string };
};

export const generateMetadata = (page: string) => {
  return async ({ params }: Props): Promise<Metadata> => {
    // read route params
    const floeClient = getFloeClient(params.subdomain);
    const project = await floeClient.project.get();
    const title = page + " - " + capitalize(project.name);

    return {
      title,
      ...(project.favicon && {
        icon: project.favicon,
        shortcut: project.favicon,
        apple: project.favicon,
        other: {
          rel: project.favicon,
          url: project.favicon,
        },
      }),
      openGraph: {
        title,
        description: project?.description,
        images: [
          {
            url: project.logo,
            width: 800,
            height: 600,
            alt: project.name,
          },
        ],
      },
    };
  };
};
