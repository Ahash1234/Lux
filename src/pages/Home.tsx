import { useEffect } from "react";
import Hero from "@/components/Hero";
import FeaturedCollections from "@/components/FeaturedCollections";
import ProductShowcase from "@/components/ProductShowcase";
import Newsletter from "@/components/Newsletter";

const Home = () => {
  useEffect(() => {
    // Update page title and meta description for SEO
    document.title = "LUXE - Premium Fashion & Luxury Clothing | Designer Collections";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Discover luxury fashion at LUXE. Premium designer clothing, accessories, and timeless pieces crafted with exceptional quality. Shop exclusive collections online.');
    }
  }, []);

  return (
    <main>
      <Hero />
      <FeaturedCollections />
      <ProductShowcase />
      <Newsletter />
    </main>
  );
};

export default Home;