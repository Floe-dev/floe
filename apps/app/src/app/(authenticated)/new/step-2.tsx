"use client";

import Link from "next/link";
import { Button } from "@floe/ui";
import { usePathname, useSearchParams } from "next/navigation";
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
        <div className="">GitHub</div>
        <div className="text-right">
          <Link
            className={workspace.githubIntegration ? "pointer-events-none" : ""}
            href={`https://github.com/apps/floe-app/installations/new?state=${encodedState}`}
          >
            <Button disabled={Boolean(workspace.githubIntegration)}>
              {workspace.githubIntegration ? "Linked" : "Link account"}
            </Button>
          </Link>
        </div>

        <div className="">GitLab</div>
        <div className="text-right text-zinc-500">Coming soon</div>
      </div>
      <Link href={`/${workspace.slug}`}>
        <Button className="w-full mt-3" disabled={!workspace.githubIntegration}>
          Continue
        </Button>
      </Link>
    </>
  );
}
