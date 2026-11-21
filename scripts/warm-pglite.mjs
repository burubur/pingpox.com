import { mkdir, readdir, readFile } from "node:fs/promises";
import path from "node:path";

async function main() {
  const dataDir = path.join(process.cwd(), ".data", "pglite");
  await mkdir(dataDir, { recursive: true });
  const { PGlite } = await import("@electric-sql/pglite");
  const db = new PGlite(dataDir);
  const migrationsDir = path.join(process.cwd(), "migrations");
  const files = (await readdir(migrationsDir).catch(() => []))
    .filter((f) => f.endsWith(".sql"))
    .sort();
  const applied = await db
    .query("select name from schema_migrations order by name")
    .then((r) => new Set(r.rows.map((row) => row.name)))
    .catch(async () => {
      await db.exec(
        "create table if not exists schema_migrations (name text primary key, applied_at timestamptz not null default now())",
      );
      return new Set();
    });
  for (const file of files) {
    if (applied.has(file)) continue;
    await db.exec(await readFile(path.join(migrationsDir, file), "utf8"));
    await db.query("insert into schema_migrations (name) values ($1)", [file]);
  }
  await db.query("select 1");
}

main().catch(() => {
  process.exit(0);
});