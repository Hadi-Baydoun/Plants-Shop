import Hero from "./HomeComponents/Hero";
import Features from "./HomeComponents/Features";
import AboutUsHome from "./HomeComponents/AboutUsHome";
import Arrivals from "./HomeComponents/Arrivals";
import Reasons from "./HomeComponents/Reasons";
import Testimonials from "./HomeComponents/Testimonials";
export default function Home() {
  
  return (
    <div className="home">
      <Hero />
      <Features />
      <Arrivals />
      <AboutUsHome />
      <Reasons />
      <Testimonials />
    </div>
  );
}
