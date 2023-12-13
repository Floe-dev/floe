"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@floe/ui";
import { useSearchParams } from "next/navigation";
import { useStepsContext } from "./context";
import { setInstallationOnWorkspace } from "./actions";

export function Step2() {
  const searchParams = useSearchParams();
  const { workspace } = useStepsContext();

  useEffect(() => {
    const code = searchParams.get("code");
    const installationId = searchParams.get("installation_id");
    // eslint-disable-next-line @typescript-eslint/no-floating-promises -- Need anonymous async function
    (async () => {
      if (code && installationId && workspace) {
        await setInstallationOnWorkspace(code, workspace, installationId);
      }
    })();
  }, [searchParams, workspace]);

  if (!workspace) {
    return null;
  }

  return (
    <>
      <h2 className="mb-2">Connect</h2>
      <p className="mb-6">Floe relies on git providers for context.</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="">GitHub</div>
        <div className="text-right">
          <Link
            href={`https://github.com/apps/floe-app/installations/new?state=${workspace.slug}`}
          >
            <Button>Link account</Button>
          </Link>
        </div>

        <div className="">GitLab</div>
        <div className="text-right text-zinc-500">Coming soon</div>
      </div>
    </>
  );
}
