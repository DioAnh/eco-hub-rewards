import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Matrix characters
const MATRIX_CHARS = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF";

interface MatrixColumnProps {
  position: [number, number, number];
  speed: number;
  length: number;
}

const MatrixColumn = ({ position, speed, length }: MatrixColumnProps) => {
  const meshRef = useRef<THREE.Points>(null);
  const charsRef = useRef<string[]>([]);
  
  const geometry = useMemo(() => {
    const positions = new Float32Array(length * 3);
    const opacities = new Float32Array(length);
    
    for (let i = 0; i < length; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = -i * 0.5;
      positions[i * 3 + 2] = 0;
      opacities[i] = 1 - (i / length);
    }
    
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.setAttribute("opacity", new THREE.BufferAttribute(opacities, 1));
    
    return geom;
  }, [length]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    meshRef.current.position.y += speed * delta * 60;
    
    if (meshRef.current.position.y > 15) {
      meshRef.current.position.y = -15;
    }
  });

  return (
    <points ref={meshRef} position={position} geometry={geometry}>
      <pointsMaterial
        color="#00ff00"
        size={0.15}
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const CircuitLines = () => {
  const linesRef = useRef<THREE.Group>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const lines = useMemo(() => {
    const lineData: { points: THREE.Vector3[]; speed: number }[] = [];
    
    for (let i = 0; i < 30; i++) {
      const startX = (Math.random() - 0.5) * 40;
      const startY = (Math.random() - 0.5) * 30;
      const points: THREE.Vector3[] = [];
      
      let x = startX;
      let y = startY;
      
      for (let j = 0; j < 5; j++) {
        points.push(new THREE.Vector3(x, y, -5));
        if (Math.random() > 0.5) {
          x += (Math.random() - 0.5) * 4;
        } else {
          y += (Math.random() - 0.5) * 4;
        }
      }
      
      lineData.push({ points, speed: 0.5 + Math.random() * 0.5 });
    }
    
    return lineData;
  }, []);

  useFrame((state) => {
    if (!linesRef.current) return;
    
    linesRef.current.children.forEach((child, i) => {
      const line = child as THREE.Line;
      const material = line.material as THREE.LineBasicMaterial;
      
      // Pulse effect
      const pulse = Math.sin(state.clock.elapsedTime * lines[i].speed + i) * 0.3 + 0.5;
      material.opacity = pulse * 0.3;
      
      // Mouse distortion
      const distX = mouseRef.current.x * 0.5;
      const distY = mouseRef.current.y * 0.5;
      line.position.x = distX * 0.2;
      line.position.y = distY * 0.2;
    });
  });

  return (
    <group ref={linesRef}>
      {lines.map((line, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={line.points.length}
              array={new Float32Array(line.points.flatMap((p) => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="#00ff00"
            transparent
            opacity={0.2}
            blending={THREE.AdditiveBlending}
          />
        </line>
      ))}
    </group>
  );
};

const DataParticles = () => {
  const particlesRef = useRef<THREE.Points>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  
  const count = 500;
  
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      
      vel[i * 3] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 1] = -Math.random() * 0.05 - 0.02;
      vel[i * 3 + 2] = 0;
    }
    
    return [pos, vel];
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(() => {
    if (!particlesRef.current) return;
    
    const positionAttr = particlesRef.current.geometry.attributes.position;
    const positions = positionAttr.array as Float32Array;
    
    const mouseX = mouseRef.current.x * 10;
    const mouseY = mouseRef.current.y * 10;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Apply velocity
      positions[i3] += velocities[i3];
      positions[i3 + 1] += velocities[i3 + 1];
      
      // Mouse repulsion
      const dx = positions[i3] - mouseX;
      const dy = positions[i3 + 1] - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 3) {
        const force = (3 - dist) / 3 * 0.1;
        positions[i3] += (dx / dist) * force;
        positions[i3 + 1] += (dy / dist) * force;
      }
      
      // Reset if out of bounds
      if (positions[i3 + 1] < -15) {
        positions[i3 + 1] = 15;
        positions[i3] = (Math.random() - 0.5) * 30;
      }
    }
    
    positionAttr.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#00ff00"
        size={0.08}
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export const MatrixBackground = () => {
  const columns = useMemo(() => {
    const cols: { position: [number, number, number]; speed: number; length: number }[] = [];
    
    for (let i = 0; i < 50; i++) {
      cols.push({
        position: [(Math.random() - 0.5) * 30, Math.random() * 30 - 15, -5 + Math.random() * 3],
        speed: 0.05 + Math.random() * 0.1,
        length: Math.floor(5 + Math.random() * 15),
      });
    }
    
    return cols;
  }, []);

  return (
    <div className="fixed inset-0 bg-black" style={{ zIndex: -10 }}>
      {/* Scanlines overlay */}
      <div className="absolute inset-0 scanlines pointer-events-none" style={{ zIndex: 1 }} />
      
      {/* Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.8) 100%)",
          zIndex: 2,
        }}
      />
      
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: "#000000" }}
      >
        <color attach="background" args={["#000000"]} />
        
        {/* Matrix rain columns */}
        {columns.map((col, i) => (
          <MatrixColumn
            key={i}
            position={col.position}
            speed={col.speed}
            length={col.length}
          />
        ))}
        
        {/* Circuit lines */}
        <CircuitLines />
        
        {/* Data particles */}
        <DataParticles />
      </Canvas>
    </div>
  );
};
