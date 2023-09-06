import { Octokit } from "octokit";
import { Endpoints } from "@octokit/types";

export const getUser = async (
  octokit: Octokit,
  {
    username,
  }: {
    username: string;
  }
) => {
  let res: Endpoints["GET /users/{username}"]["response"] | undefined =
    undefined;

  try {
    res = await octokit.request("GET /users/{username}", {
      username,
    });
  } catch (e) {
    console.warn(e);
  }

  return res?.data;
};
