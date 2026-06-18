import { useEffect, useState } from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import diseaseData from "../data/diseaseDatabase.json";
import "./EncyclopediaDetailPage.css";

export default function EncyclopediaDetailPage({ id }) {
  const [disease, setDisease] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (diseaseData[id]) {
      setDisease(diseaseData[id]);
    }
  }, [id]);

  if (!disease) {
    return (
      <>
        <Header />
        <main className="magazine-page">
          <div className="magazine-container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
            <h2>Penyakit tidak ditemukan</h2>
            <a href="#/encyclopedia" className="btn-primary" style={{ marginTop: "1rem", display: "inline-block" }}>Kembali ke Encyclopedia</a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="magazine-page">
        <div className="magazine-container">
          {/* Back Link */}
          <a href="#/encyclopedia" className="magazine-back">← Kembali ke Katalog</a>

          {/* Header Section */}
          <div className="magazine-header">
            <div className="magazine-category">{disease.categoryLabel}</div>
            <h1 className="magazine-title">{disease.displayName}</h1>
            <div className="magazine-meta">
              <span className="magazine-scientific">{disease.scientificName}</span>
              <span className="magazine-dot">•</span>
              <span className={`magazine-risk-badge ${disease.riskLevel.className}`}>
                <i className={disease.riskLevel.icon}></i> {disease.riskLevel.label}
              </span>
            </div>
            <p className="magazine-lead">{disease.description}</p>
          </div>

          {/* Featured Image */}
          <div className="magazine-featured-image">
            <img 
              src={disease.referenceImages[0] || '/paddy_field_bg.png'} 
              alt={disease.displayName} 
              onError={(e) => { e.target.src = '/paddy_field_bg.png'; }}
            />
          </div>

          {/* Article Body */}
          <div className="magazine-body">

            {/* Gejala Khas */}
            {disease.symptoms && disease.symptoms.length > 0 && (
              <>
                <h2>Gejala Khas —</h2>
                <ul className="magazine-symptom-list">
                  {disease.symptoms.map((symptom, idx) => (
                    <li key={idx}>{symptom}</li>
                  ))}
                </ul>
              </>
            )}

            {/* Penyebab & Penyebaran */}
            {disease.causes && (
              <>
                <h2>Penyebab & Penyebaran —</h2>
                <div className="magazine-info-cards">
                  <div className="magazine-info-card">
                    <div className="magazine-info-card-icon">🔬</div>
                    <div>
                      <h4>Penyebab</h4>
                      <p>{disease.causes}</p>
                    </div>
                  </div>
                  {disease.spreadMethod && (
                    <div className="magazine-info-card">
                      <div className="magazine-info-card-icon">🌊</div>
                      <div>
                        <h4>Cara Penyebaran</h4>
                        <p>{disease.spreadMethod}</p>
                      </div>
                    </div>
                  )}
                  {disease.affectedParts && disease.affectedParts.length > 0 && (
                    <div className="magazine-info-card">
                      <div className="magazine-info-card-icon">🌿</div>
                      <div>
                        <h4>Bagian Terserang</h4>
                        <p>{disease.affectedParts.join(", ")}</p>
                      </div>
                    </div>
                  )}
                  {disease.idealConditions && (
                    <div className="magazine-info-card">
                      <div className="magazine-info-card-icon">🌡️</div>
                      <div>
                        <h4>Kondisi Ideal Penyakit</h4>
                        <p>{disease.idealConditions}</p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Quote / Notes */}
            {disease.notes && (
              <div className="magazine-quote">
                <p>"{disease.notes}"</p>
              </div>
            )}

            {/* Tindakan Cepat */}
            <h2>Tindakan Cepat —</h2>
            <div className="magazine-list">
              {disease.quickActions.map((action, idx) => (
                <div className="magazine-list-item" key={idx}>
                  <strong>{action.title}</strong> — {action.description}
                </div>
              ))}
            </div>

            {/* Perawatan 7 Hari */}
            <h2>Perawatan 7 Hari —</h2>
            <div className="magazine-list">
              {disease.sevenDayCare.map((action, idx) => (
                <div className="magazine-list-item" key={idx}>
                  <strong>{action.title}</strong> — {action.description}
                </div>
              ))}
            </div>

            {/* Pencegahan */}
            <h2>Pencegahan —</h2>
            <div className="magazine-list">
              {disease.prevention.map((action, idx) => (
                <div className="magazine-list-item" key={idx}>
                  <strong>{action.title}</strong> — {action.description}
                </div>
              ))}
            </div>

            {/* Pengendalian Kimiawi */}
            {disease.chemicalControl && disease.chemicalControl.length > 0 && (
              <>
                <h2>Pengendalian Kimiawi —</h2>
                <div className="magazine-control-section">
                  <div className="magazine-control-icon chemical">⚗️</div>
                  <ul className="magazine-control-list">
                    {disease.chemicalControl.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {/* Pengendalian Biologis */}
            {disease.biologicalControl && disease.biologicalControl.length > 0 && (
              <>
                <h2>Pengendalian Biologis —</h2>
                <div className="magazine-control-section">
                  <div className="magazine-control-icon biological">🌱</div>
                  <ul className="magazine-control-list">
                    {disease.biologicalControl.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}
            
            <hr className="magazine-divider" />

            {/* Galeri Referensi */}
            <h2>Galeri Referensi —</h2>
            <div className="magazine-gallery">
              {disease.referenceImages.map((img, idx) => (
                <img 
                  src={img} 
                  alt={`Referensi ${idx + 1}`} 
                  key={idx} 
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ))}
            </div>
            <p className="magazine-photo-guide">{disease.photoGuide}</p>

            {/* Disclaimer */}
            <div className="magazine-warning">
              <strong>Disclaimer:</strong> {disease.fieldDisclaimer}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
