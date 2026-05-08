import React, { useRef, useMemo, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { useGLTF, Float, Trail, useAnimations, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

// Materiale custom per stelle con alone di luminescenza (glow) e scintillio (twinkle)
const StarGlowMaterial = shaderMaterial(
  { 
    uTime: 0, 
    uSize: 0.18, 
    uPixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1 
  },
  // Vertex Shader
  `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  attribute float aScale;
  attribute float aRandom;
  varying float vAlpha;
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    float t = uTime * (0.8 + aRandom);
    float twinkle = 0.5 + 0.5 * pow(0.5 + 0.5 * sin(t + aRandom * 100.0), 3.0);
    vAlpha = twinkle;
    gl_PointSize = uSize * aScale * uPixelRatio * (800.0 / -mvPosition.z);
  }
  `,
  // Fragment Shader
  `
  varying float vAlpha;
  void main() {
    float r = distance(gl_PointCoord, vec2(0.5));
    if (r > 0.5) discard;
    float strength = (0.07 / r) - 0.14;
    strength = clamp(strength, 0.0, 1.0);
    gl_FragColor = vec4(1.0, 1.0, 1.0, strength * vAlpha);
  }
  `
);

extend({ StarGlowMaterial });


function SketchfabPlanet({ url, size, orbitRadius, speed, offset, scrollProgress }) {
  const ref = useRef();
  const { scene } = useGLTF(url);
  
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime() * speed + offset;
    const latestScroll = typeof scrollProgress.get === 'function' ? scrollProgress.get() : 0;
    
    ref.current.position.x = Math.cos(t) * orbitRadius;
    ref.current.position.z = Math.sin(t) * orbitRadius;
    
    ref.current.rotation.y += 0.005;
    ref.current.rotation.x = latestScroll * Math.PI * 0.5;
  });

  return <primitive ref={ref} object={clonedScene} scale={size} />;
}

function Nebula({ scrollProgress }) {
  const groupRef = useRef();
  const { scene, animations } = useGLTF('/particle_nebula.glb');
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    if (actions) {
      Object.values(actions).forEach(a => a?.play());
    }
  }, [actions]);

  useFrame((state) => {
    if (groupRef.current) {
      const latestScroll = typeof scrollProgress.get === 'function' ? scrollProgress.get() : 0;
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
      groupRef.current.rotation.x = latestScroll * Math.PI * 0.1;
    }
  });

  // Nebula spostata più indietro per non interferire con l'astronauta
  return <primitive ref={groupRef} object={scene} scale={100} position={[0, 0, -20]} />;
}

function Starfield({ count = 8000, scrollProgress }) {
  const ref = useRef();
  const materialRef = useRef();

  const [positions, scales, randoms] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const scl = new Float32Array(count);
    const rnd = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const r = 80 + Math.random() * 100;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      
      scl[i] = Math.random() * 2.0 + 0.5;
      rnd[i] = Math.random();
    }
    return [pos, scl, rnd];
  }, [count]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.getElapsedTime();
    }
    if (ref.current) {
      const latestScroll = typeof scrollProgress.get === 'function' ? scrollProgress.get() : 0;
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.005;
      ref.current.rotation.x = latestScroll * Math.PI * 0.05;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aScale" count={count} array={scales} itemSize={1} />
        <bufferAttribute attach="attributes-aRandom" count={count} array={randoms} itemSize={1} />
      </bufferGeometry>
      <starGlowMaterial 
        ref={materialRef} 
        transparent 
        depthWrite={false} 
        blending={THREE.AdditiveBlending} 
      />
    </points>
  );
}

function ShootingStar() {
  const headRef = useRef();
  const [active, setActive] = useState(false);
  const [data, setData] = useState({ start: [0,0,0], end: [0,0,0], speed: 1, startTime: 0 });

  useFrame((state) => {
    if (!active && Math.random() < 0.003) {
      const xStart = 30 + Math.random() * 20;
      const yStart = 20 + Math.random() * 20;
      const z = -40;
      const xEnd = xStart - 60;
      const yEnd = yStart - 60;
      
      setData({ 
        start: [xStart, yStart, z], 
        end: [xEnd, yEnd, z], 
        speed: 0.3 + Math.random() * 0.4,
        startTime: state.clock.getElapsedTime() 
      });
      setActive(true);
    }

    if (active && headRef.current) {
      const t = (state.clock.getElapsedTime() - data.startTime) * data.speed;
      if (t > 1) {
        setActive(false);
      } else {
        headRef.current.position.set(
          THREE.MathUtils.lerp(data.start[0], data.end[0], t),
          THREE.MathUtils.lerp(data.start[1], data.end[1], t),
          THREE.MathUtils.lerp(data.start[2], data.end[2], t)
        );
      }
    }
  });

  return (
    active && (
      <Trail
        width={1.6}
        length={15}
        color={new THREE.Color('#ffffff')}
        attenuation={(t) => t * t}
      >
        <mesh ref={headRef}>
          <sphereGeometry args={[0.1, 4, 4]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </Trail>
    )
  );
}

export default function Background3D({ scrollProgress }) {
  const isLaptop = typeof window !== 'undefined' && window.innerWidth >= 1024;
  const sizeMult = isLaptop ? 1.6 : 1.2;

  // Ritarda il caricamento dei pianeti (lava: 11MB + mercury: 42MB = 53MB totali)
  // di 3 secondi per non bloccare il primo render della pagina
  const [showPlanets, setShowPlanets] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShowPlanets(true), 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full bg-[#000] -z-10">
      <Canvas
        shadows
        camera={{ position: [0, 0, 40], fov: 45 }}
        dpr={[1, isMobile ? 1 : 1.5]}
        performance={{ min: 0.5 }}
      >
        <color attach="background" args={['#000']} />
        
        <ambientLight intensity={0.6} />
        
        <pointLight 
          position={[50, 50, 50]} 
          intensity={15} 
          castShadow 
          shadow-mapSize={[1024, 1024]}
        />
        
        <Suspense fallback={null}>
          <Nebula scrollProgress={scrollProgress} />
          {/* Starfield ridotto: 5000 desktop, 2500 mobile (era 9000) */}
          <Starfield scrollProgress={scrollProgress} count={isMobile ? 2500 : 5000} />

          {/* Pianeti caricati dopo 3s: lava (11MB) + mercury (42MB) = 53MB totali */}
          {showPlanets && (
            <>
              <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
                <SketchfabPlanet
                  url="/lava_planet.glb"
                  size={1.5 * sizeMult}
                  orbitRadius={7}
                  speed={0.1}
                  offset={0}
                  scrollProgress={scrollProgress}
                />
              </Float>

              <SketchfabPlanet
                url="/mercury_planet.glb"
                size={0.6 * sizeMult}
                orbitRadius={16}
                speed={0.15}
                offset={Math.PI}
                scrollProgress={scrollProgress}
              />
            </>
          )}

          <ShootingStar />
          <ShootingStar />
        </Suspense>
      </Canvas>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)] opacity-30 pointer-events-none" />
    </div>
  );
}
