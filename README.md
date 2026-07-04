# Arwin

**AI virtual try-on for fashion brands.**

Upload a garment and generate realistic model try-ons, ghost mannequin, flat
lay and studio product visuals — ready for e-commerce, Instagram, TikTok and
Shopify.

Arwin is an MVP built to run **with zero external services out of the box**
(mock AI + local file storage + a JSON gallery), and to **upgrade in place** to
Supabase + a real AI provider by setting environment variables.

---

## Tech stack

| Layer      | Choice                                              |
| ---------- | --------------------------------------------------- |
| Frontend   | Next.js 14 (App Router) + Tailwind CSS + TypeScript |
| Backend    | Next.js API routes (Node runtime)                   |
| Database   | Supabase (Postgres) — local JSON fallback           |
| Storage    | Supabase Storage — local `/public/uploads` fallback |
| AI         | Pluggable adapter: mock / Replicate / OpenAI / …    |
| Auth       | Supabase Auth (optional; not required for the MVP)  |

---

## Run it locally

```bash
# 1. Install dependencies
npm install

# 2. (Optional) configure env — the app runs without this
cp .env.example .env.local

# 3. Start the dev server
npm run dev
```

Open <http://localhost:3000>. With no configuration you're in **local mode**:

- Uploads are written to `public/uploads/`
- The gallery is stored in `.data/gallery.json`
- Generation uses the **mock** provider (returns your input image so the full
  flow works)

---

## Project structure

```
src/
├─ app/
│  ├─ page.tsx              # Landing page
│  ├─ upload/page.tsx       # Upload garment/model + pick style
│  ├─ generate/page.tsx     # Run generation + preview + export
│  ├─ gallery/page.tsx      # Saved results
│  ├─ settings/page.tsx     # Live config status + env reference
│  └─ api/
│     ├─ upload/route.ts    # POST file  → stored URL
│     ├─ generate/route.ts  # POST inputs → generation (calls AI adapter)
│     ├─ gallery/route.ts   # GET saved generations
│     └─ status/route.ts    # GET runtime config summary
├─ components/              # Navbar, Footer, UploadDropzone, StyleSelector, …
└─ lib/
   ├─ config.ts             # Env-driven mode switches
   ├─ types.ts              # Domain types (OutputStyle, Generation, …)
   ├─ storage.ts            # Supabase Storage OR local filesystem
   ├─ db.ts                 # Supabase table OR local JSON
   ├─ draft.ts              # Client draft passed Upload → Generate
   ├─ supabase/             # admin (service role) + browser clients
   └─ ai/                   # The AI adapter — the core seam
      ├─ types.ts           # AIProvider interface
      ├─ index.ts           # getAIProvider() factory
      ├─ mock.ts            # Default, no-service provider
      ├─ replicate.ts       # Real VTON model (stub, ready)
      ├─ openai.ts          # OpenAI images (stub, ready)
      └─ prompt.ts          # Structured → text prompt builder
```

---

## The AI adapter (how generation works)

Every provider implements one interface (`src/lib/ai/types.ts`):

```ts
interface AIProvider {
  name: string;
  generate(input: GenerateInput): Promise<GenerateResult>;
}

// input:  { clothingImageUrl, modelImageUrl?, style, category?, prompt? }
// output: { imageUrl, provider, meta? }
```

`getAIProvider()` picks the implementation from `AI_PROVIDER`. The UI and API
routes never know which model is running.

### Connect a real API later

1. Choose a provider and set `AI_PROVIDER` accordingly.
2. Fill in its keys (see below) in `.env.local`.
3. Restart. Nothing else changes.

**Replicate (recommended for true try-on)** — e.g. an IDM-VTON deployment:

```bash
AI_PROVIDER=replicate
REPLICATE_API_TOKEN=r8_...
REPLICATE_TRYON_MODEL=owner/model:versionhash
```

Adjust the input field names in `src/lib/ai/replicate.ts` to match your chosen
model's schema (`garment_image` / `human_image` are common defaults).

**OpenAI (good for studio / flat-lay / ghost):**

```bash
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
```

**Add another provider (Runware, custom VTON, …):** create
`src/lib/ai/<name>.ts` implementing `AIProvider`, then add a `case` in
`src/lib/ai/index.ts`.

---

## Connect Supabase (storage + database + auth)

1. Create a project at <https://supabase.com>.
2. Run `supabase/schema.sql` in the SQL editor (creates the `generations`
   table, RLS policies, and the `arwin` storage bucket).
3. Set env vars:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...      # server only
SUPABASE_STORAGE_BUCKET=arwin
```

On restart, uploads go to Supabase Storage and the gallery reads/writes the
`generations` table automatically.

> Auth: the browser client is ready in `src/lib/supabase/client.ts`. The MVP
> does not gate pages behind login; wire `getSupabaseBrowser()` into a sign-in
> flow and pass `user.id` into the API routes to make galleries per-user.

---

## Environment variables

See [`.env.example`](./.env.example) for the full list. All are optional — the
app runs without any of them.

---

## Build stages (as delivered)

- **Stage 1** — Project structure, landing page, upload UI, style selector,
  result preview.
- **Stage 2** — Upload handling, storage abstraction, gallery.
- **Stage 3** — AI adapter interface with a working mock provider.
- **Stage 4** — Real-integration seams: provider stubs, env vars, status page.
