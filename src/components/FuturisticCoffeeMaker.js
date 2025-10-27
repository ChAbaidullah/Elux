'use client';

import { useRef, useEffect } from 'react';

export default function FuturisticCoffeeMaker() {
  const ref = useRef();
  const displayRef = useRef();

  useEffect(() => {
    if (displayRef.current) {
      displayRef.current.material.emissiveIntensity = 1.6;
    }
  }, []);

  return (
    <group ref={ref} position={[0, -0.95, 0]} scale={1.2}>
      {/* Main body */}
      <mesh castShadow receiveShadow position={[0, 0.65, 0]}>
        <boxGeometry args={[1.6, 2.2, 1.1]} />
        <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.28} />
      </mesh>

      {/* Front inset panel */}
      <mesh position={[0, 1.2, 0.56]}>
        <boxGeometry args={[1.45, 0.6, 0.02]} />
        <meshStandardMaterial color="#111827" metalness={0.9} roughness={0.22} />
      </mesh>

      {/* OLED display */}
      <mesh ref={displayRef} position={[-0.42, 1.2, 0.58]}>
        <boxGeometry args={[0.46, 0.22, 0.02]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={1.2} roughness={0.2} />
      </mesh>

      {/* Control buttons */}
      <group position={[0.3, 1.2, 0.58]}>
        <mesh position={[-0.2, 0, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.02, 24]} />
          <meshStandardMaterial color="#9ca3af" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.045, 0.045, 0.02, 24]} />
          <meshStandardMaterial color="#9ca3af" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0.2, 0, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.02, 24]} />
          <meshStandardMaterial color="#9ca3af" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* Bean hopper on top */}
      <group position={[0, 1.95, 0]}>
        <mesh>
          <cylinderGeometry args={[0.55, 0.5, 0.25, 32]} />
          <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.28, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.5, 32]} />
          <meshPhysicalMaterial transmission={0.9} thickness={0.25} roughness={0.12} clearcoat={0.2} />
        </mesh>
        <mesh position={[0, 0.62, 0]}>
          <cylinderGeometry args={[0.48, 0.48, 0.08, 32]} />
          <meshStandardMaterial color="#111827" metalness={0.85} roughness={0.25} />
        </mesh>
      </group>

      {/* Group head */}
      <group position={[0, 0.95, 0.56]}>
        <mesh>
          <boxGeometry args={[1.2, 0.28, 0.22]} />
          <meshStandardMaterial color="#0b1222" metalness={0.9} roughness={0.25} />
        </mesh>
        {/* Dual spouts */}
        <mesh position={[-0.22, -0.22, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.18, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0.22, -0.22, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.18, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Portafilter & handle */}
      <group position={[0, 0.85, 0.63]}>
        <mesh>
          <cylinderGeometry args={[0.18, 0.18, 0.08, 24]} />
          <meshStandardMaterial color="#9ca3af" metalness={0.85} roughness={0.25} />
        </mesh>
        <mesh position={[0.34, 0, 0]} rotation={[0, 0, -0.1]}>
          <boxGeometry args={[0.5, 0.08, 0.08]} />
          <meshStandardMaterial color="#111827" metalness={0.7} roughness={0.35} />
        </mesh>
      </group>

      {/* Cup */}
      <group position={[0, 0.5, 0.58]}>
        <mesh>
          <cylinderGeometry args={[0.22, 0.22, 0.32, 24]} />
          <meshStandardMaterial color="#e5e7eb" roughness={0.3} metalness={0.05} />
        </mesh>
        <mesh position={[0.18, 0.02, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.12, 0.03, 12, 24]} />
          <meshStandardMaterial color="#e5e7eb" roughness={0.3} metalness={0.05} />
        </mesh>
      </group>

      {/* Drip tray with grate */}
      <group position={[0, 0.3, 0.52]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.3, 0.1, 0.6]} />
          <meshStandardMaterial color="#1b2436" metalness={0.8} roughness={0.35} />
        </mesh>
        {Array.from({ length: 7 }).map((_, i) => (
          <mesh key={i} position={[i * 0.18 - 0.54, 0.06, 0]}>
            <boxGeometry args={[0.12, 0.02, 0.56]} />
            <meshStandardMaterial color="#0e1526" metalness={0.8} roughness={0.35} />
          </mesh>
        ))}
      </group>

      {/* Side accent panel */}
      <mesh position={[0.82, 0.9, 0]}> 
        <boxGeometry args={[0.06, 1.6, 1.08]} />
        <meshStandardMaterial color="#111827" metalness={0.85} roughness={0.25} />
      </mesh>
    </group>
  );
}
