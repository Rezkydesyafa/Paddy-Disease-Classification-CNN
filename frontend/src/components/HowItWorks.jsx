export default function HowItWorks() {
  return (
    <section className="how-it-works">
      <div className="section-header">
        <h2><span className="leaf-icon">&#127810;</span> How it works</h2>
      </div>
      <div className="steps-wrapper">
        <div className="steps-list">
          <div className="step-item">
            <div className="step-number">1</div>
            <div className="step-text">
              <h3>Upload Photo</h3>
              <p>Take a clear picture of the affected paddy leaf using your smartphone or upload an existing image from your gallery.</p>
            </div>
          </div>
          <div className="step-item">
            <div className="step-number">2</div>
            <div className="step-text">
              <h3>AI Analysis</h3>
              <p>Our Convolutional Neural Network (CNN) scans the image, comparing patterns against 10,400+ dataset images.</p>
            </div>
          </div>
          <div className="step-item">
            <div className="step-number">3</div>
            <div className="step-text">
              <h3>Get Recommendation</h3>
              <p>Instantly receive a disease prediction, confidence score, and expert steps to treat and prevent the condition.</p>
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
