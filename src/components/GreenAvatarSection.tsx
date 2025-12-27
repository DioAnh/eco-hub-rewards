import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Gift, Zap } from "lucide-react";
import greenAvatar from "@/assets/green-avatar.png";

const GreenAvatarSection = () => {
  const features = [
    {
      icon: Sparkles,
      title: "Dynamic Evolution",
      description: "Avatar tiến hóa theo Eco-Score của bạn, trở nên rực rỡ hơn mỗi khi bạn mua sắm xanh.",
    },
    {
      icon: TrendingUp,
      title: "Level Up System",
      description: "Tích lũy XP từ giao dịch bền vững, mở khóa các traits hiếm và độc quyền.",
    },
    {
      icon: Gift,
      title: "Exclusive Rewards",
      description: "Sở hữu NFT Avatar hiếm để nhận ưu đãi đặc biệt và airdrop từ Merchant.",
    },
    {
      icon: Zap,
      title: "Community Power",
      description: "Tham gia governance và bỏ phiếu cho các quyết định phát triển hệ sinh thái.",
    },
  ];

  return (
    <section id="avatar" className="py-24 bg-card overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Gamification NFT</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Green Avatar
            </h2>

            <p className="text-lg text-muted-foreground mb-8">
              Dynamic NFT độc đáo, tiến hóa theo hành trình xanh của bạn. Mỗi giao dịch bền vững 
              là một viên gạch xây dựng nhân vật số của bạn trong hệ sinh thái EcoShop.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="p-4 rounded-xl bg-background border border-border"
                >
                  <feature.icon className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>

            <Button size="lg" className="gap-2">
              <Sparkles className="w-5 h-5" />
              Mint Avatar của bạn
            </Button>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="relative w-80 h-80 mx-auto">
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-glow" />
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 animate-spin-slow" />
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={greenAvatar}
                  alt="Green Avatar NFT"
                  className="w-64 h-64 object-cover rounded-3xl animate-float"
                />
              </div>
            </div>

            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
              <div className="px-4 py-2 rounded-full bg-background border border-border shadow-lg">
                <span className="text-sm font-medium text-foreground">Level 12</span>
              </div>
              <div className="px-4 py-2 rounded-full bg-primary text-primary-foreground shadow-lg">
                <span className="text-sm font-medium">2,450 XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GreenAvatarSection;
