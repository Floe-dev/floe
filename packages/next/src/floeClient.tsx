import { Options, FloeClientFactory } from "@floe/server";

export const FloeClient = (projectSlug: string, options?: Options) => {
  const apiKeySecret = process.env.FLOE_API_KEY_SECRET!;

  if (!projectSlug) {
    throw new Error(
      "FloeProvider: NEXT_PUBLIC_FLOE_SLUG is not defined in .env.local"
    );
  }

  if (!apiKeySecret) {
    throw new Error(
      "FloeProvider: FLOE_API_KEY_SECRET is not defined in .env.local"
    );
  }

  return new FloeClientFactory(
    // AUTH
    {
      projectSlug,
      apiKeySecret,
    },

    // OPTION DEFAULTS
    {
      ...options,
      components: {
        ...options?.components,
        // TODO: De-couple Image component below from Tailwind
        // Image:
        //   options?.components?.Image ??
        //   (({
        //     src,
        //     alt,
        //     caption,
        //   }: {
        //     src: string;
        //     alt?: string;
        //     caption?: string;
        //   }) => (
        //     <div className="relative m-0 mt-2">
        //       <Image
        //         src={src}
        //         alt={alt ?? ""}
        //         width="0"
        //         height="0"
        //         sizes="100vw"
        //         className="w-auto h-auto mx-auto rounded-xl"
        //       />
        //       <p className="text-center text-gray-500">{caption}</p>
        //     </div>
        //   )),
      },
    }
  );
};
