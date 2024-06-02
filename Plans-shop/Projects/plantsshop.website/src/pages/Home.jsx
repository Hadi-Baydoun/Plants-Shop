import AboutUsHome from "./HomeComponents/AboutUsSection/AboutUsHome";
import Arrivals from "./HomeComponents/ArrivalsSection/Arrivals";
import Features from "./HomeComponents/FeaturesSection/Features";
import Hero from "./HomeComponents/HeroSection/Hero";
import Reasons from "./HomeComponents/ReasonsSection/Reasons";
import Testimonials from "./HomeComponents/TestimonialsSection/Testimonials";

export default function Home({ loggedInUser, cartId, setCartId }) {
  
  return (
    <div className="home">
      <Hero />
      <Features />
      <Arrivals loggedInUser={loggedInUser} cartId={cartId} setCartId={setCartId} />
      <AboutUsHome />
      <Reasons />
      <Testimonials />
    </div>
  );
}
