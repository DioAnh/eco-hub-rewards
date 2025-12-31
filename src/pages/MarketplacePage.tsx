import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, Search, Grid, List, Leaf, Recycle, Zap, 
  Wallet, ShoppingCart, X, Ticket, Gift, Calendar, Check
} from "lucide-react";
import { MatrixBackground, CyberHeader, CyberButton } from "@/components/cyberpunk";
import { useWalletDemo } from "@/hooks/useWalletDemo";
import { toast } from "sonner";

// Import product images
import bambooBottle from "@/assets/products/bamboo-water-bottle.jpg";
import recycledBackpack from "@/assets/products/recycled-backpack.jpg";
import organicTee from "@/assets/products/organic-cotton-tee.jpg";
import solarPowerBank from "@/assets/products/solar-power-bank.jpg";
import hempWallet from "@/assets/products/hemp-wallet.jpg";
import upcycledSneakers from "@/assets/products/upcycled-sneakers.jpg";
import steelLunchBox from "@/assets/products/steel-lunch-box.jpg";
import bambooToothbrush from "@/assets/products/bamboo-toothbrush.jpg";
import beeswaxWraps from "@/assets/products/beeswax-wraps.jpg";
import corkYogaMat from "@/assets/products/cork-yoga-mat.jpg";
import cottonProduceBag from "@/assets/products/cotton-produce-bag.jpg";
import bambooKeyboard from "@/assets/products/bamboo-keyboard.jpg";
import coconutBowl from "@/assets/products/coconut-bowl.jpg";
import recycledNotebook from "@/assets/products/recycled-notebook.jpg";
import soyCandle from "@/assets/products/soy-candle.jpg";
import steelStraws from "@/assets/products/steel-straws.jpg";
import loofahScrubber from "@/assets/products/loofah-scrubber.jpg";
import bioPhoneCase from "@/assets/products/bio-phone-case.jpg";
import ecoVoucher from "@/assets/products/eco-voucher.jpg";
import eventTicket from "@/assets/products/event-ticket.jpg";
import workshopTicket from "@/assets/products/workshop-ticket.jpg";
import cafeVoucher from "@/assets/products/cafe-voucher.jpg";

interface Product {
  id: number;
  name: string;
  price: number;
  ecoScore: number;
  category: string;
  image: string;
  badge: string;
  description: string;
}

