"use client";

import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface HeroObjectProps {
  mouseX: number;
  mouseY: number;
  scrollProgress: number;
}

export function HeroObject({ mouseX, mouseY, scrollProgress }: HeroObjectProps) {
  const groupRef = useRef<THREE.Group>(null);
  const crystalRefs = useRef<THREE.Mesh[]>([]);
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRefs = useRef<THREE.Mesh[]>([]);
  const timeRef = useRef(0);

  // Create geometry and materials
  const geometries = useMemo(() => {
    const crystalGeometries: THREE.BufferGeometry[] = [];
    for (let i = 0; i < 5; i++) {
      const radius = 0.8 + i * 0.15;
      const geometry = new THREE.IcosahedronGeometry(radius, 1);
      // Modify vertices for crystalline look
      const positions = geometry.attributes.position;
      for (let j = 0; j < positions.count; j++) {
        const vertex = new THREE.Vector3().fromBufferAttribute(positions, j);
        const noise = Math.sin(vertex.x * 5) * Math.cos(vertex.y * 5) * Math.sin(vertex.z * 5) * 0.15;
        vertex.normalize().multiplyScalar(radius + noise);
        positions.setXYZ(j, vertex.x, vertex.y, vertex.z);
      }
      geometry.computeVertexNormals();
      crystalGeometries.push(geometry);
    }
    return crystalGeometries;
  }, []);

  const materials = useMemo(() => {
    const crystalMaterials: THREE.MeshPhysicalMaterial[] = [];
    for (let i = 0; i < 5; i++) {
      const hue = 0.75 + i * 0.02; // Violet to cyan range
      const material = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color().setHSL(hue, 0.8, 0.2),
        metalness: 0.3,
        roughness: 0.2,
        transmission: 0.4,
        thickness: 0.5,
        ior: 1.4,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        emissive: new THREE.Color().setHSL(hue, 1, 0.15),
        emissiveIntensity: 0.3 + i * 0.05,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
      });
      crystalMaterials.push(material);
    }
    return crystalMaterials;
  }, []);

  // Core geometry
  const coreGeometry = useMemo(() => new THREE.SphereGeometry(0.4, 32, 32), []);
  const coreMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.9,
  }), []);

  // Ring geometries
  const ringGeometries = useMemo(() => {
    const geoms: THREE.BufferGeometry[] = [];
    for (let i = 0; i < 3; i++) {
      geoms.push(new THREE.RingGeometry(1.8 + i * 0.4, 2.0 + i * 0.4, 64));
    }
    return geoms;
  }, []);

  const ringMaterials = useMemo(() => [
    new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
    }),
    new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
    }),
    new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide,
    }),
  ], []);

  useEffect(() => {
    if (!groupRef.current) return;

    // Capture refs for cleanup
    const crystalMeshes = crystalRefs.current;
    const ringMeshes = ringRefs.current;
    const coreMesh = coreRef.current;

    // Create crystals
    crystalMeshes.forEach((mesh, i) => {
      if (mesh) mesh.geometry.dispose();
      const mesh_new = new THREE.Mesh(geometries[i], materials[i]);
      mesh_new.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      groupRef.current!.add(mesh_new);
      crystalRefs.current[i] = mesh_new;
    });

    // Create core
    if (coreMesh) coreMesh.geometry.dispose();
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    groupRef.current.add(core);
    coreRef.current = core;

    // Create rings
    ringMeshes.forEach((mesh, i) => {
      if (mesh) mesh.geometry.dispose();
      const mesh_new = new THREE.Mesh(ringGeometries[i], ringMaterials[i]);
      mesh_new.rotation.x = -Math.PI / 2;
      mesh_new.rotation.z = i * 0.3;
      groupRef.current!.add(mesh_new);
      ringRefs.current[i] = mesh_new;
    });

    return () => {
      crystalMeshes.forEach(m => m?.geometry.dispose());
      coreMesh?.geometry.dispose();
      ringMeshes.forEach(m => m?.geometry.dispose());
    };
  }, [geometries, materials, coreGeometry, coreMaterial, ringGeometries, ringMaterials]);

  useFrame((_, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;

    if (!groupRef.current) return;

    // Base rotation
    groupRef.current.rotation.y += delta * 0.15;
    groupRef.current.rotation.x += delta * 0.05;

    // Mouse interaction
    const targetX = mouseX * 0.3;
    const targetY = mouseY * 0.3;
    groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.02;
    groupRef.current.rotation.x += (targetY - groupRef.current.rotation.x) * 0.02;

    // Scroll effect
    const scrollScale = 1 - scrollProgress * 0.3;
    const scrollY = -scrollProgress * 2;
    groupRef.current.scale.setScalar(scrollScale);
    groupRef.current.position.y = scrollY;

    // Animate crystals
    crystalRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const speed = 0.3 + i * 0.1;
      mesh.rotation.x += delta * speed * 0.5;
      mesh.rotation.y += delta * speed * 0.7;
      mesh.rotation.z += delta * speed * 0.3;
      
      // Floating motion
      const floatOffset = Math.sin(t * 0.8 + i) * 0.05;
      mesh.position.y = floatOffset;
    });

    // Pulse core
    if (coreRef.current) {
      const pulse = 1 + Math.sin(t * 2) * 0.1;
      coreRef.current.scale.setScalar(pulse);
      (coreRef.current.material as THREE.MeshBasicMaterial).opacity = 0.7 + Math.sin(t * 3) * 0.2;
    }

    // Rotate rings
    ringRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      mesh.rotation.z += delta * (0.05 + i * 0.02);
      mesh.rotation.y += delta * 0.02;
      (mesh.material as THREE.MeshBasicMaterial).opacity = 0.1 + Math.sin(t * 1.5 + i) * 0.05;
    });
  });

  return (
    <group ref={groupRef}>
      <pointLight position={[0, 3, 3]} color="#a855f7" intensity={2} decay={2} />
      <pointLight position={[0, -2, -3]} color="#06b6d4" intensity={1.5} decay={2} />
      <pointLight position={[3, 0, 0]} color="#ffffff" intensity={1} decay={2} />
    </group>
  );
}