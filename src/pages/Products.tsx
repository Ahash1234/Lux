import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Filter, Search, Grid, List, Heart, ShoppingBag, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { db } from "@/lib/firebase";
import { useLocation } from "react-router-dom";
import { ref, onValue } from "firebase/database";

interface ProductItem {
  id: string;
  title: string;
  category: string;
  basePrice: number;
  salePrice?: number;
  images: string[];
  colors: string[];
  sizes: string[];
  status: "active" | "draft" | "archived";
  createdAt: string;
}

const Products = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [items, setItems] = useState<ProductItem[]>([]);

  useEffect(() => {
    const productsRef = ref(db, `admin/products`);
    const unsub = onValue(productsRef, (snap) => {
      const val = snap.val();
      if (!val) return setItems([]);
      const list: ProductItem[] = Object.values(val).filter((p: any) => p.status === 'active');
      setItems(list);
    });
    return () => unsub();
  }, []);

  const categories = useMemo(() => [
    "All",
    ...Array.from(new Set(items.map(p => p.category))).sort()
  ], [items]);

  const location = useLocation();
  const genderRoute: 'Men' | 'Women' | null = location.pathname.includes('/women') ? 'Women' : location.pathname.includes('/men') ? 'Men' : null;
  const isAccessoriesRoute = location.pathname.includes('/accessories');
  const isSaleRoute = location.pathname.includes('/sale');

  // Reset basic filters when route (men/women/products) changes
  useEffect(() => {
    setActiveCategory('All');
    setQuery("");
  }, [location.pathname]);

  const filtered = useMemo(() => {
    let arr = [...items];
    if (genderRoute) {
      arr = arr.filter(p => p.category === 'Dresses' && (p as any).gender === genderRoute);
    }
    if (isAccessoriesRoute) {
      arr = arr.filter(p => p.category === 'Accessories');
    }
    if (isSaleRoute) {
      arr = arr.filter(p => (p.salePrice || 0) > 0);
    }
    if (activeCategory !== "All") arr = arr.filter(p => p.category === activeCategory);
    if (query.trim()) {
      const q = query.toLowerCase();
      arr = arr.filter(p => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    switch (sortBy) {
      case 'price-low':
        arr.sort((a, b) => (a.salePrice || a.basePrice) - (b.salePrice || b.basePrice));
        break;
      case 'price-high':
        arr.sort((a, b) => (b.salePrice || b.basePrice) - (a.salePrice || a.basePrice));
        break;
      case 'newest':
        arr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        break;
    }
    return arr;
  }, [items, activeCategory, query, sortBy, genderRoute, isAccessoriesRoute, isSaleRoute]);

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-luxury-heading mb-4">Luxury Collection</h1>
          <p className="text-muted-foreground max-w-2xl">Discover our curated selection of premium fashion pieces, each crafted with exceptional attention to detail</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="hidden lg:block w-64 space-y-6">
            <div className="card-luxury">
              <h3 className="font-semibold mb-4">Search</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search products..." className="pl-10 input-luxury" value={query} onChange={(e) => setQuery(e.target.value)} />
              </div>
            </div>

            <div className="card-luxury">
              <h3 className="font-semibold mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category} className="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" name="category" className="text-luxury-gold" checked={activeCategory === category} onChange={() => setActiveCategory(category)} />
                    <span className="text-sm">{category}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                  </SheetContent>
                </Sheet>

                <span className="text-sm text-muted-foreground">Showing {filtered.length} products</span>
              </div>

              <div className="flex items-center gap-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>

                <div className="border rounded-lg p-1 bg-muted/20">
                  <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('grid')} className="p-2">
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button variant={viewMode === 'list' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('list')} className="p-2">
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className={viewMode === 'grid' ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {filtered.map((product) => (
                <Link key={product.id} to={`/products/${product.id}`} className={viewMode === 'grid' ? "card-product group" : "card-luxury flex gap-6 p-6"}>
                  <div className={viewMode === 'grid' ? "relative overflow-hidden" : "relative overflow-hidden w-48 h-64 flex-shrink-0 rounded-lg"}>
                    <img src={product.images?.[0] || "/placeholder.svg"} alt={product.title} className={viewMode === 'grid' ? "w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110" : "w-full h-full object-cover"} />
                    <div className="absolute top-4 left-4 space-y-2">
                      {product.salePrice && <Badge variant="destructive">Sale</Badge>}
                    </div>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-y-2">
                      <Button size="sm" variant="secondary" className="w-10 h-10 p-0 rounded-full shadow-elegant hover:shadow-luxury">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button size="sm" className="w-10 h-10 p-0 rounded-full bg-luxury-gold hover:bg-luxury-gold-light text-primary shadow-elegant hover:shadow-luxury">
                        <ShoppingBag className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className={viewMode === 'grid' ? "p-4" : "flex-1"}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">LUXE</p>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-luxury-gold text-luxury-gold" />
                        <span className="text-sm font-medium">4.8</span>
                        <span className="text-sm text-muted-foreground">(24)</span>
                      </div>
                    </div>

                    <h3 className="font-semibold text-foreground mb-2 hover:text-luxury-gold transition-colors cursor-pointer">{product.title}</h3>

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

                    {viewMode === 'list' && (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-4">
                          <div>
                            <span className="text-sm text-muted-foreground">Sizes: </span>
                            {(product.sizes || []).slice(0, 3).map((size, idx) => (
                              <span key={idx} className="text-sm mr-1">{size}{idx < 2 ? ',' : ''}</span>
                            ))}
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Colors: </span>
                            <span className="text-sm">{(product.colors || []).length}</span>
                          </div>
                        </div>
                        <Button className="btn-luxury">Add to Cart</Button>
                      </div>
                    )}

                    {viewMode === 'grid' && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">Colors:</span>
                        <div className="flex space-x-1">
                          {(product.colors || []).slice(0, 3).map((color, idx) => (
                            <div key={idx} className="w-4 h-4 rounded-full border border-border cursor-pointer hover:scale-110 transition-transform" style={{
                              backgroundColor: color.toLowerCase() === 'black' ? '#000' : color.toLowerCase() === 'navy' ? '#1e3a8a' : color.toLowerCase() === 'burgundy' ? '#991b1b' : '#000'
                            }} title={color} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;