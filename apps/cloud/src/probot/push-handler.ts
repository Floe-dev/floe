import { Context } from "probot";
import { prisma } from "@/server/db/client";
import { minimatch } from "minimatch";
import { Endpoints } from "@floe/utils";

export async function handlePushEvents(context: Context<"push">) {
  const installationId = context.payload?.installation?.id;

  if (!installationId) return;

  const owner = context.payload.repository.owner.login;
  const repo = context.payload.repository.name;
  const branch = context.payload.ref.replace("refs/heads/", "");

  const datasources = await prisma.dataSource.findMany({
    where: {
      owner,
      repo,
      baseBranch: branch,
      project: {
        installationId,
      },
    },
  });

  if (!datasources.length) {
    console.log("No datasources found");
    return;
  }

  const commits = await Promise.all(
    context.payload.commits.map((c) => {
      return context.octokit.repos.getCommit({
        ref: c.id,
        repo,
        owner,
      });
    })
  );

  const files = commits.map((c) => c.data.files).flat();

  files.forEach(async (file) => {
    if (!file) return;

    const isValidPost =
      minimatch(file.filename, ".floe/**/*.md") &&
      !minimatch(file.filename, ".floe/public/*");

    /**
     * POST HANDLERS
     */
    if (!isValidPost) {
      return;
    }

    datasources.forEach(async (dataSource) => {
      handlePush(file, dataSource.id);
    });
  });
}

async function handlePush(
  file: NonNullable<
    Endpoints["GET /repos/{owner}/{repo}/commits/{ref}"]["response"]["data"]["files"]
  >[0],
  datasourceId: string
) {
  /**
   * HANDLE FILE ADDED
   */
  if (file.status === "added") {
    await prisma.post.upsert({
      where: {
        unique_post: {
          datasourceId,
          filename: file.filename,
        },
      },
      create: {
        datasourceId,
        filename: file.filename,
      },
      // This case shouldn't ever happen, but just in case
      update: {
        filename: file.filename,
      },
    });
  }

  /**
   * HANDLE FILE RENAMED
   */
  if (file.status === "renamed" && file.previous_filename) {
    try {
      await prisma.post.upsert({
        where: {
          unique_post: {
            datasourceId,
            filename: file.previous_filename,
          },
        },
        create: {
          datasourceId,
          filename: file.filename,
        },
        update: {
          filename: file.filename,
        },
      });
    } catch (e) {
      console.log(111111, e, file, datasourceId);
    }
  }

  /**
   * HANDLE FILE MODIFIED
   */
  if (file.status === "modified") {
  }

  /**
   * HANDLE FILE REMOVED
   */
  if (file.status === "removed") {
    await prisma.post.delete({
      where: {
        unique_post: {
          datasourceId,
          filename: file.filename,
        },
      },
    });
  }
}
