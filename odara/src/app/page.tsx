// app/page.jsx
import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/ui/Hero";
import Products from "@/components/layout/Products";
import Footer from "@/components/ui/Footer"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Products />
      <Footer/>
    </div>
  );
}