import { z } from "zod";

export const schema = z.object({
  code: z.string(),
  state: z.string().nullish(),
  installationId: z.coerce.number().nullish(),
  setupAction: z.enum(["install", "request"]),
});
