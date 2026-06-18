export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="badge-small">Paddy AI</div>
        <h1>Smart <span className="highlight">diagnosis</span> for healthier paddy</h1>
        <p>Upload photos of your paddy leaves and let our advanced AI detect diseases instantly. Get accurate results and actionable care recommendations to secure your harvest.</p>
        <div className="hero-buttons">
          <a className="btn-primary" href="#/diagnosis">
            Scan Now <span className="arrow-circle">&#10132;</span>
          </a>
          <button className="btn-play">
            <span className="play-icon">&#9654;</span> See how it work
          </button>
        </div>
      </div>
      <div className="hero-image-container">
        <img src="/assets/padi-hero.png" alt="Healthy Paddy Plant" className="hero-image" />
      </div>
    </section>
  );
}
