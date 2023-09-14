"use client";

import { api } from "@/utils/trpc";
import { Card } from "@/components";
import { useProjectContext } from "@/context/project";
import { useQueryClient } from "@tanstack/react-query";
import { Project } from "@floe/db";
import { useState } from "react";

const apperances: {
  name: string;
  emoji: string;
  color: string;
  value: Project["appearance"];
}[] = [
  {
    name: "Light",
    emoji: "🌝",
    color: "bg-[#fff8da]",
    value: "LIGHT",
  },
  {
    name: "Dark",
    emoji: "🌚",
    color: "bg-[#8a94b2]",
    value: "DARK",
  },
  {
    name: "System",
    emoji: "🌗",
    color: "bg-gradient-to-r from-[#fff8da] to-[#8a94b2]",
    value: "SYSTEM",
  },
];

export default function Page() {
  const queryClient = useQueryClient();
  const { currentProject, queryKey } = useProjectContext();
  const { mutateAsync, isLoading } = api.project.update.useMutation({
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
  const [selectedAppearance, setSelectedAppearance] = useState<
    Project["appearance"] | undefined
  >(currentProject?.appearance);
  const [isSaving, setIsSaving] = useState(false);

  if (!currentProject) {
    return;
  }

  return (
    <div className="flex flex-col gap-4">
      <Card
        title="Appearance"
        bottomActions={[
          {
            text: isSaving ? "Saving..." : "Save",
            type: "submit",
            disabled: isSaving,
            onClick: async () => {
              setIsSaving(true);
              await mutateAsync({
                projectId: currentProject?.id,
                ...(currentProject?.appearance !== selectedAppearance && {
                  appearance: selectedAppearance,
                }),
              }).finally(() => setIsSaving(false));
            },
          },
        ]}
      >
        <div className="flex justify-between w-full">
          <span className="flex flex-col flex-grow mr-20">
            <h4 className="text-sm font-medium leading-6 text-gray-900">
              Theme
            </h4>
            <p className="text-sm text-gray-500">Default color scheme.</p>
          </span>
          <span className="flex gap-2">
            {apperances.map((appearance) => (
              <div
                key={appearance.value}
                className="flex flex-col gap-2 text-center"
              >
                <button
                  className={`flex items-center justify-center ring-indigo-600 w-24 h-16 border border-gray-200 rounded-lg shadow-sm ${
                    appearance.color
                  } ${
                    appearance.value === selectedAppearance
                      ? "ring-2 ring-offset-1 ring-indigo-600"
                      : ""
                  }}`}
                  onClick={() => {
                    setSelectedAppearance(appearance.value);
                  }}
                >
                  {appearance.emoji}
                </button>
                <p
                  className={`text-xs ${
                    appearance.value === selectedAppearance
                      ? "text-gray-700 font-semibold"
                      : "text-gray-500"
                  }`}
                >
                  {appearance.name}
                </p>
              </div>
            ))}
          </span>
          {/* <Button
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
          </Button> */}
        </div>
      </Card>
    </div>
  );
}
