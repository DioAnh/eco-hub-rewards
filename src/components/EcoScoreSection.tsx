import { Leaf, TrendingUp, Award, Target } from "lucide-react";

const EcoScoreSection = () => {
  const ecoMetrics = [
    {
      icon: Leaf,
      label: "Carbon Footprint",
      value: "-2.5kg",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: TrendingUp,
      label: "Eco Points",
      value: "1,250",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      icon: Award,
      label: "Green Rank",
      value: "Gold",
      color: "text-token",
      bgColor: "bg-token-light",
    },
    {
      icon: Target,
      label: "Monthly Goal",
      value: "85%",
      color: "text-sui",
      bgColor: "bg-sui-light",
    },
  ];

  return (
    <section id="eco-score" className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Eco-Score Engine
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hệ thống định lượng và token hóa tài sản xanh (RWA) dựa trên bộ máy 
            tính toán Eco-Score tiên tiến với cơ chế Proof of Green (PoG).
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="relative w-80 h-80 mx-auto">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 animate-pulse-eco" />
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30" />
              <div className="absolute inset-8 rounded-full bg-card flex items-center justify-center border-4 border-primary/40">
                <div className="text-center">
                  <p className="text-6xl font-bold text-primary">87</p>
                  <p className="text-lg font-medium text-muted-foreground">Eco Score</p>
                </div>
              </div>

              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                Level 4
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 max-w-md mx-auto">
              {ecoMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="flex items-center gap-3 p-3 rounded-xl bg-background border border-border"
                >
                  <div className={`w-10 h-10 rounded-lg ${metric.bgColor} flex items-center justify-center`}>
                    <metric.icon className={`w-5 h-5 ${metric.color}`} />
                  </div>
                  <div>
                    <p className={`text-lg font-bold ${metric.color}`}>{metric.value}</p>
                    <p className="text-xs text-muted-foreground">{metric.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-background border border-border">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Leaf className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Proof of Green (PoG)</h3>
                  <p className="text-muted-foreground">
                    Cơ chế xác thực dữ liệu phát thải trên blockchain, đảm bảo tính minh bạch 
                    và không thể giả mạo cho mỗi giao dịch xanh.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-background border border-border">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Real World Assets (RWA)</h3>
                  <p className="text-muted-foreground">
                    Token hóa giá trị carbon offset thành tài sản số, tạo thanh khoản 
                    cho thị trường tín chỉ carbon phi tập trung.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-background border border-border">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-token-light flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-token" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">ECO Token Rewards</h3>
                  <p className="text-muted-foreground">
                    Nhận thưởng ECO Token trực tiếp thông qua Smart Contract (Move) 
                    cho mỗi giao dịch mua sắm bền vững.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EcoScoreSection;
