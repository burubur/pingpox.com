export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if ((process.env.APP_ENV ?? "").trim().toLowerCase() !== "local") return;
  // Next.js 14 webpack-bundles `instrumentation.ts` and cannot load pg/pglite here.
  // PGlite migrations and seed accounts run on the first DB query (`lib/db.ts`), or run `node scripts/warm-pglite.mjs`.
}