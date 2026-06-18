export default function HowItWorks() {
  return (
    <section className="how-it-works">
      <div className="section-header">
        <h2><span className="leaf-icon">&#127810;</span> Cara Kerja</h2>
      </div>
      <div className="steps-wrapper">
        <div className="steps-list">
          <div className="step-item">
            <div className="step-number">1</div>
            <div className="step-text">
              <h3>Unggah Foto</h3>
              <p>Ambil foto daun padi yang sakit secara jelas menggunakan smartphone Anda atau unggah gambar dari galeri perangkat.</p>
            </div>
          </div>
          <div className="step-item">
            <div className="step-number">2</div>
            <div className="step-text">
              <h3>Analisis AI</h3>
              <p>Model Jaringan Syaraf Konvolusional (CNN) kami memindai gambar daun, membandingkan gejalanya dengan 10.400+ citra latih.</p>
            </div>
          </div>
          <div className="step-item">
            <div className="step-number">3</div>
            <div className="step-text">
              <h3>Dapatkan Rekomendasi</h3>
              <p>Dapatkan hasil prediksi penyakit tanaman secara instan beserta persentase kecocokan dan langkah penanganannya.</p>
            </div>
          </div>
        </div>
        <div className="steps-image">
          <img src="/assets/how-its-work.png" alt="Paddy Scanning Process" />
        </div>
      </div>
    </section>
  );
}
