import { db } from "../..";
import type { Prisma } from "../..";

export async function findOne<
  T extends Parameters<typeof db.price.findUnique>[0]["include"],
  U extends Prisma.PriceGetPayload<{
    include: T;
  }>,
>(priceId: string, include?: T): Promise<U | null> {
  const price = (await db.price.findUnique({
    where: {
      stripePriceId: priceId,
    },
    include,
  })) as U;

  return price;
}
