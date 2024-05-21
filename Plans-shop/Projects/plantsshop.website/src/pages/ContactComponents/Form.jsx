import { Typography, TextField, Button } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import "../ContactComponents/Form.css";
export default function Form() {
  return (
    <div className="contact-us-section">
        <div className="contact-details">
          <Typography variant="h4" className="contact-title">
            Get in touch
          </Typography>
          <Typography variant="body1" className="contact-description">
            You can contact us using email or phone number, or you can leave
            feedback and it will be displayed on our homepage!
          </Typography>
          <div className="contact-item">
            <div className="contact-icon-div">
              <LocationOnIcon className="contact-icon" />
              <Typography variant="h6" className="contact-subtitle">
                ADDRESS
              </Typography>
            </div>
            <Typography variant="body1" className="contact-info">
              2972 Westheimer Rd. Santa Ana, Illinois 85486
            </Typography>
          </div>
          <hr className="ContactDivider" />
          <div className="contact-item">
            <div className="contact-icon-div">
              <PhoneIcon className="contact-icon" />

              <Typography variant="h6" className="contact-subtitle">
                PHONE
              </Typography>
            </div>
            <Typography variant="body1" className="contact-info">
              (+91) 987 654 321
            </Typography>
          </div>
          <hr className="ContactDivider" />
          <div className="contact-item">
            <div className="contact-icon-div">
              <EmailIcon className="contact-icon" />
              <Typography variant="h6" className="contact-subtitle">
                EMAIL
              </Typography>
            </div>
            <Typography variant="body1" className="contact-info">
              info@contact.com
            </Typography>
          </div>
          <hr className="ContactDivider" />
        </div>
        <form className="contact-form">
          <Typography variant="h6" className="form-title">
            Leave a Feedback
          </Typography>
          <TextField
            name="Name"
            label="Name"
            variant="outlined"
            required
            fullWidth
            margin="normal"
          />
          <TextField
            name="message"
            label="Comment or Message"
            multiline
            rows={4}
            variant="outlined"
            required
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" className="contact-button">
            Submit
          </Button>
        </form>
      </div>
  )
}
