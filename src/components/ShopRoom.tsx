
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Leaf, Heart, BadgePercent, StarIcon } from "lucide-react";
import { motion } from "framer-motion";
import { audioService } from "@/utils/audioService";

// Define shop categories
const shopCategories = [
  {
    id: "hormone_helpers",
    name: "Hormone Helpers",
    icon: "🌿",
    color: "bg-green-100 text-green-800",
    iconColor: "text-green-600"
  },
  {
    id: "period_underwear",
    name: "Period Underwear",
    icon: "🩲",
    color: "bg-pink-100 text-pink-800",
    iconColor: "text-pink-600"
  },
  {
    id: "cycle_self_care",
    name: "Cycle Self-Care",
    icon: "💆‍♀️",
    color: "bg-purple-100 text-purple-800",
    iconColor: "text-purple-600"
  },
  {
    id: "sleep_stress",
    name: "Sleep & Stress",
    icon: "🛏️",
    color: "bg-blue-100 text-blue-800",
    iconColor: "text-blue-600"
  },
  {
    id: "eco_essentials",
    name: "Eco Essentials",
    icon: "💧",
    color: "bg-teal-100 text-teal-800",
    iconColor: "text-teal-600"
  }
];

// Phase-specific products
const phaseProducts = {
  menstruation: ["flo_capsules", "thinx_shorts", "saalt_cup", "de_lune_mist"],
  follicular: ["ritual_vitamin", "moon_juice", "opositiv_oil", "daye_tampon"],
  ovulatory: ["rae_drops", "ruby_period_underwear", "salt_soak", "ritual_sleep"],
  luteal: ["flo_gummies", "de_lune_oil", "moon_juice_dust", "thinx_sleepwear"]
};

