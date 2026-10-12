# Project Map — WareTrack 3D

> Peta cepat struktur project. Baca file ini dulu sebelum membuka source code,
> lalu langsung lompat ke file yang relevan. **Update file ini setiap kali menambah,
> menghapus, atau mengubah tanggung jawab sebuah file.**

## Ringkasan

Dashboard pelacakan gudang 3D bergaya isometrik. Menampilkan satu alur pengiriman:
**Warehouse WH-01 → Jl. Raya Logistik → Toko Kelontong**, dengan box car (TRK-2051)
yang beranimasi bolak-balik dan forklift (FL-01) yang berkeliling gudang.
Semua data masih mock (`src/data.ts`), belum ada backend.

**Stack:** Vite 8 · React 19 · TypeScript 6 · Three.js · React Three Fiber · Drei · Oxlint

## Struktur folder

```
hello-web-three/
├── LICENSE                 MIT
├── index.html              Entry HTML Vite (title "WareTrack 3D", mount #root)
├── package.json            Scripts: dev, build (tsc -b && vite build), lint (oxlint), preview
├── vite.config.ts          Config Vite + plugin React
├── tsconfig*.json          Config TypeScript (app = src/, node = vite.config)
├── .oxlintrc.json          Rule linter (react hooks, only-export-components)
├── public/                 Aset statis (favicon.svg, icons.svg)
├── docs/
│   ├── project-map.md      ← file ini
│   └── panduan-3d.md       Panduan: cara run, daftar fitur, konsep 3D, ide pengembangan
└── src/
    ├── main.tsx            Bootstrap React (createRoot + StrictMode), import index.css
    ├── App.tsx             Root: auth gate + state global + layout
    ├── data.ts             Mock data, tipe Entity & ShipmentPhase
    ├── index.css           Semua styling (satu file, class-based)
    ├── scene/              Dunia 3D (React Three Fiber)
    │   ├── Scene.tsx
    │   ├── Warehouse.tsx
    │   ├── Store.tsx
    │   ├── Vehicles.tsx
    │   └── Primitives.tsx
    └── ui/                 Overlay HTML 2D di atas canvas
        ├── TopBar.tsx
        ├── Login.tsx
        ├── Overlay.tsx
        └── Tracker.tsx
```

## Ringkasan per file

### Root `src/`

| File | Fungsi |
|---|---|
| `main.tsx` | Render `<App />` ke `#root`. Tidak ada logika lain. |
| `App.tsx` | **State global**: `user` (login, disimpan di `sessionStorage` key `waretrack-user`), `selected` (id entity yang dipilih, default `TRK-2051`), `phase` (`ShipmentPhase`). Jika belum login → `<Login>`; jika sudah → `TopBar` + `Scene` + `KpiCards` + `Tracker` + `DetailPanel`. |
| `data.ts` | **Sumber data mock** (nanti diganti API). Ekspor: tipe `Entity` (kind: forklift/truck/pallet/warehouse/road/store), `entities` (map id → detail: `FL-01`, `TRK-2051`, `PAL-1026`, `WH-01`, `ROAD-01`, `STORE-01`), tipe `ShipmentPhase` (`loading`/`transit`/`unloading`/`return`), `phaseInfo` (phase → stage 0-2, label, status truk & toko), `sites` (WH-01..03 untuk dropdown), `kpis` (3 kartu KPI). |
| `index.css` | Semua style. Kelompok class: layout (`.app`, `.stage`), topbar (`.topbar`, `.search`, `.site*`, `.live`, `.profile*`, `.menu*`), kartu (`.card`, `.kpis`, `.kpi*`), panel detail (`.detail`, `.detail.open`, `.pill`, `.row`), label 3D (`.zone*`, `.tag`, `.tag-blue`), tracker (`.tracker*`, `.steps`, `.step-dot`, `.done`, `.current`), login (`.login*`, `.field`, `.input`, `.btn-primary`, `.error`). |

### `src/scene/` — 3D

