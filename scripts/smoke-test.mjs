// Smoke test de RLS end-to-end contra o banco real.
// Seed (service_role) → testes como anônimo (publishable) → cleanup.
const URL = "https://zyxjbbvusnqnhnxbdhac.supabase.co";
const SECRET = process.env.SUPABASE_SECRET_KEY;
const PUB = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!SECRET || !PUB) {
  console.error("Faltam SUPABASE_SECRET_KEY e/ou NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  process.exit(1);
}

const admin = (path, opts = {}) =>
  fetch(`${URL}${path}`, {
    ...opts,
    headers: {
      apikey: SECRET,
      Authorization: `Bearer ${SECRET}`,
      "Content-Type": "application/json",
      ...(opts.headers ?? {}),
    },
  });

const anon = (path, opts = {}) =>
  fetch(`${URL}${path}`, {
    ...opts,
    headers: {
      apikey: PUB,
      Authorization: `Bearer ${PUB}`,
      "Content-Type": "application/json",
      ...(opts.headers ?? {}),
    },
  });

let pass = 0;
let fail = 0;
const check = (name, cond, extra = "") => {
  console.log(`${cond ? "  ✅" : "  ❌"} ${name}${extra ? ` — ${extra}` : ""}`);
  if (cond) pass++;
  else fail++;
};

const rnd = Math.floor(Math.random() * 1e6);
const email = `smoke_${rnd}@example.com`;
const slug = `smoke-${rnd}`;
let userId, weddingId, giftId, unpubId;

try {
  // 1) Cria usuário (dispara trigger de profile)
  const uRes = await admin("/auth/v1/admin/users", {
    method: "POST",
    body: JSON.stringify({ email, password: "Sup3r$ecret!", email_confirm: true }),
  });
  userId = (await uRes.json()).id;
  check("Cria usuário via admin", !!userId);

  // profile criado pelo trigger?
  const pRes = await admin(`/rest/v1/profiles?id=eq.${userId}&select=id`);
  const profiles = await pRes.json();
  check("Trigger handle_new_user criou o profile", Array.isArray(profiles) && profiles.length === 1);

  // 2) Cria casamento PUBLICADO (service_role bypassa RLS)
  const wRes = await admin("/rest/v1/weddings", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      owner_id: userId,
      slug,
      partner_one_name: "Ana",
      partner_two_name: "João",
      is_published: true,
    }),
  });
  weddingId = (await wRes.json())[0]?.id;
  check("Cria casamento publicado", !!weddingId);

  // casamento não publicado (para teste de bloqueio)
  const w2 = await admin("/rest/v1/weddings", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      owner_id: userId,
      slug: `${slug}-draft`,
      partner_one_name: "Rascunho",
      partner_two_name: "Teste",
      is_published: false,
    }),
  });
  unpubId = (await w2.json())[0]?.id;

  // 3) Cria presente
  const gRes = await admin("/rest/v1/gifts", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      wedding_id: weddingId,
      title: "Jogo de panelas",
      price: 500,
      quantity_desired: 1,
    }),
  });
  giftId = (await gRes.json())[0]?.id;
  check("Cria presente", !!giftId);

  console.log("\n— Testes como convidado ANÔNIMO (publishable key) —");

  // Ler casamento publicado
  const rw = await anon(`/rest/v1/weddings?slug=eq.${slug}&select=id,partner_one_name`);
  const rwData = await rw.json();
  check("Anônimo LÊ casamento publicado", Array.isArray(rwData) && rwData.length === 1);

  // NÃO ler casamento rascunho
  const rwu = await anon(`/rest/v1/weddings?id=eq.${unpubId}&select=id`);
  const rwuData = await rwu.json();
  check("Anônimo NÃO lê casamento rascunho (RLS)", Array.isArray(rwuData) && rwuData.length === 0);

  // Ler presentes do publicado
  const rg = await anon(`/rest/v1/gifts?wedding_id=eq.${weddingId}&select=id`);
  check("Anônimo LÊ presentes do publicado", (await rg.json()).length === 1);

  // Ler view de agregados
  const rs = await anon(`/rest/v1/gift_stats?wedding_id=eq.${weddingId}&select=gift_id,reserved_quantity`);
  check("Anônimo LÊ view gift_stats", Array.isArray(await rs.json()));

  // Inserir RSVP (permitido em publicado)
  const ir = await anon("/rest/v1/rsvps", {
    method: "POST",
    body: JSON.stringify({ wedding_id: weddingId, guest_name: "Convidado", status: "confirmed", companions: 1 }),
  });
  check("Anônimo INSERE RSVP em publicado", ir.status === 201, `HTTP ${ir.status}`);

  // Inserir contribuição
  const ic = await anon("/rest/v1/contributions", {
    method: "POST",
    body: JSON.stringify({ wedding_id: weddingId, gift_id: giftId, guest_name: "Convidado", amount: 100 }),
  });
  check("Anônimo INSERE contribuição em publicado", ic.status === 201, `HTTP ${ic.status}`);

  // NÃO inserir RSVP em rascunho
  const iru = await anon("/rest/v1/rsvps", {
    method: "POST",
    body: JSON.stringify({ wedding_id: unpubId, guest_name: "X", status: "confirmed" }),
  });
  check("Anônimo NÃO insere RSVP em rascunho (RLS)", iru.status === 401 || iru.status === 403, `HTTP ${iru.status}`);

  // NÃO ler contribuições (privacidade)
  const rc = await anon(`/rest/v1/contributions?wedding_id=eq.${weddingId}&select=id`);
  const rcData = await rc.json();
  check("Anônimo NÃO lê contribuições (privacidade)", Array.isArray(rcData) && rcData.length === 0);

  // Notificação criada para o dono (trigger)?
  const nRes = await admin(`/rest/v1/notifications?wedding_id=eq.${weddingId}&select=type`);
  const notifs = await nRes.json();
  check("Triggers de notificação dispararam", Array.isArray(notifs) && notifs.length >= 2, `${notifs.length} notificações`);
} finally {
  // Cleanup: apagar usuário cascateia profiles → weddings → gifts → etc.
  if (userId) {
    await admin(`/auth/v1/admin/users/${userId}`, { method: "DELETE" });
    console.log("\n🧹 Cleanup: usuário de teste removido (cascata).");
  }
}

console.log(`\n${fail === 0 ? "✅" : "❌"} Resultado: ${pass} passaram, ${fail} falharam.`);
process.exit(fail === 0 ? 0 : 1);
