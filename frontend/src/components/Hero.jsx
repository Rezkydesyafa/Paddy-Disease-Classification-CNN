export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="badge-small">Padi AI</div>
        <h1><span className="highlight">Diagnosis</span> cerdas untuk padi lebih sehat</h1>
        <p>Unggah foto daun padi Anda dan biarkan AI canggih kami mendeteksi penyakit secara instan. Dapatkan hasil akurat dan rekomendasi penanganan praktis untuk mengamankan panen Anda.</p>
        <div className="hero-buttons">
          <a className="btn-primary" href="#/diagnosis">
            Pindai Sekarang <span className="arrow-circle">&#10132;</span>
          </a>
          <button className="btn-play">
            <span className="play-icon">&#9654;</span> Lihat cara kerja
          </button>
        </div>
      </div>
      <div className="hero-image-container">
        <img src="/assets/padi-hero.png" alt="Healthy Paddy Plant" className="hero-image" />
      </div>
    </section>
  );
}
