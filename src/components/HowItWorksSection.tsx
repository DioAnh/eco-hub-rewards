import { ShoppingBag, Leaf, Coins, Trophy } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: ShoppingBag,
      step: "01",
      title: "Mua sắm bền vững",
      description: "Chọn sản phẩm từ các Merchant đã xác thực Proof of Green trên marketplace.",
    },
    {
      icon: Leaf,
      step: "02",
      title: "Eco-Score tính toán",
      description: "Hệ thống tự động định lượng lượng CO₂ giảm được từ giao dịch của bạn.",
    },
    {
      icon: Coins,
      step: "03",
      title: "Nhận ECO Token",
      description: "Smart Contract trên Sui tự động chuyển thưởng ECO Token vào wallet.",
    },
    {
      icon: Trophy,
      step: "04",
      title: "Avatar tiến hóa",
      description: "Green Avatar NFT của bạn phát triển theo hành trình mua sắm xanh.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Cách thức hoạt động
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Sui zkLogin xóa bỏ rào cản Web3, cho phép người dùng phổ thông tham gia 
            hệ sinh thái xanh chỉ với vài bước đơn giản.
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((item, index) => (
              <div key={item.step} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-card border-2 border-primary/30 flex items-center justify-center z-10 relative">
                      <item.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {item.step}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-0.5">
                    <div className="w-full h-full bg-gradient-to-r from-primary/30 to-primary/10" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-card border border-border text-center">
            <div className="w-16 h-16 rounded-2xl bg-sui-light mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-sui" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Sui Network</h3>
            <p className="text-sm text-muted-foreground">
              Blockchain Layer 1 với tốc độ cao và phí giao dịch thấp
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 mx-auto mb-4 flex items-center justify-center">
              <Leaf className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">zkLogin</h3>
            <p className="text-sm text-muted-foreground">
              Đăng nhập bằng Google/Facebook, không cần biết về crypto
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border text-center">
            <div className="w-16 h-16 rounded-2xl bg-token-light mx-auto mb-4 flex items-center justify-center">
              <Coins className="w-8 h-8 text-token" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Move Language</h3>
            <p className="text-sm text-muted-foreground">
              Smart Contract an toàn, được kiểm toán bởi đội ngũ chuyên gia
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
