import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Float, PresentationControls } from '@react-three/drei';
import { motion } from 'framer-motion-3d';

function Model({ url, rotationX, rotationZ }) {
  const { scene } = useGLTF(url);
  const modelRef = useRef();

  return (
    <motion.primitive 
      ref={modelRef}
      object={scene} 
      scale={2.5}
      rotation-x={rotationX}
      rotation-z={rotationZ}
      animate={{
        rotateX: rotationX,
        rotateZ: rotationZ
      }}
      transition={{ type: "spring", stiffness: 50, damping: 20 }}
    />
  );
}

export default function ModelViewer({ url, rotationX = 0, rotationZ = 0 }) {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        
        <Suspense fallback={null}>
          <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
            <Model url={url} rotationX={rotationX} rotationZ={rotationZ} />
          </Float>
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
