import { useState } from 'react'
import { Html } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'

export const BLUE = '#2f6bf0'

/** Kardus di atas palet kayu */
export function Pallet({ position, onClick, label }: {
  position: [number, number, number]
  onClick?: () => void
  label?: string
}) {
  const [hover, setHover] = useState(false)
  const box = hover && onClick ? '#f2c48a' : '#e3b27a'
  const click = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    onClick?.()
  }
  return (
    <group
      position={position}
      onClick={click}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHover(true)
        if (onClick) document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHover(false)
        document.body.style.cursor = 'auto'
      }}
    >
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.16, 1.2]} />
        <meshStandardMaterial color="#b98a55" />
      </mesh>
      {[[-0.28, -0.28], [0.28, -0.28], [-0.28, 0.28], [0.28, 0.28]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.42, z]} castShadow>
          <boxGeometry args={[0.52, 0.52, 0.52]} />
          <meshStandardMaterial color={box} />
        </mesh>
      ))}
      <mesh position={[0, 0.94, 0]} castShadow>
        <boxGeometry args={[0.52, 0.52, 0.52]} />
        <meshStandardMaterial color={box} />
      </mesh>
      {label && (
        <Html position={[0, 1.6, 0]} center zIndexRange={[10, 0]}>
          <div className="tag">{label}</div>
        </Html>
      )}
    </group>
  )
}

export function Tree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 1.2]} />
        <meshStandardMaterial color="#8a6a4a" />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.55, 16, 16]} />
        <meshStandardMaterial color="#5fc28a" />
      </mesh>
    </group>
  )
}

/** Pin lokasi di atas palet */
export function MapPin({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.18, 0.6, 20]} />
        <meshStandardMaterial color={BLUE} />
      </mesh>
      <mesh position={[0, 0.9, 0]}>
        <sphereGeometry args={[0.3, 20, 20]} />
        <meshStandardMaterial color={BLUE} />
      </mesh>
    </group>
  )
}

export function Container({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={[2.4, 2.4, 5.5]} />
      <meshStandardMaterial color="#25b5b0" />
    </mesh>
  )
}
