"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { useFrame, useThree, Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";

import { UNIVERSE_HOTSPOTS as HotspotsData } from "@/lib/constants";

// Small mascot for universe scene
function UniverseMascot({ position = [0, 4, 0] }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  const geometries = useMemo(() => ({
    body: new THREE.CapsuleGeometry(0.35, 0.5, 10, 20),
    head: new THREE.SphereGeometry(0.32, 20, 20),
    eye: new THREE.SphereGeometry(0.09, 10, 10),
    eyeGlow: new THREE.SphereGeometry(0.11, 10, 10),
    pupil: new THREE.SphereGeometry(0.04, 8, 8),
    antenna: new THREE.CapsuleGeometry(0.015, 0.18, 5, 10),
    antennaTip: new THREE.SphereGeometry(0.03, 8, 8),
    ear: new THREE.ConeGeometry(0.1, 0.22, 5),
    tailSegment: new THREE.CapsuleGeometry(0.04, 0.12, 5, 5),
    tailTip: new THREE.ConeGeometry(0.035, 0.1, 5),
  }), []);

  const materials = useMemo(() => ({
    bodyMat: new THREE.MeshPhysicalMaterial({
      color: 0x1a1a3a, metalness: 0.2, roughness: 0.3,
      clearcoat: 1, clearcoatRoughness: 0.1, transmission: 0.1,
      thickness: 0.3, ior: 1.3, emissive: new THREE.Color(0xa855f7), emissiveIntensity: 0.15,
    }),
    headMat: new THREE.MeshPhysicalMaterial({
      color: 0x1e1e4a, metalness: 0.15, roughness: 0.25,
      clearcoat: 1, clearcoatRoughness: 0.08, transmission: 0.15,
      thickness: 0.2, ior: 1.35, emissive: new THREE.Color(0xa855f7), emissiveIntensity: 0.18,
    }),
    eyeWhiteMat: new THREE.MeshPhysicalMaterial({
      color: 0xf0f0ff, metalness: 0, roughness: 0.1, transmission: 0.9, thickness: 0.2,
      clearcoat: 1, clearcoatRoughness: 0,
    }),
    eyeGlowMat: new THREE.MeshBasicMaterial({
      color: 0xa855f7, transparent: true, opacity: 0.6, depthWrite: false, blending: THREE.AdditiveBlending,
    }),
    pupilMat: new THREE.MeshBasicMaterial({ color: 0x0a0a1a }),
    antennaMat: new THREE.MeshPhysicalMaterial({
      color: 0x2a2a5a, metalness: 0.4, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.1,
      emissive: new THREE.Color(0xa855f7), emissiveIntensity: 0.3,
    }),
    antennaTipMat: new THREE.MeshBasicMaterial({
      color: 0x06b6d4, transparent: true, opacity: 1, blending: THREE.AdditiveBlending,
    }),
    earMat: new THREE.MeshPhysicalMaterial({
      color: 0x1a1a3a, metalness: 0.2, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.1,
      transmission: 0.2, thickness: 0.2, side: THREE.DoubleSide, emissive: new THREE.Color(0xa855f7), emissiveIntensity: 0.1,
    }),
    tailMat: new THREE.MeshPhysicalMaterial({
      color: 0x1a1a3a, metalness: 0.2, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.1,
      emissive: new THREE.Color(0xa855f7), emissiveIntensity: 0.15,
    }),
  }), []);

  useEffect(() => {
    if (!groupRef.current) return;

    const body = new THREE.Mesh(geometries.body, materials.bodyMat);
    body.position.y = 0;
    groupRef.current.add(body);

    const head = new THREE.Mesh(geometries.head, materials.headMat);
    head.position.y = 0.5;
    head.scale.set(1, 0.9, 1);
    groupRef.current.add(head);

    const eyePositions = [[-0.1, 0.03, 0.28], [0.1, 0.03, 0.28]];
    eyePositions.forEach((pos, i) => {
      const eyeGroup = new THREE.Group();
      const eyeWhite = new THREE.Mesh(geometries.eye, materials.eyeWhiteMat);
      eyeGroup.add(eyeWhite);
      const eyeGlow = new THREE.Mesh(geometries.eyeGlow, materials.eyeGlowMat);
      eyeGlow.position.z = 0.008;
      eyeGroup.add(eyeGlow);
      const pupil = new THREE.Mesh(geometries.pupil, materials.pupilMat);
      pupil.position.z = 0.06;
      pupil.scale.z = 0.3;
      eyeGroup.add(pupil);
      eyeGroup.position.set(pos[0], pos[1], pos[2]);
      head.add(eyeGroup);
      if (i === 0) {
        (eyeGroup as { pupil?: THREE.Mesh; eyeGlow?: THREE.Mesh }).pupil = pupil;
        (eyeGroup as { pupil?: THREE.Mesh; eyeGlow?: THREE.Mesh }).eyeGlow = eyeGlow;
      }
    });

    for (let i = 0; i < 2; i++) {
      const ag = new THREE.Group();
      const ant = new THREE.Mesh(geometries.antenna, materials.antennaMat);
      ant.position.y = 0.09;
      ant.rotation.z = i === 0 ? -0.3 : 0.3;
      ag.add(ant);
      const tip = new THREE.Mesh(geometries.antennaTip, materials.antennaTipMat);
      tip.position.set(0, 0.2, 0);
      ag.add(tip);
      ag.position.set(i === 0 ? -0.12 : 0.12, 0.3, 0.07);
      ag.rotation.z = i === 0 ? -0.2 : 0.2;
      head.add(ag);
    }

    for (let i = 0; i < 2; i++) {
      const ear = new THREE.Mesh(geometries.ear, materials.earMat);
      ear.position.set(i === 0 ? -0.22 : 0.22, 0.18, -0.07);
      ear.rotation.set(-Math.PI / 2, 0, i === 0 ? -0.4 : 0.4);
      ear.scale.set(1, 1, 0.4);
      head.add(ear);
    }

    const tailGroup = new THREE.Group();
    for (let i = 0; i < 3; i++) {
      const seg = new THREE.Mesh(i === 2 ? geometries.tailTip : geometries.tailSegment, materials.tailMat);
      seg.position.y = -i * 0.15;
      seg.rotation.x = i === 2 ? 0 : Math.PI / 2;
      tailGroup.add(seg);
    }
    tailGroup.position.set(0, -0.35, 0.15);
    tailGroup.rotation.x = -Math.PI / 4;
    groupRef.current.add(tailGroup);

    groupRef.current.position.set(position[0], position[1], position[2]);

    return () => {
      Object.values(geometries).forEach(g => g.dispose());
      Object.values(materials).forEach(m => m.dispose());
    };
  }, [geometries, materials, position]);

  useFrame((_, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;
    if (!groupRef.current) return;

    groupRef.current.position.y = position[1] + Math.sin(t * 0.9) * 0.15;
    groupRef.current.rotation.y += delta * 0.06;

    groupRef.current.traverse((obj) => {
      const typedObj = obj as { pupil?: THREE.Mesh; eyeGlow?: THREE.Mesh };
      if (typedObj.pupil && typedObj.eyeGlow) {
        const pupil = typedObj.pupil;
        const eyeGlow = typedObj.eyeGlow;
        const isBlink = Math.sin(t * 0.5) > 0.95;
        pupil.scale.y = isBlink ? 0.05 : 1;
        eyeGlow.scale.y = isBlink ? 0.05 : 1;
        (eyeGlow.material as THREE.MeshBasicMaterial).opacity = 0.5 + Math.sin(t * 2) * 0.15;
        eyeGlow.scale.setScalar(1 + Math.sin(t * 1.5) * 0.03);
      }
    });

    groupRef.current.children.forEach(child => {
      if (child instanceof THREE.Group) {
        const firstChild = child.children[0];
        if (firstChild instanceof THREE.Mesh && firstChild.geometry.type === 'CapsuleGeometry') {
          child.rotation.z = (child.position.x < 0 ? -0.2 : 0.2) + Math.sin(t * 1.2 + child.position.x) * 0.1;
          const tip = child.children[1] as THREE.Mesh;
          if (tip) {
            (tip.material as THREE.MeshBasicMaterial).opacity = 0.7 + Math.sin(t * 2.5) * 0.2;
            tip.scale.setScalar(1 + Math.sin(t * 2) * 0.1);
          }
        }
      }
    });

    const tail = groupRef.current.children.find(c => c instanceof THREE.Group && c.position.y < 0);
    if (tail) {
      tail.rotation.z = Math.sin(t * 1) * 0.2;
      tail.children.forEach((seg, i) => {
        if (seg instanceof THREE.Mesh) seg.rotation.z = Math.sin(t * 1.2 + i * 0.3) * 0.1 * (1 - i * 0.2);
      });
    }
  });

  return <group ref={groupRef} />;
}

