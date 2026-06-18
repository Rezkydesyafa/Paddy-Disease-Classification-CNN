export default function Footer() {
  return (
    <footer id="contact" className="site-footer">
      <div className="footer-banner">
        <h3>Deteksi penyakit padi secara instan dengan AI kami. Selamatkan panen Anda hingga 100%.</h3>
        <a href="#/diagnosis" className="btn-dark">Pindai Sekarang</a>
      </div>

      <div className="footer-main-box">
        <div className="footer-top-row">
          <div className="footer-links">
            <a href="#/">Beranda</a>
            <a href="#/diagnosis">Diagnosis</a>
            <a href="#/encyclopedia">Ensiklopedia</a>
            <a href="#/contact">Kontak</a>
          </div>

          <div className="footer-logo-center">
            Padi AI
          </div>

          <div className="footer-socials">
            <a href="#" className="social-circle" title="Instagram" target="_blank" rel="noopener noreferrer">
              <i className="ph ph-instagram-logo"></i>
            </a>
            <a href="#" className="social-circle" title="TikTok" target="_blank" rel="noopener noreferrer">
              <i className="ph ph-tiktok-logo"></i>
            </a>
            <a href="#" className="social-circle" title="WhatsApp" target="_blank" rel="noopener noreferrer">
              <i className="ph ph-whatsapp-logo"></i>
            </a>
          </div>
        </div>

        <div className="footer-bottom-row">
          <p className="copyright-text">Hak Cipta: Padi AI tanaman padi @2026</p>
          <a href="#/contact" className="btn-outline">Hubungi Kami &rarr;</a>
        </div>
      </div>
    </footer>
  );
}
