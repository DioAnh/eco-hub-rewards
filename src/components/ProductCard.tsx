import { Leaf, Star, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  image: string;
  name: string;
  brand: string;
  price: string;
  ecoScore: number;
  ecoReward: string;
  rating: number;
}

const ProductCard = ({ image, name, brand, price, ecoScore, ecoReward, rating }: ProductCardProps) => {
  return (
    <div className="group relative bg-card rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
        <Leaf className="w-3 h-3" />
        <span>{ecoScore}</span>
      </div>

      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="p-4">
        <p className="text-xs text-muted-foreground mb-1">{brand}</p>
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{name}</h3>

        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${i < rating ? "text-token fill-token" : "text-muted"}`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">({rating}.0)</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <p className="text-lg font-bold text-foreground">{price}</p>
          <div className="flex items-center gap-1 text-primary">
            <Coins className="w-4 h-4" />
            <span className="text-sm font-medium">+{ecoReward} ECO</span>
          </div>
        </div>

        <Button className="w-full" size="sm">
          Thêm vào giỏ
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
