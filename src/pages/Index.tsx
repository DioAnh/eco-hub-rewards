import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import EcoScoreSection from "@/components/EcoScoreSection";
import MarketplaceSection from "@/components/MarketplaceSection";
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
          content="EcoShop - Nền tảng Circular Economy Hub đầu tiên trên Sui, token hóa tài sản xanh và thưởng ECO Token cho mỗi giao dịch bền vững. Proof of Green, Staking Vault, Dynamic NFT."
        />
        <meta
          name="keywords"
          content="EcoShop, Circular Economy, Sui Network, ECO Token, Proof of Green, Sustainable Shopping, Web3, NFT, Carbon Offset"
        />
        <link rel="canonical" href="https://ecoshop.io" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "EcoShop",
            "description": "Circular Economy Hub on Sui Network - Tài chính hóa hành vi giảm phát thải CO₂",
            "url": "https://ecoshop.io",
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <HeroSection />
          <EcoScoreSection />
          <MarketplaceSection />
          <GreenAvatarSection />
          <HowItWorksSection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
