import { Canvas } from '@react-three/fiber'
import { Html, MapControls, OrthographicCamera } from '@react-three/drei'
import { Warehouse } from './Warehouse'
import { Store } from './Store'
import { Forklift, Truck } from './Vehicles'
import { Container, MapPin, Pallet, Tree } from './Primitives'
import type { ShipmentPhase } from '../data'

type Props = {
  selected: string | null
  onSelect: (id: string | null) => void
  phase: ShipmentPhase
  onPhase: (phase: ShipmentPhase) => void
}

// Titik tengah area peta (antara gudang dan toko) — jadi target kamera
const CENTER: [number, number, number] = [18, 0, 11]
const ROAD_Z = 24

const TREES: [number, number, number][] = [
  [8, 0, -8], [10, 0, -5], [-8, 0, -9], [12, 0, 0], [-12, 0, -6], [4, 0, -10],
  [20, 0, 16], [26, 0, 18], [16, 0, 30], [28, 0, 31], [33, 0, 9], [47, 0, 10], [48, 0, 16], [36, 0, 31],
]

function Ground({ position, size, color, onClick }: {
  position: [number, number, number]
  size: [number, number]
  color: string
  onClick?: () => void
}) {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={position}
      receiveShadow
      onClick={onClick && ((e) => { e.stopPropagation(); onClick() })}
    >
      <planeGeometry args={size} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

function ZoneLabel({ position, n, title, sub }: { position: [number, number, number]; n: number; title: string; sub: string }) {
  return (
    <Html position={position} center zIndexRange={[9, 0]}>
      <div className="zone"><span className="zone-n">{n}</span><div><strong>{title}</strong><span>{sub}</span></div></div>
    </Html>
  )
}

export function Scene({ selected, onSelect, phase, onPhase }: Props) {
  return (
    <Canvas shadows onPointerMissed={() => onSelect(null)}>
      {/* Kamera orthographic = tampilan isometrik ala game */}
      <OrthographicCamera makeDefault position={[CENTER[0] + 25, 22, CENTER[2] + 25]} zoom={24} near={-100} far={300} />
      <MapControls target={CENTER} maxPolarAngle={Math.PI / 2.6} minZoom={12} maxZoom={90} enableDamping />

      <color attach="background" args={['#dfe6f3']} />
      <ambientLight intensity={1.2} />
      <directionalLight
        position={[15, 25, 10]}
        intensity={2}
        castShadow
        shadow-mapSize={[4096, 4096]}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
      />

      {/* tanah */}
      <Ground position={[10, 0, 10]} size={[160, 160]} color="#eef1f7" />

      {/* ① WAREHOUSE — lokasi asal barang */}
      <Ground position={[-3, 0.01, 15]} size={[4, 18]} color="#c9d3e8" />
      <Warehouse onClick={() => onSelect('WH-01')} />
      <ZoneLabel position={[0, 6.5, -2]} n={1} title="Warehouse WH-01" sub="Asal barang" />
      <Forklift onClick={() => onSelect('FL-01')} selected={selected === 'FL-01'} />
      <Pallet position={[-9, 0, 8]} label="PAL-1026 · Safety Helmet" onClick={() => onSelect('PAL-1026')} />
      <Pallet position={[-10.5, 0, 9.5]} />
      <Pallet position={[-7.5, 0, 9.5]} />
      <Pallet position={[7, 0, 6]} />
      <Pallet position={[8.5, 0, 3.5]} />
      <MapPin position={[7, 1.2, 6]} />
      <MapPin position={[8.5, 1.2, 3.5]} />
      <Container position={[-13, 1.2, 1]} />

      {/* ② JALAN RAYA — moda transportasi box car */}
      <Ground position={[10, 0.01, ROAD_Z]} size={[100, 5]} color="#c9d3e8" onClick={() => onSelect('ROAD-01')} />
      {Array.from({ length: 25 }, (_, i) => (
        <Ground key={i} position={[-38 + i * 4, 0.02, ROAD_Z]} size={[2, 0.18]} color="#ffffff" />
      ))}
      <ZoneLabel position={[18, 1, ROAD_Z + 3.5]} n={2} title="Jl. Raya Logistik" sub="Jalur box car" />

      {/* ③ TOKO KELONTONG — lokasi tujuan */}
      <Ground position={[40, 0.01, 18.25]} size={[8, 6.5]} color="#c9d3e8" />
      <Store position={[40, 0, 12.5]} onClick={() => onSelect('STORE-01')} />
      <MapPin position={[44.5, 0, 19]} />
      <ZoneLabel position={[40, 6.2, 12.5]} n={3} title="Toko Kelontong" sub="Tujuan barang" />

      <Truck onClick={() => onSelect('TRK-2051')} selected={selected === 'TRK-2051'} phase={phase} onPhase={onPhase} />

      {TREES.map((p, i) => (
        <Tree key={i} position={p} scale={1 + (i % 3) * 0.2} />
      ))}
    </Canvas>
  )
}
