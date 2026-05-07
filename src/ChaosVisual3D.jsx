import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

export default function ChaosVisual3D() {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 1.2, 6], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        {/* Ambient — base visibility */}
        <ambientLight intensity={1.2} color="#ffffff" />

        {/* Key light — front-top, warm white */}
        <directionalLight position={[3, 5, 6]} intensity={3.5} color="#e8f4ff" castShadow />

        {/* Fill light — left side, soft */}
        <directionalLight position={[-4, 2, 4]} intensity={1.8} color="#c8e0ff" />

        {/* Cyan accent — top-right rim */}
        <directionalLight position={[4, 4, -2]} intensity={2.0} color="#00e5ff" />

        {/* Blue rim — back glow */}
        <directionalLight position={[0, -2, -6]} intensity={3.0} color="#0055ff" />

        {/* Point light — close front warm glow */}
        <pointLight position={[1, 2, 5]} intensity={20} distance={18} color="#ffffff" />

        {/* Cyan point — screen-like glow */}
        <pointLight position={[-1, 0, 4]} intensity={12} distance={12} color="#00d4ff" />

        <Suspense fallback={null}>
          <LaptopModel />
        </Suspense>
      </Canvas>
    </div>
  );
}

const LaptopModel = () => {
  const { scene } = useGLTF('/laptop_3d_model.glb');
  const mesh = useRef();

  useFrame((state, delta) => {
    if (mesh.current) {
      // Slow, elegant Y rotation
      mesh.current.rotation.y += delta * 0.07;
      // Subtle floating bob
      mesh.current.position.y = -0.3 + Math.sin(state.clock.elapsedTime * 0.6) * 0.08;
    }
  });

  return (
    <group ref={mesh} scale={3.4} position={[0, -0.3, 0]} rotation={[0.08, 0, 0]}>
      <primitive object={scene} />
    </group>
  );
};

useGLTF.preload('/laptop_3d_model.glb');
