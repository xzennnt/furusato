import { useEffect, useState } from 'react';
import { fallbackAboutContent } from '../data/fallbackContent';
import { API_BASE_URL, fetchJson } from '../lib/api';

function ProgramSection() {
  const [programs, setPrograms] = useState(fallbackAboutContent.programs);

  useEffect(() => {
    fetchJson('/api/about-content', fallbackAboutContent).then((data) => {
      setPrograms(data.programs?.length ? data.programs : fallbackAboutContent.programs);
    });
  }, []);

  return (
    <section className="program-section">
      <p className="eyebrow">Program</p>
      <div className="section-heading-row">
        <h2>Mulai karirmu dengan persiapan yang jelas.</h2>
      </div>
      <div className="program-list">
        {programs.map((program) => (
          <article
            className={`sticker-card ${program.imageUrl ? 'has-program-bg' : ''}`}
            key={program.id || program.title}
            style={program.imageUrl ? { '--program-bg': `url(${API_BASE_URL}${program.imageUrl})` } : undefined}
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
