import React, { useRef, Suspense, Component, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float, Environment } from '@react-three/drei';

class GLBErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: false }; }
  static getDerivedStateFromError(e) { console.error('[HelmetViewer]', e); return { error: true }; }
  render() { return this.state.error ? null : this.props.children; }
}

function HelmetModel({ isMobile }) {
  const ref = useRef();
  const { scene } = useGLTF('/spacesuit_helmet.glb');
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (isMobile) return;
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [isMobile]);

  useFrame(() => {
    if (!ref.current || isMobile) return;
    const targetY = mouse.current.x * 1.1;
    const targetX = -mouse.current.y * 0.7;
    ref.current.rotation.y += (targetY - ref.current.rotation.y) * 0.08;
    ref.current.rotation.x += (targetX - ref.current.rotation.x) * 0.08;
  });

  return (
    <group
      ref={ref}
      position={isMobile ? [0, 0, 0] : [-2.5, 1.2, 0]}
      rotation={isMobile ? [-0.5, 0.7, 0] : [0, 0, 0]}
    >
      <primitive object={scene} scale={0.05} />
    </group>
  );
}

export default function HelmetViewer() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <GLBErrorBoundary>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        dpr={[1, 2]}
        gl={{ alpha: true }}
        style={{ background: 'transparent', width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        <ambientLight intensity={isMobile ? 0.02 : 0.08} />
        <directionalLight position={[4, 8, 5]} intensity={isMobile ? 1.5 : 5} castShadow shadow-mapSize={[1024, 1024]} />
        <pointLight position={[5, 1, -3]} intensity={isMobile ? 0.4 : 1.5} color="#3366ff" distance={20} decay={2} />
        <Suspense fallback={null}>
          <Float
            speed={isMobile ? 0.35 : 0.7}
            rotationIntensity={0}
            floatIntensity={isMobile ? 1.8 : 1}
          >
            <HelmetModel isMobile={isMobile} />
          </Float>
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </GLBErrorBoundary>
  );
}
