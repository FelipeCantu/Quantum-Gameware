'use client';
// The 3D headphones (public/headphones.glb), full-bleed behind the home hero in the original hero's
// position and scale, with the original studio lighting. The concept's collapse applies to the
// model itself: two flat copies, in quantum cobalt and gill pink, start offset from the real
// headphones and fold into them as the visitor scrolls. The amount comes from the observation
// driver (motion/observe.ts), so the model and the headline ghosts always collapse together.
// The render loop pauses off screen; under reduced motion the model holds still and observed.
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { observation } from '@/motion/observe';

// x is a fraction of the visible half-width, so the model runs off the right edge of the screen
// at any window width (the canvas spans the full window, not the centred content column).
type Layout = { scale: number; x: number; y: number; z: number; fov: number };
const layoutFor = (w: number): Layout =>
  w < 768 ? { scale: 1.4, x: 0, y: 1.8, z: 6.5, fov: 60 }
  : w < 1024 ? { scale: 2.6, x: 0.35, y: 1.4, z: 5.5, fov: 50 }
  : { scale: 3.1, x: 0.66, y: 0.7, z: 5, fov: 45 };

// The canvas is taller than the screen (site.css: .hero__model bottom: -45svh). EXT widens the
// field of view and LIFT raises the model so the framing on screen stays as designed.
const EXT = 1.45;
const tanHalf = (fov: number) => Math.tan(THREE.MathUtils.degToRad(fov / 2));
const fovFor = (l: Layout) => THREE.MathUtils.radToDeg(2 * Math.atan(EXT * tanHalf(l.fov)));
const liftFor = (l: Layout) => (EXT - 1) * l.z * tanHalf(l.fov);

// Offsets of the two ghosts at full superposition (world units, radians).
const GHOSTS = [
  { color: '#2633ff', dx: -0.55, dy: 0.22, rz: -0.06, phase: 0 },
  { color: '#ff4f9a', dx: 0.5, dy: -0.26, rz: 0.05, phase: 2.1 },
];

function Headphones({ layout, still }: { layout: Layout; still: boolean }) {
  const { scene } = useGLTF('/headphones.glb');
  const main = useRef<THREE.Group>(null);
  const ghostRefs = useRef<(THREE.Group | null)[]>([]);

  // Hide any backdrop planes baked into the file (kept from the original hero), then build
  // flat-coloured copies for the ghosts. Geometry is shared; only materials differ.
  const ghosts = useMemo(() => {
    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      const name = child.name.toLowerCase();
      const size = new THREE.Box3().setFromObject(child).getSize(new THREE.Vector3());
      const flatPlane = (size.x > 10 || size.y > 10 || size.z > 10) && (size.x < 0.5 || size.y < 0.5 || size.z < 0.5);
      if (['background', 'wall', 'floor', 'plane', 'backdrop', 'ground', 'base'].some((n) => name.includes(n)) || flatPlane) {
        child.visible = false;
      }
    });
    return GHOSTS.map((g) => {
      const material = new THREE.MeshBasicMaterial({ color: g.color, transparent: true, opacity: 0, depthWrite: false });
      const copy = scene.clone(true);
      copy.traverse((child) => {
        if (child instanceof THREE.Mesh) child.material = material;
      });
      return { copy, material };
    });
  }, [scene]);

  useEffect(() => () => ghosts.forEach((g) => g.material.dispose()), [ghosts]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const u = still ? 0 : observation.u;
    const spin = still ? 0.6 : Math.sin(t * 0.3) * 0.15 + t * 0.1; // the original hero's turn
    const bob = (still ? 0 : Math.sin(t * 0.5) * 0.1) + liftFor(layout);
    const x = (state.viewport.width / 2) * layout.x;
    if (main.current) {
      main.current.rotation.y = spin;
      main.current.position.set(x, layout.y + bob, 0);
    }
    GHOSTS.forEach((g, i) => {
      const ref = ghostRefs.current[i];
      if (!ref) return;
      const s = i % 2 ? -1 : 1;
      const drift = still ? 0 : 0.04 * u + 0.008;
      ref.position.set(
        x + g.dx * u + Math.sin(t * 0.7 + g.phase) * drift + observation.lagX * 0.6 * u * s,
        layout.y + bob + g.dy * u + Math.cos(t * 0.55 + g.phase) * drift - observation.lagY * 0.35 * u * s,
        -0.25,
      );
      ref.rotation.set(0, spin, g.rz * u);
      ghosts[i].material.opacity = 0.06 + 0.7 * u;
    });
  });

  return (
    <>
      {ghosts.map((g, i) => (
        <group key={i} ref={(el) => { ghostRefs.current[i] = el; }} scale={layout.scale} renderOrder={-1}>
          <primitive object={g.copy} />
        </group>
      ))}
      <group ref={main} scale={layout.scale}>
        <primitive object={scene} />
      </group>
    </>
  );
}

useGLTF.preload('/headphones.glb');

export default function HeroModel() {
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [still, setStill] = useState(false);
  const [layout, setLayout] = useState<Layout>(() => layoutFor(typeof window === 'undefined' ? 1440 : innerWidth));

  useEffect(() => {
    setStill(matchMedia('(prefers-reduced-motion: reduce)').matches);
    const onResize = () => setLayout(layoutFor(innerWidth));
    addEventListener('resize', onResize);
    const el = host.current;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    if (el) io.observe(el);
    return () => {
      removeEventListener('resize', onResize);
      io.disconnect();
    };
  }, []);

  return (
    <div ref={host} className="hero__model" aria-hidden="true">
      <Canvas
        key={`${layout.z}-${layout.fov}`}
        frameloop={visible ? 'always' : 'never'}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, layout.z], fov: fovFor(layout) }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
      >
        <ambientLight intensity={0.15} />
        <directionalLight position={[4, 5, 5]} intensity={1.6} />
        <directionalLight position={[-5, 2, 3]} intensity={0.5} />
        <directionalLight position={[-3, 3, -5]} intensity={1.2} color="#2633ff" />
        <Environment resolution={256} environmentIntensity={0.9}>
          <Lightformer form="rect" intensity={3} position={[0, 5, -2]} scale={[10, 3, 1]} rotation-x={Math.PI / 2} />
          <Lightformer form="rect" intensity={2} position={[-5, 1, 1]} scale={[3, 6, 1]} rotation-y={Math.PI / 2} />
          <Lightformer form="rect" intensity={2} position={[5, 1, 1]} scale={[3, 6, 1]} rotation-y={-Math.PI / 2} />
          <Lightformer form="ring" intensity={1.5} color="#2633ff" position={[0, 1, -6]} scale={4} />
        </Environment>
        <Suspense fallback={null}>
          <Headphones layout={layout} still={still} />
        </Suspense>
      </Canvas>
    </div>
  );
}
