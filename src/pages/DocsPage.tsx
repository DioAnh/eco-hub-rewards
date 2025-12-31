import { useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Book, 
  Code, 
  Zap, 
  Shield, 
  Wallet, 
  ShoppingBag, 
  Coins, 
  ChevronRight,
  Terminal,
  FileText,
  Settings,
  HelpCircle
} from "lucide-react";
import { MatrixBackground, CyberHeader, CyberMenu } from "@/components/cyberpunk";
import CyberFooter from "@/components/cyberpunk/CyberFooter";

const DocsPage = () => {
  const [activeSection, setActiveSection] = useState("getting-started");

  const sections = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: <Book className="w-4 h-4" />,
      items: [
        { id: "intro", title: "Introduction to EcoShop" },
        { id: "wallet", title: "Connecting Your Wallet" },
        { id: "first-purchase", title: "Making Your First Purchase" },
        { id: "eco-tokens", title: "Understanding ECO Tokens" },
      ],
    },
    {
      id: "marketplace",
      title: "Marketplace",
      icon: <ShoppingBag className="w-4 h-4" />,
      items: [
        { id: "browsing", title: "Browsing Products" },
        { id: "eco-score", title: "Product Eco-Scores" },
        { id: "payment", title: "Payment Methods" },
        { id: "rewards", title: "Earning Rewards" },
      ],
    },
    {
      id: "staking",
      title: "Staking",
      icon: <Coins className="w-4 h-4" />,
      items: [
        { id: "staking-intro", title: "Introduction to Staking" },
        { id: "pools", title: "Staking Pools" },
        { id: "rewards-calc", title: "Calculating Rewards" },
        { id: "unstaking", title: "Unstaking Process" },
      ],
    },
    {
      id: "developers",
      title: "For Developers",
      icon: <Code className="w-4 h-4" />,
      items: [
        { id: "api", title: "API Reference" },
        { id: "smart-contracts", title: "Smart Contracts" },
        { id: "sdk", title: "SDK Integration" },
        { id: "webhooks", title: "Webhooks" },
      ],
    },
    {
      id: "security",
      title: "Security",
      icon: <Shield className="w-4 h-4" />,
      items: [
        { id: "best-practices", title: "Best Practices" },
        { id: "audits", title: "Security Audits" },
        { id: "reporting", title: "Reporting Issues" },
      ],
    },
  ];

  const contentMap: Record<string, { title: string; content: string[] }> = {
    intro: {
      title: "Introduction to EcoShop",
      content: [
        "EcoShop is the first green e-commerce platform built on Sui Network, combining blockchain and sustainability to create a complete circular economy ecosystem.",
        "With EcoShop, you can:",
        "• Shop for verified eco-friendly products",
        "• Receive ECO Token rewards for every green transaction",
        "• Track your environmental impact through Eco-Score",
        "• Stake ECO tokens to earn passive income",
        "• Participate in community governance",
      ],
    },
    wallet: {
      title: "Connecting Your Wallet",
      content: [
        "To use EcoShop, you need a Sui-compatible wallet. We recommend:",
        "1. Sui Wallet (Official)",
        "2. Slush Wallet (Recommended)",
        "3. Ethos Wallet",
        "",
        "Connection steps:",
        "1. Click the 'Connect Wallet' button in the top right corner",
        "2. Select your wallet provider",
        "3. Approve the connection request in your wallet",
        "4. Done! Your wallet is now connected",
      ],
    },
    "first-purchase": {
      title: "Making Your First Purchase",
      content: [
        "Congratulations on being ready for your first green transaction!",
        "",
        "Step 1: Browse products in the Marketplace",
        "Step 2: Check the product's Eco-Score (higher is better)",
        "Step 3: Click 'EXECUTE' to purchase",
        "Step 4: Confirm the transaction in your wallet",
        "Step 5: Receive ECO Token rewards automatically!",
        "",
        "Note: ECO rewards are calculated based on the product's Eco-Score and CO₂ reduction.",
      ],
    },
    "eco-tokens": {
      title: "Understanding ECO Tokens",
      content: [
        "ECO Token is the native utility token of the EcoShop ecosystem.",
        "",
        "Uses of ECO Token:",
        "• Pay for products with discounts",
        "• Stake to earn rewards",
        "• Governance voting rights",
        "• Access exclusive features",
        "• Boost Eco-Score multiplier",
        "",
        "Token Economics:",
        "• Total Supply: 1,000,000,000 ECO",
        "• Circulating: 250,000,000 ECO",
        "• Contract: 0x...eco (Sui Mainnet)",
      ],
    },
  };

  const currentContent = contentMap[activeSection] || contentMap.intro;

  return (
    <>
      <Helmet>
        <title>Documentation - EcoShop | User Guide & API Reference</title>
        <meta name="description" content="Complete documentation for EcoShop - learn how to use the marketplace, stake tokens, integrate APIs, and more." />
        <link rel="canonical" href="https://ecoshop.sui/docs" />
      </Helmet>

      <div className="min-h-screen bg-black overflow-x-hidden scanlines">
        <MatrixBackground />
        <CyberHeader />
        <CyberMenu />

        <main className="relative z-10 pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto">
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
                <span className="text-primary neon-text">DOCUMENTATION</span>
              </h1>
              <p className="text-muted-foreground font-mono max-w-2xl">
                {">> "}Complete guide to using EcoShop platform, APIs, and smart contracts.
              </p>
            </motion.div>

            {/* Main layout */}
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-1"
              >
                <div
                  className="sticky top-32 p-4 bg-black/80 border border-primary/30"
                  style={{
                    clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                  }}
                >
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-primary/20">
                    <Terminal className="w-4 h-4 text-primary" />
                    <span className="font-mono text-sm text-primary uppercase">Navigation</span>
                  </div>
                  <nav className="space-y-4">
                    {sections.map((section) => (
                      <div key={section.id}>
                        <div className="flex items-center gap-2 mb-2 text-muted-foreground font-mono text-xs uppercase">
                          {section.icon}
                          {section.title}
                        </div>
                        <ul className="space-y-1 ml-6">
                          {section.items.map((item) => (
                            <li key={item.id}>
                              <button
                                onClick={() => setActiveSection(item.id)}
                                className={`w-full text-left px-2 py-1 font-mono text-xs transition-colors ${
                                  activeSection === item.id
                                    ? "text-primary bg-primary/10"
                                    : "text-muted-foreground hover:text-primary"
                                }`}
                              >
                                <ChevronRight className="w-3 h-3 inline mr-1" />
                                {item.title}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </nav>
                </div>
              </motion.aside>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-3"
              >
                <div
                  className="p-8 bg-black/80 border border-primary/30"
                  style={{
                    clipPath: "polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-6">
                    <FileText className="w-5 h-5 text-primary" />
                    <h2 className="text-2xl font-bold text-primary font-mono uppercase">
                      {currentContent.title}
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {currentContent.content.map((paragraph, idx) => (
                      <p key={idx} className="font-mono text-sm text-foreground/80 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* Code example */}
                  <div className="mt-8 p-4 bg-black border border-primary/20">
                    <div className="flex items-center gap-2 mb-3">
                      <Code className="w-4 h-4 text-secondary" />
                      <span className="font-mono text-xs text-secondary">EXAMPLE_CODE</span>
                    </div>
                    <pre className="font-mono text-xs text-primary/80 overflow-x-auto">
{`// Connect to EcoShop
import { EcoShopSDK } from '@ecoshop/sdk';

const sdk = new EcoShopSDK({
  network: 'mainnet',
  apiKey: 'your-api-key'
});

// Get user eco-score
const score = await sdk.getEcoScore(walletAddress);
console.log('Eco Score:', score);`}
                    </pre>
                  </div>

                  {/* Help section */}
                  <div className="mt-8 p-4 border border-secondary/30 bg-secondary/5">
                    <div className="flex items-center gap-2 mb-2">
                      <HelpCircle className="w-4 h-4 text-secondary" />
                      <span className="font-mono text-sm text-secondary">Need Help?</span>
                    </div>
                    <p className="font-mono text-xs text-muted-foreground">
                      Join our Discord community or contact support@ecoshop.sui for assistance.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </main>

        <CyberFooter />
      </div>
    </>
  );
};

export default DocsPage;
