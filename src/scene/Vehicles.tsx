import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { BLUE } from './Primitives'
import { phaseInfo, type ShipmentPhase } from '../data'

function Wheel({ position, r = 0.2 }: { position: [number, number, number]; r?: number }) {
  return (
    <mesh position={position} rotation={[0, 0, Math.PI / 2]} castShadow>
      <cylinderGeometry args={[r, r, 0.18, 20]} />
      <meshStandardMaterial color="#222" />
    </mesh>
  )
}

function SelectionRing({ inner, outer }: { inner: number; outer: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
      <ringGeometry args={[inner, outer, 48]} />
      <meshBasicMaterial color={BLUE} />
    </mesh>
  )
}

const hoverHandlers = {
  onPointerOver: () => (document.body.style.cursor = 'pointer'),
  onPointerOut: () => (document.body.style.cursor = 'auto'),
}

/** Forklift yang jalan mengikuti rute loop + garpu naik turun */
export function Forklift({ onClick, selected }: { onClick: () => void; selected: boolean }) {
  const ref = useRef<THREE.Group>(null!)
  const fork = useRef<THREE.Group>(null!)
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        [[-7, 4], [-3, 6.5], [3, 6], [5, 3], [0, 2.5], [-5, 2]].map(([x, z]) => new THREE.Vector3(x, 0, z)),
        true,
      ),
    [],
  )
  const ahead = useMemo(() => new THREE.Vector3(), [])

  useFrame(({ clock }) => {
    const t = (clock.elapsedTime * 0.03) % 1
    ref.current.position.copy(curve.getPointAt(t))
    curve.getPointAt((t + 0.005) % 1, ahead)
    ref.current.lookAt(ahead)
    fork.current.position.y = 0.2 + (Math.sin(clock.elapsedTime * 1.5) + 1) * 0.3
  })

  return (
    <group
      ref={ref}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      {...hoverHandlers}
    >
      <mesh position={[0, 0.45, -0.1]} castShadow>
        <boxGeometry args={[0.9, 0.5, 1.2]} />
        <meshStandardMaterial color="#f5b82e" />
      </mesh>
      <mesh position={[0, 0.85, -0.4]} castShadow>
        <boxGeometry args={[0.8, 0.3, 0.5]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      {/* rangka atap */}
      {[[-0.38, 0.1], [0.38, 0.1], [-0.38, -0.5], [0.38, -0.5]].map(([x, z], i) => (
        <mesh key={i} position={[x, 1.2, z]}>
          <boxGeometry args={[0.06, 0.9, 0.06]} />
          <meshStandardMaterial color="#222" />
        </mesh>
      ))}
      <mesh position={[0, 1.65, -0.2]} castShadow>
        <boxGeometry args={[0.9, 0.06, 0.8]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* tiang & garpu */}
      <mesh position={[0, 0.9, 0.6]}>
        <boxGeometry args={[0.7, 1.6, 0.08]} />
        <meshStandardMaterial color="#444" />
      </mesh>
      <group ref={fork} position={[0, 0.2, 0.9]}>
        {[-0.2, 0.2].map((x) => (
          <mesh key={x} position={[x, 0, 0]}>
            <boxGeometry args={[0.1, 0.05, 0.7]} />
            <meshStandardMaterial color="#555" />
          </mesh>
        ))}
      </group>
      <Wheel position={[-0.48, 0.2, 0.3]} />
      <Wheel position={[0.48, 0.2, 0.3]} />
      <Wheel position={[-0.48, 0.2, -0.5]} />
      <Wheel position={[0.48, 0.2, -0.5]} />
      {selected && <SelectionRing inner={1.0} outer={1.15} />}
      <Html position={[0, 2.2, 0]} center zIndexRange={[10, 0]}>
        <div className="tag tag-blue">FL-01 <span>Loading truck</span></div>
      </Html>
    </group>
  )
}

type Segment = { phase: ShipmentPhase; dur: number; path?: THREE.CatmullRomCurve3; reverse?: boolean }

