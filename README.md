# Portfolio – Lucia Elena Manthey

Portfolio-Website als [Cloudflare Worker](https://developers.cloudflare.com/workers/) mit statischen Assets.

## Aufbau

| Pfad | Inhalt |
| --- | --- |
| `public/` | Die Website (HTML, CSS, Bilder) – wird direkt von Cloudflare ausgeliefert |
| `src/index.js` | Worker für die API-Routen unter `/api/*` |
| `wrangler.jsonc` | Worker-Konfiguration |

### API

- `GET /api/health` – Statusprüfung
- `POST /api/contact` – Kontaktformular (`name`, `email`, `message` als JSON)

## Lokal entwickeln

```bash
npm install
npm run dev        # http://localhost:8787
```

## Deployen

**Manuell:**

```bash
npx wrangler login
npm run deploy
```

Danach ist die Seite unter `https://portfolio-lucia-elena-manthey.<dein-subdomain>.workers.dev` erreichbar.

**Automatisch per GitHub Actions** (bei jedem Push auf `main`): Lege im Repo unter
*Settings → Secrets and variables → Actions* diese Secrets an:

- `CLOUDFLARE_API_TOKEN` – im Cloudflare-Dashboard unter *My Profile → API Tokens* mit der Vorlage „Edit Cloudflare Workers“ erstellen
- `CLOUDFLARE_ACCOUNT_ID` – steht im Cloudflare-Dashboard rechts auf der Workers-Übersicht

## Kontaktnachrichten speichern (optional)

Ohne weitere Einrichtung landen Kontaktanfragen nur in den Worker-Logs. Um sie dauerhaft zu speichern:

```bash
npx wrangler kv namespace create MESSAGES
```

und die ausgegebene ID in `wrangler.jsonc` eintragen:

```jsonc
"kv_namespaces": [{ "binding": "MESSAGES", "id": "<ID>" }]
```

## Eigene Domain

Im Cloudflare-Dashboard unter *Workers & Pages → portfolio-lucia-elena-manthey → Settings → Domains & Routes* eine Custom Domain hinzufügen.
