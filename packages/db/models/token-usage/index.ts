import { db } from "../..";
import type { TokenUsage } from "../..";
import { getMonthYearTimestamp } from "./get-month-year";

export type FindOneResult = TokenUsage | null;

export async function findOne(workspaceId: string): Promise<FindOneResult> {
  const monthYear = getMonthYearTimestamp();

  const tokenUsage = await db.tokenUsage.findUnique({
    where: {
      workspaceId_monthYear: {
        monthYear,
        workspaceId,
      },
    },
  });

  return tokenUsage;
}

export * from "./constants";
