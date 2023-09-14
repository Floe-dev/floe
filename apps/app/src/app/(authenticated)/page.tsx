"use client";

import { useState, useEffect } from "react";
import { FolderIcon } from "@heroicons/react/24/solid";
import { EmptyState, Card, Modal, Input } from "@/components";
import { useProjectContext } from "@/context/project";
import Link from "next/link";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import cn from "classnames";
import { api } from "@/utils/trpc";
import { useInstallationsContext } from "@/context/installations";
import slugify from "slugify";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { useQueryClient } from "@tanstack/react-query";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { UploadFileResponse } from "uploadthing/client";
import { ImageUpload } from "./ImageUpload";

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

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { projects, queryKey } = useProjectContext();
  const {
    watch,
    register,
    getValues,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: "onChange",
    resolver: yupResolver(projectSchema),
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = api.project.create.useMutation({
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
  const { currentInstallation, setCurrentInstallation } =
    useInstallationsContext();
  const slug = watch("name")
    ? slugify(watch("name"), {
        lower: true,
        strict: true,
      })
    : "";

  const [logoURL, setLogoURL] = useState<string | undefined>(undefined);
  const [faviconURL, setFaviconURL] = useState<string | undefined>(undefined);

  /**
   * After installation, redirect to the current installation and open the new
   * project modal. Then clear query params so it doesn't happen again.
   */
  useEffect(() => {
    const searchInstallationId = searchParams?.get("installation_id");
    const searchSetupAction = searchParams?.get("setup_action");

    if (searchInstallationId && searchSetupAction === "install") {
      setCurrentInstallation(parseInt(searchInstallationId));
      return redirect(`/?setup_action=install`);
    }

    if (searchSetupAction === "install") {
      setOpen(true);
      router.push("/");
    }
  }, [router, searchParams, setCurrentInstallation]);

  return (
    <div>
      <Card
        title="Projects"
        subtitle="A project is a collection of changelogs, blogs, etc."
        actions={[
          {
            text: "Create project",
            onClick: () => setOpen(true),
          },
        ]}
      >
        {projects?.length ? (
          <ul role="list" className="divide-y divide-gray-100">
            {projects?.map((project) => (
              <li key={project.slug}>
                <Link
                  href={`/${project.slug}`}
                  className="flex items-center justify-between py-5 gap-x-6"
                >
                  <div>
                    <h3 className="text-sm font-semibold leading-6 text-gray-900">
                      {project.name}
                    </h3>
                    <p className="text-xs leading-5 text-gray-500">
                      Created{" "}
                      {new Date(project.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <ChevronRightIcon
                    className="flex-none w-5 h-5 text-gray-400"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={FolderIcon}
            title="No projects"
            description="Create a project to get started."
          />
        )}
      </Card>
      <Modal
        open={open}
        setOpen={setOpen}
        title={
          projects?.length ? "Create project" : "Create your first project"
        }
        actions={[
          {
            text: loading ? "Creating..." : "Create project",
            type: "submit",
            disbaled: !isValid || loading,
            onClick: async () => {
              setLoading(true);
              await mutateAsync({
                name: getValues("name"),
                slug,
                logo: logoURL,
                favicon: faviconURL,
                description: getValues("description"),
                installationId: currentInstallation!.id,
              });

              setLoading(false);
              setOpen(false);
            },
          },
        ]}
        content={
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
                  imageUploadURL={logoURL}
                  setImageUploadURL={setLogoURL}
                />
              </div>
              <div className="flex-1">
                <ImageUpload
                  type="faviconUploader"
                  label="Favicon"
                  imageUploadURL={faviconURL}
                  setImageUploadURL={setFaviconURL}
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
              subtext="Describe how you use this project"
              errortext={errors.description?.message}
              {...register("description", {
                required: true,
              })}
              disabled={isLoading}
              textarea
            />
          </form>
        }
      />
    </div>
  );
}
