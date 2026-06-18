import { useState, useEffect } from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import "./ContactPage.css";

export default function ContactPage() {
  const [copiedText, setCopiedText] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(""), 2000);
  };

  return (
    <div className="contact-clean-page">
      <Header />

      <main className="contact-clean-main">
        <div className="contact-clean-layout">
          {/* Left Column */}
          <div className="contact-clean-left">
            <div className="title-group">
              <h1 className="contact-clean-title">Contact us</h1>
              <p className="contact-clean-subtitle">
                Get in touch with us for any enquiries and questions.
              </p>
            </div>
            
            <div className="contact-clean-socials">
              <a href="https://github.com/Rezkydesyafa" target="_blank" rel="noopener noreferrer" className="social-link">Github</a>
              <a href="#" className="social-link">Instagram</a>
              <a href="#" className="social-link">Telegram</a>
            </div>
          </div>

          {/* Right Column */}
          <div className="contact-clean-right">
            <div className="contact-clean-grid">
              {/* General Inquiries */}
              <div className="contact-clean-block clickable" onClick={() => handleCopy("rezkydesyafa@gmail.com", "email")}>
                <span className="block-label">general inquiries</span>
                <span className="block-value email-value">rezkydesyafa@gmail.com</span>
                {copiedText === "email" && <span className="copy-feedback">copied!</span>}
              </div>

              {/* Collaborations */}
              <a href="https://github.com/Rezkydesyafa" target="_blank" rel="noopener noreferrer" className="contact-clean-block link-block">
                <span className="block-label">collaborations</span>
                <span className="block-value">github.com/Rezkydesyafa</span>
              </a>

              {/* Careers */}
              <div className="contact-clean-block clickable" onClick={() => handleCopy("rezkydesyafa@gmail.com", "careers")}>
                <span className="block-label">careers</span>
                <span className="block-value email-value">rezkydesyafa@gmail.com</span>
                {copiedText === "careers" && <span className="copy-feedback">copied!</span>}
              </div>

              {/* Address */}
              <div className="contact-clean-block">
                <span className="block-label">address</span>
                <span className="block-value address-value">
                  Yogyakarta, Indonesia<br />
                  Pusat Penelitian Citra Digital Padi
                </span>
              </div>
            </div>

            {/* Landscape Image */}
            <div className="contact-clean-image-container">
              <img 
                src="/assets/contact_paddy_landscape.png" 
                alt="Paddy leaves with warm sun rays" 
                className="contact-clean-image"
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
