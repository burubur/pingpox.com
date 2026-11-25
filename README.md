# pingpox.com: Jadwal Turnamen Tenis Meja Indonesia

A Next.js 14 (App Router, TypeScript) site that lists table tennis (tenis meja / ping pong) tournaments in Indonesia.
Tournament pages are generated at build time from **`data/tournaments.json`**. The player directory reads **`data/players.json`**, which is an empty array until a separately approved update.

## Pages

- **`/`**: the list (**Daftar**) and the month calendar (**Kalender**), with search, the Kota / Provinsi and Bulan filters,
  and the "Hanya yang terkonfirmasi" and "Tampilkan yang sudah lewat" toggles. Filters live in the URL
  (`?tampilan=kalender&q=…&lokasi=c:Bandung&bulan=2026-12&konfirmasi=1&lewat=1&kal=2026-12`), so a filtered view can be shared.
- **`/turnamen/<id>`**: one page per tournament (Ikhtisar, Divisi, Pendaftaran, Sumber), statically generated with its own
  title and Open Graph tags. Unknown ids return the "Turnamen tidak ditemukan" 404 page.
- **`/pemain`**: player directory with search and gender, province, and category filters. With an empty `players.json` it shows "Data pemain segera hadir".
- **`/pemain/<id>`**: one page per player id in `data/players.json` (header, stats, Hasil terkini, Riwayat turnamen). Unknown ids return "Pemain tidak ditemukan".

The look is a bold sports-site style inspired by event pages such as worldtabletennis.com, built only from original CSS
gradients and patterns: no third-party logos, photos, or assets are copied or hotlinked. Fonts are Barlow and Barlow
Condensed, self-hosted through `next/font`. The UI is in Indonesian and mobile-first.

Past/live flags, deadline flags, and countdowns use the visitor's current date in the browser, so they stay correct
between data updates even though the pages are static.

## Code map

```
app/layout.tsx                 nav, footer, fonts, site metadata
app/page.tsx                   list + calendar page
app/turnamen/[id]/page.tsx     detail pages (generateStaticParams, generateMetadata)
app/not-found.tsx              "Turnamen tidak ditemukan"
app/globals.css                the site stylesheet (Tailwind utilities on, preflight off)
components/TournamentBrowser.tsx   client: filters, URL params, list cards, calendar
components/TournamentDetail.tsx    client: detail body and section tabs
components/EventParts.tsx      badges, deadline flags, dates, category grid
lib/data.ts                    reads and validates data/tournaments.json (build time only)
lib/tournament.ts              types, normalization, date helpers
data/tournaments.json          tournament data
data/players.json              player directory (empty array until approved)
```

## Develop

```bash
npm ci
npm run dev      # http://localhost:3000
npm run lint
npm run build && npm start
```

## Data format (`data/tournaments.json`)


This is the same shape that Tournament Scout produces, so Scout's file can replace `data/tournaments.json` unchanged.
Scout's master copy lives at `/home/box/shared/tournament-scout/tournaments.json` (on the bot box). Copy it over `data/tournaments.json` in this repo.

```text
{
  "updated_at":  string, required   ISO 8601 date or datetime, e.g. "2026-11-17T20:50:00+07:00"
  "source_note": string | null      optional, free text about where the data came from
  "tournaments": array, required    may be empty []
}

tournament = {
  "id":                    string, required   unique slug, e.g. "kejurnas-tm-2026-jakarta"
  "name":                  string, required
  "start_date":            string | null      "YYYY-MM-DD"; null = date not announced yet
  "end_date":              string | null      "YYYY-MM-DD"; null = one-day event
  "city":                  string | null      used for the Kota filter, so keep spelling consistent ("Jakarta Selatan", "Bandung")
  "province":              string | null
  "venue":                 string | null
  "categories":            string[] | null    e.g. ["Tunggal Putra Umum", "Ganda Veteran 40+"]
  "registration_fee":      string | null      free text, e.g. "Rp150.000 per peserta"
  "registration_deadline": string | null      "YYYY-MM-DD"
  "organizer":             string | null
  "contact":               string | null      free text: official organizer contact from a public source only
  "source_urls":           string[], required at least one entry. http(s) URLs become links ("Sumber", or "Sumber 1", "Sumber 2", …);
                                              other text (e.g. "info komunitas, belum dikonfirmasi") is shown as plain text, not a link
  "date_found":            string | null      "YYYY-MM-DD", the date Scout found the entry
  "status":                "confirmed" | "unconfirmed"   anything other than "confirmed" shows a "Belum dikonfirmasi" badge
  "notes":                 string | null      shown under the details when present
  "sample":                boolean, optional  true = demo entry; shows a "Contoh data / sample" badge and a top banner
}
```

How the page handles the data:

- Optional fields that are `null`, missing, or `""` show as "Belum diumumkan".
- Events are sorted by `start_date`. Entries with `start_date: null` are listed last under "Tanggal belum diumumkan"; they are never treated as past and drop out when a month is picked.
- "Hanya yang terkonfirmasi" hides everything whose `status` is not `confirmed`. The count line reads e.g. "12 turnamen · 2 terkonfirmasi" for the cards currently shown.
- An event is "past" once its `end_date` (or `start_date` if there is no end date) is before today. Past events are hidden unless "Tampilkan yang sudah lewat" is ticked.
- The registration deadline is flagged as "N hari lagi" when it is 7 days away or less, and as "Pendaftaran ditutup" once it has passed.
- The Kota / Provinsi and Bulan dropdowns are built from the data (`city` and `province` as two option groups, and the month of `start_date`).
- Only `http(s)` URLs are rendered as links. Text is HTML-escaped.
- For backwards compatibility the page also accepts `divisions` in place of `categories` and a single `source_url` in place of `source_urls`.

Example entry:

```json
{
  "id": "contoh-open-bandung-2026",
  "name": "[CONTOH] Kejuaraan Tenis Meja Terbuka Bandung",
  "start_date": "2026-12-12",
  "end_date": "2026-12-14",
  "city": "Bandung",
  "province": "Jawa Barat",
  "venue": "GOR Contoh, Jl. Contoh No. 1",
  "categories": ["Tunggal Putra Umum", "Tunggal Putri Umum", "Ganda Veteran 40+", "Pemula"],
  "registration_fee": "Rp150.000 per peserta",
  "registration_deadline": "2026-11-22",
  "organizer": "Panitia Contoh",
  "contact": "kontak@example.com (contoh)",
  "source_urls": ["https://example.com", "https://example.com"],
  "date_found": "2026-11-17",
  "status": "confirmed",
  "notes": "Entri contoh untuk pratinjau. Bukan acara nyata.",
  "sample": true
}
```

Never add an invented tournament without `sample: true` (names starting with `[CONTOH]`, sources set to `https://example.com`).

### Privacy rule for published data

Only publish information that comes from a public web source. Never publish chat-group names, private-chat references, individual people's names, or personal phone numbers. Replace sources that exist only in community chats with the text `info komunitas, belum dikonfirmasi` (it is not rendered as a link), and set `contact` to `null` when it came from such a chat.

### Updating the data

1. Replace `data/tournaments.json`, keeping the shape above, and set `updated_at` to now.
2. Run the privacy check above, then validate the JSON: `python3 -m json.tool data/tournaments.json > /dev/null && echo OK`.
3. Commit and push to `main`. Vercel rebuilds and redeploys the site; new ids get their own detail pages automatically.

If the file is not valid JSON or `tournaments` is not an array, `next build` fails on purpose, so a broken data push
never replaces the live site. Check the Vercel deployment log if an update does not show up.