interface Hotspot {
  name: string;
  description: string;
  position: [number, number, number] | number[];
}

const HOTSPOTS: Hotspot[] = HotspotsData as Hotspot[];

function FloatingIsland({ position, scale = 1, rotationSpeed = 0.1, color = "#a855f7" }: {
  position: [number, number, number];
  scale?: number;
  rotationSpeed?: number;
  color?: string;
}) {
  const ref = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1, 1), []);
  const material = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    metalness: 0.3,
    roughness: 0.4,
    transmission: 0.2,
    thickness: 0.5,
    clearcoat: 0.5,
    clearcoatRoughness: 0.2,
    emissive: new THREE.Color(color),
    emissiveIntensity: 0.1,
  }), [color]);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (ref.current) {
      ref.current.rotation.y += delta * rotationSpeed;
      ref.current.position.y = position[1] + Math.sin(timeRef.current * 0.5) * 0.3;
    }
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh geometry={geometry} material={material} castShadow receiveShadow />
      <mesh
        geometry={new THREE.OctahedronGeometry(0.4, 0)}
        material={new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(color),
          metalness: 0.5,
          roughness: 0.2,
          emissive: new THREE.Color(color),
          emissiveIntensity: 0.3,
        })}
        position={[0, 1.3, 0]}
        rotation={[Math.PI / 4, 0, 0]}
      />
    </group>
  );
}

