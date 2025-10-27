'use client';

import { useEffect, useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Html, OrbitControls, Sparkles, useGLTF, ContactShadows } from '@react-three/drei';
import FuturisticCoffeeMaker from './FuturisticCoffeeMaker';

const DEFAULT_MODEL_URL =
  'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models@master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb';

function Device({ modelUrl }) {
  const ref = useRef();
  const { scene } = useGLTF(modelUrl);
  const G = 'group';
  const P = 'primitive';

  useEffect(() => {
    if (!scene) return;
    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
  }, [scene]);

  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * 0.35;
    }
  });

  if (!scene) return null;
  return (
    <G ref={ref} position={[0, -0.2, 0]} scale={1.7} rotation={[0, Math.PI * 0.15, 0]}>
      <P object={scene} />
    </G>
  );
}

export default function TechModel({ modelUrl }) {
  const url = useMemo(() => modelUrl || DEFAULT_MODEL_URL, [modelUrl]);
  return (
    <div className="relative h-[380px] md:h-[520px] rounded-2xl overflow-hidden bg-black/10">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 6], fov: 45 }}>
        <Suspense fallback={<Html center><div className="text-zinc-300 text-sm">Loading 3D…</div></Html>}>
          <ambientLight intensity={0.6} />
          {/* Key light */}
          <spotLight position={[6, 6, 6]} angle={0.35} penumbra={0.5} intensity={1.25} castShadow />
          {/* Fill light */}
          <pointLight position={[-6, -3, -4]} intensity={0.7} />
          {/* Rim light for tech edges */}
          <pointLight position={[0, 2.5, -3]} intensity={0.5} color="#66ccff" />
          {modelUrl ? (
            <Device modelUrl={url} />
          ) : (
            <FuturisticCoffeeMaker />
          )}
          <Sparkles count={60} speed={0.2} scale={8} size={3} color="#0ea5e9" />
          <Environment preset="city" />
          <ContactShadows position={[0, -1.2, 0]} opacity={0.35} scale={10} blur={1.8} far={2.2} />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.6} />
      </Canvas>
    </div>
  );
}

useGLTF.preload(DEFAULT_MODEL_URL);
