// Semeia um casamento-demo publicado e populado (idempotente).
// Uso: SUPABASE_SECRET_KEY=... node scripts/seed-demo.mjs
const URL = "https://zyxjbbvusnqnhnxbdhac.supabase.co";
const SECRET = process.env.SUPABASE_SECRET_KEY;
if (!SECRET) {
  console.error("Falta SUPABASE_SECRET_KEY");
  process.exit(1);
}

const DEMO_EMAIL = "demo@enlace.app";
const DEMO_PASSWORD = "demo1234";
const SLUG = "marina-e-rafael";

const api = (path, opts = {}) =>
  fetch(`${URL}${path}`, {
    ...opts,
    headers: {
      apikey: SECRET,
      Authorization: `Bearer ${SECRET}`,
      "Content-Type": "application/json",
      ...(opts.headers ?? {}),
    },
  });

const rest = async (path, method, body, prefer = "return=representation") => {
  const res = await api(`/rest/v1/${path}`, {
    method,
    headers: { Prefer: prefer },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`${method} ${path} → HTTP ${res.status}: ${txt}`);
  }
  return res;
};

async function findDemoUser() {
  const list = await api("/auth/v1/admin/users?per_page=200").then((r) => r.json());
  return (list.users ?? []).find((u) => u.email === DEMO_EMAIL);
}

// 1) Remove demo anterior (se existir) e confirma a remoção
let existing = await findDemoUser();
if (existing) {
  await api(`/auth/v1/admin/users/${existing.id}`, { method: "DELETE" });
  for (let i = 0; i < 10 && (await findDemoUser()); i++) {
    await new Promise((r) => setTimeout(r, 400));
  }
  console.log("↺ demo anterior removida");
}

// 2) Usuário demo (email confirmado) — resiliente a JWT transitório e email_exists
let user;
for (let attempt = 1; attempt <= 5; attempt++) {
  const uRes = await api("/auth/v1/admin/users", {
    method: "POST",
    body: JSON.stringify({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: "Marina Costa" },
    }),
  });
  user = await uRes.json();
  if (uRes.ok && user.id) break;

  // Já existe? Localiza e remove, depois tenta de novo.
  if (user?.error_code === "email_exists") {
    const dup = await findDemoUser();
    if (dup) {
      await api(`/auth/v1/admin/users/${dup.id}`, { method: "DELETE" });
      await new Promise((r) => setTimeout(r, 600));
    }
  }

  if (attempt === 5) {
    throw new Error(`Falha ao criar usuário demo: HTTP ${uRes.status} ${JSON.stringify(user)}`);
  }
  await new Promise((r) => setTimeout(r, 700));
}
console.log("✓ usuário demo:", user.id);

// 3) Casamento publicado
const wedding = (
  await rest("weddings", "POST", {
    owner_id: user.id,
    slug: SLUG,
    partner_one_name: "Marina",
    partner_two_name: "Rafael",
    title: "Casamento de Marina & Rafael",
    hero_headline: "Vamos nos casar",
    event_date: "2026-11-14T16:00:00-03:00",
    event_location: "Serra da Mantiqueira, SP",
    welcome_message:
      "Depois de sete anos e uma vida inteira de planos, escolhemos o para sempre. E queremos você ao nosso lado nesse dia.",
    story:
      "Nos conhecemos numa viagem de mochilão em 2019 e desde então não paramos mais. Agora queremos celebrar esse amor com quem amamos.",
    cover_image_url: null,
    primary_color: "#7a1f2b",
    is_published: true,
  }).then((r) => r.json())
)[0];
console.log("✓ casamento:", wedding.slug);

// 4) Categorias
const cats = await rest("gift_categories", "POST", [
  { wedding_id: wedding.id, name: "Cozinha", sort_order: 1 },
  { wedding_id: wedding.id, name: "Casa", sort_order: 2 },
  { wedding_id: wedding.id, name: "Experiências", sort_order: 3 },
]).then((r) => r.json());
const cat = (n) => cats.find((c) => c.name === n)?.id ?? null;

// 5) Presentes
const giftRows = [
  { category: "Cozinha", title: "Jogo de panelas de inox", featured: true },
  { category: "Cozinha", title: "Cafeteira espresso", featured: false },
  { category: "Casa", title: "Jogo de cama king", featured: false },
  { category: "Casa", title: "Aspirador robô", featured: false },
  { category: "Experiências", title: "Cota da lua de mel", featured: true },
  { category: "Experiências", title: "Jantar dos noivos", featured: false },
];
const gifts = await rest(
  "gifts",
  "POST",
  giftRows.map((g, i) => ({
    wedding_id: wedding.id,
    category_id: cat(g.category),
    title: g.title,
    is_featured: g.featured,
    sort_order: i + 1,
  })),
).then((r) => r.json());
console.log(`✓ ${gifts.length} presentes`);

// 6) RSVPs + recados aprovados
await rest("rsvps", "POST", [
  { wedding_id: wedding.id, guest_name: "Carlos Mendes", status: "confirmed", companions: 1 },
  { wedding_id: wedding.id, guest_name: "Fernanda Lima", status: "confirmed", companions: 0 },
  { wedding_id: wedding.id, guest_name: "Roberto Alves", status: "declined", companions: 0 },
], "return=minimal");

await rest("guestbook_messages", "POST", [
  { wedding_id: wedding.id, author_name: "Tia Cláudia", content: "Que a vida de vocês seja tão linda quanto esse amor. Felicidades!", is_approved: true },
  { wedding_id: wedding.id, author_name: "Amigos da faculdade", content: "Finalmente! Já não era sem tempo. Contem com a gente sempre 💛", is_approved: true },
], "return=minimal");

console.log("\n✅ Demo pronta!");
console.log(`   Página pública:  /${SLUG}`);
console.log(`   Login demo:      ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