function Portal({ position, color = "#06b6d4" }: { position: [number, number, number]; color?: string }) {
  const ref = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (ref.current) {
      ref.current.rotation.z += delta * 0.3;
      (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.3 + Math.sin(timeRef.current * 2) * 0.15;
      ref.current.scale.setScalar(1 + Math.sin(timeRef.current * 1.5) * 0.1);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * 0.2;
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = 0.4 + Math.cos(timeRef.current * 1.8) * 0.1;
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={ref}
        geometry={new THREE.RingGeometry(0.5, 1.5, 64)}
        material={new THREE.MeshBasicMaterial({
          color: new THREE.Color(color),
          transparent: true,
          opacity: 0.3,
          side: THREE.DoubleSide,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        })}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <mesh
        ref={ringRef}
        geometry={new THREE.RingGeometry(1.5, 1.7, 32)}
        material={new THREE.MeshBasicMaterial({
          color: new THREE.Color(color),
          transparent: true,
          opacity: 0.2,
          side: THREE.DoubleSide,
          depthWrite: false,
        })}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <pointLight position={[0, 0, 0]} color={color} intensity={2} decay={2} distance={10} />
    </group>
  );
}

function HotspotMarker({ 
  position, 
  name, 
  description, 
  onSelect 
}: { 
  position: [number, number, number] | number[];
  name: string;
  description: string;
  onSelect: (name: string, description: string, position: [number, number, number]) => void;
}) {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [selected, setSelected] = useState(false);
  const timeRef = useRef(0);
  const pos = position as [number, number, number];

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (ref.current) {
      ref.current.rotation.y += delta * 0.5;
      const float = Math.sin(timeRef.current * 2) * 0.1;
      ref.current.position.y = pos[1] + float;
      
      const pulse = hovered || selected ? 1.3 : 1;
      ref.current.scale.setScalar(pulse + Math.sin(timeRef.current * 4) * 0.05);
    }
  });

  return (
    <group 
      ref={ref} 
      position={pos}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => {
        setSelected(!selected);
        onSelect(name, description, pos);
      }}
    >
      <mesh
        geometry={new THREE.RingGeometry(0.6, 0.8, 32)}
        material={new THREE.MeshBasicMaterial({
          color: 0xa855f7,
          transparent: true,
          opacity: hovered ? 0.4 : 0.2,
          side: THREE.DoubleSide,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        })}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={hovered ? 1.5 : 1}
      />
      <mesh
        geometry={new THREE.OctahedronGeometry(0.3, 0)}
        material={new THREE.MeshPhysicalMaterial({
          color: 0xa855f7,
          metalness: 0.8,
          roughness: 0.1,
          emissive: 0xa855f7,
          emissiveIntensity: hovered ? 1 : 0.5,
          clearcoat: 1,
          clearcoatRoughness: 0,
        })}
      />
      <mesh
        geometry={new THREE.CylinderGeometry(0.02, 0.02, 10, 8)}
        material={new THREE.MeshBasicMaterial({
          color: 0xa855f7,
          transparent: true,
          opacity: 0.15,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        })}
        position={[0, -5, 0]}
        scale={[1, 10, 1]}
      />
    </group>
  );
}

