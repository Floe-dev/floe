"use client";

import Keys from "./Keys";
import DataSources from "./DataSources";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@floe/trpc";
import { useProjectContext } from "@/context/project";
import { ProjectInfo } from "./ProjectInfo";

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
        name: "Sample Data Source",
        slug: "sample-data-source",
        projectId: currentProject!.id,
        owner,
        repository,
        baseBranch: "main",
      });
    })();
  }, [currentProject, mutateAsync, router, searchParams]);

  return (
    <>
      <ProjectInfo />
      <DataSources />
      <Keys />
    </>
  );
}
