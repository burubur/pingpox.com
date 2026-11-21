import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export type SeedAccountSpec = {
  id: string;
  email: string;
  displayName: string;
  role: "superuser" | "event_manager" | "trainer" | "member";
  envKey:
    | "SEED_OWNER_PASSWORD"
    | "SEED_TRAINER_PASSWORD"
    | "SEED_MANAGER_PASSWORD"
    | "SEED_MEMBER_PASSWORD";
};

export const SEED_ACCOUNT_SPECS: SeedAccountSpec[] = [
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

type QueryFn = <T = Record<string, unknown>>(
  text: string,
  params?: unknown[],
) => Promise<T[]>;

const LOCAL_CREDS_PATH = path.join(
  process.cwd(),
  ".data",
  "local-seed-credentials.json",
);

function appEnv(): string {
  // Only treat as local when explicitly set — hosted builds often omit APP_ENV.
  return (process.env.APP_ENV ?? "").trim().toLowerCase();
}

function passwordsFromEnv(): Partial<Record<SeedAccountSpec["envKey"], string>> {
  const out: Partial<Record<SeedAccountSpec["envKey"], string>> = {};
  for (const spec of SEED_ACCOUNT_SPECS) {
    const value = process.env[spec.envKey]?.trim();
    if (value) out[spec.envKey] = value;
  }
  return out;
}

async function loadOrCreateLocalPasswords(): Promise<
  Record<SeedAccountSpec["envKey"], string>
> {
  try {
    const raw = JSON.parse(await readFile(LOCAL_CREDS_PATH, "utf8")) as Record<
      string,
      string
    >;
    const complete = SEED_ACCOUNT_SPECS.every(
      (spec) => typeof raw[spec.envKey] === "string" && raw[spec.envKey]!.length > 0,
    );
    if (complete) {
      return raw as Record<SeedAccountSpec["envKey"], string>;
    }
  } catch {
    // generate below
  }

  const generated = Object.fromEntries(
    SEED_ACCOUNT_SPECS.map((spec) => [spec.envKey, randomBytes(18).toString("base64url")]),
  ) as Record<SeedAccountSpec["envKey"], string>;

  await mkdir(path.dirname(LOCAL_CREDS_PATH), { recursive: true });
  await writeFile(LOCAL_CREDS_PATH, `${JSON.stringify(generated, null, 2)}\n`, {
    mode: 0o600,
  });
  console.info(
    `seed-accounts: wrote local credentials to ${LOCAL_CREDS_PATH} (gitignored)`,
  );
  return generated;
}

export async function resolveSeedPasswords(): Promise<
  Partial<Record<SeedAccountSpec["envKey"], string>>
> {
  const fromEnv = passwordsFromEnv();
  if (Object.keys(fromEnv).length > 0) return fromEnv;

  if (appEnv() === "local") {
    return loadOrCreateLocalPasswords();
  }

  return {};
}

export async function ensureSeedAccounts(query: QueryFn): Promise<number> {
  const passwords = await resolveSeedPasswords();
  let seeded = 0;

  for (const spec of SEED_ACCOUNT_SPECS) {
    const password = passwords[spec.envKey];
    if (!password) continue;
    const passwordHash = await hashPassword(password);
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

  if (seeded === 0 && appEnv() !== "local") {
    console.info(
      "seed-accounts: skipped (set SEED_OWNER_PASSWORD / SEED_TRAINER_PASSWORD / SEED_MANAGER_PASSWORD / SEED_MEMBER_PASSWORD to create demo accounts)",
    );
  }

  return seeded;
}

export function localSeedCredentialsPath(): string {
  return LOCAL_CREDS_PATH;
}
