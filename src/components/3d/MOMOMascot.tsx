"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function MOMOMascotInner({ 
  mouseX = 0, 
  mouseY = 0, 
  scrollProgress = 0,
  autoRotate = true 
}: { 
  mouseX?: number; 
  mouseY?: number; 
  scrollProgress?: number;
  autoRotate?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Mesh>(null);
  
  // Eye refs store objects with group, pupil, eyeGlow
  interface EyeRef { group: THREE.Group; pupil: THREE.Mesh; eyeGlow: THREE.Mesh; }
  const eyeRefs = useRef<EyeRef[]>([]);
  
  // Antenna refs store objects with group, tip
  interface AntennaRef { group: THREE.Group; tip: THREE.Mesh; }
  const antennaRefs = useRef<AntennaRef[]>([]);
  
  const earRefs = useRef<THREE.Mesh[]>([]);
  const tailRef = useRef<THREE.Group>(null);
  const particleRefs = useRef<THREE.Points[]>([]);
  const timeRef = useRef(0);
  const blinkRef = useRef(0);
  const floatOffset = useRef(0);

  // Geometries
  const geometries = useMemo(() => ({
    // Main body - rounded capsule shape
    body: new THREE.CapsuleGeometry(1.2, 1.8, 16, 32),
    // Head - slightly larger sphere
    head: new THREE.SphereGeometry(1.1, 32, 32),
    // Eyes - large expressive eyes
    eye: new THREE.SphereGeometry(0.28, 16, 16),
    eyeGlow: new THREE.SphereGeometry(0.32, 16, 16),
    pupil: new THREE.SphereGeometry(0.12, 12, 12),
    // Antennas
    antenna: new THREE.CapsuleGeometry(0.04, 0.6, 8, 16),
    antennaTip: new THREE.SphereGeometry(0.08, 12, 12),
    // Ears/wings
    ear: new THREE.ConeGeometry(0.35, 0.7, 8),
    // Tail
    tailSegment: new THREE.CapsuleGeometry(0.15, 0.4, 8, 8),
    tailTip: new THREE.ConeGeometry(0.12, 0.3, 8),
    // Particles
    particle: new THREE.SphereGeometry(0.04, 8, 8),
  }), []);

  // Materials
  const materials = useMemo(() => {
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: 0x1a1a3a,
      metalness: 0.2,
      roughness: 0.3,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      transmission: 0.1,
      thickness: 0.5,
      ior: 1.3,
      emissive: new THREE.Color(0xa855f7),
      emissiveIntensity: 0.1,
    });

    const headMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e1e4a,
      metalness: 0.15,
      roughness: 0.25,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      transmission: 0.15,
      thickness: 0.4,
      ior: 1.35,
      emissive: new THREE.Color(0xa855f7),
      emissiveIntensity: 0.12,
    });

    const eyeWhiteMat = new THREE.MeshPhysicalMaterial({
      color: 0xf0f0ff,
      metalness: 0,
      roughness: 0.1,
      transmission: 0.9,
      thickness: 0.3,
      clearcoat: 1,
      clearcoatRoughness: 0,
    });

    const eyeGlowMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const pupilMat = new THREE.MeshBasicMaterial({
      color: 0x0a0a1a,
    });

    const antennaMat = new THREE.MeshPhysicalMaterial({
      color: 0x2a2a5a,
      metalness: 0.4,
      roughness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      emissive: new THREE.Color(0xa855f7),
      emissiveIntensity: 0.2,
    });

    const antennaTipMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });

    const earMat = new THREE.MeshPhysicalMaterial({
      color: 0x1a1a3a,
      metalness: 0.2,
      roughness: 0.3,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      transmission: 0.2,
      thickness: 0.3,
      side: THREE.DoubleSide,
      emissive: new THREE.Color(0xa855f7),
      emissiveIntensity: 0.08,
    });

    const tailMat = new THREE.MeshPhysicalMaterial({
      color: 0x1a1a3a,
      metalness: 0.2,
      roughness: 0.3,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      emissive: new THREE.Color(0xa855f7),
      emissiveIntensity: 0.1,
    });

    const particleMat = new THREE.PointsMaterial({
      color: 0xa855f7,
      size: 0.08,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    return {
      bodyMat, headMat, eyeWhiteMat, eyeGlowMat, pupilMat,
      antennaMat, antennaTipMat, earMat, tailMat, particleMat
    };
  }, []);

  useEffect(() => {
    if (!groupRef.current) return;

    // --- BODY ---
    const body = new THREE.Mesh(geometries.body, materials.bodyMat);
    body.position.y = 0;
    body.castShadow = true;
    body.receiveShadow = true;
    groupRef.current.add(body);
    bodyRef.current = body;

    // --- HEAD ---
    const head = new THREE.Mesh(geometries.head, materials.headMat);
    head.position.y = 1.8;
    head.scale.set(1, 0.95, 1);
    head.castShadow = true;
    head.receiveShadow = true;
    groupRef.current.add(head);
    headRef.current = head;

    // --- EYES (pair) ---
    const eyePositions = [
      [-0.35, 0.15, 0.95],
      [0.35, 0.15, 0.95],
    ];

    eyePositions.forEach((pos, i) => {
      const eyeGroup = new THREE.Group();
      
      // Eye white
      const eyeWhite = new THREE.Mesh(geometries.eye, materials.eyeWhiteMat);
      eyeWhite.position.set(0, 0, 0);
      eyeGroup.add(eyeWhite);
      
      // Eye glow
      const eyeGlow = new THREE.Mesh(geometries.eyeGlow, materials.eyeGlowMat);
      eyeGlow.position.set(0, 0, 0.02);
      eyeGroup.add(eyeGlow);
      
      // Pupil
      const pupil = new THREE.Mesh(geometries.pupil, materials.pupilMat);
      pupil.position.set(0, 0, 0.18);
      pupil.scale.z = 0.3;
      eyeGroup.add(pupil);
      
      eyeGroup.position.set(pos[0], pos[1], pos[2]);
      head.add(eyeGroup);
      eyeRefs.current[i] = { group: eyeGroup, pupil, eyeGlow };
    });

    // --- ANTENNAS ---
    for (let i = 0; i < 2; i++) {
      const antennaGroup = new THREE.Group();
      
      const antenna = new THREE.Mesh(geometries.antenna, materials.antennaMat);
      antenna.position.y = 0.3;
      antenna.rotation.z = (i === 0 ? -0.3 : 0.3);
      antennaGroup.add(antenna);
      
      const tip = new THREE.Mesh(geometries.antennaTip, materials.antennaTipMat);
      tip.position.set(0, 0.65, 0);
      antennaGroup.add(tip);
      
      antennaGroup.position.set(i === 0 ? -0.4 : 0.4, 1.1, 0.2);
      antennaGroup.rotation.z = (i === 0 ? -0.2 : 0.2);
      head.add(antennaGroup);
      antennaRefs.current[i] = { group: antennaGroup, tip };
    }

    // --- EARS / WINGS ---
    for (let i = 0; i < 2; i++) {
      const ear = new THREE.Mesh(geometries.ear, materials.earMat);
      ear.position.set(i === 0 ? -0.7 : 0.7, 0.6, -0.2);
      ear.rotation.set(
        -Math.PI / 2,
        0,
        i === 0 ? -0.4 : 0.4
      );
      ear.scale.set(1, 1, 0.4);
      head.add(ear);
      earRefs.current[i] = ear;
    }

    // --- TAIL ---
    const tailGroup = new THREE.Group();
    const segmentCount = 5;
    for (let i = 0; i < segmentCount; i++) {
      const segment = new THREE.Mesh(
        i === segmentCount - 1 ? geometries.tailTip : geometries.tailSegment,
        materials.tailMat
      );
      segment.position.y = -i * 0.45;
      segment.rotation.x = Math.PI / 2;
      if (i === segmentCount - 1) segment.rotation.x = 0;
      tailGroup.add(segment);
    }
    tailGroup.position.set(0, -1.2, 0.5);
    tailGroup.rotation.x = -Math.PI / 4;
    groupRef.current.add(tailGroup);
    tailRef.current = tailGroup;

    // --- AMBIENT PARTICLES ---
    for (let p = 0; p < 2; p++) {
      const particleGeo = new THREE.BufferGeometry();
      const count = 30;
      const positions = new Float32Array(count * 3);
      const sizes = new Float32Array(count);
      const alphas = new Float32Array(count);
      const phases = new Float32Array(count);
      
      for (let i = 0; i < count; i++) {
        const r = 1.5 + Math.random() * 1.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);
        sizes[i] = 0.03 + Math.random() * 0.05;
        alphas[i] = 0.3 + Math.random() * 0.5;
        phases[i] = Math.random() * Math.PI * 2;
      }
      
      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particleGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      particleGeo.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
      particleGeo.setAttribute('phase', new THREE.BufferAttribute(phases, 1));
      
      const particleMat = materials.particleMat.clone();
      particleMat.size = 0.08;
      
      const particles = new THREE.Points(particleGeo, particleMat);
      groupRef.current.add(particles);
      particleRefs.current[p] = particles;
    }

    return () => {
      // Cleanup
      Object.values(geometries).forEach(g => g.dispose());
      Object.values(materials).forEach(m => m.dispose());
    };
  }, [geometries, materials]);

  useFrame((_, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;

    if (!groupRef.current) return;

    // --- FLOAT ANIMATION ---
    floatOffset.current = Math.sin(t * 0.7) * 0.15 + Math.sin(t * 1.3) * 0.05;
    groupRef.current.position.y = floatOffset.current - scrollProgress * 1.5;

    // --- AUTO ROTATION ---
    if (autoRotate) {
      groupRef.current.rotation.y += delta * 0.12;
    }

    // --- MOUSE INTERACTION ---
    const targetRotY = mouseX * 0.4;
    const targetRotX = mouseY * 0.25;
    groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.03;
    groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.03;

    // --- SCROLL SCALE ---
    const scrollScale = 1 - scrollProgress * 0.25;
    groupRef.current.scale.setScalar(scrollScale);

    // --- BODY SUBTLE BREATHING ---
    if (bodyRef.current) {
      const breathe = 1 + Math.sin(t * 1.2) * 0.02;
      bodyRef.current.scale.setScalar(breathe);
    }

    // --- HEAD BOB ---
    if (headRef.current) {
      headRef.current.position.y = 1.8 + Math.sin(t * 1.5) * 0.04;
      headRef.current.rotation.y = Math.sin(t * 0.8) * 0.1;
    }

    // --- EYES BLINK & LOOK ---
    eyeRefs.current.forEach((eye, i) => {
      if (!eye) return;
      
      // Blinking
      blinkRef.current += delta;
      if (blinkRef.current > 3 + Math.random() * 2) {
        blinkRef.current = 0;
      }
      const isBlinking = blinkRef.current < 0.15;
      eye.group.scale.y = isBlinking ? 0.05 : 1;
      eye.eyeGlow.scale.y = isBlinking ? 0.05 : 1;
      eye.pupil.scale.y = isBlinking ? 0.05 : 1;
      
      // Pupil follows mouse
      eye.pupil.position.x = mouseX * 0.08;
      eye.pupil.position.y = -mouseY * 0.06;
      
      // Eye glow pulse
      (eye.eyeGlow.material as THREE.MeshBasicMaterial).opacity = 0.3 + Math.sin(t * 2 + i) * 0.1;
      eye.eyeGlow.scale.setScalar(1 + Math.sin(t * 1.5 + i) * 0.05);
    });

    // --- ANTENNAS SWAY ---
    antennaRefs.current.forEach((antenna, i) => {
      if (!antenna) return;
      antenna.group.rotation.z = (i === 0 ? -0.2 : 0.2) + Math.sin(t * 1.5 + i) * 0.15;
      (antenna.tip.material as THREE.MeshBasicMaterial).opacity = 0.6 + Math.sin(t * 3 + i) * 0.3;
      antenna.tip.scale.setScalar(1 + Math.sin(t * 2.5 + i) * 0.2);
    });

    // --- EARS FLUTTER ---
    earRefs.current.forEach((ear, i) => {
      if (!ear) return;
      ear.rotation.z = (i === 0 ? -0.4 : 0.4) + Math.sin(t * 2 + i) * 0.08;
      ear.rotation.x = -Math.PI / 2 + Math.sin(t * 1.8 + i) * 0.05;
    });

    // --- TAIL SWAY ---
    if (tailRef.current) {
      tailRef.current.rotation.z = Math.sin(t * 1.3) * 0.3;
      tailRef.current.rotation.y = Math.cos(t * 0.9) * 0.15;
      
      // Animate tail segments
      tailRef.current.children.forEach((segment, i) => {
        if (segment instanceof THREE.Mesh) {
          segment.rotation.z = Math.sin(t * 1.5 + i * 0.5) * 0.15 * (1 - i * 0.1);
        }
      });
    }

    // --- PARTICLES ---
    particleRefs.current.forEach((particles, p) => {
      if (!particles) return;
      particles.rotation.y += delta * (0.05 + p * 0.02);
      particles.rotation.x += delta * 0.02;
      
      const posAttr = particles.geometry.getAttribute('position') as THREE.BufferAttribute;
      const phaseAttr = particles.geometry.getAttribute('phase') as THREE.BufferAttribute;
      const alphaAttr = particles.geometry.getAttribute('alpha') as THREE.BufferAttribute;
      
      for (let i = 0; i < posAttr.count; i++) {
        const phase = phaseAttr.getX(i);
        const y = posAttr.getY(i);
        
        // Upward drift with noise
        posAttr.setY(i, y + delta * 0.15 + Math.sin(t * 2 + phase) * delta * 0.05);
        posAttr.setX(i, posAttr.getX(i) + Math.sin(t + phase) * delta * 0.03);
        posAttr.setZ(i, posAttr.getZ(i) + Math.cos(t * 0.7 + phase) * delta * 0.03);
        
        // Reset when too high
        if (posAttr.getY(i) > 3) {
          const r = 1.5 + Math.random() * 1.5;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          posAttr.setX(i, r * Math.sin(phi) * Math.cos(theta));
          posAttr.setY(i, -1.5);
          posAttr.setZ(i, r * Math.cos(phi));
        }
        
        // Pulsing alpha
        alphaAttr.setX(i, alphaAttr.getX(i) * 0.99 + (0.4 + Math.sin(t * 3 + phase) * 0.3) * 0.01);
      }
      
      posAttr.needsUpdate = true;
      alphaAttr.needsUpdate = true;
    });
  });

  return (
    <group ref={groupRef}>
      {/* Lighting from within the mascot */}
      <pointLight position={[0, 2, 0]} color="#a855f7" intensity={0.8} decay={2} distance={5} />
      <pointLight position={[0, -1, 0]} color="#06b6d4" intensity={0.5} decay={2} distance={4} />
    </group>
  );
}

interface MOMOMascotProps {
  mouseX?: number;
  mouseY?: number;
  scrollProgress?: number;
  className?: string;
  autoRotate?: boolean;
}

export function MOMOMascot({ 
  mouseX = 0, 
  mouseY = 0, 
  scrollProgress = 0,
  className = "",
  autoRotate = true
}: MOMOMascotProps) {
  return (
    <Canvas
      className={className}
      camera={{ position: [0, 0.5, 6], fov: 35 }}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      <color attach="background" args={["#030307"]} />
      <fog attach="fog" args={["#030307", 3, 15]} />
      <MOMOMascotInner 
        mouseX={mouseX} 
        mouseY={mouseY} 
        scrollProgress={scrollProgress}
        autoRotate={autoRotate}
      />
    </Canvas>
  );
}