// Product database
const products = {
  flo_capsules: {
    id: "flo_capsules",
    name: "FLO PMS Capsules",
    description: "PMS relief with cycle-synced dosing",
    price: 39,
    rating: 4.8,
    reviews: 230,
    category: "hormone_helpers",
    phase: "menstruation",
    image: "/lovable-uploads/c5a3a3fe-1f7c-43fd-af31-47b307feb425.png",
    community: "92% of Uteroo users reported reduced bloating!"
  },
  thinx_shorts: {
    id: "thinx_shorts",
    name: "Thinx Sleep Shorts",
    description: "Ultra-absorbent period shorts for overnight protection",
    price: 35,
    rating: 4.6,
    reviews: 180,
    category: "period_underwear",
    phase: "menstruation",
    image: "/lovable-uploads/79e01f75-20fb-4814-a2d3-219a420a385b.png",
    community: "88% of users slept better with these!"
  },
  saalt_cup: {
    id: "saalt_cup",
    name: "Saalt Cup",
    description: "Eco-friendly menstrual cup for heavy flow days",
    price: 29,
    rating: 4.7,
    reviews: 320,
    category: "eco_essentials",
    phase: "menstruation",
    image: "/lovable-uploads/861f1be0-201e-4269-be4e-3b74dbb8e136.png",
    community: "Saves 240 tampons per year on average!"
  },
  de_lune_mist: {
    id: "de_lune_mist",
    name: "De Lune Cramp Spray",
    description: "Aromatherapy spray for instant cramp relief",
    price: 28,
    rating: 4.5,
    reviews: 156,
    category: "cycle_self_care",
    phase: "menstruation",
    image: "/lovable-uploads/84ff2a58-b513-46b4-8065-c5d7b219f365.png",
    community: "78% felt relief within 5 minutes of application"
  },
  ritual_vitamin: {
    id: "ritual_vitamin",
    name: "Ritual Multivitamin",
    description: "Essential nutrients for hormonal balance",
    price: 32,
    rating: 4.9,
    reviews: 450,
    category: "hormone_helpers",
    phase: "follicular",
    image: "/lovable-uploads/0d952487-7b39-49f2-b2d5-7a34cfcd37da.png",
    community: "91% reported more energy during follicular phase"
  },
  moon_juice: {
    id: "moon_juice",
    name: "Moon Juice SuperYou",
    description: "Adaptogenic blend for stress & energy",
    price: 49,
    rating: 4.7,
    reviews: 270,
    category: "hormone_helpers",
    phase: "follicular",
    image: "/lovable-uploads/c00b6791-8007-435f-a0fd-63104a0d898b.png",
    community: "Reduces cortisol by 24% according to brand studies"
  },
  opositiv_oil: {
    id: "opositiv_oil",
    name: "Opositiv Massage Oil",
    description: "Hormone-balancing essential oil blend",
    price: 24,
    rating: 4.4,
    reviews: 135,
    category: "cycle_self_care",
    phase: "follicular",
    image: "/lovable-uploads/db737ae2-ab52-4d61-af92-95a81616243d.png",
    community: "85% of users reported enhanced mood"
  },
  daye_tampon: {
    id: "daye_tampon",
    name: "Daye CBD Tampons",
    description: "CBD-infused organic tampons for pain relief",
    price: 16,
    rating: 4.6,
    reviews: 198,
    category: "eco_essentials",
    phase: "follicular",
    image: "/lovable-uploads/8e841183-dbb4-442b-a052-1e662e6b5e62.png",
    community: "76% experienced reduced cramps vs. regular tampons"
  },
  rae_drops: {
    id: "rae_drops",
    name: "Rae Wellness Drops",
    description: "Hormone balance liquid supplement",
    price: 14,
    rating: 4.3,
    reviews: 110,
    category: "hormone_helpers", 
    phase: "ovulatory",
    image: "/lovable-uploads/959696ca-9468-41f5-92f4-34af0b40294b.png",
    community: "Users reported 62% less bloating during ovulation"
  },
  ruby_period_underwear: {
    id: "ruby_period_underwear",
    name: "Ruby Love Boyshorts",
    description: "Active period underwear with leak protection",
    price: 32,
    rating: 4.5,
    reviews: 175,
    category: "period_underwear",
    phase: "ovulatory",
    image: "/lovable-uploads/3f7be505-d8c4-43e8-b44e-92332022c3f1.png",
    community: "Perfect for active days - 94% leak-free workouts"
  },
  salt_soak: {
    id: "salt_soak",
    name: "Mineral Salt Soak",
    description: "Magnesium-rich bath soak for muscle tension",
    price: 18,
    rating: 4.8,
    reviews: 220,
    category: "cycle_self_care",
    phase: "ovulatory",
    image: "/lovable-uploads/8a96a5ad-54d1-431d-816c-aaf25e1a3a99.png",
    community: "89% reported improved sleep after evening bath"
  },
  ritual_sleep: {
    id: "ritual_sleep",
    name: "Ritual Sleep Blend",
    description: "Hormone-friendly sleep supplement",
    price: 30,
    rating: 4.7,
    reviews: 190,
    category: "sleep_stress",
    phase: "ovulatory",
    image: "/lovable-uploads/de0368a0-d48f-46c5-99c6-fec67d055986.png",
    community: "Fall asleep 15 minutes faster on average"
  },
  flo_gummies: {
    id: "flo_gummies",
    name: "FLO PMS Gummies",
    description: "Chewable supplements for PMS symptoms",
    price: 30,
    rating: 4.6,
    reviews: 210,
    category: "hormone_helpers",
    phase: "luteal",
    image: "/lovable-uploads/c5a3a3fe-1f7c-43fd-af31-47b307feb425.png",
    community: "83% experienced reduced mood swings"
  },
  de_lune_oil: {
    id: "de_lune_oil",
    name: "De Lune Mood Oil",
    description: "Aromatherapy roll-on for emotional balance",
    price: 22,
    rating: 4.5,
    reviews: 145,
    category: "cycle_self_care",
    phase: "luteal",
    image: "/lovable-uploads/d2c58694-d998-412e-98ea-f07e05603033.png",
    community: "72% of users reported calmer mood within minutes"
  },
  moon_juice_dust: {
    id: "moon_juice_dust",
    name: "Moon Juice Spirit Dust",
    description: "Adaptogenic blend for stress resilience",
    price: 38,
    rating: 4.4,
    reviews: 165,
    category: "sleep_stress",
    phase: "luteal",
    image: "/lovable-uploads/c00b6791-8007-435f-a0fd-63104a0d898b.png",
    community: "Perfect for the luteal phase - 78% felt calmer"
  },
  thinx_sleepwear: {
    id: "thinx_sleepwear",
    name: "Thinx Sleep Set",
    description: "Period-proof pajama shorts & top set",
    price: 65,
    rating: 4.9,
    reviews: 120,
    category: "period_underwear",
    phase: "luteal",
    image: "/lovable-uploads/79e01f75-20fb-4814-a2d3-219a420a385b.png",
    community: "95% said this improved their pre-period sleep"
  }
};

