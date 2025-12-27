import { useState, useRef, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Sparkles } from "@react-three/drei";
import { Hexagon, Zap, Leaf, TrendingUp, Sparkles as SparklesIcon } from "lucide-react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import * as THREE from "three";
import {
  MatrixBackground,
  CyberHeader,
  CyberMenu,
  MarqueeTicker,
  CyberButton,
} from "@/components/cyberpunk";
import CyberFooter from "@/components/cyberpunk/CyberFooter";

// 3D Avatar component
const Avatar3D = ({ level }: { level: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  const color = level > 5 ? "#00ffff" : level > 3 ? "#00ff88" : "#00ff00";
  const distort = 0.3 + level * 0.05;

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={meshRef} args={[1.5, 64, 64]}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={distort}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </Sphere>
      <Sparkles count={50} scale={4} size={2} speed={0.4} color={color} />
    </Float>
  );
};

const Avatar = () => {
  const currentAccount = useCurrentAccount();
  const [hasAvatar, setHasAvatar] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [avatarLevel, setAvatarLevel] = useState(1);

  const attributes = [
    { name: "ECO_LEVEL", value: avatarLevel, max: 10, color: "hsl(120 100% 50%)" },
    { name: "CO2_SAVED", value: 45.2, unit: "kg", color: "hsl(180 100% 50%)" },
    { name: "PURCHASES", value: 12, color: "hsl(280 100% 60%)" },
    { name: "RARITY", value: avatarLevel > 7 ? "LEGENDARY" : avatarLevel > 4 ? "RARE" : "COMMON", color: "hsl(45 100% 50%)" },
  ];

  const mintCost = 500;

  const handleMint = async () => {
    if (!currentAccount) {
      alert("Please connect your wallet first");
      return;
    }

    setIsMinting(true);
    // Simulate minting
    setTimeout(() => {
      setHasAvatar(true);
      setIsMinting(false);
    }, 2000);
  };

  const handleLevelUp = () => {
    if (avatarLevel < 10) {
      setAvatarLevel(prev => prev + 1);
    }
  };

  return (
    <>
      <Helmet>
        <title>Green Avatar NFT - EcoShop | Mint Your Eco Identity</title>
        <meta name="description" content="Mint your unique Green Avatar NFT. Dynamic NFT that evolves with your eco-friendly purchases on Sui blockchain." />
      </Helmet>

      <div className="min-h-screen bg-black overflow-x-hidden scanlines">
        <MatrixBackground />
        <MarqueeTicker />
        <CyberHeader />
        <CyberMenu />

        <main className="pt-24 pb-16 min-h-screen">
          <div className="container mx-auto px-4">
            {/* Header */}
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div 
                className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 font-mono text-xs uppercase"
                style={{
                  background: 'hsl(0 0% 0% / 0.8)',
                  border: '1px solid hsl(280 100% 60% / 0.4)',
                }}
              >
                <Hexagon className="w-3 h-3 text-purple-400" />
                <span className="text-purple-400">AVATAR_PROTOCOL::ACTIVE</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold font-mono uppercase tracking-tight mb-3">
                <span className="text-foreground">Green</span>{" "}
                <span className="text-purple-400">Avatar NFT</span>
              </h1>
              <p className="text-muted-foreground font-mono text-sm max-w-2xl mx-auto">
                {">> "} Dynamic NFT that evolves with your eco-friendly journey. The more you contribute, the more powerful your avatar becomes.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* 3D Avatar Display */}
              <motion.div
                className="aspect-square max-h-[500px]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                style={{
                  background: 'linear-gradient(180deg, hsl(180 10% 5%) 0%, hsl(0 0% 0%) 100%)',
                  border: '1px solid hsl(280 100% 60% / 0.3)',
                }}
              >
                {hasAvatar ? (
                  <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                    <ambientLight intensity={0.3} />
                    <pointLight position={[10, 10, 10]} intensity={1} color="#00ff00" />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ffff" />
                    <Suspense fallback={null}>
                      <Avatar3D level={avatarLevel} />
                    </Suspense>
                    <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
                  </Canvas>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-8">
                    <div 
                      className="w-32 h-32 flex items-center justify-center mb-6"
                      style={{
                        background: 'hsl(280 100% 60% / 0.1)',
                        border: '2px dashed hsl(280 100% 60% / 0.4)',
                        borderRadius: '50%',
                      }}
                    >
                      <SparklesIcon className="w-16 h-16 text-purple-400/50" />
                    </div>
                    <p className="font-mono text-sm text-muted-foreground text-center mb-6">
                      {"// "} No Avatar detected. Mint your first Green Avatar NFT to begin your eco-journey.
                    </p>
                    <CyberButton 
                      onClick={handleMint}
                      disabled={isMinting || !currentAccount}
                      style={{
                        background: 'hsl(280 100% 60% / 0.1)',
                        borderColor: 'hsl(280 100% 60% / 0.5)',
                      }}
                    >
                      {isMinting ? (
                        <span className="animate-pulse">MINTING...</span>
                      ) : (
                        <>
                          <SparklesIcon className="w-4 h-4 mr-2" />
                          MINT AVATAR ({mintCost} ECO)
                        </>
                      )}
                    </CyberButton>
                    {!currentAccount && (
                      <p className="font-mono text-xs text-red-400 mt-3">
                        {">> "} Connect wallet to mint
                      </p>
                    )}
                  </div>
                )}
              </motion.div>

              {/* Avatar Stats */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {/* Attributes */}
                <div 
                  className="p-6"
                  style={{
                    background: 'linear-gradient(180deg, hsl(180 10% 5%) 0%, hsl(0 0% 0%) 100%)',
                    border: '1px solid hsl(120 100% 50% / 0.2)',
                  }}
                >
                  <h3 className="font-mono text-sm text-primary uppercase mb-4">
                    {"<"} Avatar Attributes {"/>"}
                  </h3>
                  
                  <div className="space-y-4">
                    {attributes.map((attr, index) => (
                      <motion.div
                        key={attr.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                      >
                        <div className="flex justify-between mb-1">
                          <span className="font-mono text-xs text-muted-foreground">{attr.name}</span>
                          <span className="font-mono text-xs" style={{ color: attr.color }}>
                            {attr.value}{attr.unit || ''}{attr.max ? `/${attr.max}` : ''}
                          </span>
                        </div>
                        {attr.max && (
                          <div className="h-2 bg-black/50 rounded overflow-hidden">
                            <motion.div
                              className="h-full"
                              style={{ background: attr.color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${(Number(attr.value) / attr.max) * 100}%` }}
                              transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                            />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Evolution info */}
                <div 
                  className="p-6"
                  style={{
                    background: 'linear-gradient(180deg, hsl(180 10% 5%) 0%, hsl(0 0% 0%) 100%)',
                    border: '1px solid hsl(180 100% 50% / 0.2)',
                  }}
                >
                  <h3 className="font-mono text-sm text-secondary uppercase mb-4">
                    {"<"} Evolution System {"/>"}
                  </h3>
                  
                  <div className="space-y-3 font-mono text-xs text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <Leaf className="w-4 h-4 text-primary mt-0.5" />
                      <p>Mua sản phẩm eco-friendly để tích lũy điểm kinh nghiệm cho Avatar</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 text-secondary mt-0.5" />
                      <p>Avatar tự động cập nhật metadata khi đạt đủ điểm để lên level</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Zap className="w-4 h-4 text-yellow-400 mt-0.5" />
                      <p>Level cao hơn mở khóa các đặc quyền và phần thưởng đặc biệt</p>
                    </div>
                  </div>

                  {hasAvatar && (
                    <div className="mt-6">
                      <CyberButton onClick={handleLevelUp} disabled={avatarLevel >= 10} className="w-full justify-center">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        {avatarLevel >= 10 ? "MAX LEVEL" : `LEVEL UP (${(avatarLevel + 1) * 100} ECO)`}
                      </CyberButton>
                    </div>
                  )}
                </div>

                {/* Perks */}
                <div 
                  className="p-6"
                  style={{
                    background: 'linear-gradient(180deg, hsl(180 10% 5%) 0%, hsl(0 0% 0%) 100%)',
                    border: '1px solid hsl(45 100% 50% / 0.2)',
                  }}
                >
                  <h3 className="font-mono text-sm text-yellow-400 uppercase mb-4">
                    {"<"} Current Perks {"/>"}
                  </h3>
                  
                  <div className="space-y-2">
                    {[
                      { level: 1, perk: "5% bonus ECO on purchases", unlocked: avatarLevel >= 1 },
                      { level: 3, perk: "Early access to new products", unlocked: avatarLevel >= 3 },
                      { level: 5, perk: "10% discount on marketplace", unlocked: avatarLevel >= 5 },
                      { level: 7, perk: "Exclusive NFT airdrops", unlocked: avatarLevel >= 7 },
                      { level: 10, perk: "Governance voting rights", unlocked: avatarLevel >= 10 },
                    ].map((item) => (
                      <div 
                        key={item.level}
                        className={`flex items-center gap-3 p-2 font-mono text-xs ${item.unlocked ? 'text-yellow-400' : 'text-muted-foreground/50'}`}
                        style={{
                          background: item.unlocked ? 'hsl(45 100% 50% / 0.1)' : 'transparent',
                          border: `1px solid ${item.unlocked ? 'hsl(45 100% 50% / 0.3)' : 'hsl(0 0% 50% / 0.2)'}`,
                        }}
                      >
                        <span className="w-8">LV{item.level}</span>
                        <span>{item.perk}</span>
                        {item.unlocked && <span className="ml-auto">✓</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </main>

        <CyberFooter />
      </div>
    </>
  );
};

export default Avatar;