const route = (pts: [number, number][]) =>
  new THREE.CatmullRomCurve3(pts.map(([x, z]) => new THREE.Vector3(x, 0, z)), false, 'centripetal')

// Rute box car (x, z): dock gudang → jalan raya → toko kelontong → kembali ke dock
const SEGMENTS: Segment[] = [
  { phase: 'loading', dur: 6 },
  { phase: 'transit', dur: 14, path: route([[-3, 10], [-3, 16], [-3, 20.5], [-1.5, 24], [2, 25.3], [20, 25.3], [34, 25.3], [38, 24.6], [40, 22], [40, 19.5]]) },
  { phase: 'unloading', dur: 6 },
  // mundur keluar dari halaman toko, lalu pulang lewat lajur sebaliknya
  { phase: 'return', dur: 3, reverse: true, path: route([[40, 19.5], [40, 21.2], [41.5, 22.8], [44, 23.1]]) },
  { phase: 'return', dur: 12, path: route([[44, 23.1], [38, 22.8], [0, 22.8], [-6, 23]]) },
  // mundur masuk ke dock gudang
  { phase: 'return', dur: 5, reverse: true, path: route([[-6, 23], [-4.2, 22.6], [-3, 20.5], [-3, 15], [-3, 10]]) },
]
const TOTAL = SEGMENTS.reduce((sum, seg) => sum + seg.dur, 0)

/** Box car yang mengantar barang dari gudang ke toko kelontong lalu kembali (loop) */
export function Truck({ onClick, selected, phase, onPhase }: {
  onClick: () => void
  selected: boolean
  phase: ShipmentPhase
  onPhase: (phase: ShipmentPhase) => void
}) {
  const ref = useRef<THREE.Group>(null!)
  const last = useRef<ShipmentPhase>(phase)
  const point = useMemo(() => new THREE.Vector3(), [])
  const dir = useMemo(() => new THREE.Vector3(), [])

  useFrame(({ clock }) => {
    let t = clock.elapsedTime % TOTAL
    let seg = SEGMENTS[0]
    for (seg of SEGMENTS) {
      if (t < seg.dur) break
      t -= seg.dur
    }
    if (seg.path) {
      const u = THREE.MathUtils.smoothstep(t / seg.dur, 0, 1)
      seg.path.getPointAt(u, point)
      seg.path.getTangentAt(u, dir)
      ref.current.position.copy(point)
      // saat mundur, moncong truk menghadap berlawanan arah gerak
      ref.current.lookAt(point.add(dir.multiplyScalar(seg.reverse ? -1 : 1)))
    }
    if (seg.phase !== last.current) {
      last.current = seg.phase
      onPhase(seg.phase)
    }
  })

  return (
    <group
      ref={ref}
      position={[-3, 0, 10]}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      {...hoverHandlers}
    >
      {/* box kargo (bagian belakang menghadap gudang) */}
      <mesh position={[0, 1.5, -0.6]} castShadow>
        <boxGeometry args={[2, 2.2, 4.2]} />
        <meshStandardMaterial color="#f7f9fc" />
      </mesh>
      <mesh position={[1.01, 1.5, -0.6]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[4.2, 0.6]} />
        <meshStandardMaterial color={BLUE} />
      </mesh>
      {/* kabin */}
      <mesh position={[0, 1.1, 2.3]} castShadow>
        <boxGeometry args={[2, 1.8, 1.5]} />
        <meshStandardMaterial color={BLUE} />
      </mesh>
      <mesh position={[0, 1.5, 3.06]}>
        <planeGeometry args={[1.7, 0.7]} />
        <meshStandardMaterial color="#1b2a4a" />
      </mesh>
      {[2.3, -1.8].map((z) =>
        [-1, 1].map((s) => <Wheel key={`${z}${s}`} position={[s * 0.95, 0.35, z]} r={0.35} />),
      )}
      {selected && <SelectionRing inner={3.2} outer={3.4} />}
      <Html position={[0, 3.4, 0]} center zIndexRange={[10, 0]}>
        <div className="tag tag-blue">TRK-2051 <span>{phaseInfo[phase].truck}</span></div>
      </Html>
    </group>
  )
}
