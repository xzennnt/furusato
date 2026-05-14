import AboutSection from '../components/AboutSection';
import GallerySection from '../components/GallerySection';
import HeroSection from '../components/HeroSection';
import JobPartnerSection from '../components/JobPartnerSection';
import MapSection from '../components/MapSection';
import NewsSection from '../components/NewsSection';
import ProgramSection from '../components/ProgramSection';

function HomePage() {
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
