import { useEffect, useState } from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import diseaseData from "../data/diseaseDatabase.json";
import "./EncyclopediaPage.css";

export default function EncyclopediaPage() {
  const [diseases, setDiseases] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const dataArray = Object.keys(diseaseData).map((key) => ({
      id: key,
      ...diseaseData[key],
    }));
    setDiseases(dataArray);
  }, []);

  return (
    <>
      <Header />
      <main className="encyclopedia-page">
        <section className="ep-hero">
          <div className="ep-hero-bg"></div>
          <div className="ep-hero-content">
            <div className="badge-small">Knowledge Base</div>
            <h1 className="ep-hero-title">Padi Disease <span className="highlight">Encyclopedia</span></h1>
            <p className="ep-hero-desc">Eksplorasi panduan komprehensif mengenai penyakit padi, gejala-gejalanya, dan rekomendasi penanganan yang tepat.</p>
          </div>
        </section>

        <section className="ep-catalog-section">
          <div className="ep-catalog-container">
            <div className="ep-catalog-header">
              <h2 className="ep-catalog-title">DISEASE CATALOG</h2>
              <div className="ep-catalog-subtitle">
                Panduan komprehensif penyakit<br/>dan penanganan yang tepat
              </div>
            </div>
            
            <div className="ep-catalog-grid">
              {diseases.map((disease) => (
                <a href={`#/encyclopedia/${disease.id}`} key={disease.id} className="ep-plant-card">
                  <div className="ep-card-top">
                    <div className="ep-card-text">
                      <h3>{disease.displayName}</h3>
                      <span className="ep-local-name">{disease.localName || disease.categoryLabel}</span>
                    </div>
                    <div className="ep-card-arrow">
                      <i className="ph ph-arrow-up-right"></i>
                    </div>
                  </div>
                  
                  <div className="ep-card-image-wrapper">
                    <img 
                      src={disease.referenceImages[0] || "https://images.unsplash.com/photo-1597055181300-e3633a207511?q=80&w=400&auto=format&fit=crop"} 
                      alt={disease.displayName} 
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="ep-image-fallback" style={{ display: 'none' }}>
                      <i className="ph-fill ph-plant"></i>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
