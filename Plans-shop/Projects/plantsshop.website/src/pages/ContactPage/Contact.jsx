import FAQ from "./FAQSection/FAQ";
import Form from "./FormSection/Form";
import ContactHero from "./HeroSection/ContactHero";

export default function Contact() {
  return (
    <div className="home">
      <ContactHero />
      <Form />
      <FAQ />

      
    </div>
  );
}
