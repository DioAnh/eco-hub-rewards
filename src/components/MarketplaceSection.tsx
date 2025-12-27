import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";

const MarketplaceSection = () => {
  const products = [
    {
      image: product1,
      name: "Bình Nước Tre Organic Premium",
      brand: "GreenLife Vietnam",
      price: "450.000₫",
      ecoScore: 92,
      ecoReward: "45",
      rating: 5,
    },
    {
      image: product2,
      name: "Túi Vải Cotton Hữu Cơ",
      brand: "EcoViet Startup",
      price: "180.000₫",
      ecoScore: 88,
      ecoReward: "25",
      rating: 4,
    },
    {
      image: product3,
      name: "Sạc Dự Phòng Năng Lượng Mặt Trời",
      brand: "SolarTech Co.",
      price: "890.000₫",
      ecoScore: 95,
      ecoReward: "120",
      rating: 5,
    },
  ];

  return (
    <section id="marketplace" className="py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Sustainable Marketplace
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl">
              Khám phá sản phẩm từ các startup bền vững đã được xác thực Proof of Green, 
              nhận thưởng ECO Token với mỗi đơn hàng.
            </p>
          </div>
          <Button variant="outline" className="mt-6 md:mt-0 gap-2">
            Xem tất cả
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>

        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border border-primary/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Bạn là Merchant bền vững?
              </h3>
              <p className="text-muted-foreground">
                Tham gia Staking Vault và khóa 50% doanh thu trong 2 năm để chứng minh cam kết xanh.
              </p>
            </div>
            <Button size="lg" className="whitespace-nowrap">
              Đăng ký Merchant
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketplaceSection;
