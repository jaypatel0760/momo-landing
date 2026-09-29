"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticleFieldProps {
  count?: number;
  size?: number;
  colorA?: string;
  colorB?: string;
}

interface ParticleData {
  positions: Float32Array;
  colors: Float32Array;
  sizes: Float32Array;
  velocities: Float32Array;
  phases: Float32Array;
}

function Particles({ count = 2000, size = 50, colorA = "#a855f7", colorB = "#06b6d4" }) {
  const pointsRef = useRef<THREE.Points>(null);
  const particleDataRef = useRef<ParticleData | null>(null);
  const initializedRef = useRef(false);
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);

  // Initialize particle data and geometry in useEffect
  useEffect(() => {
    if (initializedRef.current) return;
    
    const pos = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const velocities = new Float32Array(count * 3);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const radius = 5 + Math.random() * size;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      const t = Math.random();
      const color = new THREE.Color(colorA).lerp(new THREE.Color(colorB), t);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = 0.5 + Math.random() * 2;
      velocities[i * 3] = (Math.random() - 0.5) * 0.0005;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.0005;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.0005;
      phases[i] = Math.random() * Math.PI * 2;
    }

    const data: ParticleData = { positions: pos, colors, sizes, velocities, phases };
    particleDataRef.current = data;
    initializedRef.current = true;

    // Create geometry immediately
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));
    geo.setAttribute("phase", new THREE.BufferAttribute(phases, 1));
    setGeometry(geo);
  }, [count, size, colorA, colorB]);

  const materialRef = useMemo(() => 
    new THREE.PointsMaterial({
      size: 1,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }), 
  []);

  useFrame(({ clock }) => {
    const points = pointsRef.current;
    if (!points || !particleDataRef.current || !geometry) return;

    const posAttr = points.geometry.getAttribute("position") as THREE.BufferAttribute;
    const velAttr = points.geometry.getAttribute("velocity") as THREE.BufferAttribute;
    const phaseAttr = points.geometry.getAttribute("phase") as THREE.BufferAttribute;
    const sizeAttr = points.geometry.getAttribute("size") as THREE.BufferAttribute;
    const time = clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const phase = phaseAttr.getX(i);
      
      posAttr.setX(i, posAttr.getX(i) + velAttr.getX(i) * Math.sin(time + phase));
      posAttr.setY(i, posAttr.getY(i) + velAttr.getY(i) * Math.cos(time * 0.7 + phase));
      posAttr.setZ(i, posAttr.getZ(i) + velAttr.getZ(i) * Math.sin(time * 0.5 + phase));

      const dist = Math.sqrt(
        posAttr.getX(i) ** 2 + posAttr.getY(i) ** 2 + posAttr.getZ(i) ** 2
      );
      if (dist > size + 10) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 5 + Math.random() * 10;
        posAttr.setX(i, r * Math.sin(phi) * Math.cos(theta));
        posAttr.setY(i, r * Math.sin(phi) * Math.sin(theta));
        posAttr.setZ(i, r * Math.cos(phi));
      }

      const baseSize = sizeAttr.getX(i);
      (points.material as THREE.PointsMaterial).size = baseSize * (0.8 + Math.sin(time * 2 + phase) * 0.2);
    }

    posAttr.needsUpdate = true;
  });

  if (!geometry) return null;

  return <points ref={pointsRef} geometry={geometry} material={materialRef} />;
}

interface ParticleFieldWrapperProps extends ParticleFieldProps {
  className?: string;
}

export function ParticleField({ 
  count = 1500, 
  size = 40, 
  colorA = "#a855f7", 
  colorB = "#06b6d4",
  className = "" 
}: ParticleFieldWrapperProps) {
  return (
    <Canvas
      className={className}
      camera={{ position: [0, 0, 30], fov: 50 }}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      <color attach="background" args={["#030307"]} />
      <fog attach="fog" args={["#030307", 20, 80]} />
      <Particles count={count} size={size} colorA={colorA} colorB={colorB} />
    </Canvas>
  );
}