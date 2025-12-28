import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { networkConfig } from "@/lib/sui-config";
import "@mysten/dapp-kit/dist/index.css";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import EcoScorePage from "./pages/EcoScorePage";
import StakingPage from "./pages/StakingPage";
import WhitepaperPage from "./pages/WhitepaperPage";
import MarketplacePage from "./pages/MarketplacePage";
import BlogPage from "./pages/BlogPage";
import DocsPage from "./pages/DocsPage";
import TermsPage from "./pages/TermsPage";
import ListingGuidePage from "./pages/ListingGuidePage";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="mainnet">
        <WalletProvider autoConnect>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/eco-score" element={<EcoScorePage />} />
                <Route path="/staking" element={<StakingPage />} />
                <Route path="/whitepaper" element={<WhitepaperPage />} />
                <Route path="/marketplace" element={<MarketplacePage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/docs" element={<DocsPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/listing-guide" element={<ListingGuidePage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
