import prisma from "@floe/db";
import { Probot } from "probot";
import { Context } from "probot";
import { minimatch } from "minimatch";
import { Endpoints } from "@floe/utils";
import { handlePushEvents } from "./push-handler";

const appHandler = (app: Probot) => {
  /**
   * Get all new changelog files from push event
   */
  // @ts-ignore
  app.on("push", async (context) => {
    // const installationId = context.payload?.installation?.id;

    // if (!installationId) return;
    const owner = context.payload.repository.owner.login;
    const repo = context.payload.repository.name;
    const branch = context.payload.ref.replace("refs/heads/", "");

    const datasources = [{ id: "clmy3mghd0001ky07j5g086vm" }];

    const commits = await Promise.all(
      context.payload.commits.map((c) => {
        return context.octokit.repos.getCommit({
          ref: c.id,
          repo,
          owner,
        });
      })
    ).catch((e) => {
      console.error("COULD NOT GET COMMITS: ", e);
    });

    if (!commits?.length) {
      console.log("No commits found");
      return;
    }

    const files = commits?.map((c) => c.data.files).flat();

    console.log("NUMBER OF FILES FOUND: ", files.length);

    await Promise.all(
      files.map(async (file) => {
        if (!file) return;

        const isValidPost =
          minimatch(file.filename, ".floe/**/*.md") &&
          !minimatch(file.filename, ".floe/public/*");

        /**
         * POST HANDLERS
         */
        if (!isValidPost) {
          console.log("POST IS NOT VALID");
          return;
        }

        await Promise.all(
          datasources.map(async (dataSource) => {
            handlePush(file, dataSource.id);
          })
        );
      })
    );
  });
};

export default appHandler;

async function handlePush(
  file: NonNullable<
    Endpoints["GET /repos/{owner}/{repo}/commits/{ref}"]["response"]["data"]["files"]
  >[0],
  datasourceId: string
) {
  console.log("PROCESSING FILE: ", file);
  /**
   * HANDLE FILE ADDED
   */
  if (file.status === "added") {
    return await prisma.post
      .upsert({
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
      })
      .catch((e) => {
        console.error("COULD NOT CREATE POST: ", e);
      });
  }

  /**
   * HANDLE FILE RENAMED
   */
  if (file.status === "renamed" && file.previous_filename) {
    return await prisma.post
      .upsert({
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
      })
      .catch((e) => {
        console.log(111111, file.filename, datasourceId);
        console.error("COULD NOT UPDATE POST: ", e);
      });
  }

  /**
   * HANDLE FILE MODIFIED
   */
  if (file.status === "modified") {
    return;
  }

  /**
   * HANDLE FILE REMOVED
   */
  if (file.status === "removed") {
    return await prisma.post
      .delete({
        where: {
          unique_post: {
            datasourceId,
            filename: file.filename,
          },
        },
      })
      .catch((e) => {
        console.error("COULD NOT DELETE POST: ", e);
      });
  }
}
