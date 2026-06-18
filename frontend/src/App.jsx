import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import Encyclopedia from "./components/Encyclopedia.jsx";
import Footer from "./components/Footer.jsx";
import DiagnosisPage from "./pages/DiagnosisPage.jsx";
import EncyclopediaPage from "./pages/EncyclopediaPage.jsx";
import EncyclopediaDetailPage from "./pages/EncyclopediaDetailPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";


function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <HowItWorks />
      <Encyclopedia />
      <Footer />
    </>
  );
}

export default function App() {
  const [route, setRoute] = useState(() => window.location.hash || "#/");

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || "#/";
      setRoute(hash);
      if (hash.startsWith("#/") || !hash.includes("contact")) {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener("hashchange", handleHashChange);

    // Initial check on mount
    const initialHash = window.location.hash || "#/";
    if (initialHash.startsWith("#/") || !initialHash.includes("contact")) {
      window.scrollTo(0, 0);
    }

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  if (route === "#/diagnosis") {
    return <DiagnosisPage />;
  }

  if (route === "#/encyclopedia") {
    return <EncyclopediaPage />;
  }

  if (route.startsWith("#/encyclopedia/")) {
    const id = route.split("/")[2];
    if (id) {
      return <EncyclopediaDetailPage id={id} />;
    }
  }

  if (route === "#/contact") {
    return <ContactPage />;
  }

  return <HomePage />;
}
