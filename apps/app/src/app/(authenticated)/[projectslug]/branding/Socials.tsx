"use client";

import { api } from "@/utils/trpc";
import { Card } from "@/components";
import { Input } from "@floe/ui";
import { useProjectContext } from "@/context/project";
import { useQueryClient } from "@tanstack/react-query";
import { Project } from "@floe/db";
import { useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

type FormData = {
  twitterUrl: string | undefined;
  githubUrl: string | undefined;
  discordUrl: string | undefined;
  instagramUrl: string | undefined;
  facebookUrl: string | undefined;
  youtubeUrl: string | undefined;
  twitchUrl: string | undefined;
  slackUrl: string | undefined;
};

const projectSchema = yup
  .object({
    twitterUrl: yup.string().url().optional(),
    githubUrl: yup.string().url().optional(),
    discordUrl: yup.string().url().optional(),
    instagramUrl: yup.string().url().optional(),
    facebookUrl: yup.string().url().optional(),
    youtubeUrl: yup.string().url().optional(),
    twitchUrl: yup.string().url().optional(),
    slackUrl: yup.string().url().optional(),
  })
  .required();

export const Socials = () => {
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
      twitterUrl: currentProject?.twitterURL ?? undefined,
      githubUrl: currentProject?.githubURL ?? undefined,
      discordUrl: currentProject?.discordURL ?? undefined,
      instagramUrl: currentProject?.instagramURL ?? undefined,
      facebookUrl: currentProject?.facebookURL ?? undefined,
      youtubeUrl: currentProject?.youtubeURL ?? undefined,
      twitchUrl: currentProject?.twitchURL ?? undefined,
      slackUrl: currentProject?.slackURL ?? undefined,
    },
  });
  const [isSaving, setIsSaving] = useState(false);

  if (!currentProject) {
    return;
  }

  return (
    <Card
      title="Social links"
      bottomActions={[
        {
          text: isSaving ? "Saving..." : "Save",
          type: "submit",
          disabled: !isValid || isSaving,
          onClick: async () => {
            setIsSaving(true);
            await mutateAsync({
              projectId: currentProject?.id,
              ...(getValues("twitterUrl") !== currentProject?.twitterURL && {
                twitterUrl: getValues("twitterUrl"),
              }),
              ...(getValues("githubUrl") !== currentProject?.githubURL && {
                githubUrl: getValues("githubUrl"),
              }),
              ...(getValues("discordUrl") !== currentProject?.discordURL && {
                discordUrl: getValues("discordUrl"),
              }),
              ...(getValues("instagramUrl") !==
                currentProject?.instagramURL && {
                instagramUrl: getValues("instagramUrl"),
              }),
              ...(getValues("youtubeUrl") !== currentProject?.youtubeURL && {
                youtubeUrl: getValues("youtubeUrl"),
              }),
              ...(getValues("facebookUrl") !== currentProject?.facebookURL && {
                facebookUrl: getValues("facebookUrl"),
              }),
              ...(getValues("twitchUrl") !== currentProject?.twitchURL && {
                twitchUrl: getValues("twitchUrl"),
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
              GitHub Url
            </h4>
            <p className="text-sm text-gray-500">
              Url to you GitHub account or repository.
            </p>
          </span>
          <span className="flex gap-2 w-80">
            <Input
              placeholder="eg. https://github.com/Floe-dev"
              errortext={errors.githubUrl?.message}
              {...register("githubUrl")}
              disabled={isLoading}
            />
          </span>
        </div>
        <div className="flex justify-between w-full">
          <span className="flex flex-col flex-grow mr-20">
            <h4 className="text-sm font-medium leading-6 text-gray-900">
              Twitter Url
            </h4>
            <p className="text-sm text-gray-500">Your Twitter account Url.</p>
          </span>
          <span className="flex gap-2 w-80">
            <Input
              placeholder="eg. https://twitter.com/Floe_dev"
              errortext={errors.twitchUrl?.message}
              {...register("twitterUrl")}
              disabled={isLoading}
            />
          </span>
        </div>
        <div className="flex justify-between w-full">
          <span className="flex flex-col flex-grow mr-20">
            <h4 className="text-sm font-medium leading-6 text-gray-900">
              Discord Url
            </h4>
            <p className="text-sm text-gray-500">Your Discord account Url.</p>
          </span>
          <span className="flex gap-2 w-80">
            <Input
              placeholder="eg. https://github.com/Floe-dev/floe"
              errortext={errors.discordUrl?.message}
              {...register("discordUrl")}
              disabled={isLoading}
            />
          </span>
        </div>
        <div className="flex justify-between w-full">
          <span className="flex flex-col flex-grow mr-20">
            <h4 className="text-sm font-medium leading-6 text-gray-900">
              Slack Url
            </h4>
            <p className="text-sm text-gray-500">Your Slack account Url.</p>
          </span>
          <span className="flex gap-2 w-80">
            <Input
              placeholder="eg. https://join.slack.com/t/floedev/123"
              errortext={errors.slackUrl?.message}
              {...register("slackUrl")}
              disabled={isLoading}
            />
          </span>
        </div>
        <div className="flex justify-between w-full">
          <span className="flex flex-col flex-grow mr-20">
            <h4 className="text-sm font-medium leading-6 text-gray-900">
              Twitch Url
            </h4>
            <p className="text-sm text-gray-500">Your Twitch account Url.</p>
          </span>
          <span className="flex gap-2 w-80">
            <Input
              placeholder="eg. https://www.twitch.tv/floedev"
              errortext={errors.twitchUrl?.message}
              {...register("twitchUrl")}
              disabled={isLoading}
            />
          </span>
        </div>
        <div className="flex justify-between w-full">
          <span className="flex flex-col flex-grow mr-20">
            <h4 className="text-sm font-medium leading-6 text-gray-900">
              Youtube Url
            </h4>
            <p className="text-sm text-gray-500">Your Youtube account Url.</p>
          </span>
          <span className="flex gap-2 w-80">
            <Input
              placeholder="eg. https://www.youtube.com/watch?v=1bZnhkwl6_s"
              errortext={errors.youtubeUrl?.message}
              {...register("youtubeUrl")}
              disabled={isLoading}
            />
          </span>
        </div>
        <div className="flex justify-between w-full">
          <span className="flex flex-col flex-grow mr-20">
            <h4 className="text-sm font-medium leading-6 text-gray-900">
              Facebook Url
            </h4>
            <p className="text-sm text-gray-500">Your Facebook account Url.</p>
          </span>
          <span className="flex gap-2 w-80">
            <Input
              placeholder="eg. https://www.facebook.com/groups/123"
              errortext={errors.youtubeUrl?.message}
              {...register("youtubeUrl")}
              disabled={isLoading}
            />
          </span>
        </div>
      </div>
    </Card>
  );
};
