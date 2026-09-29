"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function TokenMascotInner() {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const eyeRefs = useRef<Array<{group: THREE.Group; pupil: THREE.Mesh; eyeGlow: THREE.Mesh}>>([]);
  const antennaRefs = useRef<Array<{group: THREE.Group; tip: THREE.Mesh}>>([]);
  const earRefs = useRef<THREE.Mesh[]>([]);
  const tailRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);
  const blinkRef = useRef(0);

  const geometries = useMemo(() => ({
    body: new THREE.CapsuleGeometry(0.5, 0.7, 12, 24),
    head: new THREE.SphereGeometry(0.45, 24, 24),
    eye: new THREE.SphereGeometry(0.12, 12, 12),
    eyeGlow: new THREE.SphereGeometry(0.14, 12, 12),
    pupil: new THREE.SphereGeometry(0.05, 10, 10),
    antenna: new THREE.CapsuleGeometry(0.02, 0.25, 6, 12),
    antennaTip: new THREE.SphereGeometry(0.04, 10, 10),
    ear: new THREE.ConeGeometry(0.15, 0.3, 6),
    tailSegment: new THREE.CapsuleGeometry(0.06, 0.18, 6, 6),
    tailTip: new THREE.ConeGeometry(0.05, 0.15, 6),
  }), []);

  const materials = useMemo(() => {
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: 0x1a1a3a,
      metalness: 0.2,
      roughness: 0.3,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      transmission: 0.1,
      thickness: 0.3,
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
      thickness: 0.2,
      ior: 1.35,
      emissive: new THREE.Color(0xa855f7),
      emissiveIntensity: 0.12,
    });

    const eyeWhiteMat = new THREE.MeshPhysicalMaterial({
      color: 0xf0f0ff,
      metalness: 0,
      roughness: 0.1,
      transmission: 0.9,
      thickness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0,
    });

    const eyeGlowMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.5,
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
      thickness: 0.2,
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

    return {
      bodyMat, headMat, eyeWhiteMat, eyeGlowMat, pupilMat,
      antennaMat, antennaTipMat, earMat, tailMat
    };
  }, []);

  useEffect(() => {
    if (!groupRef.current) return;

    // Body
    const body = new THREE.Mesh(geometries.body, materials.bodyMat);
    body.position.y = 0;
    body.castShadow = true;
    body.receiveShadow = true;
    groupRef.current.add(body);
    bodyRef.current = body;

    // Head
    const head = new THREE.Mesh(geometries.head, materials.headMat);
    head.position.y = 0.75;
    head.scale.set(1, 0.9, 1);
    head.castShadow = true;
    groupRef.current.add(head);
    headRef.current = head;

    // Eyes
    const eyePositions = [
      [-0.15, 0.05, 0.4],
      [0.15, 0.05, 0.4],
    ];

    eyePositions.forEach((pos, i) => {
      const eyeGroup = new THREE.Group();
      
      const eyeWhite = new THREE.Mesh(geometries.eye, materials.eyeWhiteMat);
      eyeGroup.add(eyeWhite);
      
      const eyeGlow = new THREE.Mesh(geometries.eyeGlow, materials.eyeGlowMat);
      eyeGlow.position.z = 0.01;
      eyeGroup.add(eyeGlow);
      
      const pupil = new THREE.Mesh(geometries.pupil, materials.pupilMat);
      pupil.position.z = 0.08;
      pupil.scale.z = 0.3;
      eyeGroup.add(pupil);
      
      eyeGroup.position.set(pos[0], pos[1], pos[2]);
      head.add(eyeGroup);
      eyeRefs.current[i] = { group: eyeGroup, pupil, eyeGlow };
    });

    // Antennas
    for (let i = 0; i < 2; i++) {
      const antennaGroup = new THREE.Group();
      
      const antenna = new THREE.Mesh(geometries.antenna, materials.antennaMat);
      antenna.position.y = 0.12;
      antenna.rotation.z = (i === 0 ? -0.3 : 0.3);
      antennaGroup.add(antenna);
      
      const tip = new THREE.Mesh(geometries.antennaTip, materials.antennaTipMat);
      tip.position.set(0, 0.28, 0);
      antennaGroup.add(tip);
      
      antennaGroup.position.set(i === 0 ? -0.18 : 0.18, 0.45, 0.1);
      antennaGroup.rotation.z = (i === 0 ? -0.2 : 0.2);
      head.add(antennaGroup);
      antennaRefs.current[i] = { group: antennaGroup, tip };
    }

    // Ears
    for (let i = 0; i < 2; i++) {
      const ear = new THREE.Mesh(geometries.ear, materials.earMat);
      ear.position.set(i === 0 ? -0.3 : 0.3, 0.25, -0.1);
      ear.rotation.set(-Math.PI / 2, 0, i === 0 ? -0.4 : 0.4);
      ear.scale.set(1, 1, 0.4);
      head.add(ear);
      earRefs.current[i] = ear;
    }

    // Tail
    const tailGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
      const segment = new THREE.Mesh(
        i === 3 ? geometries.tailTip : geometries.tailSegment,
        materials.tailMat
      );
      segment.position.y = -i * 0.2;
      segment.rotation.x = i === 3 ? 0 : Math.PI / 2;
      tailGroup.add(segment);
    }
    tailGroup.position.set(0, -0.5, 0.2);
    tailGroup.rotation.x = -Math.PI / 4;
    groupRef.current.add(tailGroup);
    tailRef.current = tailGroup;

    return () => {
      Object.values(geometries).forEach(g => g.dispose());
      Object.values(materials).forEach(m => m.dispose());
    };
  }, [geometries, materials]);

  useFrame((_, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;

    if (!groupRef.current) return;

    // Gentle float
    groupRef.current.position.y = Math.sin(t * 0.8) * 0.05;
    groupRef.current.rotation.y += delta * 0.08;

    // Body breathe
    if (bodyRef.current) {
      const breathe = 1 + Math.sin(t * 1.1) * 0.015;
      bodyRef.current.scale.setScalar(breathe);
    }

    // Head bob
    if (headRef.current) {
      headRef.current.position.y = 0.75 + Math.sin(t * 1.3) * 0.02;
      headRef.current.rotation.y = Math.sin(t * 0.7) * 0.08;
    }

    // Eyes blink & glow
    eyeRefs.current.forEach((eye, i) => {
      if (!eye) return;
      
      blinkRef.current += delta;
      if (blinkRef.current > 3 + Math.random() * 2) blinkRef.current = 0;
      const isBlinking = blinkRef.current < 0.12;
      eye.group.scale.y = isBlinking ? 0.05 : 1;
      eye.eyeGlow.scale.y = isBlinking ? 0.05 : 1;
      eye.pupil.scale.y = isBlinking ? 0.05 : 1;
      
      (eye.eyeGlow.material as THREE.MeshBasicMaterial).opacity = 0.4 + Math.sin(t * 2 + i) * 0.1;
      eye.eyeGlow.scale.setScalar(1 + Math.sin(t * 1.5 + i) * 0.04);
    });

    // Antennas sway
    antennaRefs.current.forEach((antenna, i) => {
      if (!antenna) return;
      antenna.group.rotation.z = (i === 0 ? -0.2 : 0.2) + Math.sin(t * 1.3 + i) * 0.12;
      (antenna.tip.material as THREE.MeshBasicMaterial).opacity = 0.6 + Math.sin(t * 2.5 + i) * 0.25;
      antenna.tip.scale.setScalar(1 + Math.sin(t * 2 + i) * 0.15);
    });

    // Ears flutter
    earRefs.current.forEach((ear, i) => {
      if (!ear) return;
      ear.rotation.z = (i === 0 ? -0.4 : 0.4) + Math.sin(t * 1.8 + i) * 0.06;
      ear.rotation.x = -Math.PI / 2 + Math.sin(t * 1.6 + i) * 0.04;
    });

    // Tail sway
    if (tailRef.current) {
      tailRef.current.rotation.z = Math.sin(t * 1.1) * 0.25;
      tailRef.current.children.forEach((segment, i) => {
        if (segment instanceof THREE.Mesh) {
          segment.rotation.z = Math.sin(t * 1.3 + i * 0.4) * 0.12 * (1 - i * 0.15);
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      <pointLight position={[0, 1, 1]} color="#a855f7" intensity={0.6} decay={2} distance={3} />
      <pointLight position={[0, -0.5, 0]} color="#06b6d4" intensity={0.4} decay={2} distance={2} />
    </group>
  );
}

interface TokenMascotProps {
  className?: string;
  position?: [number, number, number];
}

export function TokenMascot({ 
  className = "", 
  position = [2.5, -0.5, 0] 
}: TokenMascotProps) {
  return (
    <Canvas
      className={className}
      camera={{ position: [position[0], position[1], 3], fov: 30 }}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      <color attach="background" args={["#030307"]} />
      <TokenMascotInner />
    </Canvas>
  );
}