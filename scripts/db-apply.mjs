// Aplica as migrações SQL no banco remoto via Supabase Management API.
// Não usa senha do banco — apenas o access token (SUPABASE_ACCESS_TOKEN).
// Uso: SUPABASE_ACCESS_TOKEN=sbp_... node scripts/db-apply.mjs [arquivo.sql]
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const token = process.env.SUPABASE_ACCESS_TOKEN;
const ref = process.env.SUPABASE_PROJECT_REF || "zyxjbbvusnqnhnxbdhac";

if (!token) {
  console.error("✗ SUPABASE_ACCESS_TOKEN ausente no ambiente.");
  process.exit(1);
}

const here = dirname(fileURLToPath(import.meta.url));
const migrationsDir = join(here, "..", "supabase", "migrations");
const endpoint = `https://api.supabase.com/v1/projects/${ref}/database/query`;

const only = process.argv[2];
const files = only
  ? [only]
  : readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();

async function runSql(sql) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sql }),
  });
  const body = await res.text();
  return { ok: res.ok, status: res.status, body };
}

let failed = false;
for (const file of files) {
  const path = file.includes("/") ? file : join(migrationsDir, file);
  const sql = readFileSync(path, "utf8");
  process.stdout.write(`▶ ${file.split(/[\\/]/).pop()} … `);
  const { ok, status, body } = await runSql(sql);
  if (!ok) {
    console.log("ERRO");
    console.error(`  HTTP ${status}\n  ${body}`);
    failed = true;
    break;
  }
  console.log("OK");
}

if (failed) process.exit(1);
console.log("\n✅ Migrações aplicadas com sucesso.");
