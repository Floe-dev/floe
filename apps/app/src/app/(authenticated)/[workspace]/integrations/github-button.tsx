"use client";

import { Button } from "@floe/ui";
import type { Prisma } from "@floe/db";
import { useGitHubInstallationURL } from "~/lib/features/github-installation";

interface GitHubButtonProps {
  workspace: Prisma.WorkspaceGetPayload<{
    include: {
      githubIntegration: true;
      gitlabIntegration: true;
      encrytpedKeys: {
        select: {
          name: true;
          slug: true;
          createdAt: true;
        };
      };
    };
  }>;
}

export function GitHubButton({ workspace }: GitHubButtonProps) {
  const installationUrl = useGitHubInstallationURL(
    workspace.id,
    workspace.slug
  );

  if (!installationUrl) {
    return null;
  }

  return (
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
        ? workspace.githubIntegration.status === "pending"
          ? "Pending approval"
          : "Linked"
        : "Link account"}
    </Button>
  );
}
