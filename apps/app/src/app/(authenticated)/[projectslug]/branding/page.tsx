"use client";

import { api } from "@floe/trpc/client";
import { Card } from "@/components";
import { Input } from "@floe/ui";
import { useProjectContext } from "@/context/project";
import { useQueryClient } from "@tanstack/react-query";
import { Project } from "@floe/db";
import { useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Socials } from "./Socials";

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

type FormData = {
  primary: string | undefined;
  primaryDark: string | undefined;
  background: string | undefined;
  backgroundDark: string | undefined;
};

const projectSchema = yup
  .object({
    primary: yup
      .string()
      .matches(/^#[0-9A-F]{6}$/i)
      .optional(),
    primaryDark: yup
      .string()
      .matches(/^#[0-9A-F]{6}$/i)
      .optional(),
    background: yup
      .string()
      .matches(/^#[0-9A-F]{6}$/i)
      .optional(),
    backgroundDark: yup
      .string()
      .matches(/^#[0-9A-F]{6}$/i)
      .optional(),
  })
  .required();

export default function Page() {
  const queryClient = useQueryClient();
  const { currentProject, queryKey } = useProjectContext();
  const { mutateAsync, isLoading } = api.project.update.useMutation({
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
  const {
    register,
    getValues,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: "onChange",
    resolver: yupResolver(projectSchema),
    defaultValues: {
      primary: currentProject?.primary ?? undefined,
      primaryDark: currentProject?.primaryDark ?? undefined,
      background: currentProject?.background ?? undefined,
      backgroundDark: currentProject?.backgroundDark ?? undefined,
    },
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
            disabled: !isValid || isSaving,
            onClick: async () => {
              setIsSaving(true);
              await mutateAsync({
                projectId: currentProject?.id,
                ...(currentProject?.appearance !== selectedAppearance && {
                  appearance: selectedAppearance,
                }),
                ...(getValues("primary") !== currentProject?.primary && {
                  primary: getValues("primary"),
                }),
                ...(getValues("primaryDark") !==
                  currentProject?.primaryDark && {
                  primaryDark: getValues("primaryDark"),
                }),
                ...(getValues("background") !== currentProject?.background && {
                  background: getValues("background"),
                }),
                ...(getValues("backgroundDark") !==
                  currentProject?.backgroundDark && {
                  backgroundDark: getValues("backgroundDark"),
                }),
              }).finally(() => setIsSaving(false));
            },
          },
        ]}
      >
        <div className="flex flex-col gap-8">
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
          </div>
          <div className="flex justify-between w-full">
            <span className="flex flex-col flex-grow mr-20">
              <h4 className="text-sm font-medium leading-6 text-gray-900">
                Primary color
              </h4>
              <p className="text-sm text-gray-500">
                The primary color for buttons, links, etc in light mode.
              </p>
            </span>
            <span className="flex gap-2 w-80">
              <Input
                placeholder="eg. #4138c2"
                errortext={errors.primary?.message}
                {...register("primary")}
                disabled={isLoading}
              />
            </span>
          </div>
          <div className="flex justify-between w-full">
            <span className="flex flex-col flex-grow mr-20">
              <h4 className="text-sm font-medium leading-6 text-gray-900">
                Primary color (dark)
              </h4>
              <p className="text-sm text-gray-500">
                The primary color for buttons, links, etc in dark mode.
              </p>
            </span>
            <span className="flex gap-2 w-80">
              <Input
                placeholder="eg. #4138c2"
                errortext={errors.primaryDark?.message}
                {...register("primaryDark")}
                disabled={isLoading}
              />
            </span>
          </div>
          <div className="flex justify-between w-full">
            <span className="flex flex-col flex-grow mr-20">
              <h4 className="text-sm font-medium leading-6 text-gray-900">
                Background color
              </h4>
              <p className="text-sm text-gray-500">
                The background color in light mode.
              </p>
            </span>
            <span className="flex gap-2 w-80">
              <Input
                placeholder="eg. #ffffff"
                errortext={errors.background?.message}
                {...register("background")}
                disabled={isLoading}
              />
            </span>
          </div>
          <div className="flex justify-between w-full">
            <span className="flex flex-col flex-grow mr-20">
              <h4 className="text-sm font-medium leading-6 text-gray-900">
                Background color (dark)
              </h4>
              <p className="text-sm text-gray-500">
                The background color in dark mode.
              </p>
            </span>
            <span className="flex gap-2 w-80">
              <Input
                placeholder="eg. #09090b"
                errortext={errors.backgroundDark?.message}
                {...register("backgroundDark")}
                disabled={isLoading}
              />
            </span>
          </div>
        </div>
      </Card>
      <Socials />
    </div>
  );
}
