import React, { useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float, useAnimations } from '@react-three/drei';

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

function AstronautModel() {
  const group = useRef();
  const { scene, animations } = useGLTF('/astronaut_animated.glb');
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (scene) {
      scene.traverse((node) => {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
          if (node.material) {
            // Premium metallic look for the suit and visor
            node.material.metalness = 0.8;
            node.material.roughness = 0.2;
            
            // If it's the visor (usually named something with glass or visor)
            if (node.name.toLowerCase().includes('visor') || node.name.toLowerCase().includes('glass')) {
              node.material.metalness = 1.0;
              node.material.roughness = 0.05;
              node.material.envMapIntensity = 2.5;
            }
          }
        }
      });
    }
  }, [scene]);

  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      Object.values(actions)[0].play();
    }
  }, [actions]);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.07) * 0.12;
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.3;
    }
  });

  return (
    <group ref={group} position={isMobile ? [0, -0.5, 0] : [4.5, -0.3, 0]} rotation={[0.1, -0.6, 0]}>
      {/* Primary key light - PURE WHITE and strong */}
      <spotLight
        position={[-3, 10, 8]}
        intensity={isMobile ? 180 : 1000}
        angle={0.3}
        penumbra={0.2}
        color="#ffffff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      />
      
      {/* Neutral highlight side */}
      <pointLight 
        position={[8, 4, -2]} 
        intensity={isMobile ? 30 : 150} 
        color="#ffffff" 
        distance={30} 
        decay={1.5} 
      />
      
      {/* Subtle Azure Rim for the visor reflections */}
      <pointLight 
        position={[5, 2, 5]} 
        intensity={isMobile ? 20 : 100} 
        color="#00d2ff" 
        distance={15} 
        decay={2} 
      />

      {/* Another azure accent from below */}
      <pointLight 
        position={[-5, -2, 2]} 
        intensity={isMobile ? 10 : 40} 
        color="#00aaff" 
        distance={12} 
        decay={2} 
      />

      {/* Neutral back light for separation */}
      <spotLight
        position={[2, 5, -12]}
        intensity={isMobile ? 60 : 300}
        angle={0.5}
        penumbra={1}
        color="#ffffff"
      />

      <primitive object={scene} scale={4.5} castShadow receiveShadow />
    </group>
  );
}

export default function AstronautHero() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 10], fov: 45 }}
      dpr={[1, 2]}
      gl={{ alpha: true }}
      style={{ background: 'transparent', width: '100%', height: '100%', pointerEvents: 'none' }}
    >
      <ambientLight intensity={isMobile ? 0.05 : 0.25} />
      <Suspense fallback={null}>
        <Float speed={0.8} rotationIntensity={0.15} floatIntensity={2.5}>
          <AstronautModel />
        </Float>
      </Suspense>
    </Canvas>
  );
}
