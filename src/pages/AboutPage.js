import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fallbackAboutContent, fallbackSite } from '../data/fallbackContent';
import { API_BASE_URL, fetchJson, fetchSite } from '../lib/api';

function AboutPage() {
  const [aboutContent, setAboutContent] = useState(fallbackAboutContent);
  const [site, setSite] = useState(fallbackSite);
  const aboutHeroBackground = site.backgrounds?.aboutPageUrl || site.backgrounds?.homeAboutUrl || '';
  const aboutHeroStyle = aboutHeroBackground
    ? { '--page-hero-bg': `url(${API_BASE_URL}${aboutHeroBackground})` }
    : undefined;

  useEffect(() => {
    fetchJson('/api/about-content', fallbackAboutContent).then((data) => {
      setAboutContent({
        ...fallbackAboutContent,
        ...data,
        profile: { ...fallbackAboutContent.profile, ...(data.profile || {}) },
        chairman: { ...fallbackAboutContent.chairman, ...(data.chairman || {}) },
        visionMission: { ...fallbackAboutContent.visionMission, ...(data.visionMission || {}) },
        programs: data.programs?.length ? data.programs : fallbackAboutContent.programs,
        slogan: { ...fallbackAboutContent.slogan, ...(data.slogan || {}) },
      });
    });
    fetchSite(fallbackSite).then((data) => {
      setSite({
        ...fallbackSite,
        ...data,
        backgrounds: { ...fallbackSite.backgrounds, ...(data.backgrounds || {}) },
      });
    });
  }, []);

  return (
    <section className="page-section about-page">
      <div className={`page-hero ${aboutHeroBackground ? 'has-page-hero-bg' : ''}`} style={aboutHeroStyle}>
        <p className="eyebrow">Tentang Kami</p>
        <h1>Tentang Furusato</h1>
        <p>Beranda / Tentang Furusato</p>
      </div>

      <section className="about-story-panel">
        <div>
          <p className="eyebrow">{aboutContent.profile.eyebrow}</p>
          <h2>{aboutContent.profile.title}</h2>
        </div>
        <div className="about-rich-text">{aboutContent.profile.body}</div>
      </section>

      <section className="about-chairman-panel">
        {aboutContent.chairman.imageUrl ? (
          <img
            className="about-chairman-photo"
            src={`${API_BASE_URL}${aboutContent.chairman.imageUrl}`}
            alt={aboutContent.chairman.name}
          />
        ) : (
          <div className="about-chairman-photo image-marker">
            <span>FURUSATO</span>
          </div>
        )}
        <div>
          <p className="eyebrow">{aboutContent.chairman.eyebrow}</p>
          <h2>{aboutContent.chairman.name}</h2>
          <div className="about-rich-text">{aboutContent.chairman.body}</div>
        </div>
      </section>

      <section className="about-vision-grid">
        <article>
          <h2>{aboutContent.visionMission.visionTitle}</h2>
          <p>{aboutContent.visionMission.vision}</p>
        </article>
        <article>
          <h2>{aboutContent.visionMission.missionTitle}</h2>
          <div className="about-rich-text">{aboutContent.visionMission.mission}</div>
        </article>
      </section>

      <section className="about-program-section">
        <p className="eyebrow">Program Kerja Furusato</p>
        <h2>Program yang disiapkan untuk peserta.</h2>
        <div className="about-program-grid">
          {aboutContent.programs.map((program) => (
            <article className="about-program-card sticker-card" key={program.id}>
              {program.imageUrl ? (
                <img src={`${API_BASE_URL}${program.imageUrl}`} alt={program.title} />
              ) : (
                <div className="gallery-placeholder image-marker">
                  <span>PROGRAM</span>
                </div>
              )}
              <div>
                <h3>{program.title}</h3>
                <p>{program.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="about-slogan-band" style={aboutHeroStyle}>
        <p className="eyebrow">{aboutContent.slogan.eyebrow}</p>
        <h2>{aboutContent.slogan.title}</h2>
        <Link className="primary-action" to={aboutContent.slogan.buttonUrl || '/kontak'}>
          {aboutContent.slogan.buttonText}
        </Link>
      </section>
    </section>
  );
}

export default AboutPage;