const MarketplacePage = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { wallet, connect, disconnect, purchase } = useWalletDemo();

  const categories = [
    { id: "all", label: "ALL_ITEMS", count: 22, icon: <Grid className="w-3 h-3" /> },
    { id: "eco", label: "ECO_CERTIFIED", count: 6, icon: <Leaf className="w-3 h-3" /> },
    { id: "recycled", label: "RECYCLED", count: 6, icon: <Recycle className="w-3 h-3" /> },
    { id: "organic", label: "ORGANIC", count: 6, icon: <Zap className="w-3 h-3" /> },
    { id: "voucher", label: "VOUCHERS", count: 2, icon: <Gift className="w-3 h-3" /> },
    { id: "event", label: "EVENTS", count: 2, icon: <Calendar className="w-3 h-3" /> },
  ];

  const products: Product[] = [
    // Eco Certified Products
    { id: 1, name: "Bamboo Water Bottle", price: 25, ecoScore: 95, category: "eco", image: bambooBottle, badge: "ECO_CERTIFIED", description: "Sustainable bamboo water bottle, plastic-free and naturally antibacterial." },
    { id: 4, name: "Solar Power Bank", price: 85, ecoScore: 96, category: "eco", image: solarPowerBank, badge: "ECO_CERTIFIED", description: "Charge your devices with clean solar energy, anywhere you go." },
    { id: 7, name: "Steel Lunch Box", price: 30, ecoScore: 94, category: "eco", image: steelLunchBox, badge: "ECO_CERTIFIED", description: "Durable stainless steel lunch container, keeps food fresh for hours." },
    { id: 10, name: "Cork Yoga Mat", price: 65, ecoScore: 93, category: "eco", image: corkYogaMat, badge: "ECO_CERTIFIED", description: "Natural cork surface provides excellent grip and antibacterial properties." },
    { id: 13, name: "Bamboo Keyboard", price: 75, ecoScore: 91, category: "eco", image: bambooKeyboard, badge: "ECO_CERTIFIED", description: "Wireless bamboo keyboard, sustainable tech for your workspace." },
    { id: 16, name: "Bio Phone Case", price: 20, ecoScore: 89, category: "eco", image: bioPhoneCase, badge: "ECO_CERTIFIED", description: "100% biodegradable phone case, returns to nature in 2 years." },
    
    // Recycled Products
    { id: 2, name: "Recycled Backpack", price: 120, ecoScore: 88, category: "recycled", image: recycledBackpack, badge: "RECYCLED", description: "Made from 20 recycled plastic bottles, durable and water-resistant." },
    { id: 6, name: "Upcycled Sneakers", price: 150, ecoScore: 85, category: "recycled", image: upcycledSneakers, badge: "RECYCLED", description: "Stylish sneakers crafted from recycled ocean plastics and rubber." },
    { id: 8, name: "Beeswax Wraps Set", price: 18, ecoScore: 92, category: "recycled", image: beeswaxWraps, badge: "RECYCLED", description: "Reusable food wraps, replace single-use plastic wrap forever." },
    { id: 11, name: "Cotton Produce Bags", price: 12, ecoScore: 90, category: "recycled", image: cottonProduceBag, badge: "RECYCLED", description: "Set of 5 mesh bags for plastic-free grocery shopping." },
    { id: 14, name: "Recycled Notebook", price: 8, ecoScore: 87, category: "recycled", image: recycledNotebook, badge: "RECYCLED", description: "100% recycled paper notebook, perfect for eco-conscious notes." },
    { id: 17, name: "Steel Straw Set", price: 10, ecoScore: 93, category: "recycled", image: steelStraws, badge: "RECYCLED", description: "Reusable stainless steel straws with cleaning brush and pouch." },
    
    // Organic Products
    { id: 3, name: "Organic Cotton Tee", price: 45, ecoScore: 92, category: "organic", image: organicTee, badge: "ORGANIC", description: "GOTS certified organic cotton, soft and sustainably produced." },
    { id: 5, name: "Hemp Wallet", price: 35, ecoScore: 90, category: "organic", image: hempWallet, badge: "ORGANIC", description: "Handcrafted hemp wallet, naturally durable and eco-friendly." },
    { id: 9, name: "Bamboo Toothbrush", price: 5, ecoScore: 95, category: "organic", image: bambooToothbrush, badge: "ORGANIC", description: "Biodegradable bamboo handle with plant-based bristles." },
    { id: 12, name: "Coconut Bowl Set", price: 22, ecoScore: 91, category: "organic", image: coconutBowl, badge: "ORGANIC", description: "Handmade from reclaimed coconut shells, each piece is unique." },
    { id: 15, name: "Soy Wax Candle", price: 15, ecoScore: 88, category: "organic", image: soyCandle, badge: "ORGANIC", description: "Natural soy wax with essential oils, clean burning and long-lasting." },
    { id: 18, name: "Loofah Scrubber", price: 6, ecoScore: 94, category: "organic", image: loofahScrubber, badge: "ORGANIC", description: "Natural plant-based body scrubber, fully compostable." },
    
    // Vouchers
    { id: 19, name: "EcoShop Gift Card", price: 50, ecoScore: 100, category: "voucher", image: ecoVoucher, badge: "VOUCHER", description: "Give the gift of sustainability. Redeemable for any eco-product." },
    { id: 20, name: "GreenCafe Voucher", price: 15, ecoScore: 100, category: "voucher", image: cafeVoucher, badge: "VOUCHER", description: "Enjoy organic coffee at partner sustainable cafes." },
    
    // Event Tickets
    { id: 21, name: "VIP EcoSummit Pass", price: 80, ecoScore: 100, category: "event", image: eventTicket, badge: "EVENT", description: "Exclusive access to the annual EcoShop Summit with brand founders." },
    { id: 22, name: "Sustainability Workshop", price: 25, ecoScore: 100, category: "event", image: workshopTicket, badge: "EVENT", description: "Learn zero-waste living from expert instructors." },
  ];

  const filteredProducts = activeFilter === "all" 
    ? products 
    : products.filter(p => p.category === activeFilter);

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case "ECO_CERTIFIED": return <Leaf className="w-3 h-3" />;
      case "RECYCLED": return <Recycle className="w-3 h-3" />;
      case "ORGANIC": return <Zap className="w-3 h-3" />;
      case "VOUCHER": return <Gift className="w-3 h-3" />;
      case "EVENT": return <Ticket className="w-3 h-3" />;
      default: return null;
    }
  };

  const handleBuyProduct = (product: Product) => {
    if (!wallet.isConnected) {
      toast.error("Please connect your wallet first!");
      return;
    }

    if (wallet.balance < product.price) {
      toast.error(`Insufficient balance! You need ${product.price} ECO but have ${wallet.balance} ECO.`);
      return;
    }

    const success = purchase(product.price, product.name);
    if (success) {
      toast.success(
        <div className="flex flex-col">
          <span className="font-bold">Purchase Successful!</span>
          <span className="text-sm">You bought {product.name} for {product.price} ECO</span>
        </div>
      );
      setSelectedProduct(null);
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

            {/* Page header with wallet */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8"
            >
              <div>
                <h1 className="text-4xl md:text-6xl font-bold font-mono uppercase tracking-tight mb-4">
                  <span className="text-primary neon-text">MARKETPLACE</span>
                </h1>
                <p className="text-muted-foreground font-mono max-w-2xl">
                  {">> "}Browse eco-friendly products, vouchers & event tickets. Pay with ECO tokens.
                </p>
              </div>

              {/* Wallet Panel */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex-shrink-0"
              >
                {wallet.isConnected ? (
                  <div
                    className="p-4 min-w-[280px]"
                    style={{
                      background: "linear-gradient(180deg, hsl(120 20% 8%) 0%, hsl(0 0% 4%) 100%)",
                      border: "1px solid hsl(120 100% 50% / 0.4)",
                      clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-primary" />
                        <span className="font-mono text-xs text-primary">WALLET_CONNECTED</span>
                      </div>
                      <button
                        onClick={disconnect}
                        className="text-xs font-mono text-muted-foreground hover:text-red-400 transition-colors"
                      >
                        DISCONNECT
                      </button>
                    </div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-3xl font-bold text-primary font-mono neon-text">
                        {wallet.balance}
                      </span>
                      <span className="text-sm text-secondary font-mono">ECO</span>
                    </div>
                    <div className="text-xs font-mono text-muted-foreground">
                      {wallet.address}
                    </div>
                  </div>
                ) : (
                  <CyberButton onClick={connect} variant="primary">
                    <Wallet className="w-4 h-4 mr-2" />
                    CONNECT_WALLET
                  </CyberButton>
                )}
              </motion.div>
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
                  className={`px-4 py-2 border font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
                    activeFilter === cat.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-primary/30 text-muted-foreground hover:border-primary/60"
                  }`}
                  style={{
                    clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                  }}
                >
                  {cat.icon}
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
                  transition={{ delay: 0.5 + index * 0.03 }}
                  className={`group bg-black/80 border border-primary/30 hover:border-primary/60 transition-all cursor-pointer ${
                    viewMode === "list" ? "flex items-center gap-6 p-4" : "p-0"
                  }`}
                  style={{
                    clipPath: viewMode === "grid" 
                      ? "polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)"
                      : "none",
                  }}
                  onClick={() => setSelectedProduct(product)}
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
                        <div className="text-xl font-bold text-primary font-mono neon-text">{product.price} ECO</div>
                        <div className="text-xs text-muted-foreground font-mono">ECO_SCORE: {product.ecoScore}</div>
                      </div>
                      {viewMode === "list" && (
                        <CyberButton 
                          variant="primary" 
                          className="text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBuyProduct(product);
                          }}
                        >
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          BUY
                        </CyberButton>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </main>

        {/* Product Detail Modal */}
        <AnimatePresence>
          {selectedProduct && (
            <motion.div
              className="fixed inset-0 z-[100] flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Backdrop */}
              <motion.div
                className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                onClick={() => setSelectedProduct(null)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />

              {/* Modal */}
              <motion.div
                className="relative w-full max-w-lg overflow-hidden"
                style={{
                  background: "linear-gradient(180deg, hsl(180 10% 5%) 0%, hsl(0 0% 0%) 100%)",
                  border: "1px solid hsl(120 100% 50% / 0.5)",
                  boxShadow: "0 0 50px hsl(120 100% 50% / 0.2)",
                  clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
                }}
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
              >
                {/* Close button */}
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 z-10 p-2 hover:bg-primary/20 rounded transition-colors"
                >
                  <X className="w-5 h-5 text-primary" />
                </button>

                {/* Image */}
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-2 py-1 bg-primary/90 text-black font-mono text-xs flex items-center gap-1">
                    {getBadgeIcon(selectedProduct.badge)}
                    {selectedProduct.badge}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold font-mono text-foreground mb-2">
                    {selectedProduct.name}
                  </h2>
                  <p className="text-muted-foreground text-sm mb-4">
                    {selectedProduct.description}
                  </p>

                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-3xl font-bold text-primary font-mono neon-text">
                        {selectedProduct.price} ECO
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        ECO_SCORE: {selectedProduct.ecoScore}
                      </div>
                    </div>
                    {wallet.isConnected && (
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground font-mono">YOUR_BALANCE</div>
                        <div className={`text-lg font-bold font-mono ${wallet.balance >= selectedProduct.price ? "text-primary" : "text-red-400"}`}>
                          {wallet.balance} ECO
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {wallet.isConnected ? (
                    <CyberButton
                      variant="primary"
                      className="w-full justify-center"
                      onClick={() => handleBuyProduct(selectedProduct)}
                      disabled={wallet.balance < selectedProduct.price}
                    >
                      {wallet.balance >= selectedProduct.price ? (
                        <>
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          BUY FOR {selectedProduct.price} ECO
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4 mr-2" />
                          INSUFFICIENT BALANCE
                        </>
                      )}
                    </CyberButton>
                  ) : (
                    <CyberButton
                      variant="primary"
                      className="w-full justify-center"
                      onClick={connect}
                    >
                      <Wallet className="w-4 h-4 mr-2" />
                      CONNECT WALLET TO BUY
                    </CyberButton>
                  )}
                </div>

                {/* Decorative corners */}
                <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-primary" />
                <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-primary" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-primary" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-primary" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default MarketplacePage;
