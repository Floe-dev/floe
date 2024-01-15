import { HttpError } from "@floe/lib/http-error";
import type { NextRequest } from "next/server";
import { schema } from "./schema";
import { handleSetupRequestWithState } from "./handle-setup-request-with-state";
import { handleSetupInstallWithState } from "./handle-setup-install-with-state";
import { handleSetupInstallWithoutState } from "./handle-setup-install-without-state";
import { handleSetupRequestWithoutState } from "./handle-setup-request-without-state";

const handler = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;

  const parsedSchema = schema.parse({
    code: searchParams.get("code"),
    state: searchParams.get("state"),
    setupAction: searchParams.get("setup_action"),
    installationId: searchParams.get("installation_id"),
  });

  /**
   * REQUEST ACTION
   * Handle request install action.
   * This happens when a GitHub app needs to go through approval.
   */
  if (parsedSchema.setupAction === "request") {
    if (parsedSchema.state) {
      return handleSetupRequestWithState(parsedSchema);
    }

    /**
     * This can happen is a user chooses to request installation directly from
     * the Floe Github page (ie.
     * https://github.com/apps/floe-app/installations/select_target)
     */
    handleSetupRequestWithoutState();
    return;
  }

  /**
   * INSTALL ACTION
   * If not request, then it's an install action.
   */

  /**
   * If there is state, this was triggered from a workflow where the approval
   * flow was not required (eg. when the user is the owner)
   */
  if (parsedSchema.state) {
    return handleSetupInstallWithState({
      ...parsedSchema,
      state: parsedSchema.state,
    });
  }

  /**
   * If there is no state, this was triggered from a workflow where the approval
   * flow was required (eg. when the user is not the owner).
   *
   * This workflow is not supported by GitHub yet:
   * https://github.com/orgs/community/discussions/42351 SO, we cannot
   * programtically set the installation. Instead, we can just direct the
   * installer (a GitHub admin) to a confirmation page. I then need to manually
   * set the installation and set the status to "installed".
   */
  if (parsedSchema.installationId) {
    return handleSetupInstallWithoutState(parsedSchema);
  }

  /**
   * If we got here, something is wrong.
   */
  throw new HttpError({
    message: "Invalid request",
    statusCode: 400,
    log: true,
  });
};

export { handler as GET, handler as POST };
