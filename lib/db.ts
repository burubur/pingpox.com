import { mkdir, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import pg from "pg";

const databaseUrl = process.env.DATABASE_URL?.trim() ?? "";

type DbGlobal = {
  pingpoxPool?: pg.Pool;
  pingpoxLocal?: Promise<PGlite>;
};

const globalForDb = globalThis as unknown as DbGlobal;

export async function sql<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  if (databaseUrl !== "") {
    globalForDb.pingpoxPool ??= new pg.Pool({
      connectionString: databaseUrl,
      max: 5,
    });
    return (await globalForDb.pingpoxPool.query(text, params)).rows as T[];
  }
  globalForDb.pingpoxLocal ??= startLocal().catch((error: unknown) => {
    globalForDb.pingpoxLocal = undefined;
    throw error;
  });
  return (await (await globalForDb.pingpoxLocal).query<T>(text, params)).rows;
}

export async function sqlOne<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = [],
): Promise<T | null> {
  const rows = await sql<T>(text, params);
  return rows[0] ?? null;
}

export async function withClient<T>(
  fn: (query: typeof sql) => Promise<T>,
): Promise<T> {
  return fn(sql);
}

async function startLocal(): Promise<PGlite> {
  const dataDir = path.join(process.cwd(), ".data", "pglite");
  await mkdir(dataDir, { recursive: true });
  const db = new PGlite(dataDir);
  const migrationsDir = path.join(process.cwd(), "migrations");
  const files = (await readdir(migrationsDir).catch(() => []))
    .filter((f) => f.endsWith(".sql"))
    .sort();
  const applied = await db
    .query<{ name: string }>(
      "select name from schema_migrations order by name",
    )
    .then((r) => new Set(r.rows.map((row) => row.name)))
    .catch(async () => {
      await db.exec(
        "create table if not exists schema_migrations (name text primary key, applied_at timestamptz not null default now())",
      );
      return new Set<string>();
    });
  for (const file of files) {
    if (applied.has(file)) continue;
    await db.exec(await readFile(path.join(migrationsDir, file), "utf8"));
    await db.query("insert into schema_migrations (name) values ($1)", [file]);
  }
  const { ensureSeedAccounts } = await import("@/lib/seed-accounts");
  await ensureSeedAccounts(async <T = Record<string, unknown>>(text: string, params: unknown[] = []) => {
    return (await db.query<T>(text, params)).rows;
  });
  return db;
}

export function resetLocalDbForTests(): void {
  globalForDb.pingpoxLocal = undefined;
  globalForDb.pingpoxPool = undefined;
}

export function isUsingPostgres(): boolean {
  return databaseUrl !== "";
}
