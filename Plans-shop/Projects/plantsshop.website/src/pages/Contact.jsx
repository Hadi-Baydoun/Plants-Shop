import FAQ from "./ContactComponents/FAQSection/FAQ";
import Form from "./ContactComponents/FormSection/Form";
import ContactHero from "./ContactComponents/HeroSection/ContactHero";

export default function Contact() {
  return (
    <div className="home">
      <ContactHero />
      <Form />
      <FAQ />

      
    </div>
  );
}
