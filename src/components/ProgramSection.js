import { useEffect, useState } from 'react';
import { fallbackAboutContent } from '../data/fallbackContent';
import { fetchJson, resolveMediaUrl } from '../lib/api';
import { useLanguage } from '../i18n/LanguageProvider';
import { useTranslatedItems } from '../i18n/useTranslatedItems';

function ProgramSection() {
  const [programs, setPrograms] = useState(fallbackAboutContent.programs);
  const { copy, language } = useLanguage();
  const translatedPrograms = useTranslatedItems(programs, ['title', 'description'], language);

  useEffect(() => {
    fetchJson('/api/about-content', fallbackAboutContent).then((data) => {
      setPrograms(data.programs?.length ? data.programs : fallbackAboutContent.programs);
    });
  }, []);

  return (
    <section className="program-section">
      <p className="eyebrow">{copy.program.eyebrow}</p>
      <div className="section-heading-row">
        <h2>{copy.program.title}</h2>
      </div>
      <div className="program-list">
        {translatedPrograms.map((program) => (
          <article
            className={`sticker-card ${program.imageUrl ? 'has-program-bg' : ''}`}
            key={program.id || program.title}
            style={program.imageUrl ? { '--program-bg': `url(${resolveMediaUrl(program.imageUrl)})` } : undefined}
          >
            <h3>{program.title}</h3>
            <p>{program.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ProgramSection;
