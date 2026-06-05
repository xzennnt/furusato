import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fallbackHomeContent } from '../data/fallbackContent';
import { fetchJson, resolveMediaUrl } from '../lib/api';
import { useLanguage } from '../i18n/LanguageProvider';
import { useTranslatedObject } from '../i18n/useTranslatedItems';
import NewsTicker from './NewsTicker';

function JobPartnerSection() {
  const [content, setContent] = useState(fallbackHomeContent);
  const { copy, language } = useLanguage();
  const translatedJobInfo = useTranslatedObject(content.jobInfo, ['label', 'title', 'description'], language);
  const translatedJobBanner = useTranslatedObject(content.jobBanner, ['label', 'title', 'description'], language);
  const { partners } = content;
  const jobLink = translatedJobBanner?.linkUrl || translatedJobInfo?.linkUrl || '/berita';
  const isExternalJobLink = /^https?:\/\//i.test(jobLink);
  const jobBannerContent = (
    <>
      <div className="job-banner-media">
        {translatedJobBanner?.imageUrl ? (
          <img src={resolveMediaUrl(translatedJobBanner.imageUrl)} alt={translatedJobInfo?.title || translatedJobBanner.title} />
        ) : (
          <div className="job-banner-placeholder">
            <span>{copy.job.bannerPlaceholder}</span>
          </div>
        )}
      </div>
      <div className="job-banner-caption">
        <p className="eyebrow">{translatedJobInfo?.label || copy.job.defaultJobLabel}</p>
        <h2>{translatedJobInfo?.title || translatedJobBanner?.title || copy.job.defaultJobTitle}</h2>
        <p>{translatedJobInfo?.description || translatedJobBanner?.description || copy.job.defaultJobDescription}</p>
      </div>
    </>
  );

  useEffect(() => {
    fetchJson('/api/home-content', fallbackHomeContent).then((data) => {
      const nextJobBanner = { ...fallbackHomeContent.jobBanner, ...(data.jobBanner || {}) };
      const nextJobInfo = data.jobInfo
        ? { ...fallbackHomeContent.jobInfo, ...data.jobInfo }
        : {
            ...fallbackHomeContent.jobInfo,
            label: nextJobBanner.label || fallbackHomeContent.jobInfo.label,
            title: nextJobBanner.title || fallbackHomeContent.jobInfo.title,
            description: nextJobBanner.description || fallbackHomeContent.jobInfo.description,
            linkUrl: nextJobBanner.linkUrl || fallbackHomeContent.jobInfo.linkUrl,
          };

      setContent({
        ...fallbackHomeContent,
        ...data,
        jobInfo: nextJobInfo,
        jobBanner: nextJobBanner,
        partners: data.partners?.length ? data.partners : fallbackHomeContent.partners,
      });
    });
  }, []);

  return (
    <section className="job-partner-section">
      <div className="job-partner-layout">
        <div className="job-news-column is-straight-card">
          <div>
            <span className="hero-badge">{copy.job.newsEyebrow}</span>
            <h2>{copy.job.newsTitle}</h2>
          </div>
          <NewsTicker />
        </div>

        {isExternalJobLink ? (
          <a className="job-banner-card is-straight-card" href={jobLink} target="_blank" rel="noreferrer">
            {jobBannerContent}
          </a>
        ) : (
          <Link className="job-banner-card is-straight-card" to={jobLink}>
            {jobBannerContent}
          </Link>
        )}

        <aside
          className={`partner-panel is-straight-card partner-count-${partners.length} ${partners.length > 4 ? 'has-many-partners' : ''}`}
          aria-label={copy.job.partnerEyebrow}
        >
          <p className="eyebrow">{copy.job.partnerEyebrow}</p>
          <h2>{copy.job.partnerTitle}</h2>
          <div className="partner-list">
            {partners.map((partner) => (
              <div className="partner-item is-straight-card" key={partner.id}>
                <div className="partner-icon">
                  {partner.iconUrl ? (
                    <img src={resolveMediaUrl(partner.iconUrl)} alt={partner.name} />
                  ) : (
                    <span>{partner.name.charAt(0)}</span>
                  )}
                </div>
                <strong>{partner.name}</strong>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

export default JobPartnerSection;
