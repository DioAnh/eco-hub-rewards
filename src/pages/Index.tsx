import { Helmet } from "react-helmet-async";
import {
  ParticleBackground,
  MinimalHeader,
  BioDynamicHero,
  FloatingBiomesSection,
  OrbitalMenu,
} from "@/components/bio-dynamic";
import GreenAvatarSection from "@/components/GreenAvatarSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>EcoShop - Circular Economy Hub on Sui Network</title>
        <meta
          name="description"
          content="EcoShop - Nền tảng Circular Economy Hub đầu tiên trên Sui, token hóa tài sản xanh và thưởng ECO Token cho mỗi giao dịch bền vững."
        />
      </Helmet>

      <div className="min-h-screen bg-background overflow-x-hidden">
        {/* WebGL Particle Background */}
        <ParticleBackground ecoActivity={0.8} />
        
        {/* Minimal Header */}
        <MinimalHeader />
        
        {/* Orbital Navigation Menu */}
        <OrbitalMenu />
        
        <main>
          {/* Bio-Dynamic Hero */}
          <BioDynamicHero />
          
          {/* Floating Product Biomes */}
          <FloatingBiomesSection />
          
          {/* Existing sections */}
          <GreenAvatarSection />
          <HowItWorksSection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
