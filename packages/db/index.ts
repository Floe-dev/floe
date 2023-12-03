import { PrismaClient } from "@prisma/client";

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var -- allow
  var db: PrismaClient | undefined;
}

const db =
  global.db ||
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") global.db = db;

export { db };
export type { PrismaClient };
export * from "@prisma/client";
