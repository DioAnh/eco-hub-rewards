import { Helmet } from "react-helmet-async";
import {
  MatrixBackground,
  CyberHeader,
  CyberpunkHero,
  CyberMenu,
  MarqueeTicker,
  MagneticDataStream,
} from "@/components/cyberpunk";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>EcoShop - Circular Economy Hub on Sui Network</title>
        <meta
          name="description"
          content="EcoShop - Nền tảng Circular Economy Hub đầu tiên trên Sui, token hóa tài sản xanh và thưởng ECO Token."
        />
      </Helmet>

      <div className="min-h-screen bg-black overflow-x-hidden scanlines">
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
