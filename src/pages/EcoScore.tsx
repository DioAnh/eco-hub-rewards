import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Leaf, Zap, TrendingUp, Calculator, Shield, Globe } from "lucide-react";
import {
  MatrixBackground,
  CyberHeader,
  CyberMenu,
  MarqueeTicker,
  TypingText,
} from "@/components/cyberpunk";
import CyberFooter from "@/components/cyberpunk/CyberFooter";

const EcoScore = () => {
  const algorithms = [
    {
      title: "CO₂ MEASUREMENT",
      description: "Đo lường lượng carbon dioxide được giảm thiểu từ mỗi sản phẩm dựa trên vòng đời sản xuất và vận chuyển.",
      formula: "CO₂_saved = (traditional_emission - eco_emission) × quantity",
      icon: Leaf,
      color: "hsl(120 100% 50%)",
    },
    {
      title: "ECO TOKEN CALCULATION",
      description: "Công thức tính toán số lượng ECO token được thưởng dựa trên giá trị CO₂ và eco score của sản phẩm.",
      formula: "ECO_reward = (CO₂_value × eco_score / 100) × price_multiplier",
      icon: Zap,
      color: "hsl(180 100% 50%)",
    },
    {
      title: "IMPACT SCORING",
      description: "Thuật toán đánh giá tổng thể tác động môi trường dựa trên nhiều yếu tố khác nhau.",
      formula: "impact_score = Σ(material_score + transport_score + packaging_score)",
      icon: TrendingUp,
      color: "hsl(280 100% 60%)",
    },
  ];

  const factors = [
    { name: "Material Sustainability", weight: 30, description: "Đánh giá nguồn gốc và tính bền vững của nguyên liệu" },
    { name: "Carbon Footprint", weight: 25, description: "Lượng khí thải carbon trong quá trình sản xuất" },
    { name: "Recyclability", weight: 20, description: "Khả năng tái chế và tái sử dụng sản phẩm" },
    { name: "Packaging Impact", weight: 15, description: "Tác động môi trường từ bao bì đóng gói" },
    { name: "Transport Efficiency", weight: 10, description: "Hiệu quả vận chuyển và logistics xanh" },
  ];

  return (
    <>
      <Helmet>
        <title>Eco-Score Algorithm - EcoShop | CO₂ Quantification System</title>
        <meta name="description" content="Learn how EcoShop calculates eco scores and CO₂ reduction using blockchain-verified algorithms on Sui Network." />
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
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div 
                className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 font-mono text-xs uppercase"
                style={{
                  background: 'hsl(0 0% 0% / 0.8)',
                  border: '1px solid hsl(120 100% 50% / 0.4)',
                }}
              >
                <Calculator className="w-3 h-3 text-primary" />
                <span className="text-primary">ECO_ALGORITHM::V2.0</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold font-mono uppercase tracking-tight mb-3">
                <span className="text-foreground">Eco-Score</span>{" "}
                <span className="text-primary neon-text">Algorithm</span>
              </h1>
              <p className="text-muted-foreground font-mono text-sm max-w-2xl mx-auto">
                {">> "} Hệ thống định lượng CO₂ được xác thực trên blockchain, đảm bảo tính minh bạch và chính xác.
              </p>
            </motion.div>

            {/* Algorithm cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {algorithms.map((algo, index) => (
                <motion.div
                  key={algo.title}
                  className="p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    background: 'linear-gradient(180deg, hsl(180 10% 5%) 0%, hsl(0 0% 0%) 100%)',
                    border: `1px solid ${algo.color}40`,
                  }}
                >
                  <div 
                    className="w-12 h-12 flex items-center justify-center mb-4"
                    style={{
                      background: `${algo.color}10`,
                      border: `1px solid ${algo.color}50`,
                    }}
                  >
                    <algo.icon className="w-6 h-6" style={{ color: algo.color }} />
                  </div>
                  
                  <h3 className="font-mono text-sm uppercase tracking-wider mb-3" style={{ color: algo.color }}>
                    {algo.title}
                  </h3>
                  
                  <p className="font-mono text-xs text-muted-foreground mb-4 leading-relaxed">
                    {algo.description}
                  </p>
                  
                  <div 
                    className="p-3 font-mono text-[10px] overflow-x-auto"
                    style={{
                      background: 'hsl(0 0% 0% / 0.5)',
                      border: `1px solid ${algo.color}30`,
                    }}
                  >
                    <code style={{ color: algo.color }}>{algo.formula}</code>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Scoring factors */}
            <motion.div
              className="mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="font-mono text-2xl text-primary uppercase mb-8 text-center">
                {"<"} Scoring Factors {"/>"}
              </h2>
              
              <div 
                className="p-6"
                style={{
                  background: 'linear-gradient(180deg, hsl(180 10% 5%) 0%, hsl(0 0% 0%) 100%)',
                  border: '1px solid hsl(120 100% 50% / 0.2)',
                }}
              >
                <div className="space-y-4">
                  {factors.map((factor, index) => (
                    <motion.div
                      key={factor.name}
                      className="flex items-center gap-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <div className="w-32 font-mono text-xs text-primary">
                        {factor.name}
                      </div>
                      <div className="flex-1">
                        <div className="h-6 bg-black/50 rounded overflow-hidden relative">
                          <motion.div
                            className="h-full"
                            style={{ 
                              background: `linear-gradient(90deg, hsl(120 100% 50%), hsl(${120 + index * 30} 100% 50%))`,
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: `${factor.weight}%` }}
                            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 font-mono text-xs text-foreground">
                            {factor.weight}%
                          </span>
                        </div>
                      </div>
                      <div className="w-64 font-mono text-[10px] text-muted-foreground hidden md:block">
                        {factor.description}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Verification section */}
            <motion.div
              className="grid md:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div 
                className="p-6"
                style={{
                  background: 'linear-gradient(180deg, hsl(180 10% 5%) 0%, hsl(0 0% 0%) 100%)',
                  border: '1px solid hsl(280 100% 60% / 0.3)',
                }}
              >
                <Shield className="w-8 h-8 text-purple-400 mb-4" />
                <h3 className="font-mono text-lg text-purple-400 uppercase mb-3">
                  Blockchain Verification
                </h3>
                <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                  Mọi phép tính eco-score được ghi lại và xác thực trên Sui blockchain, đảm bảo tính minh bạch tuyệt đối. 
                  Không thể thay đổi hoặc giả mạo dữ liệu sau khi đã được ghi nhận.
                </p>
              </div>
              
              <div 
                className="p-6"
                style={{
                  background: 'linear-gradient(180deg, hsl(180 10% 5%) 0%, hsl(0 0% 0%) 100%)',
                  border: '1px solid hsl(180 100% 50% / 0.3)',
                }}
              >
                <Globe className="w-8 h-8 text-secondary mb-4" />
                <h3 className="font-mono text-lg text-secondary uppercase mb-3">
                  Real-time Updates
                </h3>
                <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                  Dữ liệu eco-score được cập nhật theo thời gian thực dựa trên các nguồn đáng tin cậy và được 
                  kiểm chứng bởi cộng đồng validators trên mạng lưới Sui.
                </p>
              </div>
            </motion.div>
          </div>
        </main>

        <CyberFooter />
      </div>
    </>
  );
};

export default EcoScore;