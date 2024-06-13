
import AboutUsHero from "./HeroSection/AboutUsHero";
import NumbersSection from "./NumbersSection/NumbersSection";
import Goals from "./GoalsSection/Goals";
import OurJourney from "./JourneySection/OurJourney";
import OurStory from "./StorySection/OurStory";
import Reasons from "../HomePage/ReasonsSection/Reasons";



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