interface ShopRoomProps {
  currentPhase: "menstruation" | "follicular" | "ovulatory" | "luteal";
  stats: {
    coins: number;
    hearts: number;
  };
  onPurchase: (price: number, productName: string, type: string) => void;
}

export const ShopRoom = ({ currentPhase, stats, onPurchase }: ShopRoomProps) => {
  const [activeCategory, setActiveCategory] = useState(shopCategories[0].id);
  const [flippedCard, setFlippedCard] = useState<string | null>(null);
  const [cart, setCart] = useState<string[]>([]);
  const { toast } = useToast();

  const handleCategoryClick = (categoryId: string) => {
    audioService.play('click');
    setActiveCategory(categoryId);
    setFlippedCard(null);
  };

  const handleCardFlip = (productId: string) => {
    audioService.play('click');
    setFlippedCard(flippedCard === productId ? null : productId);
  };

  const handleAddToCart = (product: any) => {
    if (stats.coins < product.price) {
      audioService.play('click'); // Error sound
      toast({
        title: "Not enough coins!",
        description: `You need ${product.price} coins to buy ${product.name}`,
        variant: "destructive",
      });
      return;
    }

    // Add to cart
    setCart([...cart, product.id]);
    
    // Play success sound
    audioService.play('bonus');
    
    // Update stats through callback
    onPurchase(product.price, product.name, product.category);
    
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your collection!`,
    });
  };

  // Get products filtered by active category and phase relevance
  const filteredProducts = Object.values(products).filter((product: any) => {
    if (activeCategory === "all") return true;
    return product.category === activeCategory;
  });

  // Sort products to prioritize phase-relevant items
  const sortedProducts = [...filteredProducts].sort((a: any, b: any) => {
    // Prioritize products that match the current phase
    if (a.phase === currentPhase && b.phase !== currentPhase) return -1;
    if (a.phase !== currentPhase && b.phase === currentPhase) return 1;
    return 0;
  });

  // Function to render rating hearts
  const renderRating = (rating: number) => {
    const fullHearts = Math.floor(rating);
    const hasHalfHeart = rating % 1 >= 0.5;
    const hearts = [];
    
    for (let i = 0; i < 5; i++) {
      if (i < fullHearts) {
        hearts.push(<Heart key={i} className="h-3 w-3 text-pink-500 fill-pink-500" />);
      } else if (i === fullHearts && hasHalfHeart) {
        hearts.push(<Heart key={i} className="h-3 w-3 text-pink-500 fill-pink-300" />);
      } else {
        hearts.push(<Heart key={i} className="h-3 w-3 text-gray-300" />);
      }
    }
    
    return hearts;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-center mb-4">Hormone-Aware Shop</h2>
      
      {/* Quiz button */}
      <Button 
        variant="outline" 
        className="w-full flex items-center justify-center gap-2 border-dashed" 
        onClick={() => {
          audioService.play('click');
          toast({
            title: "Find My Match Quiz",
            description: "Based on your symptoms, we recommend De Lune's Cramp Spray (86% match)!",
          });
        }}
      >
        <BadgePercent className="h-4 w-4" />
        <span>Find My Perfect Match Quiz</span>
      </Button>
      
      {/* Categories */}
      <div className="flex overflow-x-auto pb-2 gap-2 snap-x">
        {shopCategories.map((category) => (
          <motion.div 
            key={category.id}
            className={cn(
              "flex-shrink-0 snap-center cursor-pointer rounded-full p-3",
              activeCategory === category.id ? category.color : "bg-gray-100"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCategoryClick(category.id)}
          >
            <div className="w-10 h-10 flex items-center justify-center">
              <span className="text-2xl">{category.icon}</span>
            </div>
            <div className="text-xs text-center mt-1 font-medium">
              {category.name}
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Products grid */}
      <div className="grid grid-cols-2 gap-3">
        {sortedProducts.map((product: any) => (
          <motion.div 
            key={product.id}
            className={cn(
              "relative rounded-lg overflow-hidden cursor-pointer",
              flippedCard === product.id ? "h-56" : "h-44"
            )}
            onClick={() => handleCardFlip(product.id)}
            animate={{ rotateY: flippedCard === product.id ? 180 : 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Front of card */}
            <motion.div 
              className={cn(
                "absolute inset-0 p-3 bg-white border rounded-lg",
                flippedCard === product.id ? "opacity-0" : "opacity-100"
              )}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-between items-start">
                <div 
                  className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    product.phase === "menstruation" ? "bg-pink-100 text-pink-800" :
                    product.phase === "follicular" ? "bg-green-100 text-green-800" :
                    product.phase === "ovulatory" ? "bg-yellow-100 text-yellow-800" :
                    "bg-orange-100 text-orange-800"
                  )}
                >
                  Best for {product.phase}
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-bold">💲{product.price}</span>
                </div>
              </div>
              
              <div className="flex justify-center my-2">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="h-12 w-12 object-contain"
                />
              </div>
              
              <h3 className="font-bold text-sm">{product.name}</h3>
              <p className="text-2xs text-gray-600 line-clamp-2">{product.description}</p>
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-0.5">
                  {renderRating(product.rating)}
                </div>
                <span className="text-2xs text-gray-500">{product.reviews}+ reviews</span>
              </div>
            </motion.div>
            
            {/* Back of card */}
            <motion.div 
              className={cn(
                "absolute inset-0 p-3 bg-white border rounded-lg",
                flippedCard === product.id ? "opacity-100" : "opacity-0"
              )}
              style={{ transform: flippedCard === product.id ? "rotateY(180deg)" : "rotateY(0deg)" }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="font-bold">{product.name}</h3>
              <p className="text-xs my-1">{product.description}</p>
              
              <div className="bg-purple-50 rounded-lg p-2 my-2">
                <p className="text-xs text-purple-800">
                  <span className="font-semibold">Community:</span> {product.community}
                </p>
              </div>
              
              <div className="text-xs flex items-center gap-1 my-1">
                <span className="font-semibold">Rating:</span>
                <span>{product.rating}/5</span>
                <span>({product.reviews}+ reviews)</span>
              </div>
              
              <div className="my-2">
                <Button
                  size="sm"
                  className="w-full text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                  disabled={cart.includes(product.id)}
                >
                  {cart.includes(product.id) ? (
                    <span>Added to Cart ✓</span>
                  ) : (
                    <span>Add to Cart (💲{product.price})</span>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
      
      {/* Empty state */}
      {sortedProducts.length === 0 && (
        <div className="text-center p-8">
          <p className="text-gray-500">Your hormonal toolkit awaits! Tap an icon to start 🌸</p>
        </div>
      )}
    </div>
  );
};
