import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Sparkles, Shield } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
      </div>

      <div className="container mx-auto px-4 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-eco-light border border-primary/20 mb-6 animate-slide-up">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Powered by Sui Network</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 animate-slide-up">
            Tài chính hóa hành vi{" "}
            <span className="text-primary">giảm phát thải CO₂</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up">
            EcoShop - Nền tảng Circular Economy Hub đầu tiên trên Sui, token hóa tài sản xanh 
            và thưởng ECO Token cho mỗi giao dịch bền vững của bạn.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-slide-up">
            <Button size="lg" className="gap-2 text-base">
              Khám phá Marketplace
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" className="gap-2 text-base">
              <Leaf className="w-5 h-5" />
              Tìm hiểu Eco-Score
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto animate-slide-up">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-card/80 backdrop-blur-sm border border-border">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Leaf className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-foreground">50K+</p>
                <p className="text-sm text-muted-foreground">Tấn CO₂ đã giảm</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-card/80 backdrop-blur-sm border border-border">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-secondary" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-foreground">10M+</p>
                <p className="text-sm text-muted-foreground">ECO Token phát hành</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-card/80 backdrop-blur-sm border border-border">
              <div className="w-12 h-12 rounded-lg bg-accent/50 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-foreground">500+</p>
                <p className="text-sm text-muted-foreground">Merchant xác thực</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
