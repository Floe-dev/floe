import type { Prisma } from "../..";
import { db } from "../..";
import { getMonthYearTimestamp } from "./get-month-year";

export function findOne(workspaceId: string): Prisma.Prisma__TokenUsageClient<
  {
    id: number;
    monthYear: Date;
    basePromptTokens: number;
    baseCompletionTokens: number;
    proPromptTokens: number;
    proCompletionTokens: number;
    workspaceId: string;
  } | null,
  null
> {
  const monthYear = getMonthYearTimestamp();

  return db.tokenUsage.findUnique({
    where: {
      workspaceId_monthYear: {
        monthYear,
        workspaceId,
      },
    },
  });
}
