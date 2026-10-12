# WareTrack 3D

Dashboard pelacakan gudang 3D bergaya isometrik. Memvisualisasikan alur pengiriman barang dari
**gudang → jalan raya → toko**, lengkap dengan forklift dan box car yang bergerak, panel detail,
kartu KPI, dan tracker status pengiriman.

Dibangun dengan **Vite + React + TypeScript + Three.js** (React Three Fiber & Drei).

## Fitur

- Kamera isometrik (orthographic) — drag untuk geser, klik kanan untuk putar, scroll untuk zoom
- Gudang, toko kelontong, jalan raya, palet, kontainer, dan pohon dalam 3D
- Forklift dan box car beranimasi; box car mengikuti siklus *loading → transit → unloading → return*
- Panel detail muncul saat objek diklik (forklift, truk, palet, gudang, jalan, toko)
- Shipment tracker yang sinkron dengan posisi truk
- Halaman login sederhana (session disimpan di `sessionStorage`)

## Persyaratan

- Node.js 20.19+ atau 22.12+
- npm

## Menjalankan

```bash
npm install
npm run dev       # http://localhost:5173
```

## Scripts

| Perintah | Keterangan |
|---|---|
| `npm run dev` | Dev server dengan HMR |
| `npm run build` | Type-check + build production ke `dist/` |
| `npm run preview` | Preview hasil build |
| `npm run lint` | Lint dengan Oxlint |

## Struktur project

```
src/
├── App.tsx        Root: login gate + state global
├── data.ts        Mock data (nanti diganti API)
├── index.css      Styling
├── scene/         Objek & animasi 3D
└── ui/            Overlay 2D (top bar, login, panel, tracker)
```

Penjelasan lengkap per file ada di [`docs/project-map.md`](docs/project-map.md).
Konsep 3D dan rencana pengembangan ada di [`docs/panduan-3d.md`](docs/panduan-3d.md).

## Status

Prototype — semua data masih mock dan login menerima kredensial apa pun.
