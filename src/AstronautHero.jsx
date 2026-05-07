import React, { useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float, useAnimations } from '@react-three/drei';

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

function AstronautModel() {
  const group = useRef();
  const { scene, animations } = useGLTF('/astronaut_animated.glb');
  const { actions } = useAnimations(animations, group);

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
      <spotLight
        position={[-3, 8, 6]}
        intensity={isMobile ? 80 : 400}
        angle={0.35}
        penumbra={0.4}
        color="#ffffff"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.001}
      />
      <pointLight position={[6, 2, -3]} intensity={isMobile ? 8 : 40} color="#00aaff" distance={18} decay={2} />
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
