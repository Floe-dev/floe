"use client";

import { Button } from "@floe/ui";
import { useRouter } from "next/navigation";
import { useGitHubInstallationURL } from "~/lib/features/github-installation";
import { useStepsContext } from "./context";

export function Step2() {
  const router = useRouter();
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
      <h2 className="mt-0 mb-2">Connect</h2>
      <p className="mb-10">Floe relies on git providers for context.</p>
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
            {workspace.githubIntegration
              ? !workspace.githubIntegration.installationId
                ? "Pending approval"
                : "Linked"
              : "Link account"}
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
        className="w-full mt-6"
        disabled={!workspace.githubIntegration}
        onClick={() => {
          if (!workspace.githubIntegration) {
            return;
          }

          router.replace(`/${workspace.slug}`);
        }}
      >
        Continue
      </Button>
      <Button
        className="w-full mt-2"
        color="gray"
        onClick={() => {
          router.replace(`/${workspace.slug}`);
        }}
        variant="text"
      >
        I&apos;ll do this later
      </Button>
    </>
  );
}
