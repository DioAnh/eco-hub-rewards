import { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Custom shader for the warping grid
const gridVertexShader = `
  uniform float uTime;
  uniform vec3 uProductPositions[8];
  uniform int uProductCount;
  uniform vec2 uMouse;
  
  varying vec2 vUv;
  varying float vDistortion;
  varying float vNearProduct;
  
  void main() {
    vUv = uv;
    vec3 pos = position;
    
    float totalDistortion = 0.0;
    float nearestProduct = 1000.0;
    
    // Apply magnetic warping from each product
    for(int i = 0; i < 8; i++) {
      if(i >= uProductCount) break;
      
      vec3 productPos = uProductPositions[i];
      float dist = distance(pos.xy, productPos.xy);
      float influence = 1.0 / (1.0 + dist * 0.5);
      
      // Warp towards product
      float warpStrength = smoothstep(3.0, 0.0, dist) * 0.3;
      pos.xy += normalize(productPos.xy - pos.xy) * warpStrength;
      pos.z += sin(dist * 2.0 - uTime * 2.0) * warpStrength * 0.5;
      
      totalDistortion += influence;
      nearestProduct = min(nearestProduct, dist);
    }
    
    // Mouse influence
    float mouseDist = distance(pos.xy, vec3(uMouse, 0.0).xy);
    float mouseInfluence = smoothstep(2.0, 0.0, mouseDist) * 0.2;
    pos.z += mouseInfluence;
    
    vDistortion = totalDistortion;
    vNearProduct = smoothstep(2.0, 0.0, nearestProduct);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const gridFragmentShader = `
  uniform float uTime;
  uniform vec3 uProductPositions[8];
  uniform int uProductCount;

  varying vec2 vUv;
  varying float vDistortion;
  varying float vNearProduct;

  void main() {
    // Grid pattern - sparser grid (10 instead of 20)
    vec2 grid = abs(fract(vUv * 10.0 - 0.5) - 0.5);
    float gridLine = min(grid.x, grid.y);
    float gridAlpha = 1.0 - smoothstep(0.0, 0.04, gridLine);

    // Base grid color - much dimmer
    vec3 baseColor = vec3(0.0, 0.12, 0.0);

    // Brighten near products - subtle
    vec3 brightColor = vec3(0.0, 0.5, 0.0);
    vec3 finalColor = mix(baseColor, brightColor, vNearProduct * 0.4);

    // Subtle pulse effect
    float pulse = sin(uTime * 2.0) * 0.5 + 0.5;
    finalColor += brightColor * vNearProduct * pulse * 0.1;

    // Subtle intersection glow
    float intersectionGlow = vDistortion * 0.25;
    finalColor += vec3(0.0, 0.2, 0.1) * intersectionGlow;

    float alpha = gridAlpha * (0.06 + vNearProduct * 0.15 + vDistortion * 0.08);

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

// Particle shader for floating code particles
const particleVertexShader = `
  uniform float uTime;
  uniform vec3 uProductPositions[8];
  uniform int uProductCount;
  
  attribute float aSize;
  attribute float aSpeed;
  attribute vec3 aVelocity;
  
  varying float vAlpha;
  varying float vNearProduct;
  
  void main() {
    vec3 pos = position;
    
    // Base movement
    pos.x += sin(uTime * aSpeed + position.y) * 0.3;
    pos.y -= uTime * aSpeed * 0.5;
    pos.y = mod(pos.y + 10.0, 20.0) - 10.0;
    
    // Get attracted to nearby products
    float nearestDist = 1000.0;
    for(int i = 0; i < 8; i++) {
      if(i >= uProductCount) break;
      
      vec3 productPos = uProductPositions[i];
      float dist = distance(pos.xy, productPos.xy);
      
      if(dist < 3.0) {
        vec3 dir = normalize(productPos - pos);
        float attraction = (3.0 - dist) / 3.0;
        pos += dir * attraction * 0.5;
      }
      
      nearestDist = min(nearestDist, dist);
    }
    
    vNearProduct = smoothstep(3.0, 0.0, nearestDist);
    vAlpha = 0.3 + vNearProduct * 0.7;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (300.0 / -mvPosition.z) * (1.0 + vNearProduct);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const particleFragmentShader = `
  varying float vAlpha;
  varying float vNearProduct;
  
  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if(dist > 0.5) discard;
    
    float alpha = (1.0 - dist * 2.0) * vAlpha;
    vec3 color = mix(vec3(0.0, 0.4, 0.0), vec3(0.0, 1.0, 0.5), vNearProduct);
    
    gl_FragColor = vec4(color, alpha * 0.6);
  }
`;

interface GridMeshProps {
  productPositions: THREE.Vector3[];
}

const GridMesh = ({ productPositions }: GridMeshProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { mouse } = useThree();
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uProductPositions: { value: new Array(8).fill(null).map(() => new THREE.Vector3()) },
    uProductCount: { value: 0 },
    uMouse: { value: new THREE.Vector2() },
  }), []);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const material = meshRef.current.material as THREE.ShaderMaterial;
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uMouse.value.set(mouse.x * 10, mouse.y * 6);
    material.uniforms.uProductCount.value = Math.min(productPositions.length, 8);
    
    productPositions.slice(0, 8).forEach((pos, i) => {
      material.uniforms.uProductPositions.value[i].copy(pos);
    });
  });
  
  return (
    <mesh ref={meshRef} position={[0, 0, -2]} rotation={[-0.3, 0, 0]}>
      <planeGeometry args={[30, 20, 100, 100]} />
      <shaderMaterial
        vertexShader={gridVertexShader}
        fragmentShader={gridFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

const FloatingParticles = ({ productPositions }: GridMeshProps) => {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 500;
  
  const { positions, sizes, speeds } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const speeds = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5 - 1;
      sizes[i] = Math.random() * 3 + 1;
      speeds[i] = Math.random() * 0.5 + 0.2;
    }
    
    return { positions, sizes, speeds };
  }, []);
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uProductPositions: { value: new Array(8).fill(null).map(() => new THREE.Vector3()) },
    uProductCount: { value: 0 },
  }), []);
  
  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const material = pointsRef.current.material as THREE.ShaderMaterial;
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uProductCount.value = Math.min(productPositions.length, 8);
    
    productPositions.slice(0, 8).forEach((pos, i) => {
      material.uniforms.uProductPositions.value[i].copy(pos);
    });
  });
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          count={particleCount}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aSpeed"
          count={particleCount}
          array={speeds}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Shockwave effect component
const Shockwave = ({ position, startTime }: { position: THREE.Vector3; startTime: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const elapsed = state.clock.elapsedTime - startTime;
    const scale = elapsed * 3;
    const opacity = Math.max(0, 1 - elapsed * 0.5);
    
    meshRef.current.scale.set(scale, scale, 1);
    (meshRef.current.material as THREE.MeshBasicMaterial).opacity = opacity * 0.3;
    
    if (elapsed > 2) {
      meshRef.current.visible = false;
    }
  });
  
  return (
    <mesh ref={meshRef} position={position}>
      <ringGeometry args={[0.8, 1, 32]} />
      <meshBasicMaterial
        color="#00ff00"
        transparent
        opacity={0.3}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

interface ConductiveGridProps {
  productPositions?: { x: number; y: number }[];
}

const Scene = ({ productPositions = [] }: ConductiveGridProps) => {
  const positions = useMemo(() => {
    return productPositions.map(p => new THREE.Vector3(
      (p.x / window.innerWidth - 0.5) * 20,
      -(p.y / window.innerHeight - 0.5) * 12,
      0
    ));
  }, [productPositions]);
  
  return (
    <>
      <GridMesh productPositions={positions} />
      <FloatingParticles productPositions={positions} />
    </>
  );
};

export const ConductiveGrid = ({ productPositions = [] }: ConductiveGridProps) => {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent', pointerEvents: 'none' }}
      >
        <Scene productPositions={productPositions} />
      </Canvas>
    </div>
  );
};