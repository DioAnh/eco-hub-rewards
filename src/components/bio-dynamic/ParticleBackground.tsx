import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface ParticleFieldProps {
  ecoActivity: number; // 0-1, represents eco activity level
}

const ParticleField = ({ ecoActivity }: ParticleFieldProps) => {
  const points = useRef<THREE.Points>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();
  
  const particleCount = 800;
  
  const [positions, velocities, originalPositions] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);
    const orig = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 10;
      
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      
      orig[i * 3] = x;
      orig[i * 3 + 1] = y;
      orig[i * 3 + 2] = z;
      
      vel[i * 3] = 0;
      vel[i * 3 + 1] = 0;
      vel[i * 3 + 2] = 0;
    }
    
    return [pos, vel, orig];
  }, []);

  const colors = useMemo(() => {
    const cols = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      // Green to cyan gradient based on eco activity
      const hue = 0.3 + Math.random() * 0.15; // Green range
      const saturation = 0.6 + Math.random() * 0.4;
      const lightness = 0.4 + Math.random() * 0.3;
      
      const color = new THREE.Color().setHSL(hue, saturation, lightness);
      cols[i * 3] = color.r;
      cols[i * 3 + 1] = color.g;
      cols[i * 3 + 2] = color.b;
    }
    return cols;
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (!points.current) return;
    
    const positionAttr = points.current.geometry.attributes.position;
    const positions = positionAttr.array as Float32Array;
    
    const mouseX = mouseRef.current.x * viewport.width * 0.5;
    const mouseY = mouseRef.current.y * viewport.height * 0.5;
    
    const speed = 0.3 + ecoActivity * 0.7;
    const repelRadius = 3;
    const repelStrength = 2;
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Get current position
      const x = positions[i3];
      const y = positions[i3 + 1];
      const z = positions[i3 + 2];
      
      // Calculate distance from mouse
      const dx = x - mouseX;
      const dy = y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Repel from mouse
      if (dist < repelRadius && dist > 0.01) {
        const force = (repelRadius - dist) / repelRadius * repelStrength;
        velocities[i3] += (dx / dist) * force * delta;
        velocities[i3 + 1] += (dy / dist) * force * delta;
      }
      
      // Spring back to original position
      const origX = originalPositions[i3];
      const origY = originalPositions[i3 + 1];
      const origZ = originalPositions[i3 + 2];
      
      velocities[i3] += (origX - x) * 0.02 * delta * 60;
      velocities[i3 + 1] += (origY - y) * 0.02 * delta * 60;
      velocities[i3 + 2] += (origZ - z) * 0.01 * delta * 60;
      
      // Add gentle floating motion
      velocities[i3] += Math.sin(state.clock.elapsedTime * speed + i) * 0.001;
      velocities[i3 + 1] += Math.cos(state.clock.elapsedTime * speed + i * 0.5) * 0.001;
      
      // Apply damping
      velocities[i3] *= 0.95;
      velocities[i3 + 1] *= 0.95;
      velocities[i3 + 2] *= 0.95;
      
      // Update position
      positions[i3] += velocities[i3];
      positions[i3 + 1] += velocities[i3 + 1];
      positions[i3 + 2] += velocities[i3 + 2];
    }
    
    positionAttr.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const LiquidGradient = ({ ecoActivity }: ParticleFieldProps) => {
  const mesh = useRef<THREE.Mesh>(null);
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uEcoActivity: { value: ecoActivity },
    uMouse: { value: new THREE.Vector2(0, 0) },
  }), []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      uniforms.uMouse.value.x = e.clientX / window.innerWidth;
      uniforms.uMouse.value.y = 1 - e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [uniforms]);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uEcoActivity.value = ecoActivity;
  });

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform float uEcoActivity;
    uniform vec2 uMouse;
    varying vec2 vUv;
    
    vec3 palette(float t) {
      vec3 a = vec3(0.1, 0.2, 0.1);
      vec3 b = vec3(0.2, 0.4, 0.2);
      vec3 c = vec3(0.2, 0.5, 0.3);
      vec3 d = vec3(0.0, 0.3, 0.2);
      return a + b * cos(6.28318 * (c * t + d));
    }
    
    void main() {
      vec2 uv = vUv;
      float speed = 0.3 + uEcoActivity * 0.5;
      
      // Mouse influence
      float mouseDist = distance(uv, uMouse);
      float mouseInfluence = smoothstep(0.5, 0.0, mouseDist) * 0.3;
      
      // Flowing liquid effect
      float flow = sin(uv.x * 3.0 + uTime * speed) * cos(uv.y * 2.0 + uTime * speed * 0.7);
      flow += sin(uv.y * 4.0 - uTime * speed * 0.5) * 0.5;
      flow += mouseInfluence;
      
      vec3 color = palette(flow * 0.5 + uTime * 0.1);
      color = mix(color, vec3(0.1, 0.4, 0.2), 0.3); // Add green tint
      color *= (0.5 + uEcoActivity * 0.5); // Brightness based on activity
      
      gl_FragColor = vec4(color, 0.15);
    }
  `;

  return (
    <mesh ref={mesh} position={[0, 0, -5]}>
      <planeGeometry args={[30, 30]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
      />
    </mesh>
  );
};

interface ParticleBackgroundProps {
  ecoActivity?: number;
}

export const ParticleBackground = ({ ecoActivity = 0.7 }: ParticleBackgroundProps) => {
  return (
    <div className="fixed inset-0 -z-10 bg-background">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <LiquidGradient ecoActivity={ecoActivity} />
        <ParticleField ecoActivity={ecoActivity} />
      </Canvas>
    </div>
  );
};
