// Cloudflare Worker für das Portfolio von Lucia Elena Manthey.
// Statische Dateien aus ./public liefert Cloudflare direkt aus;
// dieser Worker kümmert sich nur um die Routen unter /api/*.

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

async function handleContact(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Ungültige Anfrage." }, 400);
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ ok: false, error: "Bitte Name, gültige E-Mail und Nachricht angeben." }, 422);
  }
  if (name.length > 200 || email.length > 200 || message.length > 5000) {
    return json({ ok: false, error: "Eingabe zu lang." }, 413);
  }

  const entry = { name, email, message, receivedAt: new Date().toISOString() };

  // Optional: Nachrichten in einem KV-Namespace "MESSAGES" speichern (siehe README).
  if (env.MESSAGES) {
    await env.MESSAGES.put(`msg:${entry.receivedAt}:${crypto.randomUUID()}`, JSON.stringify(entry));
  } else {
    console.log("Neue Kontaktanfrage", entry);
  }

  return json({ ok: true, message: `Danke, ${name}! Deine Nachricht ist angekommen.` });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return json({ ok: true, owner: env.OWNER_NAME, time: new Date().toISOString() });
    }

    if (url.pathname === "/api/contact") {
      if (request.method !== "POST") {
        return json({ ok: false, error: "Nur POST erlaubt." }, 405);
      }
      return handleContact(request, env);
    }

    if (url.pathname.startsWith("/api/")) {
      return json({ ok: false, error: "Nicht gefunden." }, 404);
    }

    return env.ASSETS.fetch(request);
  },
};
