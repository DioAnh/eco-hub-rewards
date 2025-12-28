import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Store, 
  CheckCircle, 
  FileText, 
  Shield, 
  Zap, 
  TrendingUp, 
  Users,
  Leaf,
  Coins,
  ArrowRight,
  Mail,
  MessageSquare
} from "lucide-react";
import { MatrixBackground, CyberHeader, CyberMenu, CyberButton } from "@/components/cyberpunk";
import CyberFooter from "@/components/cyberpunk/CyberFooter";

const ListingGuidePage = () => {
  const benefits = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Access to Green Community",
      description: "Tiếp cận cộng đồng người tiêu dùng có ý thức về môi trường, sẵn sàng trả premium cho sản phẩm bền vững.",
    },
    {
      icon: <Coins className="w-6 h-6" />,
      title: "ECO Token Incentives",
      description: "Nhận ECO Token rewards cho mỗi sản phẩm bán được. Token có thể stake để tạo passive income.",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Eco-Score Boost",
      description: "Sản phẩm của bạn được đánh giá Eco-Score, giúp khách hàng dễ dàng nhận biết và tin tưởng.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Blockchain Verification",
      description: "Mọi giao dịch được ghi nhận trên Sui blockchain, đảm bảo minh bạch và không thể giả mạo.",
    },
  ];

  const requirements = [
    "Sản phẩm phải thuộc danh mục eco-friendly (organic, recycled, sustainable, v.v.)",
    "Có giấy chứng nhận môi trường hoặc eco-label (ưu tiên)",
    "Cung cấp thông tin đầy đủ về nguồn gốc nguyên liệu",
    "Có khả năng ship hàng trong nước và/hoặc quốc tế",
    "Đồng ý với điều khoản merchant của EcoShop",
    "Có wallet Sui để nhận thanh toán",
  ];

  const steps = [
    {
      step: "01",
      title: "ĐĂNG KÝ TÀI KHOẢN MERCHANT",
      description: "Điền form đăng ký với thông tin doanh nghiệp và kết nối Sui wallet của bạn.",
      details: ["Thông tin công ty/cá nhân", "Sui wallet address", "Danh mục sản phẩm dự kiến"],
    },
    {
      step: "02",
      title: "XÁC MINH & REVIEW",
      description: "Team EcoShop sẽ review hồ sơ và xác minh các chứng nhận eco-friendly.",
      details: ["Kiểm tra giấy chứng nhận", "Đánh giá chất lượng sản phẩm", "Phỏng vấn nếu cần"],
    },
    {
      step: "03",
      title: "SETUP STORE",
      description: "Sau khi được approve, bạn có thể setup store và upload sản phẩm đầu tiên.",
      details: ["Tạo store profile", "Upload sản phẩm", "Set giá và inventory"],
    },
    {
      step: "04",
      title: "GO LIVE & EARN",
      description: "Store của bạn chính thức hoạt động. Mỗi giao dịch sẽ được reward ECO Token!",
      details: ["Nhận đơn hàng", "Xử lý shipping", "Collect ECO rewards"],
    },
  ];

  const fees = [
    { item: "Phí đăng ký", value: "MIỄN PHÍ", note: "Trong giai đoạn early access" },
    { item: "Commission", value: "3-5%", note: "Tùy danh mục sản phẩm" },
    { item: "Gas fee (Sui)", value: "~0.001 SUI", note: "Cho mỗi giao dịch on-chain" },
    { item: "Premium listing", value: "100 ECO/tháng", note: "Hiển thị ưu tiên (optional)" },
  ];

  const faqs = [
    {
      q: "Startup mới có thể đăng ký không?",
      a: "Có! Chúng tôi welcome các startup eco-friendly. Chỉ cần có sản phẩm thực sự bền vững và cam kết với môi trường.",
    },
    {
      q: "Cần bao lâu để được approve?",
      a: "Thông thường 3-5 ngày làm việc. Với hồ sơ đầy đủ và chứng nhận eco-label, quá trình có thể nhanh hơn.",
    },
    {
      q: "Có hỗ trợ ship quốc tế không?",
      a: "Có, EcoShop partner với các đơn vị logistics để hỗ trợ ship toàn cầu với carbon footprint tracking.",
    },
    {
      q: "ECO Token rewards được tính như thế nào?",
      a: "Rewards = (Eco-Score sản phẩm × Giá trị đơn hàng × 0.05%). Eco-Score càng cao, rewards càng nhiều.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Hướng dẫn niêm yết sản phẩm - EcoShop | Listing Guide for Startups</title>
        <meta name="description" content="Hướng dẫn chi tiết cách niêm yết sản phẩm trên EcoShop cho startups và merchants. Tham gia ecosystem circular economy trên Sui Network." />
        <link rel="canonical" href="https://ecoshop.sui/listing-guide" />
      </Helmet>

      <div className="min-h-screen bg-black overflow-x-hidden scanlines">
        <MatrixBackground />
        <CyberHeader />
        <CyberMenu />

        <main className="relative z-10 pt-32 pb-20 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Back button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-mono text-sm mb-8 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                BACK_TO_MAIN
              </Link>
            </motion.div>

            {/* Hero section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 border border-primary/50 bg-black/80 mb-6 font-mono text-xs uppercase">
                <Store className="w-4 h-4 text-primary" />
                <span className="text-primary">MERCHANT_PROGRAM::OPEN</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold font-mono uppercase tracking-tight mb-4">
                <span className="text-foreground">Niêm yết sản phẩm</span>
                <br />
                <span className="text-primary neon-text">CHO STARTUPS</span>
              </h1>
              <p className="text-muted-foreground font-mono max-w-2xl mx-auto">
                {">> "}Tham gia EcoShop Marketplace và tiếp cận cộng đồng người tiêu dùng xanh. 
                Nhận ECO Token rewards cho mỗi sản phẩm bán được.
              </p>
            </motion.div>

            {/* Benefits */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-16"
            >
              <h2 className="text-2xl font-bold font-mono text-primary uppercase mb-8 text-center">
                {"<"} Lợi ích khi tham gia {"/>"}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="p-6 bg-black/80 border border-primary/30 hover:border-primary/60 transition-all"
                    style={{
                      clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
                    }}
                  >
                    <div className="text-primary mb-4">{benefit.icon}</div>
                    <h3 className="font-mono text-sm text-primary uppercase mb-2">{benefit.title}</h3>
                    <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Requirements */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-16"
            >
              <div
                className="p-8 bg-black/80 border border-secondary/30"
                style={{
                  clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Leaf className="w-6 h-6 text-secondary" />
                  <h2 className="text-xl font-bold font-mono text-secondary uppercase">
                    Yêu cầu đối với Merchant
                  </h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {requirements.map((req, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="font-mono text-sm text-foreground/80">{req}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* Steps */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-16"
            >
              <h2 className="text-2xl font-bold font-mono text-primary uppercase mb-8 text-center">
                {"<"} Quy trình đăng ký {"/>"}
              </h2>
              <div className="space-y-6">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex gap-6 items-start"
                  >
                    <div
                      className="flex-shrink-0 w-16 h-16 flex items-center justify-center font-mono text-2xl font-bold text-primary border border-primary"
                      style={{
                        clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
                      }}
                    >
                      {step.step}
                    </div>
                    <div
                      className="flex-1 p-6 bg-black/80 border border-primary/30"
                      style={{
                        clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
                      }}
                    >
                      <h3 className="font-mono text-lg text-primary uppercase mb-2">{step.title}</h3>
                      <p className="font-mono text-sm text-muted-foreground mb-3">{step.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {step.details.map((detail, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-primary/10 border border-primary/30 font-mono text-xs text-primary"
                          >
                            {detail}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Fees */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-16"
            >
              <h2 className="text-2xl font-bold font-mono text-primary uppercase mb-8 text-center">
                {"<"} Biểu phí {"/>"}
              </h2>
              <div
                className="overflow-hidden border border-primary/30"
                style={{
                  clipPath: "polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",
                }}
              >
                <table className="w-full">
                  <thead>
                    <tr className="bg-primary/10 border-b border-primary/30">
                      <th className="text-left p-4 font-mono text-sm text-primary uppercase">Hạng mục</th>
                      <th className="text-left p-4 font-mono text-sm text-primary uppercase">Phí</th>
                      <th className="text-left p-4 font-mono text-sm text-primary uppercase hidden md:table-cell">Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fees.map((fee, index) => (
                      <tr key={fee.item} className="border-b border-primary/20 bg-black/80">
                        <td className="p-4 font-mono text-sm text-foreground">{fee.item}</td>
                        <td className="p-4 font-mono text-sm text-secondary font-bold">{fee.value}</td>
                        <td className="p-4 font-mono text-xs text-muted-foreground hidden md:table-cell">{fee.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.section>

            {/* FAQs */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mb-16"
            >
              <h2 className="text-2xl font-bold font-mono text-primary uppercase mb-8 text-center">
                {"<"} Câu hỏi thường gặp {"/>"}
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="p-5 bg-black/80 border border-primary/30"
                    style={{
                      clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
                    }}
                  >
                    <h4 className="font-mono text-sm text-primary mb-2">Q: {faq.q}</h4>
                    <p className="font-mono text-xs text-muted-foreground leading-relaxed">A: {faq.a}</p>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* CTA */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="text-center"
            >
              <div
                className="p-8 bg-primary/5 border border-primary"
                style={{
                  clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
                }}
              >
                <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-mono text-2xl text-primary uppercase mb-4">
                  Sẵn sàng tham gia?
                </h3>
                <p className="font-mono text-sm text-muted-foreground mb-6 max-w-xl mx-auto">
                  Đăng ký ngay để trở thành merchant trên EcoShop. Early access merchants sẽ được miễn phí đăng ký và nhiều ưu đãi khác!
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <CyberButton variant="primary">
                    <Mail className="w-4 h-4 mr-2" />
                    ĐĂNG KÝ NGAY
                  </CyberButton>
                  <CyberButton variant="secondary">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    LIÊN HỆ TƯ VẤN
                  </CyberButton>
                </div>
              </div>
            </motion.section>
          </div>
        </main>

        <CyberFooter />
      </div>
    </>
  );
};

export default ListingGuidePage;
