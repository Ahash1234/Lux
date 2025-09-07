import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ProductDetailType = {
  id: string;
  title: string;
  description: string;
  category: string;
  sizes: string[];
  colors: string[];
  stockQuantity: number;
  basePrice: number;
  salePrice?: number;
  images: string[];
  featured: boolean;
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
  updatedAt: string;
};

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductDetailType | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    const productRef = ref(db, `admin/products/${id}`);
    const unsub = onValue(productRef, (snap) => {
      const val = snap.val();
      if (!val) {
        setNotFound(true);
        setProduct(null);
        return;
      }
      const p = val as ProductDetailType;
      setProduct(p);
      setCurrentIndex(0);
      setNotFound(false);
    });
    return () => unsub();
  }, [id]);

  if (notFound) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-muted-foreground">Product not found.</p>
        <Link to="/products" className="text-luxury-gold">Back to products</Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="aspect-square bg-muted rounded-lg overflow-hidden relative">
            <img src={(product.images && product.images[currentIndex]) || "/placeholder.svg"} alt={product.title} className="w-full h-full object-cover" />
            {product.images && product.images.length > 1 && (
              <>
                <button
                  aria-label="Previous image"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-9 h-9 flex items-center justify-center"
                  onClick={() => setCurrentIndex((i) => (i - 1 + product.images.length) % product.images.length)}
                >
                  ‹
                </button>
                <button
                  aria-label="Next image"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-9 h-9 flex items-center justify-center"
                  onClick={() => setCurrentIndex((i) => (i + 1) % product.images!.length)}
                >
                  ›
                </button>
              </>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  className={`aspect-square bg-muted rounded-lg overflow-hidden border ${idx === currentIndex ? 'border-luxury-gold' : 'border-transparent'}`}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Show image ${idx + 1}`}
                >
                  <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <h1 className="text-3xl font-bold text-foreground">{product.title}</h1>
            {Number(product.salePrice || 0) > 0 && <Badge variant="destructive">Sale</Badge>}
          </div>
          <div className="flex items-center space-x-3">
            {(() => {
              const bp = Number(product.basePrice || 0);
              const sp = Number(product.salePrice || 0);
              if (bp <= 0 && sp <= 0) return null;
              const display = sp > 0 ? sp : bp;
              return (
                <>
                  <span className="text-2xl font-semibold">₹{display.toLocaleString()}</span>
                  {sp > 0 && bp > 0 && (
                    <span className="text-muted-foreground line-through">₹{bp.toLocaleString()}</span>
                  )}
                </>
              );
            })()}
          </div>
          <p className="text-muted-foreground">{product.description}</p>

          {product.sizes && product.sizes.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Sizes</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <span key={s} className="px-3 py-1 border border-border rounded text-sm">{s}</span>
                ))}
              </div>
            </div>
          )}

          {product.colors && product.colors.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Colors</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c, i) => (
                  <span key={`${c}-${i}`} className="px-3 py-1 border border-border rounded text-sm">{c}</span>
                ))}
              </div>
            </div>
          )}

          <div className="space-x-2 pt-2">
            <Button className="btn-luxury">Add to Cart</Button>
            <Link to="/products" className="text-luxury-gold">Back to products</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;


