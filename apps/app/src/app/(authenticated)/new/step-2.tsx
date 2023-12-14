"use client";

import { Button } from "@floe/ui";
import { redirect, usePathname, useSearchParams } from "next/navigation";
import { useStepsContext } from "./context";

export function Step2() {
  const { workspace } = useStepsContext();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!workspace) {
    return null;
  }

  const arr: string[] = [];

  searchParams.forEach((val, key) => {
    arr.push(key, val);
  });

  const valuesToInclude = [workspace.id, workspace.slug, pathname, ...arr];
  const encodedState = encodeURIComponent(valuesToInclude.join(","));

  return (
    <>
      <h2 className="mb-2">Connect</h2>
      <p className="mb-6">Floe relies on git providers for context.</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-zinc-500">GitHub</div>
        <div className="text-right">
          <Button
            color="secondary"
            disabled={Boolean(workspace.githubIntegration)}
            onClick={() => {
              if (workspace.githubIntegration) {
                return;
              }

              redirect(
                `https://github.com/apps/floe-app/installations/new?state=${encodedState}`
              );
            }}
          >
            {workspace.githubIntegration ? "Linked" : "Link account"}
          </Button>
        </div>

        <div className="text-zinc-500">GitLab</div>
        {/* <div className="text-sm text-right text-zinc-500">Coming soon</div> */}
        <div className="text-right">
          <Button color="secondary" disabled variant="text">
            Coming soon
          </Button>
        </div>
      </div>
      <Button
        className="w-full mt-3"
        disabled={!workspace.githubIntegration}
        onClick={() => {
          if (!workspace.githubIntegration) {
            return;
          }

          redirect(`/${workspace.slug}`);
        }}
      >
        Continue
      </Button>
    </>
  );
}
