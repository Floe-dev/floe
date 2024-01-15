import type { z } from "zod";
import { redirect } from "next/navigation";
import { HttpError } from "@floe/lib/http-error";
import { env } from "~/env.mjs";
import type { schema } from "./schema";
import { getOctokit } from "./get-octokit";

export async function handleSetupInstallWithoutState(
  parsedSchema: z.infer<typeof schema>
) {
  const { code, installationId } = parsedSchema;
  const octokit = await getOctokit(code);
  const installationsResp = await octokit.request("GET /user/installations", {
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  const installation = installationsResp.data.installations.find(
    (i) => i.id === installationId
  );

  if (!installation) {
    throw new HttpError({
      message: "The installation was not found.",
      statusCode: 400,
    });
  }

  /**
   * Email
   */
  const email = "contact@floe.dev";

  /**
   * Let me know that someone has requested an installation.
   */
  await fetch("https://api.sendgrid.com/v3/mail/send", {
    // The body format will vary depending on provider, please see their documentation
    // for further details.
    body: JSON.stringify({
      personalizations: [{ to: [{ email }] }],
      from: { email: "noreply@floe.dev" },
      subject: "📥 Installation Request",
      content: [
        {
          type: "text/plain",
          value: `Installation request for\n\nInstallation ID: ${installationId}\nGitHub Account Login:${JSON.stringify(
            // @ts-expect-error - login is defined
            installation.account?.login ??
              installation.account?.name ??
              "Name not found"
          )}\nGitHub Account Email: ${
            // @ts-expect-error - login is defined
            installation.account?.email ?? "Email not found"
          }`,
        },
      ],
    }),
    headers: {
      // Authentication will also vary from provider to provider, please see their docs.
      Authorization: `Bearer ${env.SENDGRID_API}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  redirect("/installation/confirmed");
}
