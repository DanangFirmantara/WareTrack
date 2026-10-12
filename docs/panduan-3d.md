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
| **Gudang 3D** | Dinding, atap biru miring, dan 3 pintu dock |
| **Forklift bergerak sendiri** | Berputar di satu rute, garpunya naik turun, label `FL-01` ikut bergerak |
| **Truk** | Datang dari jalan, parkir di dock sekitar 10 detik, lalu pergi lagi (berulang tiap 20 detik) |
| **Palet, pin lokasi, kontainer, pohon** | Pelengkap suasana |
| **UI overlay** | Top bar, 3 kartu KPI, dan panel detail yang muncul dari kanan saat forklift, truk, palet `PAL-1026` atau gudang diklik |

## Struktur file

```
src/
├── data.ts            ← data contoh (nanti diganti dengan API)
├── App.tsx            ← menggabungkan scene 3D + UI
├── scene/
│   ├── Scene.tsx      ← Canvas, kamera, lampu, tanah, posisi objek
│   ├── Warehouse.tsx
│   ├── Vehicles.tsx   ← forklift & truk + animasinya (useFrame)
│   └── Primitives.tsx ← palet, pohon, pin, kontainer
└── ui/Overlay.tsx     ← KPI cards & panel detail (HTML biasa)
```

## Konsep penting

1. **Three.js** adalah mesin 3D-nya. **React Three Fiber** memungkinkan objek 3D ditulis sebagai komponen React (`<mesh>`, `<boxGeometry>`). **Drei** berisi helper siap pakai seperti kamera, kontrol, dan label `<Html>`.
2. **Animasi** dibuat di `useFrame`, yang berjalan setiap frame (sekitar 60x per detik). Di situ posisi atau rotasi objek diubah.
3. **UI 2D tetap terpakai.** Panel dan kartu adalah HTML/CSS biasa yang ditumpuk di atas canvas 3D, jadi komponen dari aplikasi 2D bisa dipindahkan ke sini.

## Langkah berikutnya

1. **Model 3D asli.** Saat ini semua objek dibangun dari bentuk sederhana. Untuk detail lebih, buat atau unduh model `.glb` (Blender, Sketchfab, Kenney.nl, Poly Pizza), lalu ubah menjadi komponen React dengan `npx gltfjsx model.glb`.
2. **Kamera halus.** Buat kamera terbang perlahan ke objek yang diklik dengan `CameraControls` dari drei.
3. **Data real-time.** Ganti isi `data.ts` dengan fetch atau WebSocket dari backend, supaya posisi forklift dan truk mengikuti data asli.
4. **Efek visual.** Gunakan `@react-three/postprocessing` untuk efek outline saat hover dan ambient occlusion.
