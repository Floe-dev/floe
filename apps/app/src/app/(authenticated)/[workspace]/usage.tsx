import { db } from "@floe/db";
import { Card } from "@floe/ui";
import { Flex, ProgressBar, CategoryBar, Text } from "@tremor/react";
import { getMonthYearTimestamp } from "@floe/lib/get-month-year";

const MAX_USAGE = 1000000;

function getUsage(workspaceId: string) {
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

export async function Usage({ workspaceId }: { workspaceId: string }) {
  const usage = await getUsage(workspaceId);

  // if (!usage) {
  //   return null;
  // }

  const totalProUsage =
    (usage?.proCompletionTokens ?? 0) + (usage?.proPromptTokens ?? 0);

  return (
    <Card className="max-w-sm" title="Usage">
      <Flex>
        <Text>$ 9,012 &bull; 45%</Text>
        <Text>$ 20,000</Text>
      </Flex>
      <CategoryBar
        className="mt-4"
        colors={["blue", "cyan", "amber", "pink"]}
        showAnimation
        values={[20, 10, 60, 20]}
      />
    </Card>
  );
}
