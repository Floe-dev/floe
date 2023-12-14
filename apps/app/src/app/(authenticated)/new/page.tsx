"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Spinner } from "@floe/ui";
import { Nav } from "./nav";
import { Step1 } from "./step-1";
import { Step2 } from "./step-2";
import { getWorkspace } from "./actions";
import { StepsContext } from "./context";
import type { DefaultContext } from "./context";

const steps = {
  1: <Step1 />,
  2: <Step2 />,
};

export default function New() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const step = parseInt(searchParams.get("s") ?? "1", 10);
  const workspaceSlug = searchParams.get("w");
  const [workspace, setWorkspace] = useState<DefaultContext["workspace"]>(null);
  const [workspaceLoading, setWorkspaceLoading] = useState(true);

  const setSearchParams = (
    obj: Record<string, string | number | undefined | null>
  ) => {
    // now you got a read/write object
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    Object.entries(obj).forEach(([key, value]) => {
      if (value === null || value === undefined) current.delete(key);
      else current.set(key, value.toString());
    });

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.replace(`${pathname}${query}`);
  };

  /**
   * If the workspace in the query param doesn't exist, start over
   */
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises -- Need anonymous async function
    (async () => {
      if (workspaceSlug) {
        setWorkspaceLoading(true);
        const w = await getWorkspace(workspaceSlug);

        if (!w) {
          router.push(`/new`);
        }

        setWorkspace(w);
        setWorkspaceLoading(false);
      } else {
        setWorkspaceLoading(false);
      }
    })();
  }, [workspaceSlug, router]);

  return (
    <>
      <Nav />
      <div className="flex flex-col items-center justify-center pt-16">
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[360px] prose prose-zinc flex flex-col">
          <StepsContext.Provider
            value={{ step, setSearchParams, workspace, workspaceLoading }}
          >
            {workspaceLoading ? (
              <span className="mx-auto">
                <Spinner color="zinc" />
              </span>
            ) : (
              <>
                <p className="text-sm text-zinc-500">
                  {step} / {Object.keys(steps).length}
                </p>
                {steps[step]}
              </>
            )}
          </StepsContext.Provider>
        </div>
      </div>
    </>
  );
}
