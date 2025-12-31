import { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  MatrixBackground,
  CyberHeader,
  CyberpunkHero,
  CyberMenu,
  MarqueeTicker,
  MagneticDataStream,
  SplashScreen,
} from "@/components/cyberpunk";
import Footer from "@/components/Footer";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      <Helmet>
        <title>EcoShop - Circular Economy Hub on Sui Network</title>
        <meta
          name="description"
          content="EcoShop - The first Circular Economy Hub on Sui, tokenizing green assets and rewarding ECO Tokens."
        />
      </Helmet>

      {/* Splash Screen */}
      {showSplash && (
        <SplashScreen 
          onComplete={() => setShowSplash(false)} 
          duration={5000} 
        />
      )}

      <div className={`min-h-screen bg-black overflow-x-hidden scanlines ${showSplash ? "hidden" : ""}`}>
        {/* Matrix Rain Background */}
        <MatrixBackground />
        
        {/* Live Ticker */}
        <MarqueeTicker />
        
        {/* Cyber Header */}
        <CyberHeader />
        
        {/* Cyber Menu */}
        <CyberMenu />
        
        <main className="pt-8">
          {/* Cyberpunk Hero */}
          <CyberpunkHero />
          
          {/* Magnetic Data Stream Products */}
          <MagneticDataStream />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
