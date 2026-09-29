"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Token3DInner() {
  const groupRef = useRef<THREE.Group>(null);
  const coinRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);

  const geometries = useMemo(() => {
    // Main coin - cylinder with beveled edges
    const coinGeo = new THREE.CylinderGeometry(2, 2, 0.25, 64, 1, false);
    
    // Inner ring
    const innerRingGeo = new THREE.RingGeometry(0.8, 1.2, 64);
    
    // Outer ring
    const outerRingGeo = new THREE.RingGeometry(1.7, 1.9, 64);
    
    // Glow sphere
    const glowGeo = new THREE.SphereGeometry(2.5, 32, 32);
    
    return { coinGeo, innerRingGeo, outerRingGeo, glowGeo };
  }, []);

  const materials = useMemo(() => {
    const coinMat = new THREE.MeshPhysicalMaterial({
      color: 0x1a1a2e,
      metalness: 0.9,
      roughness: 0.1,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      envMapIntensity: 1.5,
    });

    const innerRingMat = new THREE.MeshPhysicalMaterial({
      color: 0xa855f7,
      metalness: 0.8,
      roughness: 0.1,
      emissive: 0xa855f7,
      emissiveIntensity: 0.5,
      side: THREE.DoubleSide,
    });

    const outerRingMat = new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4,
      metalness: 0.8,
      roughness: 0.1,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.4,
      side: THREE.DoubleSide,
    });

    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
      depthWrite: false,
    });

    return { coinMat, innerRingMat, outerRingMat, glowMat };
  }, []);

  useEffect(() => {
    if (!groupRef.current) return;

    // Create coin
    const coin = new THREE.Mesh(geometries.coinGeo, materials.coinMat);
    coin.castShadow = true;
    coin.receiveShadow = true;
    groupRef.current.add(coin);
    coinRef.current = coin;

    // Inner ring
    const innerRing = new THREE.Mesh(geometries.innerRingGeo, materials.innerRingMat);
    innerRing.rotation.x = -Math.PI / 2;
    innerRing.position.z = 0.13;
    groupRef.current.add(innerRing);
    innerRingRef.current = innerRing;

    // Outer ring
    const outerRing = new THREE.Mesh(geometries.outerRingGeo, materials.outerRingMat);
    outerRing.rotation.x = -Math.PI / 2;
    outerRing.position.z = -0.13;
    groupRef.current.add(outerRing);
    outerRingRef.current = outerRing;

    // Glow
    const glow = new THREE.Mesh(geometries.glowGeo, materials.glowMat);
    groupRef.current.add(glow);
    glowRef.current = glow;

    // Add $ symbol as text geometry (using a simple shape)
    const textShape = new THREE.Shape();
    // Simple $ shape using paths
    textShape.moveTo(-0.3, -0.6);
    textShape.bezierCurveTo(-0.3, -0.6, -0.5, -0.4, -0.4, -0.1);
    textShape.bezierCurveTo(-0.4, -0.1, -0.5, 0.2, -0.3, 0.4);
    textShape.bezierCurveTo(-0.3, 0.4, -0.1, 0.5, 0.2, 0.5);
    textShape.bezierCurveTo(0.2, 0.5, 0.5, 0.3, 0.4, 0.0);
    textShape.bezierCurveTo(0.4, 0.0, 0.5, -0.3, 0.2, -0.5);
    textShape.bezierCurveTo(0.2, -0.5, -0.1, -0.6, -0.3, -0.6);
    
    const hole = new THREE.Path();
    hole.ellipse(0, 0, 0.15, 0.25, 0, Math.PI * 2, false);
    textShape.holes.push(hole);

    const textGeometry = new THREE.ExtrudeGeometry(textShape, {
      depth: 0.1,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 4,
    });
    textGeometry.center();

    const textMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xa855f7,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0xa855f7,
      emissiveIntensity: 0.8,
    });

    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.rotation.x = -Math.PI / 2;
    textMesh.position.z = 0.18;
    textMesh.scale.setScalar(0.8);
    groupRef.current.add(textMesh);

    return () => {
      geometries.coinGeo.dispose();
      geometries.innerRingGeo.dispose();
      geometries.outerRingGeo.dispose();
      geometries.glowGeo.dispose();
      textGeometry.dispose();
    };
  }, [geometries, materials]);

  useFrame((_, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;

    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
      groupRef.current.rotation.x = Math.sin(t * 0.5) * 0.15;
    }

    if (innerRingRef.current) {
      innerRingRef.current.rotation.z += delta * 0.8;
      (innerRingRef.current.material as THREE.MeshPhysicalMaterial).emissiveIntensity = 0.5 + Math.sin(t * 3) * 0.2;
    }

    if (outerRingRef.current) {
      outerRingRef.current.rotation.z -= delta * 0.6;
      (outerRingRef.current.material as THREE.MeshPhysicalMaterial).emissiveIntensity = 0.4 + Math.cos(t * 2.5) * 0.15;
    }

    if (glowRef.current) {
      const pulse = 1 + Math.sin(t * 1.5) * 0.15;
      glowRef.current.scale.setScalar(pulse);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.05 + Math.sin(t * 2) * 0.03;
    }

    if (coinRef.current) {
      (coinRef.current.material as THREE.MeshPhysicalMaterial).envMapIntensity = 1 + Math.sin(t) * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      <pointLight position={[3, 3, 5]} color="#a855f7" intensity={3} decay={2} />
      <pointLight position={[-3, -2, 3]} color="#06b6d4" intensity={2} decay={2} />
      <ambientLight color="#ffffff" intensity={0.5} />
    </group>
  );
}

interface Token3DWrapperProps {
  className?: string;
}

export function Token3D({ className = "" }: Token3DWrapperProps) {
  return (
    <Canvas
      className={className}
      camera={{ position: [0, 0, 8], fov: 35 }}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      <color attach="background" args={["#030307"]} />
      <Token3DInner />
    </Canvas>
  );
}