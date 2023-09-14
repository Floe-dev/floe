"use client";

import { Card, Input } from "@/components";
import { ImageUpload } from "../../ImageUpload";
import { useProjectContext } from "@/context/project";
import * as yup from "yup";
import slugify from "slugify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import cn from "classnames";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/trpc";
import { useRouter } from "next/navigation";

type FormData = {
  name: string;
  description: string | undefined;
  homepageUrl: string | undefined;
};

const projectSchema = yup
  .object({
    name: yup.string().min(3).max(24).required("A project name is required."),
    description: yup.string().max(255),
    homepageUrl: yup.string().url(),
  })
  .required();

export const ProjectSettings = () => {
  const { currentProject, queryKey } = useProjectContext();
  const {
    watch,
    register,
    getValues,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: "onChange",
    resolver: yupResolver(projectSchema),
    defaultValues: {
      name: currentProject?.name ?? "",
      description: currentProject?.description ?? "",
      homepageUrl: currentProject?.homepageURL ?? undefined,
    },
  });
  const slug = watch("name")
    ? slugify(watch("name"), {
        lower: true,
        strict: true,
      })
    : "";
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = api.project.update.useMutation({
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const [logoFileURL, setLogoFileURL] = useState<string | undefined>(
    currentProject?.logo ?? undefined
  );
  const [faviconFileURL, setFaviconFileURL] = useState<string | undefined>(
    currentProject?.favicon ?? undefined
  );
  const [isSaving, setIsSaving] = useState(false);

  if (!currentProject) {
    return null;
  }

  return (
    <Card
      title="Project settings"
      bottomActions={[
        {
          text: isSaving ? "Saving..." : "Save",
          type: "submit",
          disabled: !isValid || isSaving,
          onClick: async () => {
            const isNameChange = getValues("name") !== currentProject?.name;
            setIsSaving(true);

            await mutateAsync({
              projectId: currentProject?.id,
              ...(isNameChange && {
                name: getValues("name"),
                slug,
              }),
              ...(getValues("description") !== currentProject?.description && {
                description: getValues("description"),
              }),
              ...(getValues("homepageUrl") !== currentProject?.homepageURL && {
                homepageUrl: getValues("homepageUrl"),
              }),
              ...(logoFileURL !== currentProject?.logo && {
                logo: logoFileURL,
              }),
              ...(faviconFileURL !== currentProject?.favicon && {
                favicon: faviconFileURL,
              }),
            })
              .then(() => {
                if (isNameChange) {
                  router.push(`/${slug}/settings`);
                }
              })
              .catch((e) => {})
              .finally(() => setIsSaving(false));
          },
        },
      ]}
    >
      <form
        className={cn("flex flex-col items-start gap-6")}
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex w-full gap-4">
          <Input
            label="Name*"
            placeholder="Acme Inc"
            errortext={errors.name?.message}
            {...register("name", {
              required: true,
            })}
            disabled={isLoading}
          />
          <Input
            label="Slug*"
            placeholder="acme-inc"
            value={slug}
            disabled
            className="bg-gray-100"
          />
        </div>
        <div className="flex w-full gap-4">
          <div className="flex-1">
            <ImageUpload
              type="logoUploader"
              label="Logo"
              imageUploadURL={logoFileURL}
              setImageUploadURL={setLogoFileURL}
            />
          </div>
          <div className="flex-1">
            <ImageUpload
              type="faviconUploader"
              label="Favicon"
              imageUploadURL={faviconFileURL}
              setImageUploadURL={setFaviconFileURL}
            />
          </div>
        </div>
        <Input
          label="Homepage URL"
          placeholder="https://www.acme.com"
          {...register("homepageUrl", {
            required: true,
          })}
          errortext={errors.homepageUrl?.message}
          disabled={isLoading}
        />
        <Input
          label="Description"
          placeholder="eg. Release notes for new API updates."
          subtext="Describe how you use this project."
          errortext={errors.description?.message}
          {...register("description", {
            required: true,
          })}
          disabled={isLoading}
          textarea
        />
      </form>
    </Card>
  );
};
