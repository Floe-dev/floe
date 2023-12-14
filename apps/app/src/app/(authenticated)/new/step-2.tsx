"use client";

import { Button } from "@floe/ui";
import { redirect } from "next/navigation";
import { useGitHubInstallationURL } from "~/lib/github-installation-url";
import { useStepsContext } from "./context";

export function Step2() {
  const { workspace } = useStepsContext();
  const installationUrl = useGitHubInstallationURL(
    workspace?.id,
    workspace?.slug
  );

  if (!workspace || !installationUrl) {
    return null;
  }

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

              window.open(installationUrl);
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