function UniverseSceneContent() {
  const { camera } = useThree();
  const [selectedHotspot, setSelectedHotspot] = useState<{name: string; description: string; position: [number, number, number]} | null>(null);
  const timeRef = useRef(0);
  const cameraPositionRef = useRef(new THREE.Vector3(0, 5, 25));

  useFrame((_, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;
    const radius = 25;
    
    cameraPositionRef.current.set(
      Math.sin(t * 0.05) * radius,
      5 + Math.sin(t * 0.03) * 2,
      Math.cos(t * 0.05) * radius
    );
    camera.position.copy(cameraPositionRef.current);
    camera.lookAt(0, 0, 0);
  });

  const handleHotspotSelect = (name: string, description: string, position: [number, number, number] | number[]) => {
    setSelectedHotspot({ name, description, position: position as [number, number, number] });
  };

  // Pre-generate crystalline positions to avoid Math.random in render
  const [crystalPositions] = useState<[number, number, number][]>(() => {
    const positions: [number, number, number][] = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const radius = 7;
      const height = (Math.random() - 0.5) * 6;
      positions.push([Math.cos(angle) * radius, height, Math.sin(angle) * radius]);
    }
    return positions;
  });

  return (
    <>
      <fog attach="fog" args={["#030307", 15, 60]} />
      
      <ambientLight color="#1a1a2e" intensity={0.4} />
      <directionalLight position={[10, 15, 10]} color="#a855f7" intensity={0.5} castShadow />
      <directionalLight position={[-10, 10, -10]} color="#06b6d4" intensity={0.4} />
      <pointLight position={[0, 10, 0]} color="#a855f7" intensity={1} decay={2} distance={30} />
      <pointLight position={[0, -5, -10]} color="#06b6d4" intensity={0.8} decay={2} distance={25} />

      <group position={[0, 0, 0]}>
        <mesh
          geometry={new THREE.SphereGeometry(4, 64, 64)}
          material={new THREE.MeshPhysicalMaterial({
            color: 0x0a0a1a,
            metalness: 0.2,
            roughness: 0.6,
            clearcoat: 0.3,
            clearcoatRoughness: 0.3,
          })}
          castShadow
          receiveShadow
        />
        <mesh
          geometry={new THREE.SphereGeometry(4.3, 32, 32)}
          material={new THREE.MeshBasicMaterial({
            color: 0xa855f7,
            transparent: true,
            opacity: 0.08,
            side: THREE.BackSide,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          })}
        />
        <mesh
          geometry={new THREE.RingGeometry(4.5, 5.5, 128)}
          material={new THREE.MeshBasicMaterial({
            color: 0xa855f7,
            transparent: true,
            opacity: 0.15,
            side: THREE.DoubleSide,
            depthWrite: false,
          })}
          rotation={[-Math.PI / 2, 0, 0]}
        />
        <mesh
          geometry={new THREE.RingGeometry(5.5, 5.8, 64)}
          material={new THREE.MeshBasicMaterial({
            color: 0x06b6d4,
            transparent: true,
            opacity: 0.12,
            side: THREE.DoubleSide,
            depthWrite: false,
          })}
          rotation={[-Math.PI / 2, 0, 0]}
        />
      </group>

      <FloatingIsland position={[-6, 4, -4]} scale={1.2} rotationSpeed={0.08} color="#a855f7" />
      <FloatingIsland position={[7, 2, 5]} scale={0.8} rotationSpeed={-0.1} color="#06b6d4" />
      <FloatingIsland position={[-4, -3, 6]} scale={1} rotationSpeed={0.06} color="#a855f7" />
      <FloatingIsland position={[5, -1, -7]} scale={0.7} rotationSpeed={-0.08} color="#06b6d4" />
      <FloatingIsland position={[-8, 1, 2]} scale={0.9} rotationSpeed={0.07} color="#a855f7" />

      <Portal position={[0, -4, -8]} color="#06b6d4" />
      <Portal position={[8, 3, -2]} color="#a855f7" />
      <Portal position={[-7, -2, 4]} color="#a855f7" />

      {crystalPositions.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh
            geometry={new THREE.ConeGeometry(0.3, 1.5, 6)}
            material={new THREE.MeshPhysicalMaterial({
              color: i % 2 === 0 ? 0xa855f7 : 0x06b6d4,
              metalness: 0.5,
              roughness: 0.2,
              transmission: 0.3,
              thickness: 0.5,
              emissive: i % 2 === 0 ? 0xa855f7 : 0x06b6d4,
              emissiveIntensity: 0.2,
              clearcoat: 1,
              clearcoatRoughness: 0.1,
            })}
            rotation={[-Math.PI / 2, 0, 0]}
          />
        </group>
      ))}

      <ParticleSystem count={800} radius={30} />

      <UniverseMascot position={[0, 4.5, 1.5]} />

      {HOTSPOTS.map((hotspot, i) => (
        <HotspotMarker
          key={i}
          position={hotspot.position}
          name={hotspot.name}
          description={hotspot.description}
          onSelect={handleHotspotSelect}
        />
      ))}

      {selectedHotspot && (
        <Html
          position={selectedHotspot.position}
          transform
          style={{
            pointerEvents: "auto",
            transform: "translate(-50%, -100%)",
          }}
        >
          <HotspotCard
            name={selectedHotspot.name}
            description={selectedHotspot.description}
            onClose={() => setSelectedHotspot(null)}
          />
        </Html>
      )}
    </>
  );
}

