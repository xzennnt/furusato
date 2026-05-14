import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fallbackHomeContent } from '../data/fallbackContent';
import { fetchJson, resolveMediaUrl } from '../lib/api';
import NewsTicker from './NewsTicker';

function JobPartnerSection() {
  const [content, setContent] = useState(fallbackHomeContent);
  const { jobInfo, jobBanner, partners } = content;
  const jobLink = jobInfo.linkUrl || jobBanner.linkUrl || '/berita';
  const isExternalJobLink = /^https?:\/\//i.test(jobLink);
  const jobBannerContent = (
    <>
      {jobBanner.imageUrl ? (
        <img src={resolveMediaUrl(jobBanner.imageUrl)} alt={jobInfo.title || jobBanner.title} />
      ) : (
        <div className="job-banner-placeholder">
          <span>UPLOAD BANNER INFORMASI</span>
        </div>
      )}
      <div className="job-banner-caption">
        <p className="eyebrow">{jobInfo.label || 'Info Job'}</p>
        <h2>{jobInfo.title || jobBanner.title}</h2>
        <p>{jobInfo.description || jobBanner.description}</p>
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
            <span className="hero-badge">Berita Terkini</span>
            <h2>Informasi kelas, seleksi, dan kegiatan peserta.</h2>
          </div>
          <NewsTicker />
        </div>

        {isExternalJobLink ? (
          <a className="job-banner-card sticker-card is-straight-card" href={jobLink} target="_blank" rel="noreferrer">
            {jobBannerContent}
          </a>
        ) : (
          <Link className="job-banner-card sticker-card is-straight-card" to={jobLink}>
            {jobBannerContent}
          </Link>
        )}

        <aside
          className={`partner-panel sticker-card is-straight-card partner-count-${partners.length} ${partners.length > 4 ? 'has-many-partners' : ''}`}
          aria-label="Mitra kerja sama"
        >
          <p className="eyebrow">Mitra Kerja Sama</p>
          <h2>Perusahaan dan LPK rekanan</h2>
          <div className="partner-list">
            {partners.map((partner) => (
              <div className="partner-item sticker-card is-straight-card" key={partner.id}>
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
