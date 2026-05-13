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
      <JobPartnerSection />
      <AboutSection />
      <ProgramSection />
      <MapSection />
      <GallerySection />
      <NewsSection />
    </>
  );
}

export default HomePage;