function ParticleSystem({ count = 800, radius = 30 }: { count?: number; radius?: number }) {
  const ref = useRef<THREE.Points>(null);
  const timeRef = useRef(0);
  const initializedRef = useRef(false);
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);

  useEffect(() => {
    if (initializedRef.current) return;
    
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const r = Math.random() * radius;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const t = Math.random();
      const color = new THREE.Color(0xa855f7).lerp(new THREE.Color(0x06b6d4), t);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = 0.2 + Math.random() * 0.8;
      velocities[i * 3] = (Math.random() - 0.5) * 0.002;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));
    setGeometry(geo);
    initializedRef.current = true;
  }, [count, radius]);

  const material = useMemo(() => new THREE.PointsMaterial({
    size: 1,
    vertexColors: true,
    transparent: true,
    opacity: 0.5,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), []);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (!ref.current || !geometry) return;

    const posAttr = ref.current.geometry.getAttribute("position") as THREE.BufferAttribute;
    const velAttr = ref.current.geometry.getAttribute("velocity") as THREE.BufferAttribute;
    const sizeAttr = ref.current.geometry.getAttribute("size") as THREE.BufferAttribute;

    for (let i = 0; i < count; i++) {
      posAttr.setX(i, posAttr.getX(i) + velAttr.getX(i));
      posAttr.setY(i, posAttr.getY(i) + velAttr.getY(i));
      posAttr.setZ(i, posAttr.getZ(i) + velAttr.getZ(i));

      const dist = Math.sqrt(
        posAttr.getX(i) ** 2 + posAttr.getY(i) ** 2 + posAttr.getZ(i) ** 2
      );
      if (dist > radius) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = Math.random() * radius * 0.5;
        posAttr.setX(i, r * Math.sin(phi) * Math.cos(theta));
        posAttr.setY(i, r * Math.sin(phi) * Math.sin(theta));
        posAttr.setZ(i, r * Math.cos(phi));
      }

      const baseSize = sizeAttr.getX(i);
      (ref.current.material as THREE.PointsMaterial).size = baseSize * (0.8 + Math.sin(timeRef.current * 2 + i) * 0.2);
    }

    posAttr.needsUpdate = true;
  });

  if (!geometry) return null;

  return <points ref={ref} geometry={geometry} material={material} />;
}

function HotspotCard({ name, description, onClose }: { name: string; description: string; onClose: () => void }) {
  return (
    <div
      className="glass"
      style={{
        padding: "20px 24px",
        borderRadius: "16px",
        minWidth: "240px",
        maxWidth: "280px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(168,85,247,0.2)",
        border: "1px solid rgba(168,85,247,0.3)",
        animation: "slideIn 0.3s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
        <h3 style={{
          fontFamily: "var(--font-syne)",
          fontSize: "18px",
          fontWeight: 700,
          color: "#a855f7",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}>
          {name}
        </h3>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "rgba(240,240,245,0.6)",
            cursor: "pointer",
            padding: "4px",
            fontSize: "18px",
            lineHeight: 1,
            transition: "color 0.2s",
          }}
          onMouseOver={(e) => e.currentTarget.style.color = "#a855f7"}
          onMouseOut={(e) => e.currentTarget.style.color = "rgba(240,240,245,0.6)"}
        >
          ✕
        </button>
      </div>
      <p style={{
        fontSize: "14px",
        lineHeight: 1.6,
        color: "rgba(240,240,245,0.8)",
        fontFamily: "var(--font-space-grotesk)",
      }}>
        {description}
      </p>
    </div>
  );
}

export function UniverseScene() {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Canvas
        camera={{ position: [0, 5, 25], fov: 50 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <color attach="background" args={["#030307"]} />
        <UniverseSceneContent />
      </Canvas>
    </div>
  );
}