import { Context } from "probot";
import prisma from "@floe/db";
import { minimatch } from "minimatch";
import { Endpoints, Octokit, getFileTree } from "@floe/utils";
import input from "postcss/lib/input";

export async function handlePushEvents(context: Context<"push">) {
  const installationId = context.payload?.installation?.id;

  console.log("INSTALLATION ID: ", installationId);

  if (!installationId) return;

  const owner = context.payload.repository.owner.login;
  const repo = context.payload.repository.name;
  const branch = context.payload.ref.replace("refs/heads/", "");

  console.log("REPO INFO: ", owner, repo, branch);

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

  console.log("DATA SOURCES: ", datasources);

  if (!datasources.length) {
    console.log("No datasources found");
    return;
  }

  // const commits = await Promise.all(
  //   context.payload.commits.map((c) => {
  //     return context.octokit.repos.getCommit({
  //       ref: c.id,
  //       repo,
  //       owner,
  //     });
  //   })
  // );
  // const commits = context.payload.commits;

  // const files = commits.map((c) => c.data.files).flat();

  /**
   * Note: This will delete data for files that were renamed. Can eventually make
   * a fix this for this, but not necessary right now.
   */
  const files = await getFileTree(context.octokit as unknown as Octokit, {
    owner: owner,
    repo,
    ref: branch,
    rules: [".floe/**/*.md"],
  });

  const posts = files.map((f) => ({ filename: f }));

  await prisma.$transaction(async (tx) => {
    /**
     * Delete posts that are no longer present
     */
    await prisma.post.deleteMany({
      where: {
        datasourceId: {
          in: datasources.map((d) => d.id),
        },
        filename: {
          notIn: files,
        },
      },
    });

    /**
     * Create new posts
     */
    await prisma.post.createMany({
      skipDuplicates: true,
      data: datasources
        .map((d) => posts.map((p) => ({ ...p, datasourceId: d.id })))
        .flat(),
    });
  });

  console.log("TRANSACTED");
}
