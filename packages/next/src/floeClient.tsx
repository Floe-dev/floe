import Image from "next/image";
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
        Image:
          options?.components?.Image ??
          (({ src, alt }: { src: string; alt?: string }) => (
            <div className="relative w-full h-56 m-0 mt-2 overflow-hidden md:h-96 rounded-xl">
              <Image
                fill
                src={src}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 55vw"
                alt={alt ?? ""}
                className="object-cover m-0"
              />
            </div>
          )),
      },
    }
  );
};
