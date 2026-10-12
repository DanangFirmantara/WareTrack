import { BLUE } from './Primitives'

const STRIPES = 9

/** Toko kelontong tujuan: bangunan kecil + kanopi belang + rak barang di depan */
export function Store({ position, onClick }: { position: [number, number, number]; onClick: () => void }) {
  const W = 7, D = 5, H = 3
  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'auto')}
    >
      {/* dinding */}
      <mesh position={[0, H / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[W, H, D]} />
        <meshStandardMaterial color="#fff6e6" />
      </mesh>
      {/* atap datar + lis */}
      <mesh position={[0, H + 0.15, 0]} castShadow>
        <boxGeometry args={[W + 0.4, 0.3, D + 0.4]} />
        <meshStandardMaterial color="#3b4a66" />
      </mesh>
      {/* papan nama */}
      <mesh position={[0, H + 0.75, D / 2 - 0.1]} castShadow>
        <boxGeometry args={[4.6, 0.9, 0.2]} />
        <meshStandardMaterial color={BLUE} />
      </mesh>
      <mesh position={[0, H + 0.75, D / 2 + 0.01]}>
        <planeGeometry args={[3.8, 0.35]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      {/* kanopi belang merah-putih */}
      {Array.from({ length: STRIPES }, (_, i) => (
        <mesh key={i} position={[-W / 2 + (W / STRIPES) * (i + 0.5), H - 0.35, D / 2 + 0.7]} rotation={[0.45, 0, 0]} castShadow>
          <boxGeometry args={[W / STRIPES, 0.08, 1.5]} />
          <meshStandardMaterial color={i % 2 ? '#ffffff' : '#ef4444'} />
        </mesh>
      ))}
      {/* pintu kaca + jendela */}
      <mesh position={[0, 1.05, D / 2 + 0.01]}>
        <planeGeometry args={[1.4, 2.1]} />
        <meshStandardMaterial color="#8fb3e8" />
      </mesh>
      {[-2.3, 2.3].map((x) => (
        <mesh key={x} position={[x, 1.4, D / 2 + 0.01]}>
          <planeGeometry args={[1.6, 1.1]} />
          <meshStandardMaterial color="#b9d0f2" />
        </mesh>
      ))}
      {/* rak barang dagangan di teras */}
      {[-2.4, 2.4].map((x) => (
        <group key={x} position={[x, 0, D / 2 + 0.6]}>
          <mesh position={[0, 0.35, 0]} castShadow>
            <boxGeometry args={[1.4, 0.7, 0.6]} />
            <meshStandardMaterial color="#b98a55" />
          </mesh>
          {['#f59e0b', '#22c55e', '#ef4444', '#3b82f6'].map((c, i) => (
            <mesh key={c} position={[-0.48 + i * 0.32, 0.85, 0]} castShadow>
              <boxGeometry args={[0.26, 0.3, 0.4]} />
              <meshStandardMaterial color={c} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}
