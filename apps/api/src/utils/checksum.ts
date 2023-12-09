import { createHash } from "node:crypto";

export function createChecksum(data: string) {
  const hash = createHash("sha256");
  hash.update(data);
  return hash.digest("base64");
}
