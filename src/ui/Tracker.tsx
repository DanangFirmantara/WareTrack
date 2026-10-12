import { phaseInfo, type ShipmentPhase } from '../data'

const STAGES = [
  { id: 'WH-01', title: 'Warehouse', sub: 'WH-01 · Asal' },
  { id: 'ROAD-01', title: 'Di jalan', sub: 'Jl. Raya Logistik' },
  { id: 'STORE-01', title: 'Toko Kelontong', sub: 'Tujuan' },
]

/** Posisi barang saat ini: gudang → jalan → toko */
export function Tracker({ phase, onSelect }: { phase: ShipmentPhase; onSelect: (id: string) => void }) {
  const { stage, label } = phaseInfo[phase]
  return (
    <section className="card tracker">
      <div className="tracker-head">
        <strong>Shipment Tracking</strong>
        <button className="muted small link" onClick={() => onSelect('TRK-2051')}>#SHP-78442 · TRK-2051</button>
      </div>
      <ol className="steps">
        {STAGES.map((s, i) => (
          <li key={s.id} className={i < stage ? 'done' : i === stage ? 'current' : ''}>
            <button onClick={() => onSelect(s.id)}>
              <span className="step-dot">
                {i < stage ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
                ) : i + 1}
              </span>
              <strong>{s.title}</strong>
              <span className="muted small">{s.sub}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="tracker-status"><span className="dot" />{label}</div>
    </section>
  )
}
