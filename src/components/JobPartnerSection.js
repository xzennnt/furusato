import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fallbackHomeContent } from '../data/fallbackContent';
import { API_BASE_URL, fetchJson } from '../lib/api';

function JobPartnerSection() {
  const [content, setContent] = useState(fallbackHomeContent);
  const { jobInfo, jobBanner, partners } = content;

  useEffect(() => {
    fetchJson('/api/home-content', fallbackHomeContent).then((data) => {
      setContent({
        jobInfo: { ...fallbackHomeContent.jobInfo, ...(data.jobInfo || {}) },
        jobBanner: { ...fallbackHomeContent.jobBanner, ...(data.jobBanner || {}) },
        partners: data.partners?.length ? data.partners : fallbackHomeContent.partners,
      });
    });
  }, []);

  return (
    <section className="job-partner-section">
      <div className="job-partner-layout">
        <div className="job-left-column">
          <Link className="job-info-card" to={jobInfo.linkUrl || '/berita'}>
            <p className="eyebrow">Info Job</p>
            <h2>{jobInfo.title}</h2>
            <p>{jobInfo.description}</p>
          </Link>

          <Link className="job-banner-card" to={jobBanner.linkUrl || '/berita'}>
            {jobBanner.imageUrl ? (
              <img src={`${API_BASE_URL}${jobBanner.imageUrl}`} alt={jobBanner.title} />
            ) : (
              <div className="job-banner-placeholder">
                <span>UPLOAD BANNER INFORMASI</span>
              </div>
            )}
            <div className="job-banner-caption">
              <h3>{jobBanner.title}</h3>
              <p>{jobBanner.description}</p>
            </div>
          </Link>
        </div>

        <aside className="partner-panel" aria-label="Mitra kerja sama">
          <p className="eyebrow">Mitra Kerja Sama</p>
          <h2>Perusahaan dan LPK rekanan</h2>
          <div className="partner-list">
            {partners.map((partner) => (
              <div className="partner-item" key={partner.id}>
                <div className="partner-icon">
                  {partner.iconUrl ? (
                    <img src={`${API_BASE_URL}${partner.iconUrl}`} alt={partner.name} />
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
