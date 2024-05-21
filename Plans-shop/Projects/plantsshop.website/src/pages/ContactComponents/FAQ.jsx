import "../ContactComponents/FAQ.css";
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
export default function FAQ() {
  return (
    <div className="faqs-section">
      <div className="faqs-intro">
        <Typography variant="h4" className="faqs-title">
          FAQs
        </Typography>
        <Typography variant="body1" className="faqs-description">
          Find answers to common questions about our plant products, ordering,
          shipping, care, and more. If you need further information, feel free
          to contact us.
        </Typography>
      </div>
      <div className="faqs-accordion">
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" className="accordion-title">
              Ordering and Shipping
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" className="accordion-description">
              All our products are shipped for free.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" className="accordion-title">
              Product Care
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" className="accordion-description">
              All our products are cared for by professionals 24/7 to maintain
              the maximum life for plants. This ensures that when you receive
              your plants, they are healthy and ready to thrive in your home or
              office.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" className="accordion-title">
              Returns and Refunds
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" className="accordion-description">
              At this time, we do not offer returns or refunds. We strive to
              ensure the quality and condition of all our plants before they
              leave our facility. If you have any issues with your order, please
              contact us for assistance.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" className="accordion-title">
              Contact and Support
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" className="accordion-description">
              You can contact us using email or phone number, or you can leave
              feedback and it will be displayed on our homepage!
            </Typography>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
}
