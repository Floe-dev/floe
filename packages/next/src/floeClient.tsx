import Image from "next/image";
import { Options, FloeClientFactory } from "@floe/server";

export const FloeClient = (options?: Options) => {
  const apiKeyId = process.env.NEXT_PUBLIC_FLOE_API_KEY_ID!;
  const apiKeySecret = process.env.FLOE_API_KEY_SECRET!;

  if (!apiKeyId) {
    throw new Error(
      "FloeProvider: NEXT_PUBLIC_FLOE_API_KEY_ID is not defined in .env.local"
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
      apiKeyId,
      apiKeySecret,
    },

    // OPTION DEFAULTS
    {
      ...options,
      components: {
        ...options?.components,
        Image: options?.components?.Image ?? (({ src, alt }: { src: string; alt?: string }) => (
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
