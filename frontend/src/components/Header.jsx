import { useEffect, useState } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [currentHash, setCurrentHash] = useState(window.location.hash || "#/");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 5);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    const handleHashChange = () => setCurrentHash(window.location.hash || "#/");
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <header id="main-header" className={scrolled ? "scrolled" : ""}>
      <nav>
        <a href="#/" className="logo">
          <div className="logo-icon"></div>
          Padi AI
        </a>
        <div className="nav-links">
          <a href="#/" className={currentHash === "#/" ? "active" : ""}>Beranda</a>
          <a href="#/diagnosis" className={currentHash === "#/diagnosis" ? "active" : ""}>Diagnosis</a>
          <a href="#/encyclopedia" className={currentHash.startsWith("#/encyclopedia") ? "active" : ""}>Ensiklopedia</a>
          <a href="#/contact" className={currentHash === "#/contact" ? "active" : ""}>Kontak</a>
        </div>
        <div className="nav-icons">
          <div className="icon-circle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>
      </nav>
    </header>
  );
}
