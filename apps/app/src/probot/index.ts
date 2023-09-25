import prisma from "@floe/db";
import { Probot } from "probot";
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

    console.log(1111111, commits);
  });
};

export default appHandler;
