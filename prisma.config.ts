import "dotenv/config";

import { defineConfig } from "prisma/config";

function migrationDatabaseUrl() {
  if (process.env.DIRECT_URL) return process.env.DIRECT_URL;
  if (!process.env.DATABASE_URL) return undefined;

  const url = new URL(process.env.DATABASE_URL);
  url.hostname = url.hostname.replace(/-pooler(?=\.)/, "");
  url.searchParams.delete("pgbouncer");
  return url.toString();
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations", seed: "tsx prisma/seed.ts" },
  datasource: {
    url: migrationDatabaseUrl(),
    shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL,
  },
});
