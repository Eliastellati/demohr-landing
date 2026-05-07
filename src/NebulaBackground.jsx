import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

const RADIUS = 8;      // distanza camera dall'origine
const DEG_PER_100VH = Math.PI / 2;  // 90° ogni 100vh

function CameraRig() {
  const { camera } = useThree();
  const scrollY  = useRef(0);
  const curPos   = useRef(new THREE.Vector3(0, 0, RADIUS));
  const tgtPos   = useRef(new THREE.Vector3());
  const curFov   = useRef(65);

  useEffect(() => {
    const onScroll = () => { scrollY.current = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useFrame(() => {
    const progress = scrollY.current / (window.innerHeight || 1);
    const angle    = progress * DEG_PER_100VH;

    // Orbita XZ + variazione verticale a frequenza diversa
    tgtPos.current.set(
      RADIUS * Math.sin(angle),
      Math.sin(angle * 0.6) * 3,
      RADIUS * Math.cos(angle)
    );

    // FOV oscilla tra 53° e 77° per accentuare la sensazione di profondità
    const tgtFov = 65 + Math.cos(angle * 0.4) * 12;

    curPos.current.lerp(tgtPos.current, 0.1);
    curFov.current  = THREE.MathUtils.lerp(curFov.current, tgtFov, 0.06);

    camera.position.copy(curPos.current);
    camera.fov = curFov.current;
    camera.updateProjectionMatrix();
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function NebulaScene() {
  const { scene, animations } = useGLTF('/particle_nebula.glb');
  const { actions }           = useAnimations(animations, scene);
  const groupRef              = useRef();

  useEffect(() => {
    Object.values(actions).forEach(a => a?.play());
  }, [actions]);

  // Lenta auto-rotazione della nebula per renderla viva anche quando non si scrolla
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.03;
  });

  return (
    <>
      <CameraRig />
      <ambientLight intensity={1.5} />
      <primitive ref={groupRef} object={scene} />
    </>
  );
}

useGLTF.preload('/particle_nebula.glb');

export default function NebulaBackground() {
  return (
    <Canvas
      camera={{ position: [0, 0, RADIUS], fov: 65, near: 0.1, far: 1000 }}
      gl={{ antialias: true, alpha: false }}
      style={{ background: '#010208', width: '100%', height: '100%' }}
    >
      <NebulaScene />
    </Canvas>
  );
}
