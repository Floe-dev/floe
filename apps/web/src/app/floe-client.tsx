import { FloeClient } from "@floe/next";
import { Image } from "@/components/Image";
import { Callout } from "@/components/Callout";
import { CodeBlock } from "@/components/CodeBlock";

export const getFloeClient = (slug: string) =>
  FloeClient(slug, {
    components: {
      Image,
      Callout,
      CodeBlock,
    },
  });
