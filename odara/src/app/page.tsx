// app/page.jsx

import Hero from "@/components/ui/Hero";
import Products from "@/components/layout/Products";
import Footer from "@/components/layout/Footer"

export default function Home() {
  return (
    <div className="min-h-screen">
    
      <Hero />
      <Products />
      <Footer/>
    </div>
  );
}