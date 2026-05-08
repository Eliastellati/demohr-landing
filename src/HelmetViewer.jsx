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
    if (scene) {
      scene.traverse((node) => {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
          if (node.material) {
            // Make it more metallic and slightly brighter base for contrast
            node.material.metalness = 1.0;
            node.material.roughness = 0.05;
            node.material.envMapIntensity = 2.0;
            // Slightly brighter base color to allow for highlights to pop
            if (node.material.color) {
              node.material.color.multiplyScalar(0.6);
            }
          }
        }
      });
    }
  }, [scene]);

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
        shadows
        camera={{ position: [0, 0, 10], fov: 45 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent', width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        <ambientLight intensity={0.01} />
        
        {/* Main dramatic light - Brighter */}
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={isMobile ? 3 : 7} 
          castShadow 
          shadow-mapSize={[1024, 1024]} 
        />
        
        {/* Blue rim light - More intense */}
        <pointLight position={[5, 2, -3]} intensity={isMobile ? 2 : 5} color="#00d2ff" distance={25} decay={2} />
        
        {/* Front accent for highlights */}
        <pointLight position={[-4, 1, 5]} intensity={isMobile ? 1.5 : 4} color="#ffffff" distance={20} decay={2} />

        {/* Back light for separation */}
        <spotLight position={[-5, 8, -5]} intensity={3} color="#ffffff" angle={0.3} penumbra={1} />

        <Suspense fallback={null}>
          <Float
            speed={isMobile ? 0.35 : 0.7}
            rotationIntensity={0}
            floatIntensity={isMobile ? 1.8 : 1}
          >
            <HelmetModel isMobile={isMobile} />
          </Float>
          {/* Night preset with higher intensity for reflections */}
          <Environment preset="night" environmentIntensity={1.5} />
        </Suspense>
      </Canvas>
    </GLBErrorBoundary>
  );
}
