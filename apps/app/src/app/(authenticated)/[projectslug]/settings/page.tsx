"use client";

import { api } from "@floe/trpc";
import { Button, Card } from "@/components";
import { useRouter } from "next/navigation";
import { useProjectContext } from "@/context/project";
import { useQueryClient } from "@tanstack/react-query";
import { ProjectSettings } from "./ProjectSettings";

export default function Page() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { currentProject, queryKey } = useProjectContext();
  const { mutateAsync } = api.project.delete.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey }), router.push("/");
    },
  });

  if (!currentProject) {
    return;
  }

  return (
    <div className="flex flex-col gap-4">
      <ProjectSettings />
      <Card title="Danger zone">
        <div className="flex items-center justify-between w-full">
          <span className="flex flex-col flex-grow mr-20">
            <h4 className="text-sm font-medium leading-6 text-gray-900">
              Delete project
            </h4>
            <p className="text-sm text-gray-500">
              This action will delete the project and all associated data,
              including reactions. This action cannot be undone.
            </p>
          </span>
          <Button
            variant="error"
            onClick={() => {
              if (
                confirm(
                  "Are you sure you would like to delete this project?"
                ) === true
              ) {
                mutateAsync({
                  projectId: currentProject.id,
                });
              }
            }}
          >
            Delete
          </Button>
        </div>
      </Card>
    </div>
  );
}
