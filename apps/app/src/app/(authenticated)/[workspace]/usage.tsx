import * as tokenUsage from "@floe/db/models/token-usage";
import { Card } from "@floe/ui";
import { Flex, ProgressBar, Text } from "@tremor/react";

export async function Usage({ workspaceId }: { workspaceId: string }) {
  const usage = await tokenUsage.findOne(workspaceId);

  // if (!usage) {
  //   return null;
  // }

  const proPercentage = Math.floor(
    (((usage?.proCompletionTokens ?? 0) + (usage?.proPromptTokens ?? 0)) /
      tokenUsage.FREE_PRO_TOKEN_LIMIT) *
      100
  );

  return (
    <Card className="max-w-sm" title="Usage">
      <Flex>
        <Text>$ 9,012 &bull; 45%</Text>
        <Text>{tokenUsage.FREE_PRO_TOKEN_LIMIT}</Text>
      </Flex>
      <ProgressBar className="mt-4" color="indigo" value={proPercentage} />
    </Card>
  );
}
