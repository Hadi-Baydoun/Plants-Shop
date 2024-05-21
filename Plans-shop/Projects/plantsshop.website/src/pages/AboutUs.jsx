
import AboutUsHero from "./AboutUsComponents/AboutUsHero";
import NumbersSection from "./AboutUsComponents/NumbersSection";
import Goals from "./AboutUsComponents/Goals";
import OurJourney from "./AboutUsComponents/OurJourney";
import OurStory from "./AboutUsComponents/OurStory";
import Reasons from "./HomeComponents/Reasons";



export default function AboutUs() {
  return (
    <div className="home">
      <AboutUsHero />
      <NumbersSection />
      <OurStory />
      <OurJourney />
      <Goals />
      <Reasons />
    </div>
  );
}
