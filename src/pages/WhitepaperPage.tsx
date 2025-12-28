import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText, Download, ExternalLink, Book, Code, Shield, Coins } from "lucide-react";
import { MatrixBackground, CyberHeader, CyberButton } from "@/components/cyberpunk";

const WhitepaperPage = () => {
  const sections = [
    {
      id: "abstract",
      title: "ABSTRACT",
      content: "EcoShop is a decentralized circular economy platform built on the Sui Network, designed to incentivize sustainable commerce through tokenized rewards. Our protocol enables users to earn ECO tokens for eco-friendly purchases, recycling activities, and carbon footprint reduction.",
    },
    {
      id: "problem",
      title: "PROBLEM_STATEMENT",
      content: "Traditional e-commerce lacks incentives for sustainable behavior. Consumers have no direct reward for making eco-friendly choices, and businesses struggle to verify and reward green practices. The circular economy remains fragmented without a unified tokenized incentive layer.",
    },
    {
      id: "solution",
      title: "SOLUTION",
      content: "EcoShop introduces ECO Token as the native currency for sustainable commerce. Smart contracts automatically reward users based on their Eco Score, which measures environmental impact across multiple factors including carbon footprint, recycling rate, and sustainable purchases.",
    },
    {
      id: "tokenomics",
      title: "TOKENOMICS",
      content: "Total Supply: 1,000,000,000 ECO\n• 40% Community Rewards\n• 25% Staking Pool\n• 20% Team & Advisors (4-year vesting)\n• 10% Liquidity\n• 5% Marketing & Partnerships",
    },
    {
      id: "roadmap",
      title: "ROADMAP",
      content: "Q1 2025: Mainnet Launch on Sui\nQ2 2025: Marketplace v2 & Mobile App\nQ3 2025: Cross-chain Bridge Integration\nQ4 2025: DAO Governance Launch\n2026: Global Expansion & Enterprise Partnerships",
    },
  ];

  const documents = [
    { name: "Full Whitepaper", size: "2.4 MB", format: "PDF" },
    { name: "Tokenomics Deep Dive", size: "1.1 MB", format: "PDF" },
    { name: "Smart Contract Audit", size: "856 KB", format: "PDF" },
    { name: "Technical Documentation", size: "3.2 MB", format: "PDF" },
  ];

  return (
    <>
      <Helmet>
        <title>Whitepaper - EcoShop Protocol</title>
        <meta name="description" content="Read the EcoShop whitepaper to understand our circular economy protocol on Sui Network" />
      </Helmet>

      <div className="min-h-screen bg-black overflow-x-hidden scanlines">
        <MatrixBackground />
        <CyberHeader />

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

            {/* Page title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-12"
            >
              <h1 className="text-4xl md:text-6xl font-bold font-mono uppercase tracking-tight mb-4">
                <span className="text-primary neon-text">WHITEPAPER</span>
              </h1>
              <p className="text-muted-foreground font-mono max-w-2xl">
                {">> "}Version 2.0 | Last updated: December 2024 | Protocol documentation for EcoShop on Sui Network
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main content */}
              <div className="lg:col-span-2 space-y-6">
                {sections.map((section, index) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="p-6 bg-black/80 border border-primary/30"
                    style={{
                      clipPath: "polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",
                    }}
                  >
                    <h2 className="text-xl font-bold text-primary font-mono mb-4 flex items-center gap-2">
                      <span className="text-primary/50">{String(index + 1).padStart(2, "0")}.</span>
                      {section.title}
                    </h2>
                    <p className="text-foreground/80 font-mono text-sm leading-relaxed whitespace-pre-line">
                      {section.content}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick links */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-6 bg-black/80 border border-primary/30"
                  style={{
                    clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))",
                  }}
                >
                  <h3 className="text-lg font-bold text-primary font-mono mb-4 flex items-center gap-2">
                    <Book className="w-5 h-5" />
                    QUICK_LINKS
                  </h3>
                  <div className="space-y-2">
                    {sections.map((section) => (
                      <a
                        key={section.id}
                        href={`#${section.id}`}
                        className="block text-sm font-mono text-muted-foreground hover:text-primary transition-colors"
                      >
                        → {section.title}
                      </a>
                    ))}
                  </div>
                </motion.div>

                {/* Downloads */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="p-6 bg-black/80 border border-primary/30"
                  style={{
                    clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))",
                  }}
                >
                  <h3 className="text-lg font-bold text-primary font-mono mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    DOWNLOADS
                  </h3>
                  <div className="space-y-3">
                    {documents.map((doc) => (
                      <div
                        key={doc.name}
                        className="flex items-center justify-between p-3 border border-primary/20 hover:border-primary/50 transition-colors cursor-pointer"
                      >
                        <div>
                          <div className="text-sm font-mono text-foreground">{doc.name}</div>
                          <div className="text-xs text-muted-foreground font-mono">
                            {doc.format} • {doc.size}
                          </div>
                        </div>
                        <Download className="w-4 h-4 text-primary" />
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Resources */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="p-6 bg-black/80 border border-primary/30"
                  style={{
                    clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))",
                  }}
                >
                  <h3 className="text-lg font-bold text-primary font-mono mb-4 flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    RESOURCES
                  </h3>
                  <div className="space-y-2">
                    <a href="#" className="flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-primary transition-colors">
                      <ExternalLink className="w-3 h-3" />
                      GitHub Repository
                    </a>
                    <a href="#" className="flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-primary transition-colors">
                      <ExternalLink className="w-3 h-3" />
                      Smart Contract Docs
                    </a>
                    <a href="#" className="flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-primary transition-colors">
                      <ExternalLink className="w-3 h-3" />
                      API Reference
                    </a>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default WhitepaperPage;
