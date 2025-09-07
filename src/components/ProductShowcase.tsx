import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";

type ShowcaseProduct = {
  id: string;
  title: string;
  basePrice: number;
  salePrice?: number;
  images: string[];
  featured: boolean;
  colors: string[];
};

const ProductShowcase = () => {
  const [products, setProducts] = useState<ShowcaseProduct[]>([]);

  useEffect(() => {
    const productsRef = ref(db, `admin/products`);
    const unsub = onValue(productsRef, (snap) => {
      const val = snap.val();
      if (!val) return setProducts([]);
      const list: ShowcaseProduct[] = Object.values(val)
        .filter((p: any) => p.status === 'active')
        .slice(0, 8);
      setProducts(list);
    });
    return () => unsub();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-luxury-heading mb-4">
            Bestsellers
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our most coveted pieces, loved by fashion connoisseurs worldwide
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.map((product, index) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="card-product group animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Product Image */}
              <div className="relative overflow-hidden">
                <img
                  src={product.images?.[0] || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 space-y-2">
                  {product.featured && (
                    <Badge className="bg-luxury-gold text-primary">
                      Featured
                    </Badge>
                  )}
                  {Number(product.salePrice || 0) > 0 && (
                    <Badge variant="destructive">
                      Sale
                    </Badge>
                  )}
                </div>

                {/* Hover Actions */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-y-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="w-10 h-10 p-0 rounded-full shadow-elegant hover:shadow-luxury"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    className="w-10 h-10 p-0 rounded-full bg-luxury-gold hover:bg-luxury-gold-light text-primary shadow-elegant hover:shadow-luxury"
                  >
                    <ShoppingBag className="h-4 w-4" />
                  </Button>
                </div>

                {/* Quick Add Button */}
                <div className="absolute bottom-4 left-4 right-4 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <Button className="w-full btn-luxury">
                    Quick Add
                  </Button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">LUXE</p>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-luxury-gold text-luxury-gold" />
                    <span className="text-sm font-medium">4.8</span>
                    <span className="text-sm text-muted-foreground">(24)</span>
                  </div>
                </div>
                
                <h3 className="font-semibold text-foreground mb-2 hover:text-luxury-gold transition-colors cursor-pointer">
                  {product.title}
                </h3>
                
                <div className="flex items-center space-x-2 mb-3">
                  {(() => {
                    const bp = Number(product.basePrice || 0);
                    const sp = Number(product.salePrice || 0);
                    const hasPrice = bp > 0 || sp > 0;
                    if (!hasPrice) return null;
                    const display = sp > 0 ? sp : bp;
                    return (
                      <>
                        <span className="text-lg font-bold text-foreground">₹{display.toLocaleString()}</span>
                        {sp > 0 && bp > 0 && (
                          <span className="text-sm text-muted-foreground line-through">₹{bp.toLocaleString()}</span>
                        )}
                      </>
                    );
                  })()}
                </div>

                {/* Color Options */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Colors:</span>
                  <div className="flex space-x-1">
                    {(product.colors || []).slice(0, 3).map((color, idx) => (
                      <div
                        key={idx}
                        className="w-4 h-4 rounded-full border border-border cursor-pointer hover:scale-110 transition-transform"
                        style={{
                          backgroundColor: color.toLowerCase() === 'black' ? '#000' : 
                                         color.toLowerCase() === 'navy' ? '#1e3a8a' :
                                         color.toLowerCase() === 'burgundy' ? '#991b1b' :
                                         color.toLowerCase() === 'charcoal' ? '#374151' :
                                         color.toLowerCase() === 'camel' ? '#d2b48c' :
                                         color.toLowerCase() === 'brown' ? '#92400e' :
                                         color.toLowerCase() === 'cognac' ? '#b45309' :
                                         color.toLowerCase() === 'grey' ? '#6b7280' : '#000'
                        }}
                        title={color}
                      />
                    ))}
                    {(product.colors || []).length > 3 && (
                      <span className="text-xs text-muted-foreground">+{(product.colors || []).length - 3}</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Products Button */}
        <div className="text-center mt-12">
          <Button className="btn-outline-luxury">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;