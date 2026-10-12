# Panduan WareTrack 3D

Aplikasi gudang 3D bergaya isometrik, dibangun dengan **Vite + React + Three.js (React Three Fiber + Drei)**.

## Cara menjalankan

```
cd hello-web-three
npm install
npm run dev
```

Lalu buka `http://localhost:5173`.

## Fitur yang sudah ada

| Fitur | Penjelasan |
|---|---|
| **Kamera isometrik** | Kamera orthographic supaya tampilannya seperti game. Geser dengan drag, putar dengan klik kanan, zoom dengan scroll |
| **3 zona bernomor** | ① Warehouse WH-01 (asal barang) → ② Jl. Raya Logistik (jalur box car) → ③ Toko Kelontong (tujuan) |
| **Gudang 3D** | Dinding, atap biru miring, dan 3 pintu dock |
| **Toko kelontong** | Bangunan kecil dengan papan nama, kanopi belang merah-putih, dan rak barang di teras |
| **Forklift bergerak sendiri** | Berputar di satu rute, garpunya naik turun, label `FL-01` ikut bergerak |
| **Box car `TRK-2051`** | Siklus pengiriman berulang (±46 detik): dimuat di dock gudang (6 dtk) → jalan ke toko (14 dtk) → dibongkar (6 dtk) → mundur keluar, pulang lewat lajur sebaliknya, lalu mundur masuk ke dock |
| **Shipment tracker** | Kartu kiri bawah, 3 langkah (Warehouse → Di jalan → Toko) yang ikut bergerak sesuai fase truk |
| **Palet, pin lokasi, kontainer, pohon** | Pelengkap suasana |
| **UI overlay** | Top bar (search, pilih site, jam live, profil), 3 kartu KPI, dan panel detail yang muncul dari kanan saat forklift, truk, palet `PAL-1026`, gudang, jalan, atau toko diklik. Status truk & toko di panel ikut fase pengiriman |
| **Login** | Halaman masuk sederhana; sementara kredensial apa pun diterima asal tidak kosong. Session disimpan di `sessionStorage` |

## Struktur file

```
src/
├── data.ts            ← data contoh + fase pengiriman (nanti diganti dengan API)
├── App.tsx            ← login gate, state global, menggabungkan scene 3D + UI
├── index.css          ← semua styling
├── scene/
│   ├── Scene.tsx      ← Canvas, kamera, lampu, tanah, jalan, posisi objek
│   ├── Warehouse.tsx  ← gedung gudang
│   ├── Store.tsx      ← toko kelontong tujuan
│   ├── Vehicles.tsx   ← forklift & box car + animasinya (useFrame)
│   └── Primitives.tsx ← palet, pohon, pin, kontainer
└── ui/
    ├── TopBar.tsx     ← header: search, site, jam live, profil/logout
    ├── Login.tsx      ← halaman login
    ├── Overlay.tsx    ← KPI cards & panel detail
    └── Tracker.tsx    ← shipment tracker 3 langkah
```

Ringkasan fungsi tiap file yang lebih detail ada di [`project-map.md`](project-map.md).

## Konsep penting

1. **Three.js** adalah mesin 3D-nya. **React Three Fiber** memungkinkan objek 3D ditulis sebagai komponen React (`<mesh>`, `<boxGeometry>`). **Drei** berisi helper siap pakai seperti kamera, kontrol, dan label `<Html>`.
2. **Animasi** dibuat di `useFrame`, yang berjalan setiap frame (sekitar 60x per detik). Di situ posisi atau rotasi objek diubah.
3. **UI 2D tetap terpakai.** Panel dan kartu adalah HTML/CSS biasa yang ditumpuk di atas canvas 3D, jadi komponen dari aplikasi 2D bisa dipindahkan ke sini.

## Langkah berikutnya

1. **Model 3D asli.** Saat ini semua objek dibangun dari bentuk sederhana. Untuk detail lebih, buat atau unduh model `.glb` (Blender, Sketchfab, Kenney.nl, Poly Pizza), lalu ubah menjadi komponen React dengan `npx gltfjsx model.glb`.
2. **Kamera halus.** Buat kamera terbang perlahan ke objek yang diklik dengan `CameraControls` dari drei.
3. **Data real-time.** Ganti isi `data.ts` dengan fetch atau WebSocket dari backend, supaya posisi forklift dan truk mengikuti data asli.
4. **Efek visual.** Gunakan `@react-three/postprocessing` untuk efek outline saat hover dan ambient occlusion.
