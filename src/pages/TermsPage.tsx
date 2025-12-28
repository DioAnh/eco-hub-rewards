import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText, Shield, AlertTriangle, Scale, Users, Globe } from "lucide-react";
import { MatrixBackground, CyberHeader, CyberMenu } from "@/components/cyberpunk";
import CyberFooter from "@/components/cyberpunk/CyberFooter";

const TermsPage = () => {
  const sections = [
    {
      id: "intro",
      title: "1. GIỚI THIỆU",
      icon: <FileText className="w-5 h-5" />,
      content: [
        "Chào mừng bạn đến với EcoShop. Bằng việc truy cập và sử dụng nền tảng của chúng tôi, bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu trong tài liệu này.",
        "EcoShop là một nền tảng thương mại điện tử phi tập trung được xây dựng trên Sui Network, cung cấp các sản phẩm thân thiện với môi trường và hệ thống token reward (ECO Token).",
        "Các điều khoản này áp dụng cho tất cả người dùng, bao gồm khách truy cập, người mua, người bán (merchants), và đối tác của nền tảng.",
      ],
    },
    {
      id: "definitions",
      title: "2. ĐỊNH NGHĨA",
      icon: <Scale className="w-5 h-5" />,
      content: [
        '"Nền tảng" hoặc "EcoShop" đề cập đến website, ứng dụng, và tất cả các dịch vụ liên quan.',
        '"Người dùng" là bất kỳ cá nhân hoặc tổ chức nào truy cập hoặc sử dụng Nền tảng.',
        '"ECO Token" là utility token gốc của EcoShop, được sử dụng cho rewards, staking, và governance.',
        '"Eco-Score" là hệ thống đánh giá tác động môi trường của sản phẩm và người dùng.',
        '"Smart Contract" là các hợp đồng thông minh được triển khai trên Sui Network.',
        '"Wallet" là ví điện tử tương thích với Sui blockchain.',
      ],
    },
    {
      id: "eligibility",
      title: "3. ĐIỀU KIỆN SỬ DỤNG",
      icon: <Users className="w-5 h-5" />,
      content: [
        "Để sử dụng EcoShop, bạn phải:",
        "• Đủ 18 tuổi hoặc tuổi trưởng thành theo pháp luật địa phương",
        "• Có wallet tương thích với Sui Network",
        "• Không bị cấm sử dụng các dịch vụ blockchain theo pháp luật địa phương",
        "• Cung cấp thông tin chính xác khi đăng ký làm merchant",
        "• Chịu trách nhiệm về bảo mật wallet và private keys của mình",
      ],
    },
    {
      id: "services",
      title: "4. DỊCH VỤ",
      icon: <Globe className="w-5 h-5" />,
      content: [
        "EcoShop cung cấp các dịch vụ sau:",
        "",
        "4.1 Marketplace",
        "• Mua bán sản phẩm eco-friendly được xác thực",
        "• Thanh toán bằng cryptocurrency hoặc ECO Token",
        "• Nhận ECO Token rewards cho mỗi giao dịch",
        "",
        "4.2 Staking",
        "• Stake ECO Token để nhận passive income",
        "• Các pool staking với APY và thời hạn khác nhau",
        "",
        "4.3 Eco-Score",
        "• Theo dõi và cải thiện tác động môi trường",
        "• Nhận rewards dựa trên Eco-Score",
        "",
        "4.4 Governance",
        "• Tham gia voting cho các quyết định quan trọng",
        "• Đề xuất cải tiến cho nền tảng",
      ],
    },
    {
      id: "risks",
      title: "5. CẢNH BÁO RỦI RO",
      icon: <AlertTriangle className="w-5 h-5" />,
      content: [
        "QUAN TRỌNG: Việc sử dụng cryptocurrency và blockchain có rủi ro đáng kể:",
        "",
        "• Biến động giá: Giá trị của ECO Token và các cryptocurrency khác có thể dao động mạnh",
        "• Rủi ro smart contract: Mặc dù đã được audit, smart contracts vẫn có thể chứa lỗi",
        "• Mất mát không thể khôi phục: Mất private key đồng nghĩa với mất quyền truy cập vĩnh viễn",
        "• Rủi ro pháp lý: Quy định về cryptocurrency có thể thay đổi",
        "",
        "Bạn nên tự nghiên cứu (DYOR) và chỉ đầu tư số tiền có thể chấp nhận mất.",
      ],
    },
    {
      id: "liability",
      title: "6. GIỚI HẠN TRÁCH NHIỆM",
      icon: <Shield className="w-5 h-5" />,
      content: [
        "EcoShop không chịu trách nhiệm cho:",
        "",
        "• Thiệt hại do biến động giá cryptocurrency",
        "• Mất mát do người dùng không bảo mật wallet đúng cách",
        "• Các vấn đề phát sinh từ network congestion trên Sui",
        "• Hành vi gian lận của người bán hoặc người mua",
        "• Sự cố kỹ thuật ngoài tầm kiểm soát",
        "",
        "Trách nhiệm tối đa của chúng tôi được giới hạn ở số tiền bạn đã thanh toán cho dịch vụ.",
      ],
    },
    {
      id: "privacy",
      title: "7. QUYỀN RIÊNG TƯ",
      icon: <Shield className="w-5 h-5" />,
      content: [
        "Chúng tôi cam kết bảo vệ quyền riêng tư của bạn:",
        "",
        "• Dữ liệu on-chain là public theo bản chất của blockchain",
        "• Dữ liệu off-chain được bảo vệ theo tiêu chuẩn ngành",
        "• Chúng tôi không bán dữ liệu cá nhân cho bên thứ ba",
        "• Bạn có quyền yêu cầu xóa dữ liệu off-chain",
        "",
        "Chi tiết được mô tả trong Chính sách Bảo mật riêng biệt.",
      ],
    },
    {
      id: "changes",
      title: "8. THAY ĐỔI ĐIỀU KHOẢN",
      icon: <FileText className="w-5 h-5" />,
      content: [
        "EcoShop có quyền sửa đổi các điều khoản này bất cứ lúc nào.",
        "",
        "• Thay đổi quan trọng sẽ được thông báo trước 30 ngày",
        "• Việc tiếp tục sử dụng sau thông báo đồng nghĩa với chấp nhận",
        "• Phiên bản mới nhất luôn có sẵn tại trang này",
        "• Các thay đổi có thể được thảo luận qua governance voting",
      ],
    },
    {
      id: "contact",
      title: "9. LIÊN HỆ",
      icon: <Users className="w-5 h-5" />,
      content: [
        "Nếu có câu hỏi về các điều khoản này, vui lòng liên hệ:",
        "",
        "• Email: legal@ecoshop.sui",
        "• Discord: discord.gg/ecoshop",
        "• Telegram: t.me/ecoshop_official",
        "",
        "Thời gian phản hồi: 24-48 giờ làm việc",
      ],
    },
  ];

  return (
    <>
      <Helmet>
        <title>Điều khoản sử dụng - EcoShop | Terms of Service</title>
        <meta name="description" content="Điều khoản và điều kiện sử dụng nền tảng EcoShop - marketplace eco-friendly trên Sui Network." />
        <link rel="canonical" href="https://ecoshop.sui/terms" />
      </Helmet>

      <div className="min-h-screen bg-black overflow-x-hidden scanlines">
        <MatrixBackground />
        <CyberHeader />
        <CyberMenu />

        <main className="relative z-10 pt-32 pb-20 px-6">
          <div className="max-w-4xl mx-auto">
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

            {/* Page title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-12"
            >
              <h1 className="text-4xl md:text-6xl font-bold font-mono uppercase tracking-tight mb-4">
                <span className="text-primary neon-text">ĐIỀU KHOẢN SỬ DỤNG</span>
              </h1>
              <p className="text-muted-foreground font-mono max-w-2xl">
                {">> "}Cập nhật lần cuối: Tháng 12, 2024 | Phiên bản 2.0
              </p>
            </motion.div>

            {/* Warning banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8 p-4 border border-yellow-500/50 bg-yellow-500/10"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-mono text-sm text-yellow-500 font-bold mb-1">QUAN TRỌNG</p>
                  <p className="font-mono text-xs text-muted-foreground">
                    Vui lòng đọc kỹ các điều khoản này trước khi sử dụng EcoShop. Bằng việc kết nối wallet và sử dụng nền tảng, bạn đồng ý với tất cả các điều khoản được nêu dưới đây.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Sections */}
            <div className="space-y-8">
              {sections.map((section, index) => (
                <motion.section
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="p-6 bg-black/80 border border-primary/30"
                  style={{
                    clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-primary">{section.icon}</span>
                    <h2 className="text-lg font-bold text-primary font-mono uppercase">
                      {section.title}
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {section.content.map((paragraph, idx) => (
                      <p key={idx} className="font-mono text-sm text-foreground/80 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </motion.section>
              ))}
            </div>

            {/* Agreement section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-12 p-6 border border-primary bg-primary/5 text-center"
            >
              <p className="font-mono text-sm text-primary mb-4">
                Bằng việc sử dụng EcoShop, bạn xác nhận đã đọc, hiểu và đồng ý với tất cả các điều khoản trên.
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-mono text-sm uppercase hover:bg-primary/90 transition-colors"
                style={{
                  clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
                }}
              >
                TÔI ĐỒNG Ý - QUAY VỀ TRANG CHỦ
              </Link>
            </motion.div>
          </div>
        </main>

        <CyberFooter />
      </div>
    </>
  );
};

export default TermsPage;
