import { getPassword, setPassword } from "keytar";
import { TokenResponse } from "../types.js";

export async function getAccessToken() {
  const token = await getPassword("floeInstallation", "githubUserAccessToken");

  if (!token) {
    throw new Error("No token found");
  }

  return JSON.parse(token) as TokenResponse;
}

export async function setAccessToken(token: TokenResponse) {
  return setPassword(
    "floeInstallation",
    "githubUserAccessToken",
    JSON.stringify(token)
  );
}
