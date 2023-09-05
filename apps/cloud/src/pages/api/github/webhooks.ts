import { createNodeMiddleware, createProbot } from "probot";
import app from "../../../probot";

export default createNodeMiddleware(app, {
  probot: createProbot(),
  webhooksPath: "/api/github/webhooks",
});
