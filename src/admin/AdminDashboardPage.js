import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  API_BASE_URL,
  clearAdminToken,
  createGallery,
  createNews,
  deleteGallery,
  deleteNews,
  getAdminAccount,
  getGallery,
  getHomeContent,
  getNews,
  getSiteSettings,
  isAdminLoggedIn,
  updateAdminAccount,
  updateGallery,
  updateHomeContent,
  updateNews,
  updateSiteSettings,
  uploadImage,
} from './adminApi';

const emptyNews = { id: '', date: '', title: '', description: '', content: '' };
const emptyGallery = { id: '', title: '', description: '', imageUrl: '' };
const emptyAccount = { username: '', password: '' };
const emptySite = {
  brandName: '',
  brandSubtitle: '',
  logoUrl: '',
  address: '',
  phone: '',
  email: '',
  whatsapp: '',
  socials: { instagram: '', facebook: '', youtube: '', tiktok: '' },
};
const emptyHomeContent = {
  heroBackgroundUrl: '',
  jobInfo: { title: '', description: '', linkUrl: '/berita' },
  jobBanner: { title: '', description: '', imageUrl: '', linkUrl: '/berita' },
  partners: [],
};

function AdminDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('news');
  const [newsItems, setNewsItems] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [newsForm, setNewsForm] = useState(emptyNews);
  const [galleryForm, setGalleryForm] = useState(emptyGallery);
  const [accountForm, setAccountForm] = useState(emptyAccount);
  const [siteForm, setSiteForm] = useState(emptySite);
  const [homeContentForm, setHomeContentForm] = useState(emptyHomeContent);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      return;
    }

    refreshContent();
  }, []);

  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin/login" replace />;
  }

  async function refreshContent() {
    try {
      const [news, gallery, account, site, homeContent] = await Promise.all([
        getNews(),
        getGallery(),
        getAdminAccount(),
        getSiteSettings(),
        getHomeContent(),
      ]);
      setNewsItems(news);
      setGalleryItems(gallery);
      setAccountForm({ username: account.username, password: '' });
      setSiteForm({ ...emptySite, ...site, socials: { ...emptySite.socials, ...(site.socials || {}) } });
      setHomeContentForm({
        heroBackgroundUrl: homeContent.heroBackgroundUrl || '',
        jobInfo: { ...emptyHomeContent.jobInfo, ...(homeContent.jobInfo || {}) },
        jobBanner: { ...emptyHomeContent.jobBanner, ...(homeContent.jobBanner || {}) },
        partners: homeContent.partners || [],
      });
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  function resetFeedback() {
    setMessage('');
    setError('');
  }

  async function handleNewsSubmit(event) {
    event.preventDefault();
    resetFeedback();

    try {
      if (newsForm.id) {
        await updateNews(newsForm.id, newsForm);
        setMessage('Berita berhasil diperbarui.');
      } else {
        await createNews(newsForm);
        setMessage('Berita baru berhasil ditambahkan.');
      }

      setNewsForm(emptyNews);
      await refreshContent();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function handleGallerySubmit(event) {
    event.preventDefault();
    resetFeedback();

    try {
      if (galleryForm.id) {
        await updateGallery(galleryForm.id, galleryForm);
        setMessage('Galeri berhasil diperbarui.');
      } else {
        await createGallery(galleryForm);
        setMessage('Galeri baru berhasil ditambahkan.');
      }

      setGalleryForm(emptyGallery);
      await refreshContent();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function handleAccountSubmit(event) {
    event.preventDefault();
    resetFeedback();

    try {
      await updateAdminAccount(accountForm);
      setMessage('Akun admin berhasil diperbarui. Silakan login lagi dengan akun baru.');
      clearAdminToken();
      setTimeout(() => navigate('/admin/login', { replace: true }), 900);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function handleImageUpload(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    resetFeedback();

    try {
      const result = await uploadImage(file);
      setGalleryForm({ ...galleryForm, imageUrl: result.imageUrl });
      setMessage('Gambar berhasil diupload. Simpan galeri untuk memakai gambar ini.');
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function handleLogoUpload(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    resetFeedback();

    try {
      const result = await uploadImage(file);
      setSiteForm({ ...siteForm, logoUrl: result.imageUrl });
      setMessage('Logo berhasil diupload. Klik Simpan Site untuk memakai logo ini.');
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function handleJobBannerUpload(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    resetFeedback();

    try {
      const result = await uploadImage(file);
      setHomeContentForm({
        ...homeContentForm,
        jobBanner: { ...homeContentForm.jobBanner, imageUrl: result.imageUrl },
      });
      setMessage('Banner job berhasil diupload. Klik Simpan Job & Mitra untuk memakai banner ini.');
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function handleHeroBackgroundUpload(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    resetFeedback();

    try {
      const result = await uploadImage(file);
      setHomeContentForm({ ...homeContentForm, heroBackgroundUrl: result.imageUrl });
      setMessage('Background home berhasil diupload. Klik Simpan Job & Mitra untuk memakai background ini.');
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function handlePartnerIconUpload(index, file) {
    if (!file) {
      return;
    }

    resetFeedback();

    try {
      const result = await uploadImage(file);
      const partners = homeContentForm.partners.map((partner, partnerIndex) => (
        partnerIndex === index ? { ...partner, iconUrl: result.imageUrl } : partner
      ));
      setHomeContentForm({ ...homeContentForm, partners });
      setMessage('Icon mitra berhasil diupload. Klik Simpan Job & Mitra untuk menyimpan.');
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function handleHomeContentSubmit(event) {
    event.preventDefault();
    resetFeedback();

    try {
      await updateHomeContent(homeContentForm);
      setMessage('Banner job dan mitra berhasil diperbarui.');
      await refreshContent();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  function updatePartner(index, patch) {
    const partners = homeContentForm.partners.map((partner, partnerIndex) => (
      partnerIndex === index ? { ...partner, ...patch } : partner
    ));
    setHomeContentForm({ ...homeContentForm, partners });
  }

  function addPartner() {
    setHomeContentForm({
      ...homeContentForm,
      partners: [
        ...homeContentForm.partners,
        { id: `partner-${Date.now()}`, name: 'Mitra Baru', iconUrl: '' },
      ],
    });
  }

  function removePartner(index) {
    setHomeContentForm({
      ...homeContentForm,
      partners: homeContentForm.partners.filter((_partner, partnerIndex) => partnerIndex !== index),
    });
  }

  async function handleSiteSubmit(event) {
    event.preventDefault();
    resetFeedback();

    try {
      await updateSiteSettings(siteForm);
      setMessage('Logo dan informasi website berhasil diperbarui.');
      await refreshContent();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function handleDeleteNews(id) {
    resetFeedback();
    await deleteNews(id);
    setMessage('Berita berhasil dihapus.');
    await refreshContent();
  }

  async function handleDeleteGallery(id) {
    resetFeedback();
    await deleteGallery(id);
    setMessage('Galeri berhasil dihapus.');
    await refreshContent();
  }

  function logout() {
    clearAdminToken();
    navigate('/admin/login', { replace: true });
  }

  return (
    <section className="admin-dashboard">
      <header className="admin-dashboard-header">
        <div>
          <p className="eyebrow">Dashboard Admin</p>
          <h1>Manage Galeri dan Berita</h1>
        </div>
        <button type="button" onClick={logout}>Keluar</button>
      </header>

      <div className="admin-tabs" role="tablist" aria-label="Dashboard content">
        <button className={activeTab === 'news' ? 'active' : ''} type="button" onClick={() => setActiveTab('news')}>
          Berita
        </button>
        <button className={activeTab === 'gallery' ? 'active' : ''} type="button" onClick={() => setActiveTab('gallery')}>
          Galeri
        </button>
        <button className={activeTab === 'account' ? 'active' : ''} type="button" onClick={() => setActiveTab('account')}>
          Setting Akun
        </button>
        <button className={activeTab === 'site' ? 'active' : ''} type="button" onClick={() => setActiveTab('site')}>
          Logo & Site
        </button>
        <button className={activeTab === 'home' ? 'active' : ''} type="button" onClick={() => setActiveTab('home')}>
          Job & Mitra
        </button>
      </div>

      {message && <div className="admin-success">{message}</div>}
      {error && <div className="admin-error">{error}</div>}

      {activeTab === 'news' ? (
        <div className="admin-grid">
          <form className="admin-panel" onSubmit={handleNewsSubmit}>
            <h2>{newsForm.id ? 'Edit Berita' : 'Tambah Berita'}</h2>
            <label>
              Tanggal
              <input value={newsForm.date} onChange={(event) => setNewsForm({ ...newsForm, date: event.target.value })} placeholder="2026.05" />
            </label>
            <label>
              Judul
              <input value={newsForm.title} onChange={(event) => setNewsForm({ ...newsForm, title: event.target.value })} required />
            </label>
            <label>
              Deskripsi singkat
              <textarea value={newsForm.description} onChange={(event) => setNewsForm({ ...newsForm, description: event.target.value })} rows="3" />
            </label>
            <label>
              Isi berita
              <textarea value={newsForm.content} onChange={(event) => setNewsForm({ ...newsForm, content: event.target.value })} rows="6" />
            </label>
            <div className="admin-form-actions">
              <button type="submit">{newsForm.id ? 'Update Berita' : 'Tambah Berita'}</button>
              {newsForm.id && <button type="button" className="ghost-button" onClick={() => setNewsForm(emptyNews)}>Batal</button>}
            </div>
          </form>

          <div className="admin-panel admin-list">
            <h2>Daftar Berita</h2>
            {newsItems.map((item) => (
              <article key={item.id}>
                <time>{item.date}</time>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="admin-item-actions">
                  <button type="button" onClick={() => setNewsForm(item)}>Edit</button>
                  <button type="button" className="danger-button" onClick={() => handleDeleteNews(item.id)}>Hapus</button>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : activeTab === 'gallery' ? (
        <div className="admin-grid">
          <form className="admin-panel" onSubmit={handleGallerySubmit}>
            <h2>{galleryForm.id ? 'Edit Galeri' : 'Tambah Galeri'}</h2>
            <label>
              Judul
              <input value={galleryForm.title} onChange={(event) => setGalleryForm({ ...galleryForm, title: event.target.value })} required />
            </label>
            <label>
              Deskripsi
              <textarea value={galleryForm.description} onChange={(event) => setGalleryForm({ ...galleryForm, description: event.target.value })} rows="4" />
            </label>
            <label>
              Upload gambar
              <input type="file" accept="image/*" onChange={handleImageUpload} />
            </label>
            <label>
              URL gambar
              <input value={galleryForm.imageUrl} onChange={(event) => setGalleryForm({ ...galleryForm, imageUrl: event.target.value })} placeholder="/uploads/nama-file.jpg" />
            </label>
            {galleryForm.imageUrl && (
              <img className="admin-image-preview" src={`${API_BASE_URL}${galleryForm.imageUrl}`} alt="Preview galeri" />
            )}
            <div className="admin-form-actions">
              <button type="submit">{galleryForm.id ? 'Update Galeri' : 'Tambah Galeri'}</button>
              {galleryForm.id && <button type="button" className="ghost-button" onClick={() => setGalleryForm(emptyGallery)}>Batal</button>}
            </div>
          </form>

          <div className="admin-panel admin-list">
            <h2>Daftar Galeri</h2>
            {galleryItems.map((item) => (
              <article key={item.id}>
                {item.imageUrl && <img src={`${API_BASE_URL}${item.imageUrl}`} alt={item.title} />}
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="admin-item-actions">
                  <button type="button" onClick={() => setGalleryForm(item)}>Edit</button>
                  <button type="button" className="danger-button" onClick={() => handleDeleteGallery(item.id)}>Hapus</button>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : activeTab === 'account' ? (
        <div className="admin-grid single-admin-grid">
          <form className="admin-panel" onSubmit={handleAccountSubmit}>
            <h2>Setting Akun Admin</h2>
            <p>Username dan password disimpan di backend pada file `server/data/accounts.json`.</p>
            <label>
              Username
              <input
                value={accountForm.username}
                onChange={(event) => setAccountForm({ ...accountForm, username: event.target.value })}
                required
              />
            </label>
            <label>
              Password baru
              <input
                type="password"
                value={accountForm.password}
                onChange={(event) => setAccountForm({ ...accountForm, password: event.target.value })}
                placeholder="Masukkan password baru"
                required
              />
            </label>
            <div className="admin-form-actions">
              <button type="submit">Simpan Akun</button>
            </div>
          </form>
        </div>
      ) : activeTab === 'site' ? (
        <div className="admin-grid single-admin-grid">
          <form className="admin-panel" onSubmit={handleSiteSubmit}>
            <h2>Logo & Informasi Website</h2>
            <label>
              Upload logo navbar
              <input type="file" accept="image/*" onChange={handleLogoUpload} />
            </label>
            <label>
              URL logo
              <input value={siteForm.logoUrl} onChange={(event) => setSiteForm({ ...siteForm, logoUrl: event.target.value })} placeholder="/uploads/logo.png" />
            </label>
            {siteForm.logoUrl && (
              <img className="admin-logo-preview" src={`${API_BASE_URL}${siteForm.logoUrl}`} alt="Preview logo" />
            )}
            <label>
              Nama brand
              <input value={siteForm.brandName} onChange={(event) => setSiteForm({ ...siteForm, brandName: event.target.value })} />
            </label>
            <label>
              Subjudul brand
              <input value={siteForm.brandSubtitle} onChange={(event) => setSiteForm({ ...siteForm, brandSubtitle: event.target.value })} />
            </label>
            <label>
              Alamat
              <textarea value={siteForm.address} onChange={(event) => setSiteForm({ ...siteForm, address: event.target.value })} rows="3" />
            </label>
            <label>
              Telepon
              <input value={siteForm.phone} onChange={(event) => setSiteForm({ ...siteForm, phone: event.target.value })} />
            </label>
            <label>
              Email
              <input value={siteForm.email} onChange={(event) => setSiteForm({ ...siteForm, email: event.target.value })} />
            </label>
            <label>
              WhatsApp URL
              <input value={siteForm.whatsapp} onChange={(event) => setSiteForm({ ...siteForm, whatsapp: event.target.value })} />
            </label>
            <label>
              Instagram
              <input value={siteForm.socials.instagram} onChange={(event) => setSiteForm({ ...siteForm, socials: { ...siteForm.socials, instagram: event.target.value } })} />
            </label>
            <label>
              Facebook
              <input value={siteForm.socials.facebook} onChange={(event) => setSiteForm({ ...siteForm, socials: { ...siteForm.socials, facebook: event.target.value } })} />
            </label>
            <label>
              YouTube
              <input value={siteForm.socials.youtube} onChange={(event) => setSiteForm({ ...siteForm, socials: { ...siteForm.socials, youtube: event.target.value } })} />
            </label>
            <label>
              TikTok
              <input value={siteForm.socials.tiktok} onChange={(event) => setSiteForm({ ...siteForm, socials: { ...siteForm.socials, tiktok: event.target.value } })} />
            </label>
            <div className="admin-form-actions">
              <button type="submit">Simpan Site</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="admin-grid single-admin-grid">
          <form className="admin-panel" onSubmit={handleHomeContentSubmit}>
            <h2>Banner Job & Mitra</h2>
            <label>
              Upload background home
              <input type="file" accept="image/*" onChange={handleHeroBackgroundUpload} />
            </label>
            <label>
              URL background home
              <input
                value={homeContentForm.heroBackgroundUrl}
                onChange={(event) => setHomeContentForm({
                  ...homeContentForm,
                  heroBackgroundUrl: event.target.value,
                })}
                placeholder="/uploads/background-home.jpg"
              />
            </label>
            {homeContentForm.heroBackgroundUrl && (
              <img className="admin-image-preview" src={`${API_BASE_URL}${homeContentForm.heroBackgroundUrl}`} alt="Preview background home" />
            )}
            <label>
              Judul info job
              <input
                value={homeContentForm.jobInfo.title}
                onChange={(event) => setHomeContentForm({
                  ...homeContentForm,
                  jobInfo: { ...homeContentForm.jobInfo, title: event.target.value },
                })}
              />
            </label>
            <label>
              Deskripsi info job
              <textarea
                value={homeContentForm.jobInfo.description}
                onChange={(event) => setHomeContentForm({
                  ...homeContentForm,
                  jobInfo: { ...homeContentForm.jobInfo, description: event.target.value },
                })}
                rows="3"
              />
            </label>
            <label>
              Link info job
              <input
                value={homeContentForm.jobInfo.linkUrl}
                onChange={(event) => setHomeContentForm({
                  ...homeContentForm,
                  jobInfo: { ...homeContentForm.jobInfo, linkUrl: event.target.value },
                })}
              />
            </label>
            <label>
              Judul banner job
              <input
                value={homeContentForm.jobBanner.title}
                onChange={(event) => setHomeContentForm({
                  ...homeContentForm,
                  jobBanner: { ...homeContentForm.jobBanner, title: event.target.value },
                })}
              />
            </label>
            <label>
              Deskripsi banner job
              <textarea
                value={homeContentForm.jobBanner.description}
                onChange={(event) => setHomeContentForm({
                  ...homeContentForm,
                  jobBanner: { ...homeContentForm.jobBanner, description: event.target.value },
                })}
                rows="3"
              />
            </label>
            <label>
              Link banner
              <input
                value={homeContentForm.jobBanner.linkUrl}
                onChange={(event) => setHomeContentForm({
                  ...homeContentForm,
                  jobBanner: { ...homeContentForm.jobBanner, linkUrl: event.target.value },
                })}
              />
            </label>
            <label>
              Upload banner job
              <input type="file" accept="image/*" onChange={handleJobBannerUpload} />
            </label>
            <label>
              URL banner job
              <input
                value={homeContentForm.jobBanner.imageUrl}
                onChange={(event) => setHomeContentForm({
                  ...homeContentForm,
                  jobBanner: { ...homeContentForm.jobBanner, imageUrl: event.target.value },
                })}
              />
            </label>
            {homeContentForm.jobBanner.imageUrl && (
              <img className="admin-image-preview" src={`${API_BASE_URL}${homeContentForm.jobBanner.imageUrl}`} alt="Preview banner job" />
            )}

            <div className="admin-partner-editor">
              <div className="section-heading-row">
                <h2>Mitra Kerja Sama</h2>
                <button type="button" className="ghost-button" onClick={addPartner}>Tambah Mitra</button>
              </div>
              {homeContentForm.partners.map((partner, index) => (
                <div className="admin-partner-row" key={partner.id}>
                  <label>
                    Nama mitra
                    <input value={partner.name} onChange={(event) => updatePartner(index, { name: event.target.value })} />
                  </label>
                  <label>
                    Upload icon
                    <input type="file" accept="image/*" onChange={(event) => handlePartnerIconUpload(index, event.target.files?.[0])} />
                  </label>
                  <label>
                    URL icon
                    <input value={partner.iconUrl} onChange={(event) => updatePartner(index, { iconUrl: event.target.value })} />
                  </label>
                  {partner.iconUrl && <img className="admin-logo-preview" src={`${API_BASE_URL}${partner.iconUrl}`} alt={partner.name} />}
                  <button type="button" className="danger-button" onClick={() => removePartner(index)}>Hapus Mitra</button>
                </div>
              ))}
            </div>

            <div className="admin-form-actions">
              <button type="submit">Simpan Job & Mitra</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

export default AdminDashboardPage;
