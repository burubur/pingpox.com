import { createRequire } from "node:module";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";
import pg from "pg";
import bcrypt from "bcryptjs";

const require = createRequire(import.meta.url);

const SPECS = [
  {
    id: "acc-super",
    email: "owner@pingpox.com",
    displayName: "PingpoX Owner",
    role: "superuser",
    envKey: "SEED_OWNER_PASSWORD",
  },
  {
    id: "acc-trainer",
    email: "trainer@pingpox.com",
    displayName: "Coach Rina",
    role: "trainer",
    envKey: "SEED_TRAINER_PASSWORD",
  },
  {
    id: "acc-manager",
    email: "events@pingpox.com",
    displayName: "Event Desk",
    role: "event_manager",
    envKey: "SEED_MANAGER_PASSWORD",
  },
  {
    id: "acc-member",
    email: "member@pingpox.com",
    displayName: "Budi Member",
    role: "member",
    envKey: "SEED_MEMBER_PASSWORD",
  },
];

const localCredsPath = path.join(process.cwd(), ".data", "local-seed-credentials.json");
const appEnv = (process.env.APP_ENV ?? "").trim().toLowerCase();
const databaseUrl = process.env.DATABASE_URL?.trim() ?? "";

function passwordsFromEnv() {
  const out = {};
  for (const spec of SPECS) {
    const value = process.env[spec.envKey]?.trim();
    if (value) out[spec.envKey] = value;
  }
  return out;
}

async function loadOrCreateLocalPasswords() {
  try {
    const raw = JSON.parse(await readFile(localCredsPath, "utf8"));
    if (SPECS.every((spec) => typeof raw[spec.envKey] === "string" && raw[spec.envKey])) {
      return raw;
    }
  } catch {
    // generate
  }
  const generated = Object.fromEntries(
    SPECS.map((spec) => [spec.envKey, randomBytes(18).toString("base64url")]),
  );
  await mkdir(path.dirname(localCredsPath), { recursive: true });
  await writeFile(localCredsPath, `${JSON.stringify(generated, null, 2)}\n`, {
    mode: 0o600,
  });
  console.log(`seed-accounts: wrote local credentials to ${localCredsPath}`);
  return generated;
}

async function resolvePasswords() {
  const fromEnv = passwordsFromEnv();
  if (Object.keys(fromEnv).length > 0) return fromEnv;
  if (appEnv === "local") return loadOrCreateLocalPasswords();
  return {};
}

async function seedWithClient(query) {
  const passwords = await resolvePasswords();
  let seeded = 0;
  for (const spec of SPECS) {
    const password = passwords[spec.envKey];
    if (!password) continue;
    const passwordHash = await bcrypt.hash(password, 10);
    await query(
      `insert into accounts (id, email, password_hash, display_name, role)
       values ($1, $2, $3, $4, $5)
       on conflict (email) do update set
         password_hash = excluded.password_hash,
         display_name = excluded.display_name,
         role = excluded.role`,
      [spec.id, spec.email, passwordHash, spec.displayName, spec.role],
    );
    seeded += 1;
  }
  if (seeded === 0) {
    console.log(
      "seed-accounts: skipped (set SEED_*_PASSWORD secrets to create demo accounts)",
    );
  } else {
    console.log(`seed-accounts: upserted ${seeded} demo account(s)`);
  }
}

if (databaseUrl === "") {
  if (appEnv === "local") {
    // Local PGlite seeding happens in src/lib/db.ts on boot.
    await resolvePasswords();
    console.log("seed-accounts: prepared local credentials for PGlite boot");
  } else {
    console.log("seed-accounts: no DATABASE_URL; nothing to do");
  }
  process.exit(0);
}

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL_UNPOOLED?.trim() || databaseUrl,
});
await client.connect();
try {
  await seedWithClient((text, params) => client.query(text, params));
} finally {
  await client.end();
}

// silence unused require in environments without tsx
void require;
