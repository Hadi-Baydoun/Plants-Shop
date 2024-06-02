
import AboutUsHero from "./AboutUsComponents/HeroSection/AboutUsHero";
import NumbersSection from "./AboutUsComponents/NumbersSection/NumbersSection";
import Goals from "./AboutUsComponents/GoalsSection/Goals";
import OurJourney from "./AboutUsComponents/JourneySection/OurJourney";
import OurStory from "./AboutUsComponents/StorySection/OurStory";
import Reasons from "./HomeComponents/ReasonsSection/Reasons";



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
