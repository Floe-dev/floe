import { NextApiRequestExtension } from "@/lib/types/middleware";
import { defaultResponder } from "@/lib/helpers/defaultResponder";

async function handler({ project }: NextApiRequestExtension) {
  return {
    message: "Hello World!",
    project,
  };
}

export default defaultResponder(handler);
