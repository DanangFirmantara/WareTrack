// Mock data — nanti ganti dengan data dari API/backend kamu
export type Entity = {
  id: string
  kind: 'forklift' | 'truck' | 'pallet' | 'warehouse' | 'road' | 'store'
  site?: string
  title: string
  subtitle: string
  status: string
  details: Record<string, string>
}

export const entities: Record<string, Entity> = {
  'FL-01': {
    id: 'FL-01', kind: 'forklift', title: 'FL-01', subtitle: 'Sam Haddad · Toyota 8FBE18',
    status: 'Loading truck',
    details: { Battery: '75%', Carrying: 'Empty', 'Moves today': '28', Speed: '6.4 km/h', Site: 'Riverside Hub' },
  },
  'TRK-2051': {
    id: 'TRK-2051', kind: 'truck', title: 'TRK-2051', subtitle: 'Box car · #SHP-78442',
    status: 'Loading',
    details: { Asal: 'WH-01 · Riverside Hub', Tujuan: 'Toko Kelontong Sumber Rezeki', Rute: 'Jl. Raya Logistik', Driver: 'Maya Lin', Muatan: '6 pallets' },
  },
  'PAL-1026': {
    id: 'PAL-1026', kind: 'pallet', title: 'PAL-1026', subtitle: 'Safety Helmet',
    status: 'Staged',
    details: { SKU: 'SH-2201', Qty: '120 pcs', Zone: 'Staging A', Weight: '340 kg' },
  },
  'WH-01': {
    id: 'WH-01', kind: 'warehouse', title: 'WH-01', subtitle: 'Riverside Hub',
    status: '78% full',
    details: { Peran: 'Lokasi asal barang', Docks: '2 / 2 active', 'Stock on hand': '1,412 pallets', Forklifts: '1 / 2 active' },
  },
  'ROAD-01': {
    id: 'ROAD-01', kind: 'road', site: 'Rute', title: 'Jl. Raya Logistik', subtitle: 'WH-01 → Toko Kelontong',
    status: 'Lancar',
    details: { Peran: 'Jalur transportasi box car', Jarak: '12 km', 'Waktu tempuh': '± 25 menit', 'Lalu lintas': 'Normal' },
  },
  'STORE-01': {
    id: 'STORE-01', kind: 'store', site: 'Tujuan', title: 'Toko Kelontong Sumber Rezeki', subtitle: 'Jl. Melati No. 8',
    status: 'Menunggu kiriman',
    details: { Peran: 'Lokasi tujuan barang', Pemilik: 'Ibu Sri', 'Order': '#SHP-78442', Kontak: '0812-xxxx-2210' },
  },
}

/** Fase perjalanan box car — menentukan posisi barang saat ini */
export type ShipmentPhase = 'loading' | 'transit' | 'unloading' | 'return'

export const phaseInfo: Record<ShipmentPhase, { stage: 0 | 1 | 2; label: string; truck: string; store: string }> = {
  loading: { stage: 0, label: 'Sedang dimuat di gudang', truck: 'Loading', store: 'Menunggu kiriman' },
  transit: { stage: 1, label: 'Dalam perjalanan ke toko', truck: 'In transit', store: 'Kiriman di jalan' },
  unloading: { stage: 2, label: 'Sedang dibongkar di toko', truck: 'Unloading', store: 'Barang tiba' },
  return: { stage: 2, label: 'Terkirim · truk kembali ke gudang', truck: 'Returning', store: 'Barang diterima' },
}

export const sites = [
  { code: 'WH-01', name: 'Riverside Hub', note: '78% full · 1/2 docked' },
  { code: 'WH-02', name: 'Northgate DC', note: '64% full · 2/4 docked' },
  { code: 'WH-03', name: 'Harbor Point', note: '91% full · 3/3 docked' },
]

export const kpis = [
  { label: 'Stock on hand', value: '1,412', delta: '+15', note: 'pallets · WH-01' },
  { label: 'Trucks on site', value: '1', delta: '+1', note: '1 inbound · WH-01' },
  { label: 'On-time delivery', value: '96.6%', delta: '+0.4%', note: 'last 30 days' },
]
