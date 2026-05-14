import { useEffect, useState } from 'react';
import { fallbackSite } from '../data/fallbackContent';
import { fetchSite, resolveMediaUrl } from '../lib/api';

function AboutSection() {
  const [site, setSite] = useState(fallbackSite);
  const aboutBackgroundUrl = site.backgrounds?.homeAboutUrl || '';
  const backgroundUrl = resolveMediaUrl(aboutBackgroundUrl);

  useEffect(() => {
    fetchSite(fallbackSite).then((data) => {
      setSite({
        ...fallbackSite,
        ...data,
        backgrounds: { ...fallbackSite.backgrounds, ...(data.backgrounds || {}) },
      });
    });
  }, []);

  return (
    <section
      id="tentang"
      className={`section-grid about-section ${backgroundUrl ? 'has-section-bg' : ''}`}
      style={backgroundUrl ? { '--section-bg': `url(${backgroundUrl})` } : undefined}
    >
      <div>
        <p className="eyebrow">Tentang Furusato Temanggung</p>
        <h2>Pelatihan kerja di Temanggung yang dekat dengan kebutuhan peserta dan mitra.</h2>
      </div>
      <div className="editable-note">
        {/* EDIT TEKS TENTANG FURUSATO DI SINI:
          Ganti paragraf berikut dengan profil resmi Furusato, izin lembaga,
          program unggulan, visi, misi, dan informasi lain yang ingin ditampilkan.
        */}
        <p>
          Furusato Temanggung adalah lembaga pelatihan kerja yang berfokus pada persiapan
          peserta agar siap memasuki lingkungan kerja profesional. Materi pelatihan
          mencakup kedisiplinan, komunikasi, dasar bahasa, etika kerja, dan praktik
          keterampilan yang disesuaikan dengan kebutuhan mitra kerja tujuan.
        </p>
      </div>
    </section>
  );
}

export default AboutSection;
