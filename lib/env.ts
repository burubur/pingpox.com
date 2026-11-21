export type AppEnv = "local" | "dev-container" | "dev-cloud" | "production";

export function getAppEnv(): AppEnv {
  const value = process.env.APP_ENV?.trim();
  if (
    value === "local" ||
    value === "dev-container" ||
    value === "dev-cloud" ||
    value === "production"
  ) {
    return value;
  }
  if (process.env.DATABASE_URL?.trim()) {
    return "dev-cloud";
  }
  return "local";
}

export function getAppUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    "http://127.0.0.1:3847"
  );
}