| File | Fungsi |
|---|---|
| `Scene.tsx` | **Komposisi dunia 3D.** `<Canvas>` + `OrthographicCamera` (isometrik) + `MapControls` (pan/rotate/zoom) + lampu & bayangan. Menaruh semua objek dan posisinya: zona ① Warehouse (x≈0), ② jalan (`ROAD_Z = 24`), ③ toko (x≈40); `CENTER` = target kamera. Helper lokal: `Ground` (plane, bisa diklik), `ZoneLabel` (label bernomor via `<Html>`). Klik area kosong → `onSelect(null)`. Daftar pohon di konstanta `TREES`. |
| `Warehouse.tsx` | `Warehouse` — gedung gudang (dinding, list biru, atap pelana 2 bidang, 3 pintu dock). Klik → pilih `WH-01`. |
| `Store.tsx` | `Store` — toko kelontong tujuan (dinding, atap, papan nama, kanopi belang merah-putih, pintu/jendela, rak barang). Klik → pilih `STORE-01`. |
| `Vehicles.tsx` | **Animasi kendaraan (`useFrame`).** `Forklift`: jalan di kurva loop `CatmullRomCurve3`, garpu naik-turun. `Truck`: mengikuti array `SEGMENTS` (loading 6s → transit 14s → unloading 6s → return, termasuk segmen mundur `reverse`), total loop `TOTAL` detik; memanggil `onPhase` saat fase berganti → ini yang menggerakkan Tracker & status di DetailPanel. Helper: `Wheel`, `SelectionRing`, `route()`, `hoverHandlers`. **Ubah rute/durasi truk di `SEGMENTS`.** |
| `Primitives.tsx` | Objek kecil reusable + konstanta warna `BLUE` (`#2f6bf0`). `Pallet` (kardus di palet, opsional label & klik), `Tree`, `MapPin`, `Container`. |

### `src/ui/` — overlay 2D

| File | Fungsi |
|---|---|
| `TopBar.tsx` | Header: `Logo` (diekspor, dipakai Login juga), search (shortcut `/`, belum ada logika pencarian), dropdown site (dari `sites`), indikator Live + jam (`useClock`), tombol notifikasi (dummy), menu profil + Logout. Hook lokal `useOutsideClose` untuk menutup dropdown. Ikon SVG inline di objek `Icon`. |
| `Login.tsx` | Form login. **Sementara menerima kredensial apa pun** asal tidak kosong → `onLogin(username)`. |
| `Overlay.tsx` | `KpiCards` (render `kpis`) dan `DetailPanel` (panel kanan untuk entity terpilih; status truk/toko dihitung dari `phaseInfo[phase]`, sisanya dari `entities[id].status`). |
| `Tracker.tsx` | Kartu "Shipment Tracking" 3 langkah (Warehouse → Di jalan → Toko) berdasarkan `phaseInfo[phase].stage`. Klik langkah → pilih entity terkait. |

## Alur data

```
Vehicles.Truck (useFrame) --onPhase--> App.phase --> Tracker, DetailPanel, label truk
Objek 3D / Tracker  --onSelect(id)--> App.selected --> DetailPanel (entities[id]), SelectionRing
Login --onLogin--> App.user (sessionStorage) ; TopBar --onLogout--> hapus session
```

## Cari cepat: "mau ubah X, buka file Y"

| Mau ubah… | Buka |
|---|---|
| Data entity / KPI / daftar site | `src/data.ts` |
| Tambah entity baru yang bisa diklik | `data.ts` (`entities`) + taruh objek di `scene/Scene.tsx` dengan `onClick={() => onSelect('ID')}` |
| Posisi objek, kamera, lampu, pohon | `src/scene/Scene.tsx` |
| Rute / durasi / fase truk | `SEGMENTS` di `src/scene/Vehicles.tsx` |
| Label fase & status pengiriman | `phaseInfo` di `src/data.ts` |
| Bentuk gudang / toko | `scene/Warehouse.tsx` / `scene/Store.tsx` |
| Header, search, dropdown site, logout | `src/ui/TopBar.tsx` |
| Logika login / session | `src/ui/Login.tsx` + `src/App.tsx` |
| Tampilan panel detail / KPI | `src/ui/Overlay.tsx` |
| Warna / layout / ukuran UI | `src/index.css` |

## Catatan & TODO yang diketahui

- Belum ada backend: semua di `data.ts` statis.
- Login belum ada validasi sungguhan.
- Search, notifikasi, dan pilihan site di TopBar belum mempengaruhi scene.
- Objek 3D masih primitif (box/cylinder); rencana model `.glb` ada di `docs/panduan-3d.md`.
