import { Card } from "@floe/ui";
import { ProgressBar } from "@tremor/react";
import { tokenUsage, subscription } from "@floe/db/models";

export async function Usage({ workspaceId }: { workspaceId: string }) {
  const usage = await tokenUsage.findOne(workspaceId);
  const limits = await subscription.getTokenLimits(workspaceId);

  const totalProTokens =
    (usage?.proCompletionTokens ?? 0) + (usage?.proPromptTokens ?? 0);
  const proPercentage = Math.floor(
    (totalProTokens / limits.proTokenLimit) * 100
  );

  const totalBasicTokens =
    (usage?.baseCompletionTokens ?? 0) + (usage?.basePromptTokens ?? 0);
  const basicPercentage = Math.floor(
    (totalBasicTokens / limits.baseTokenLimit) * 100
  );

  return (
    <div className="flex flex-col gap-8 md:gap-4 md:flex-row">
      <Card className="flex-1" title="Pro Token usage">
        <div className="flex justify-between">
          <div className="font-mono text-zinc-500">
            {totalProTokens.toLocaleString()} &bull; {proPercentage}%
          </div>
          <div className="font-mono text-zinc-500">
            {limits.proTokenLimit.toLocaleString()}
          </div>
        </div>
        <ProgressBar className="mt-4" color="indigo" value={proPercentage} />
        <p className="mt-4 text-sm text-zinc-400">
          Monthly limit for Pro Tokens. Pro Tokens use more advanced models and
          achieve better results.
        </p>
      </Card>
      <Card className="flex-1" title="Basic Token usage">
        <div className="flex justify-between">
          <div className="font-mono text-zinc-500">
            {totalBasicTokens.toLocaleString()} &bull; {basicPercentage}%
          </div>
          <div className="font-mono text-zinc-500">
            {limits.baseTokenLimit.toLocaleString()}
          </div>
        </div>
        <ProgressBar className="mt-4" color="zinc" value={basicPercentage} />
        <p className="mt-4 text-sm text-zinc-400">
          Monthly limit for Basic Tokens. Basic Tokens accrue once you use up
          your pro tokens.
        </p>
      </Card>
    </div>
  );
}
