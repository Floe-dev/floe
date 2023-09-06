"use client";

import Keys from "./Keys";
import DataSources from "./DataSources";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/trpc";
import { useProjectContext } from "@/context/project";

export default function Project() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const { currentProject, queryKey } = useProjectContext();
  const { mutateAsync } = api.dataSource.create.useMutation({
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  useEffect(() => {
    (async () => {
      const githubRepositoryUrl = searchParams?.get("repository-url");

      if (!githubRepositoryUrl) {
        return;
      }

      router.push(`/${currentProject?.slug}`);

      const owner = githubRepositoryUrl.split("/")[3];
      const repository = githubRepositoryUrl.split("/")[4];

      await mutateAsync({
        projectId: currentProject!.id,
        owner,
        repository,
        baseBranch: "main",
      });
    })();
  }, [searchParams]);

  return (
    <>
      <DataSources />
      <Keys />
    </>
  );
}
