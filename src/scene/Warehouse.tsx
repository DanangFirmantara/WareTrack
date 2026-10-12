import { BLUE } from './Primitives'

/** Gedung gudang: dinding + atap pelana + pintu dock */
export function Warehouse({ onClick }: { onClick: () => void }) {
  const W = 10, D = 7, H = 3.4
  return (
    <group
      position={[0, 0, -2]}
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
        <meshStandardMaterial color="#e9eef7" />
      </mesh>
      {/* list biru bawah */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[W + 0.05, 0.5, D + 0.05]} />
        <meshStandardMaterial color={BLUE} />
      </mesh>
      {/* atap: dua bidang miring */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0, H + 0.55, (s * D) / 4]} rotation={[s * 0.3, 0, 0]} castShadow>
          <boxGeometry args={[W + 0.6, 0.2, D / 2 + 0.6]} />
          <meshStandardMaterial color={BLUE} roughness={0.5} />
        </mesh>
      ))}
      {/* pintu dock di sisi depan */}
      {[-3, 0, 3].map((x) => (
        <group key={x} position={[x, 0, D / 2 + 0.01]}>
          <mesh position={[0, 1.3, 0]}>
            <planeGeometry args={[2, 2.4]} />
            <meshStandardMaterial color="#9aa6bb" />
          </mesh>
          <mesh position={[0, 2.6, 0.05]}>
            <boxGeometry args={[2.3, 0.2, 0.1]} />
            <meshStandardMaterial color={BLUE} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
