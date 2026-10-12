import { entities, kpis, phaseInfo, type ShipmentPhase } from '../data'

export function KpiCards() {
  return (
    <div className="kpis">
      {kpis.map((k) => (
        <div key={k.label} className="card kpi">
          <div className="muted">{k.label}</div>
          <div className="kpi-value">{k.value} <span className="up">↑ {k.delta}</span></div>
          <div className="muted small">{k.note}</div>
        </div>
      ))}
    </div>
  )
}

export function DetailPanel({ id, phase, onClose }: { id: string | null; phase: ShipmentPhase; onClose: () => void }) {
  const e = id ? entities[id] : null
  // status truk & toko mengikuti posisi pengiriman yang sedang berjalan
  const status = e?.kind === 'truck' ? phaseInfo[phase].truck : e?.kind === 'store' ? phaseInfo[phase].store : e?.status
  return (
    <aside className={`card detail ${e ? 'open' : ''}`}>
      {e && (
        <>
          <div className="detail-head">
            <div>
              <div className="eyebrow">{e.kind.toUpperCase()} · {e.site ?? 'WH-01'}</div>
              <div className="detail-title">{e.title}</div>
              <div className="muted">{e.subtitle}</div>
            </div>
            <button onClick={onClose} aria-label="Close">✕</button>
          </div>
          <div className="pill">{status}</div>
          <dl>
            {Object.entries(e.details).map(([k, v]) => (
              <div key={k} className="row"><dt>{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>
        </>
      )}
    </aside>
  )
}
