import { Context } from "probot";
import { prisma } from "@/server/db/client";
import { minimatch } from "minimatch";
import { Endpoints } from "@floe/utils";

export async function handlePushEvents(context: Context<"check_suite">) {
  const x = await context.octokit.checks.create({
    owner: context.payload.repository.owner.login,
    repo: context.payload.repository.name,
    name: "Floe Check",
    head_sha: context.payload.check_suite.head_sha,
  });

  console.log(111111, x);
}
