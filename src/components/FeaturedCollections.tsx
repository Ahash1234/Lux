import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import collectionAccessories from "@/assets/collection-accessories.jpg";
import collectionMens from "@/assets/collection-mens.jpg";
import { Link } from "react-router-dom";

const FeaturedCollections = () => {
  const collections = [
    {
      id: 1,
      title: "Women's Collection",
      subtitle: "Sophisticated & Elegant",
      image: collectionAccessories,
      description: "Discover timeless pieces crafted with exceptional attention to detail",
      items: "156 Items",
    },
    {
      id: 2,
      title: "Men's Collection",
      subtitle: "Classic & Contemporary",
      image: collectionMens,
      description: "Refined menswear that embodies modern luxury and sophistication",
      items: "89 Items",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-luxury-heading mb-4">
            Featured Collections
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our carefully curated collections, each piece representing the pinnacle of luxury fashion
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {collections.map((collection, index) => (
            <Link
              key={collection.id}
              className={`group relative overflow-hidden rounded-lg ${
                index % 2 === 0 ? "animate-fade-in-up" : "animate-fade-in-up"
              }`}
              style={{ animationDelay: `${index * 200}ms` }}
              to={collection.title.toLowerCase().includes("women") ? "/women" : "/men"}
            >
              {/* Image Container */}
              <div className="relative h-96 md:h-[500px] overflow-hidden rounded-lg">
                <img
                  src={collection.image}
                  alt={collection.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Collection Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                  <div className="transform transition-transform duration-500 group-hover:translate-y-0 translate-y-2">
                    <p className="text-sm font-light tracking-wider uppercase mb-2 text-luxury-champagne">
                      {collection.subtitle}
                    </p>
                    <h3 className="text-2xl md:text-3xl font-bold mb-3">
                      {collection.title}
                    </h3>
                    <p className="text-gray-200 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {collection.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-luxury-champagne">
                        {collection.items}
                      </span>
                      <Button 
                        className="btn-outline-luxury opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0"
                      >
                        Shop Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Collections Button */}
        <div className="text-center mt-12">
          <Link to="/products">
            <Button className="btn-luxury">
              View All Collections
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;