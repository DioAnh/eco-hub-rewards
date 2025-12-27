import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Search, Filter, Grid, List, ShoppingCart, Zap, Leaf, Star } from "lucide-react";
import {
  MatrixBackground,
  CyberHeader,
  CyberMenu,
  MarqueeTicker,
  CyberButton,
  TerminalModal,
} from "@/components/cyberpunk";
import CyberFooter from "@/components/cyberpunk/CyberFooter";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";

const products = [
  { id: 1, name: "Organic Canvas Bag", price: 189000, ecoTokens: 45, co2Saved: 2.3, rating: 4.8, buyers: 1247, verified: true, image: product1, category: "bags" },
  { id: 2, name: "Bamboo Straw Set", price: 89000, ecoTokens: 25, co2Saved: 0.8, rating: 4.5, buyers: 892, verified: true, image: product2, category: "kitchen" },
  { id: 3, name: "Steel Water Bottle", price: 299000, ecoTokens: 60, co2Saved: 4.2, rating: 4.9, buyers: 2103, verified: true, image: product3, category: "bottles" },
  { id: 4, name: "Wheat Lunch Box", price: 159000, ecoTokens: 35, co2Saved: 1.5, rating: 4.6, buyers: 567, verified: true, image: product1, category: "kitchen" },
  { id: 5, name: "Bamboo Toothbrush", price: 45000, ecoTokens: 15, co2Saved: 0.5, rating: 4.4, buyers: 3421, verified: true, image: product2, category: "bathroom" },
  { id: 6, name: "Organic Cotton Towel", price: 249000, ecoTokens: 50, co2Saved: 3.1, rating: 4.7, buyers: 432, verified: true, image: product3, category: "bathroom" },
  { id: 7, name: "Hemp Backpack", price: 459000, ecoTokens: 85, co2Saved: 5.2, rating: 4.9, buyers: 789, verified: true, image: product1, category: "bags" },
  { id: 8, name: "Cork Wallet", price: 199000, ecoTokens: 40, co2Saved: 1.8, rating: 4.3, buyers: 654, verified: false, image: product2, category: "accessories" },
  { id: 9, name: "Recycled Notebook", price: 79000, ecoTokens: 20, co2Saved: 0.6, rating: 4.2, buyers: 1876, verified: true, image: product3, category: "office" },
  { id: 10, name: "Solar Power Bank", price: 589000, ecoTokens: 100, co2Saved: 8.5, rating: 4.8, buyers: 1234, verified: true, image: product1, category: "electronics" },
  { id: 11, name: "Beeswax Food Wrap", price: 129000, ecoTokens: 30, co2Saved: 1.2, rating: 4.6, buyers: 987, verified: true, image: product2, category: "kitchen" },
  { id: 12, name: "Coconut Bowl Set", price: 169000, ecoTokens: 38, co2Saved: 1.4, rating: 4.5, buyers: 543, verified: true, image: product3, category: "kitchen" },
];

const categories = [
  { id: "all", label: "ALL" },
  { id: "bags", label: "BAGS" },
  { id: "kitchen", label: "KITCHEN" },
  { id: "bathroom", label: "BATHROOM" },
  { id: "bottles", label: "BOTTLES" },
  { id: "accessories", label: "ACCESSORIES" },
  { id: "electronics", label: "ELECTRONICS" },
  { id: "office", label: "OFFICE" },
];

const Marketplace = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleBuyWithVND = (product: typeof products[0]) => {
    console.log("Buy with VND:", product);
    setSelectedProduct(null);
  };

  const handleBuyWithECO = (product: typeof products[0]) => {
    console.log("Buy with ECO:", product);
    setSelectedProduct(null);
  };

  return (
    <>
      <Helmet>
        <title>Marketplace - EcoShop | Sustainable Products on Sui Network</title>
        <meta name="description" content="Browse and purchase eco-friendly products. Earn ECO tokens with every purchase on Sui blockchain." />
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
              className="text-center mb-12"
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
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-primary">MARKETPLACE::ACTIVE</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold font-mono uppercase tracking-tight mb-3">
                <span className="text-foreground">Eco</span>{" "}
                <span className="text-primary neon-text">Marketplace</span>
              </h1>
              <p className="text-muted-foreground font-mono text-sm max-w-xl mx-auto">
                {">> "} {products.length} sustainable products available. Earn ECO tokens with every purchase.
              </p>
            </motion.div>

            {/* Filters */}
            <div className="mb-8 space-y-4">
              {/* Search and view toggle */}
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div 
                  className="flex-1 max-w-md flex items-center gap-2 px-4 py-2"
                  style={{
                    background: 'hsl(0 0% 0% / 0.8)',
                    border: '1px solid hsl(120 100% 50% / 0.3)',
                  }}
                >
                  <Search className="w-4 h-4 text-primary" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 transition-colors ${viewMode === "grid" ? "text-primary" : "text-muted-foreground"}`}
                    style={{ border: '1px solid hsl(120 100% 50% / 0.3)' }}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 transition-colors ${viewMode === "list" ? "text-primary" : "text-muted-foreground"}`}
                    style={{ border: '1px solid hsl(120 100% 50% / 0.3)' }}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Category filters */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 font-mono text-xs transition-all ${
                      selectedCategory === cat.id
                        ? "text-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                    style={{
                      background: selectedCategory === cat.id ? 'hsl(120 100% 50% / 0.1)' : 'transparent',
                      border: `1px solid ${selectedCategory === cat.id ? 'hsl(120 100% 50% / 0.5)' : 'hsl(120 100% 50% / 0.2)'}`,
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Products grid */}
            <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="group cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedProduct(product)}
                  style={{
                    background: 'linear-gradient(180deg, hsl(180 10% 5%) 0%, hsl(0 0% 0%) 100%)',
                    border: '1px solid hsl(120 100% 50% / 0.2)',
                  }}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      style={{ filter: 'grayscale(30%) brightness(0.9)' }}
                    />
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: 'hsl(120 100% 50% / 0.1)' }}
                    />
                    
                    {/* Eco badge */}
                    <div 
                      className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 font-mono text-[10px]"
                      style={{
                        background: 'hsl(0 0% 0% / 0.9)',
                        border: '1px solid hsl(120 100% 50% / 0.5)',
                      }}
                    >
                      <Leaf className="w-3 h-3 text-primary" />
                      <span className="text-primary">{product.co2Saved}kg CO₂</span>
                    </div>

                    {/* Rating */}
                    <div 
                      className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 font-mono text-[10px]"
                      style={{
                        background: 'hsl(0 0% 0% / 0.9)',
                        border: '1px solid hsl(45 100% 50% / 0.5)',
                      }}
                    >
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-yellow-400">{product.rating}</span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-mono text-sm text-primary uppercase truncate mb-2">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-lg text-foreground">
                        {product.price.toLocaleString()}đ
                      </span>
                      <div className="flex items-center gap-1 text-secondary font-mono text-xs">
                        <Zap className="w-3 h-3" />
                        +{product.ecoTokens} ECO
                      </div>
                    </div>

                    <CyberButton 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                      }}
                      className="w-full justify-center"
                    >
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      VIEW DETAILS
                    </CyberButton>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="font-mono text-muted-foreground">
                  {">> "} No products found matching your criteria.
                </p>
              </div>
            )}
          </div>
        </main>

        <CyberFooter />

        {/* Product Modal */}
        <TerminalModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onBuyWithVND={handleBuyWithVND}
          onBuyWithECO={handleBuyWithECO}
        />
      </div>
    </>
  );
};

export default Marketplace;