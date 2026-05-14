import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AboutSection from '../components/AboutSection';
import GallerySection from '../components/GallerySection';
import HeroSection from '../components/HeroSection';
import JobPartnerSection from '../components/JobPartnerSection';
import MapSection from '../components/MapSection';
import NewsSection from '../components/NewsSection';
import ProgramSection from '../components/ProgramSection';
import { scrollToMapSection } from '../lib/scroll';

function HomePage() {
  const location = useLocation();

  useLayoutEffect(() => {
    if (location.hash !== '#map') {
      return undefined;
    }

    let active = true;
    let attempt = 0;
    let timeoutId = 0;

    const scrollToMap = () => {
      if (!active) {
        return;
      }

      if (!scrollToMapSection()) {
        if (attempt < 30) {
          attempt += 1;
          timeoutId = window.setTimeout(scrollToMap, 50);
        }
        return;
      }
    };

    timeoutId = window.setTimeout(scrollToMap, 0);

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
    };
  }, [location.hash]);

  return (
    <>
      <HeroSection />
      <AboutSection />
      <ProgramSection />
      <JobPartnerSection />
      <GallerySection />
      <MapSection />
      <NewsSection />
    </>
  );
}

export default HomePage;
