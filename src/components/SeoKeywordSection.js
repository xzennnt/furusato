import { useLanguage } from '../i18n/LanguageProvider';

function SeoKeywordSection() {
  const { copy } = useLanguage();

  return (
    <section className="seo-local-section" aria-labelledby="seo-local-heading">
      <div className="seo-local-copy">
        <p className="eyebrow">{copy.seoSection.eyebrow}</p>
        <h2 id="seo-local-heading">{copy.seoSection.title}</h2>
        <p>{copy.seoSection.body}</p>
      </div>

      <div className="seo-local-points" aria-label={copy.seoSection.listLabel}>
        {copy.seoSection.points.map((point) => (
          <span key={point}>{point}</span>
        ))}
      </div>
    </section>
  );
}

export default SeoKeywordSection;
