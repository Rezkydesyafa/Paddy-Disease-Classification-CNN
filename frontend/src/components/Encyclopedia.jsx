import React from 'react';
import diseaseData from '../data/diseaseDatabase.json';
import '../pages/EncyclopediaPage.css';

export default function Encyclopedia() {
  const topCategories = Object.keys(diseaseData).slice(0, 6).map(key => ({
    id: key,
    ...diseaseData[key]
  }));

  return (
    <section className="encyclopedia" id="encyclopedia" style={{ maxWidth: '1300px', margin: '0 auto' }}>
      <div className="ep-catalog-container" style={{ textAlign: 'left' }}>
        <div className="ep-catalog-header">
          <h2 className="ep-catalog-title">ENSIKLOPEDIA PENYAKIT</h2>
          <div className="ep-catalog-subtitle">
            Kenali berbagai jenis penyakit pada tanaman padi<br/>dan cara penanganannya yang tepat.
          </div>
        </div>
        
        <div className="ep-catalog-grid">
          {topCategories.map((disease) => (
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

        <div style={{marginTop: '3.5rem', display: 'flex', justifyContent: 'center'}}>
          <a href="#/encyclopedia" className="btn-primary">
            Lihat Semua Penyakit <i className="ph-bold ph-arrow-right"></i>
          </a>
        </div>
      </div>
    </section>
  );
}
