import { z } from "zod";
import { db } from "../..";
import { FREE_BASE_TOKEN_LIMIT, FREE_PRO_TOKEN_LIMIT } from "./constants";

const metadataSchema = z.object({
  base_tokens: z.coerce.number(),
  pro_tokens: z.coerce.number(),
});

export async function getTokenLimits(workspaceId: string) {
  const subscription = await db.subscription.findUnique({
    where: {
      workspaceId,
    },
    include: {
      price: {
        include: {
          product: true,
        },
      },
    },
  });

  // On free tier
  if (!subscription) {
    return {
      baseTokenLimit: FREE_BASE_TOKEN_LIMIT,
      proTokenLimit: FREE_PRO_TOKEN_LIMIT,
    };
  }

  let metadata: z.infer<typeof metadataSchema>;

  try {
    metadata = metadataSchema.parse(subscription.price.product.metadata);
  } catch (e) {
    throw new Error(
      `Could not parse subscription metadata: ${(e as ErrorEvent).message}`
    );
  }

  return {
    baseTokenLimit: metadata.base_tokens,
    proTokenLimit: metadata.pro_tokens,
  };
}
