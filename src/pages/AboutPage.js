import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fallbackAboutContent, fallbackSite } from '../data/fallbackContent';
import { fetchJson, fetchSite, resolveMediaUrl } from '../lib/api';
import { useLanguage } from '../i18n/LanguageProvider';
import { useTranslatedItems, useTranslatedObject } from '../i18n/useTranslatedItems';

function AboutPage() {
  const [aboutContent, setAboutContent] = useState(fallbackAboutContent);
  const [site, setSite] = useState(fallbackSite);
  const { copy, language } = useLanguage();
  const profile = useTranslatedObject(aboutContent.profile, ['eyebrow', 'title', 'body'], language);
  const chairman = useTranslatedObject(aboutContent.chairman, ['eyebrow', 'name', 'body'], language);
  const visionMission = useTranslatedObject(
    aboutContent.visionMission,
    ['visionTitle', 'vision', 'missionTitle', 'mission'],
    language,
  );
  const programs = useTranslatedItems(aboutContent.programs, ['title', 'description'], language);
  const slogan = useTranslatedObject(aboutContent.slogan, ['eyebrow', 'title', 'buttonText'], language);
  const aboutHeroBackground = site.backgrounds?.aboutPageUrl || site.backgrounds?.homeAboutUrl || '';
  const aboutHeroStyle = aboutHeroBackground
    ? { '--page-hero-bg': `url(${resolveMediaUrl(aboutHeroBackground)})` }
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
        <p className="eyebrow">{copy.aboutPage.heroEyebrow}</p>
        <h1>{copy.aboutPage.heroTitle}</h1>
        <p>{copy.aboutPage.breadcrumb}</p>
      </div>

      <section className="about-story-panel">
        <div>
          <p className="eyebrow">{profile.eyebrow}</p>
          <h2>{profile.title}</h2>
        </div>
        <div className="about-rich-text">{profile.body}</div>
      </section>

      <section className="about-chairman-panel">
        {chairman.imageUrl ? (
          <img
            className="about-chairman-photo"
            src={resolveMediaUrl(chairman.imageUrl)}
            alt={chairman.name}
          />
        ) : (
          <div className="about-chairman-photo image-marker">
            <span>FURUSATO</span>
          </div>
        )}
        <div>
          <p className="eyebrow">{chairman.eyebrow}</p>
          <h2>{chairman.name}</h2>
          <div className="about-rich-text">{chairman.body}</div>
        </div>
      </section>

      <section className="about-vision-grid">
        <article>
          <h2>{visionMission.visionTitle}</h2>
          <p>{visionMission.vision}</p>
        </article>
        <article>
          <h2>{visionMission.missionTitle}</h2>
          <div className="about-rich-text">{visionMission.mission}</div>
        </article>
      </section>

      <section className="about-program-section">
        <p className="eyebrow">{copy.aboutPage.programEyebrow}</p>
        <h2>{copy.aboutPage.programTitle}</h2>
        <div className="about-program-grid">
          {programs.map((program) => (
            <article className="about-program-card sticker-card" key={program.id}>
              {program.imageUrl ? (
                <img src={resolveMediaUrl(program.imageUrl)} alt={program.title} />
              ) : (
                <div className="gallery-placeholder image-marker">
                  <span>{copy.aboutPage.programPlaceholder}</span>
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
        <p className="eyebrow">{slogan.eyebrow}</p>
        <h2>{slogan.title}</h2>
        <Link className="primary-action" to={slogan.buttonUrl || '/kontak'}>
          {slogan.buttonText}
        </Link>
      </section>
    </section>
  );
}

export default AboutPage;
