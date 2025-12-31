import { useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Filter, Search, Grid, List, Leaf, Recycle, Zap } from "lucide-react";
import { MatrixBackground, CyberHeader, CyberButton } from "@/components/cyberpunk";

// Import product images
import bambooBottle from "@/assets/products/bamboo-water-bottle.jpg";
import recycledBackpack from "@/assets/products/recycled-backpack.jpg";
import organicTee from "@/assets/products/organic-cotton-tee.jpg";
import solarPowerBank from "@/assets/products/solar-power-bank.jpg";
import hempWallet from "@/assets/products/hemp-wallet.jpg";
import upcycledSneakers from "@/assets/products/upcycled-sneakers.jpg";

const MarketplacePage = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeFilter, setActiveFilter] = useState("all");

  const categories = [
    { id: "all", label: "ALL_ITEMS", count: 156 },
    { id: "eco", label: "ECO_CERTIFIED", count: 89 },
    { id: "recycled", label: "RECYCLED", count: 42 },
    { id: "organic", label: "ORGANIC", count: 25 },
  ];

  const products = [
    {
      id: 1,
      name: "Bamboo Water Bottle",
      price: "25 ECO",
      ecoScore: 95,
      category: "eco",
      image: bambooBottle,
      badge: "ECO_CERTIFIED",
    },
    {
      id: 2,
      name: "Recycled Backpack",
      price: "120 ECO",
      ecoScore: 88,
      category: "recycled",
      image: recycledBackpack,
      badge: "RECYCLED",
    },
    {
      id: 3,
      name: "Organic Cotton Tee",
      price: "45 ECO",
      ecoScore: 92,
      category: "organic",
      image: organicTee,
      badge: "ORGANIC",
    },
    {
      id: 4,
      name: "Solar Power Bank",
      price: "85 ECO",
      ecoScore: 96,
      category: "eco",
      image: solarPowerBank,
      badge: "ECO_CERTIFIED",
    },
    {
      id: 5,
      name: "Hemp Wallet",
      price: "35 ECO",
      ecoScore: 90,
      category: "organic",
      image: hempWallet,
      badge: "ORGANIC",
    },
    {
      id: 6,
      name: "Upcycled Sneakers",
      price: "150 ECO",
      ecoScore: 85,
      category: "recycled",
      image: upcycledSneakers,
      badge: "RECYCLED",
    },
  ];

  const filteredProducts = activeFilter === "all" 
    ? products 
    : products.filter(p => p.category === activeFilter);

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case "ECO_CERTIFIED": return <Leaf className="w-3 h-3" />;
      case "RECYCLED": return <Recycle className="w-3 h-3" />;
      case "ORGANIC": return <Zap className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Marketplace - EcoShop</title>
        <meta name="description" content="Shop eco-friendly products and earn ECO tokens on EcoShop marketplace" />
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
              className="mb-8"
            >
              <h1 className="text-4xl md:text-6xl font-bold font-mono uppercase tracking-tight mb-4">
                <span className="text-primary neon-text">MARKETPLACE</span>
              </h1>
              <p className="text-muted-foreground font-mono max-w-2xl">
                {">> "}Browse eco-friendly products. Pay with ECO tokens and earn rewards for sustainable purchases.
              </p>
            </motion.div>

            {/* Search and filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center gap-4 mb-8"
            >
              {/* Search */}
              <div className="flex-1 min-w-[200px] relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="SEARCH_PRODUCTS..."
                  className="w-full pl-10 pr-4 py-3 bg-black/80 border border-primary/30 focus:border-primary outline-none font-mono text-sm text-foreground placeholder:text-muted-foreground"
                  style={{
                    clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
                  }}
                />
              </div>

              {/* View toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 border ${viewMode === "grid" ? "border-primary bg-primary/10" : "border-primary/30"} transition-colors`}
                >
                  <Grid className="w-4 h-4 text-primary" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 border ${viewMode === "list" ? "border-primary bg-primary/10" : "border-primary/30"} transition-colors`}
                >
                  <List className="w-4 h-4 text-primary" />
                </button>
              </div>
            </motion.div>

            {/* Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-3 mb-8"
            >
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveFilter(cat.id)}
                  className={`px-4 py-2 border font-mono text-xs uppercase tracking-wider transition-all ${
                    activeFilter === cat.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-primary/30 text-muted-foreground hover:border-primary/60"
                  }`}
                  style={{
                    clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                  }}
                >
                  {cat.label} ({cat.count})
                </button>
              ))}
            </motion.div>

            {/* Products grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className={`group bg-black/80 border border-primary/30 hover:border-primary/60 transition-all cursor-pointer ${
                    viewMode === "list" ? "flex items-center gap-6 p-4" : "p-0"
                  }`}
                  style={{
                    clipPath: viewMode === "grid" 
                      ? "polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)"
                      : "none",
                  }}
                >
                  {/* Image */}
                  <div className={`relative overflow-hidden ${viewMode === "grid" ? "aspect-square" : "w-24 h-24 flex-shrink-0"}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {/* Badge */}
                    <div className="absolute top-2 left-2 px-2 py-1 bg-primary/90 text-black font-mono text-xs flex items-center gap-1">
                      {getBadgeIcon(product.badge)}
                      {product.badge}
                    </div>
                  </div>

                  {/* Info */}
                  <div className={viewMode === "grid" ? "p-4" : "flex-1"}>
                    <h3 className="text-lg font-bold text-foreground font-mono mb-2">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xl font-bold text-primary font-mono neon-text">{product.price}</div>
                        <div className="text-xs text-muted-foreground font-mono">ECO_SCORE: {product.ecoScore}</div>
                      </div>
                      {viewMode === "list" && (
                        <CyberButton variant="primary" className="text-xs">
                          ADD_TO_CART
                        </CyberButton>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
};

export default MarketplacePage;
