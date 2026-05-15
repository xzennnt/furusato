import { useCallback, useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  clearAdminToken,
  createGallery,
  createLulusJob,
  createNews,
  deleteGallery,
  deleteLulusJob,
  deleteNews,
  getAboutContent,
  getAdminAccount,
  getGallery,
  getHomeContent,
  getLulusJobs,
  getNews,
  getSiteSettings,
  isAdminLoggedIn,
  refreshAdminSession,
  publishJobNews,
  updateAdminAccount,
  updateAboutContent,
  updateGallery,
  updateLulusJob,
  updateHomeContent,
  updateJobBanner,
  updateNews,
  updateSiteSettings,
  uploadImage,
} from './adminApi';
import { resolveMediaUrl } from '../lib/api';
import { fallbackAboutContent, fallbackLulusJobs } from '../data/fallbackContent';

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

const emptyNews = { id: '', date: getTodayDate(), title: '', description: '', content: '', imageUrl: '' };
const emptyGallery = { id: '', title: '', description: '', imageUrl: '' };
const emptyLulusJob = { id: '', name: '', origin: '', quote: '', imageUrl: '' };
const emptyAccount = { username: '', password: '' };
const emptySite = {
  brandName: '',
  brandSubtitle: '',
  logoUrl: '',
  backgrounds: {
    homeHeroUrl: '',
    homeAboutUrl: '',
    homeNewsUrl: '',
    aboutPageUrl: '',
    galleryPageUrl: '',
    lulusJobPageUrl: '',
  },
  address: '',
  phone: '',
  email: '',
  whatsapp: '',
  socials: { instagram: '', facebook: '', youtube: '', tiktok: '' },
};
const emptyHomeContent = {
  jobInfo: { label: 'Info Job', title: '', description: '', linkUrl: '/berita' },
  jobBanner: { title: '', description: '', imageUrl: '', linkUrl: '/berita' },
  partners: [],
};

function normalizeHomeContent(homeContent) {
  return {
    ...emptyHomeContent,
    ...homeContent,
    jobInfo: { ...emptyHomeContent.jobInfo, ...(homeContent.jobInfo || {}) },
    jobBanner: { ...emptyHomeContent.jobBanner, ...(homeContent.jobBanner || {}) },
    partners: homeContent.partners || [],
  };
}

function AdminDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('news');
  const [newsItems, setNewsItems] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [lulusJobItems, setLulusJobItems] = useState(fallbackLulusJobs);
  const [newsForm, setNewsForm] = useState(emptyNews);
  const [galleryForm, setGalleryForm] = useState(emptyGallery);
  const [lulusJobForm, setLulusJobForm] = useState(emptyLulusJob);
  const [accountForm, setAccountForm] = useState(emptyAccount);
  const [siteForm, setSiteForm] = useState(emptySite);
  const [homeContentForm, setHomeContentForm] = useState(emptyHomeContent);
  const [aboutContentForm, setAboutContentForm] = useState(fallbackAboutContent);
  const [message, setMessage] = useState('');
  const [messageTone, setMessageTone] = useState('success');
  const [error, setError] = useState('');
  const siteFormRef = useRef(emptySite);
  const lastSessionTouchRef = useRef(0);

  const refreshContent = useCallback(async () => {
    try {
      const [news, gallery, lulusJobs, account, site, homeContent, aboutContent] = await Promise.all([
        getNews(),
        getGallery(),
        getLulusJobs(),
        getAdminAccount(),
        getSiteSettings(),
        getHomeContent(),
        getAboutContent(),
      ]);
      setNewsItems(news);
      setGalleryItems(gallery);
      setLulusJobItems(Array.isArray(lulusJobs) ? lulusJobs : fallbackLulusJobs);
      setLulusJobForm(emptyLulusJob);
      setAccountForm({ username: account.username, password: '' });
      setSiteForm({
        ...emptySite,
        ...site,
        backgrounds: { ...emptySite.backgrounds, ...(site.backgrounds || {}) },
        socials: { ...emptySite.socials, ...(site.socials || {}) },
      });
      setHomeContentForm(normalizeHomeContent(homeContent));
      setAboutContentForm({
        ...fallbackAboutContent,
        ...aboutContent,
        profile: { ...fallbackAboutContent.profile, ...(aboutContent.profile || {}) },
        chairman: { ...fallbackAboutContent.chairman, ...(aboutContent.chairman || {}) },
        visionMission: { ...fallbackAboutContent.visionMission, ...(aboutContent.visionMission || {}) },
        programs: aboutContent.programs?.length ? aboutContent.programs : fallbackAboutContent.programs,
        slogan: { ...fallbackAboutContent.slogan, ...(aboutContent.slogan || {}) },
      });
    } catch (requestError) {
      clearAdminToken();
      navigate('/admin/login', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      return;
    }

    refreshContent();
  }, [refreshContent]);

  useEffect(() => {
    siteFormRef.current = siteForm;
  }, [siteForm]);

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      return undefined;
    }

    const verifyAdminSession = async () => {
      try {
        await getAdminAccount();
        refreshAdminSession();
        lastSessionTouchRef.current = Date.now();
      } catch (_requestError) {
        clearAdminToken();
        navigate('/admin/login', { replace: true });
      }
    };

    const touchAdminSession = () => {
      const now = Date.now();

      if (now - lastSessionTouchRef.current < 15000) {
        return;
      }

      refreshAdminSession();
      lastSessionTouchRef.current = now;
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        touchAdminSession();
        verifyAdminSession();
      }
    };

    const handleFocus = () => {
      touchAdminSession();
      verifyAdminSession();
    };

    const handleActivity = () => {
      touchAdminSession();
    };

    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        verifyAdminSession();
      } else {
        touchAdminSession();
      }
    }, 60000);

    window.addEventListener('focus', handleFocus);
    window.addEventListener('click', handleActivity, true);
    window.addEventListener('keydown', handleActivity, true);
    window.addEventListener('mousemove', handleActivity, true);
    window.addEventListener('touchstart', handleActivity, true);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    verifyAdminSession();

    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('click', handleActivity, true);
      window.removeEventListener('keydown', handleActivity, true);
      window.removeEventListener('mousemove', handleActivity, true);
      window.removeEventListener('touchstart', handleActivity, true);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [navigate]);

  useEffect(() => {
    if (!message && !error) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setMessage('');
      setError('');
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [message, error]);

  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin/login" replace />;
  }

  function resetFeedback() {
    setMessage('');
    setMessageTone('success');
    setError('');
  }

  function showToast(text, tone = 'success') {
    setMessageTone(tone);
    setMessage(text);
  }

  function scrollToAdminRow(rowType, rowId) {
    if (!rowType || !rowId) {
      return;
    }

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const targetRow = document.querySelector(`[data-admin-row="${rowType}"][data-row-id="${rowId}"]`);
        targetRow?.scrollIntoView({ block: 'start', behavior: 'smooth' });
      });
    });
  }

  function scrollToProgramRow(programId) {
    scrollToAdminRow('program', programId);
  }

  function scrollToPartnerRow(partnerId) {
    scrollToAdminRow('partner', partnerId);
  }

  function getDashboardScrollY() {
    return window.scrollY || window.pageYOffset || 0;
  }

  function restoreDashboardScroll(scrollY) {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: scrollY, behavior: 'auto' });
      });
    });
  }

  async function keepDashboardPosition(action) {
    const scrollY = getDashboardScrollY();

    try {
      return await action();
    } finally {
      restoreDashboardScroll(scrollY);
    }
  }

  async function saveHomeContent(payload, messageText) {
    await keepDashboardPosition(async () => {
      resetFeedback();

      try {
        const updatedHomeContent = await updateHomeContent(payload);
        setHomeContentForm(normalizeHomeContent(updatedHomeContent));
        setMessage(messageText);
      } catch (requestError) {
        setError(requestError.message);
      }
    });
  }

  async function saveJobBanner() {
    await keepDashboardPosition(async () => {
      resetFeedback();

      try {
        const updatedHomeContent = await updateJobBanner({
          jobInfo: homeContentForm.jobInfo,
          jobBanner: {
            ...homeContentForm.jobBanner,
            label: homeContentForm.jobInfo.label,
            title: homeContentForm.jobInfo.title,
            description: homeContentForm.jobInfo.description,
            linkUrl: homeContentForm.jobInfo.linkUrl || homeContentForm.jobBanner.linkUrl,
          },
        });
        setHomeContentForm(normalizeHomeContent(updatedHomeContent));
        setMessage('Banner info job berhasil disimpan.');
      } catch (requestError) {
        setError(requestError.message);
      }
    });
  }

  async function handleNewsSubmit(event) {
    event.preventDefault();
    await keepDashboardPosition(async () => {
      resetFeedback();

      try {
        if (newsForm.id) {
          const updatedNews = await updateNews(newsForm.id, newsForm);
          setNewsItems((currentItems) => (
            currentItems.map((item) => (item.id === updatedNews.id ? updatedNews : item))
          ));
          setMessage('Berita berhasil diperbarui.');
        } else {
          const createdNews = await createNews(newsForm);
          setNewsItems((currentItems) => [createdNews, ...currentItems]);
          setMessage('Berita baru berhasil ditambahkan.');
        }

        setNewsForm({ ...emptyNews, date: getTodayDate() });
      } catch (requestError) {
        setError(requestError.message);
      }
    });
  }

  async function handleNewsImageUpload(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    resetFeedback();

    try {
      const result = await uploadImage(file);
      setNewsForm((currentForm) => ({ ...currentForm, imageUrl: result.imageUrl }));
      setMessage('Gambar berita berhasil diupload. Klik Tambah/Update Berita untuk menyimpan.');
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function handleGallerySubmit(event) {
    event.preventDefault();
    await keepDashboardPosition(async () => {
      resetFeedback();

      try {
        if (galleryForm.id) {
          const updatedGallery = await updateGallery(galleryForm.id, galleryForm);
          setGalleryItems((currentItems) => (
            currentItems.map((item) => (item.id === updatedGallery.id ? updatedGallery : item))
          ));
          setMessage('Galeri berhasil diperbarui.');
        } else {
          const createdGallery = await createGallery(galleryForm);
          setGalleryItems((currentItems) => [createdGallery, ...currentItems]);
          setMessage('Galeri baru berhasil ditambahkan.');
        }

        setGalleryForm(emptyGallery);
      } catch (requestError) {
        setError(requestError.message);
      }
    });
  }

  async function handleLulusJobSubmit(event) {
    event.preventDefault();
    await keepDashboardPosition(async () => {
      resetFeedback();

      try {
        if (lulusJobForm.id) {
          const updatedLulusJob = await updateLulusJob(lulusJobForm.id, lulusJobForm);
          setLulusJobItems((currentItems) => (
            currentItems.map((item) => (item.id === updatedLulusJob.id ? updatedLulusJob : item))
          ));
          setMessage('Data siswa lulus job berhasil diperbarui.');
        } else {
          const createdLulusJob = await createLulusJob(lulusJobForm);
          setLulusJobItems((currentItems) => [createdLulusJob, ...currentItems]);
          setMessage('Data siswa lulus job berhasil ditambahkan.');
        }

        setLulusJobForm(emptyLulusJob);
      } catch (requestError) {
        setError(requestError.message);
      }
    });
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
      setSiteForm((currentForm) => ({ ...currentForm, logoUrl: result.imageUrl }));
      setMessage('Logo berhasil diupload. Klik Simpan Site untuk memakai logo ini.');
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function handleLulusJobImageUpload(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    resetFeedback();

    try {
      const result = await uploadImage(file);
      setLulusJobForm((currentForm) => ({ ...currentForm, imageUrl: result.imageUrl }));
      setMessage('Gambar siswa lulus job berhasil diupload. Klik simpan untuk memakai gambar ini.');
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
      setHomeContentForm((currentForm) => ({
        ...currentForm,
          jobBanner: {
            ...currentForm.jobBanner,
            imageUrl: result.imageUrl,
            label: currentForm.jobInfo.label,
            title: currentForm.jobInfo.title,
            description: currentForm.jobInfo.description,
            linkUrl: currentForm.jobInfo.linkUrl || currentForm.jobBanner.linkUrl,
            newsId: currentForm.jobInfo.newsId || currentForm.jobBanner.newsId || '',
          },
        }));
      setMessage('Banner job berhasil diupload. Klik Simpan Banner untuk memakai gambar ini.');
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function handleSiteBackgroundUpload(key, file) {
    if (!file) {
      return;
    }

    resetFeedback();

    try {
      const result = await uploadImage(file);
      setSiteForm((currentForm) => ({
        ...currentForm,
        backgrounds: {
          ...currentForm.backgrounds,
          [key]: result.imageUrl,
        },
      }));
      const uploadMessage = {
        homeHeroUrl: 'Background hero home berhasil diupload. Klik simpan untuk memakai gambar ini.',
        homeAboutUrl: 'Background tentang kami home berhasil diupload. Klik simpan untuk memakai gambar ini.',
        homeNewsUrl: 'Background berita home berhasil diupload. Klik simpan untuk memakai gambar ini.',
        aboutPageUrl: 'Background halaman tentang Furusato berhasil diupload. Klik simpan untuk memakai gambar ini.',
        galleryPageUrl: 'Background halaman galeri berhasil diupload. Klik simpan untuk memakai gambar ini.',
        lulusJobPageUrl: 'Background halaman lulus job berhasil diupload. Klik simpan untuk memakai gambar ini.',
      }[key] || 'Background berhasil diupload. Klik simpan untuk memakai gambar ini.';

      setMessage(uploadMessage);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function handleChairmanImageUpload(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    resetFeedback();

    try {
      const result = await uploadImage(file);
      setAboutContentForm({
        ...aboutContentForm,
        chairman: { ...aboutContentForm.chairman, imageUrl: result.imageUrl },
      });
      setMessage('Foto ketua berhasil diupload. Klik Simpan Tentang Furusato untuk memakai foto ini.');
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function handleAboutProgramImageUpload(programId, file) {
    if (!file) {
      return;
    }

    resetFeedback();

    try {
      const result = await uploadImage(file);
      const programs = aboutContentForm.programs.map((program, programIndex) => (
        program.id === programId ? { ...program, imageUrl: result.imageUrl } : program
      ));
      setAboutContentForm({ ...aboutContentForm, programs });
      setMessage('Gambar program berhasil diupload. Klik tombol simpan pada panel terkait untuk menyimpan.');
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  function updateAboutProgram(programId, patch) {
    const programs = aboutContentForm.programs.map((program, programIndex) => (
      program.id === programId ? { ...program, ...patch } : program
    ));
    setAboutContentForm({ ...aboutContentForm, programs });
  }

  function addAboutProgram() {
    const newProgram = { id: `program-${Date.now()}`, title: 'Program Baru', description: '', imageUrl: '' };

    setAboutContentForm({
      ...aboutContentForm,
      programs: [
        ...aboutContentForm.programs,
        newProgram,
      ],
    });
    showToast(activeTab === 'about' ? 'Program kerja Furusato berhasil ditambahkan.' : 'Program home berhasil ditambahkan.');
    scrollToProgramRow(newProgram.id);
  }

  function removeAboutProgram(programId) {
    const currentIndex = aboutContentForm.programs.findIndex((program) => program.id === programId);
    const nextPrograms = aboutContentForm.programs.filter((program) => program.id !== programId);
    const nextProgram = nextPrograms[Math.min(currentIndex, nextPrograms.length - 1)];

    setAboutContentForm({
      ...aboutContentForm,
      programs: nextPrograms,
    });
    showToast(activeTab === 'about' ? 'Program kerja Furusato berhasil dihapus.' : 'Program home berhasil dihapus.', 'delete');
    scrollToProgramRow(nextProgram?.id);
  }

  function updateSiteBackground(key, value) {
    setSiteForm({
      ...siteForm,
      backgrounds: {
        ...siteForm.backgrounds,
        [key]: value,
      },
    });
  }

  async function handlePartnerIconUpload(partnerId, file) {
    if (!file) {
      return;
    }

    await keepDashboardPosition(async () => {
      resetFeedback();

      try {
        const result = await uploadImage(file);
        const partners = homeContentForm.partners.map((partner, partnerIndex) => (
          partner.id === partnerId ? { ...partner, iconUrl: result.imageUrl } : partner
        ));
        setHomeContentForm({ ...homeContentForm, partners });
        setMessage('Icon mitra berhasil diupload. Klik Simpan Mitra untuk menyimpan.');
      } catch (requestError) {
        setError(requestError.message);
      }
    });
  }

  async function handlePublishJobNews() {
    await keepDashboardPosition(async () => {
      resetFeedback();

      try {
        const today = new Date();
        const { newsItem: publishedNews, homeContent: updatedHomeContent } = await publishJobNews({
          date: today.toISOString().slice(0, 10),
          title: homeContentForm.jobInfo.title || 'Info Job Baru',
          description: homeContentForm.jobInfo.description || '',
          content: [
            homeContentForm.jobInfo.description || '',
            homeContentForm.jobInfo.linkUrl ? `Link informasi: ${homeContentForm.jobInfo.linkUrl}` : '',
          ].filter(Boolean).join('\n\n'),
          imageUrl: homeContentForm.jobBanner.imageUrl || '',
          source: 'job-banner',
          jobInfo: homeContentForm.jobInfo,
          jobBanner: homeContentForm.jobBanner,
        });
        setNewsItems((currentItems) => [
          publishedNews,
          ...currentItems.filter((item) => item.id !== publishedNews.id),
        ]);
        setActiveTab('news');
        setHomeContentForm(normalizeHomeContent(updatedHomeContent));
        setMessage('Info job berhasil diposting ke Berita dan link banner sudah diarahkan ke artikel tersebut.');
      } catch (requestError) {
        setError(requestError.message);
      }
    });
  }

  function updatePartner(partnerId, patch) {
    const partners = homeContentForm.partners.map((partner, partnerIndex) => (
      partner.id === partnerId ? { ...partner, ...patch } : partner
    ));
    setHomeContentForm({ ...homeContentForm, partners });
  }

  function addPartner() {
    const newPartner = { id: `partner-${Date.now()}`, name: 'Mitra Baru', iconUrl: '' };

    setHomeContentForm({
      ...homeContentForm,
      partners: [
        ...homeContentForm.partners,
        newPartner,
      ],
    });
    showToast('Mitra kerja sama berhasil ditambahkan.');
    scrollToPartnerRow(newPartner.id);
  }

  function removePartner(partnerId) {
    const currentIndex = homeContentForm.partners.findIndex((partner) => partner.id === partnerId);
    const nextPartners = homeContentForm.partners.filter((partner) => partner.id !== partnerId);
    const nextPartner = nextPartners[Math.min(currentIndex, nextPartners.length - 1)];

    setHomeContentForm({
      ...homeContentForm,
      partners: nextPartners,
    });
    showToast('Mitra kerja sama berhasil dihapus.', 'delete');
    scrollToPartnerRow(nextPartner?.id);
  }

  async function handleSiteSubmit(event) {
    event.preventDefault();
    await keepDashboardPosition(async () => {
      resetFeedback();

      try {
        const updatedSite = await updateSiteSettings(siteFormRef.current);
        setSiteForm({
          ...emptySite,
          ...updatedSite,
          backgrounds: { ...emptySite.backgrounds, ...(updatedSite.backgrounds || {}) },
          socials: { ...emptySite.socials, ...(updatedSite.socials || {}) },
        });
        setMessage(activeTab === 'lulusJob'
          ? 'Background halaman siswa lulus job berhasil diperbarui.'
          : 'Logo dan informasi website berhasil diperbarui.');
      } catch (requestError) {
        setError(requestError.message);
      }
    });
  }

  async function handleAboutContentSubmit(event) {
    event.preventDefault();
    await keepDashboardPosition(async () => {
      resetFeedback();

      try {
        const updatedAboutContent = await updateAboutContent(aboutContentForm);
        setAboutContentForm({
          ...fallbackAboutContent,
          ...updatedAboutContent,
          profile: { ...fallbackAboutContent.profile, ...(updatedAboutContent.profile || {}) },
          chairman: { ...fallbackAboutContent.chairman, ...(updatedAboutContent.chairman || {}) },
          visionMission: { ...fallbackAboutContent.visionMission, ...(updatedAboutContent.visionMission || {}) },
          programs: updatedAboutContent.programs?.length ? updatedAboutContent.programs : fallbackAboutContent.programs,
          slogan: { ...fallbackAboutContent.slogan, ...(updatedAboutContent.slogan || {}) },
        });
        setMessage('Konten Tentang Furusato berhasil disimpan.');
      } catch (requestError) {
        setError(requestError.message);
      }
    });
  }

  async function handleProgramHomeSubmit(event) {
    event.preventDefault();
    await keepDashboardPosition(async () => {
      resetFeedback();

      try {
        const updatedAboutContent = await updateAboutContent(aboutContentForm);
        setAboutContentForm({
          ...fallbackAboutContent,
          ...updatedAboutContent,
          profile: { ...fallbackAboutContent.profile, ...(updatedAboutContent.profile || {}) },
          chairman: { ...fallbackAboutContent.chairman, ...(updatedAboutContent.chairman || {}) },
          visionMission: { ...fallbackAboutContent.visionMission, ...(updatedAboutContent.visionMission || {}) },
          programs: updatedAboutContent.programs?.length ? updatedAboutContent.programs : fallbackAboutContent.programs,
          slogan: { ...fallbackAboutContent.slogan, ...(updatedAboutContent.slogan || {}) },
        });
        setMessage('Program home berhasil disimpan.');
      } catch (requestError) {
        setError(requestError.message);
      }
    });
  }

  async function handleDeleteNews(id) {
    await keepDashboardPosition(async () => {
      resetFeedback();
      await deleteNews(id);
      setNewsItems((currentItems) => currentItems.filter((item) => item.id !== id));
      showToast('Berita berhasil dihapus.', 'delete');
    });
  }

  async function handleDeleteGallery(id) {
    await keepDashboardPosition(async () => {
      resetFeedback();
      await deleteGallery(id);
      setGalleryItems((currentItems) => currentItems.filter((item) => item.id !== id));
      showToast('Galeri berhasil dihapus.', 'delete');
    });
  }

  async function handleDeleteLulusJob(id) {
    await keepDashboardPosition(async () => {
      resetFeedback();
      await deleteLulusJob(id);
      setLulusJobItems((currentItems) => currentItems.filter((item) => item.id !== id));
      if (lulusJobForm.id === id) {
        setLulusJobForm(emptyLulusJob);
      }
      showToast('Data siswa lulus job berhasil dihapus.', 'delete');
    });
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
        <button className={activeTab === 'lulusJob' ? 'active' : ''} type="button" onClick={() => setActiveTab('lulusJob')}>
          Lulus Job
        </button>
        <button className={activeTab === 'about' ? 'active' : ''} type="button" onClick={() => setActiveTab('about')}>
          Tentang Furusato
        </button>
        <button className={activeTab === 'account' ? 'active' : ''} type="button" onClick={() => setActiveTab('account')}>
          Setting Akun
        </button>
        <button className={activeTab === 'site' ? 'active' : ''} type="button" onClick={() => setActiveTab('site')}>
          Logo & Site
        </button>
        <button className={activeTab === 'homeBackgrounds' ? 'active' : ''} type="button" onClick={() => setActiveTab('homeBackgrounds')}>
          Background Home
        </button>
        <button className={activeTab === 'home' ? 'active' : ''} type="button" onClick={() => setActiveTab('home')}>
          Job & Mitra
        </button>
      </div>

      {message && <div className={`admin-success ${messageTone === 'delete' ? 'is-delete' : ''}`}>{message}</div>}
      {error && <div className="admin-error">{error}</div>}

      {activeTab === 'news' ? (
        <div className="admin-grid">
          <form className="admin-panel" onSubmit={handleNewsSubmit}>
            <h2>{newsForm.id ? 'Edit Berita' : 'Tambah Berita'}</h2>
            <label>
              Tanggal
              <input type="date" value={newsForm.date || getTodayDate()} onChange={(event) => setNewsForm({ ...newsForm, date: event.target.value })} />
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
            <label>
              Upload gambar berita
              <input type="file" accept="image/*" onChange={handleNewsImageUpload} />
            </label>
            <label>
              URL gambar berita
              <input value={newsForm.imageUrl || ''} onChange={(event) => setNewsForm({ ...newsForm, imageUrl: event.target.value })} placeholder="/uploads/gambar-berita.jpg" />
            </label>
            {newsForm.imageUrl && (
              <img className="admin-image-preview" src={resolveMediaUrl(newsForm.imageUrl)} alt="Preview berita" />
            )}
            <div className="admin-form-actions">
              <button type="submit">{newsForm.id ? 'Update Berita' : 'Tambah Berita'}</button>
              {newsForm.id && <button type="button" className="ghost-button" onClick={() => setNewsForm({ ...emptyNews, date: getTodayDate() })}>Batal</button>}
            </div>
          </form>

          <div className="admin-panel admin-list">
            <h2>Daftar Berita</h2>
            {newsItems.map((item) => (
              <article data-admin-row="news" data-row-id={item.id} key={item.id}>
                <p className="admin-card-meta">ID: {item.id}</p>
                {item.imageUrl && <img src={resolveMediaUrl(item.imageUrl)} alt={item.title} />}
                <time>{item.date}</time>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="admin-item-actions">
                  <button type="button" onClick={() => setNewsForm({ ...item })}>Edit</button>
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
              <img className="admin-image-preview" src={resolveMediaUrl(galleryForm.imageUrl)} alt="Preview galeri" />
            )}
            <div className="admin-form-actions">
              <button type="submit">{galleryForm.id ? 'Update Galeri' : 'Tambah Galeri'}</button>
              {galleryForm.id && <button type="button" className="ghost-button" onClick={() => setGalleryForm(emptyGallery)}>Batal</button>}
            </div>
          </form>

          <div className="admin-panel admin-list">
            <h2>Daftar Galeri</h2>
            {galleryItems.map((item) => (
              <article data-admin-row="gallery" data-row-id={item.id} key={item.id}>
                <p className="admin-card-meta">ID: {item.id}</p>
                {item.imageUrl && <img src={resolveMediaUrl(item.imageUrl)} alt={item.title} />}
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="admin-item-actions">
                  <button type="button" onClick={() => setGalleryForm({ ...item })}>Edit</button>
                  <button type="button" className="danger-button" onClick={() => handleDeleteGallery(item.id)}>Hapus</button>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : activeTab === 'lulusJob' ? (
        <div className="admin-grid lulus-job-admin-grid">
          <form className="admin-panel" onSubmit={handleSiteSubmit}>
            <h2>Siswa Lulus Job</h2>
            <p>Kelola background halaman dan data siswa yang sudah lulus job dari satu panel.</p>

            <div className="admin-field-group">
              <h3>Background Page</h3>
              <label>
                Upload background halaman
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleSiteBackgroundUpload('lulusJobPageUrl', event.target.files?.[0])}
                />
              </label>
              <label>
                URL background halaman
                <input
                  value={siteForm.backgrounds.lulusJobPageUrl || ''}
                  onChange={(event) => updateSiteBackground('lulusJobPageUrl', event.target.value)}
                  placeholder="/uploads/background-lulus-job.jpg"
                />
              </label>
              {siteForm.backgrounds.lulusJobPageUrl && (
                <img className="admin-image-preview" src={resolveMediaUrl(siteForm.backgrounds.lulusJobPageUrl)} alt="Preview background page lulus job" />
              )}
              <p className="admin-help-text">
                Background ini dipakai di halaman <strong>Lulus Job</strong> pada bagian hero.
              </p>
            </div>

            <div className="admin-form-actions">
              <button type="submit">Simpan Background Lulus Job</button>
            </div>
          </form>

          <div className="lulus-job-editor-stack">
            <form className="admin-panel" onSubmit={handleLulusJobSubmit}>
              <div className="section-heading-row">
                <div>
                  <h2>Data Siswa Lulus Job</h2>
                  <p>Tambahkan kartu siswa berisi foto, nama, asal, dan kata-kata singkat setelah lulus.</p>
                </div>
              </div>

              <label>
                Nama siswa
                <input
                  value={lulusJobForm.name}
                  onChange={(event) => setLulusJobForm({ ...lulusJobForm, name: event.target.value })}
                  required
                  placeholder="Nama siswa"
                />
              </label>
              <label>
                Asal
                <input
                  value={lulusJobForm.origin}
                  onChange={(event) => setLulusJobForm({ ...lulusJobForm, origin: event.target.value })}
                  placeholder="Temanggung"
                />
              </label>
              <label>
                Kata-kata siswa
                <textarea
                  value={lulusJobForm.quote}
                  onChange={(event) => setLulusJobForm({ ...lulusJobForm, quote: event.target.value })}
                  rows="4"
                  placeholder="Pesan singkat dari siswa lulus job"
                />
              </label>
              <label>
                Upload foto siswa
                <input type="file" accept="image/*" onChange={handleLulusJobImageUpload} />
              </label>
              <label>
                URL foto siswa
                <input
                  value={lulusJobForm.imageUrl || ''}
                  onChange={(event) => setLulusJobForm({ ...lulusJobForm, imageUrl: event.target.value })}
                  placeholder="/uploads/siswa-lulus.jpg"
                />
              </label>
              {lulusJobForm.imageUrl && (
                <img className="admin-image-preview" src={resolveMediaUrl(lulusJobForm.imageUrl)} alt="Preview siswa lulus job" />
              )}
              <div className="admin-form-actions">
                <button type="submit">{lulusJobForm.id ? 'Update Siswa' : 'Tambah Siswa'}</button>
                {lulusJobForm.id && <button type="button" className="ghost-button" onClick={() => setLulusJobForm(emptyLulusJob)}>Batal</button>}
              </div>
            </form>

            <div className="admin-panel admin-list admin-lulus-job-list">
              <div className="section-heading-row">
                <div>
                  <h2>History Siswa Lulus Job</h2>
                  <p>Daftar siswa yang sudah lulus dan siap tampil di halaman publik.</p>
                </div>
              </div>
              {lulusJobItems.map((item) => (
                <article data-admin-row="lulus-job" data-row-id={item.id} key={item.id}>
                  <p className="admin-card-meta">ID: {item.id}</p>
                  {item.imageUrl && <img src={resolveMediaUrl(item.imageUrl)} alt={item.name} />}
                  <h3>{item.name}</h3>
                  <p className="admin-card-meta">{item.origin}</p>
                  <p>{item.quote}</p>
                  <div className="admin-item-actions">
                    <button type="button" onClick={() => setLulusJobForm({ ...item })}>Edit</button>
                    <button type="button" className="danger-button" onClick={() => handleDeleteLulusJob(item.id)}>Hapus</button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      ) : activeTab === 'about' ? (
        <div className="admin-grid about-admin-grid">
          <form className="admin-panel" onSubmit={handleAboutContentSubmit}>
            <h2>Tentang Furusato</h2>
            <div className="admin-field-group">
              <h3>1. Konten Tentang Furusato</h3>
              <label>
                Label kecil
                <input value={aboutContentForm.profile.eyebrow} onChange={(event) => setAboutContentForm({ ...aboutContentForm, profile: { ...aboutContentForm.profile, eyebrow: event.target.value } })} />
              </label>
              <label>
                Judul
                <input value={aboutContentForm.profile.title} onChange={(event) => setAboutContentForm({ ...aboutContentForm, profile: { ...aboutContentForm.profile, title: event.target.value } })} />
              </label>
              <label>
                Isi konten
                <textarea value={aboutContentForm.profile.body} onChange={(event) => setAboutContentForm({ ...aboutContentForm, profile: { ...aboutContentForm.profile, body: event.target.value } })} rows="7" />
              </label>
            </div>

            <div className="admin-field-group">
              <h3>2. Sambutan Ketua</h3>
              <label>
                Label kecil
                <input value={aboutContentForm.chairman.eyebrow} onChange={(event) => setAboutContentForm({ ...aboutContentForm, chairman: { ...aboutContentForm.chairman, eyebrow: event.target.value } })} />
              </label>
              <label>
                Nama ketua
                <input value={aboutContentForm.chairman.name} onChange={(event) => setAboutContentForm({ ...aboutContentForm, chairman: { ...aboutContentForm.chairman, name: event.target.value } })} />
              </label>
              <label>
                Upload foto ketua
                <input type="file" accept="image/*" onChange={handleChairmanImageUpload} />
              </label>
              <label>
                URL foto ketua
                <input value={aboutContentForm.chairman.imageUrl || ''} onChange={(event) => setAboutContentForm({ ...aboutContentForm, chairman: { ...aboutContentForm.chairman, imageUrl: event.target.value } })} placeholder="/uploads/foto-ketua.jpg" />
              </label>
              {aboutContentForm.chairman.imageUrl && (
                <img className="admin-image-preview" src={resolveMediaUrl(aboutContentForm.chairman.imageUrl)} alt="Preview foto ketua" />
              )}
              <label>
                Isi sambutan
                <textarea value={aboutContentForm.chairman.body} onChange={(event) => setAboutContentForm({ ...aboutContentForm, chairman: { ...aboutContentForm.chairman, body: event.target.value } })} rows="7" />
              </label>
            </div>

            <div className="admin-field-group">
              <h3>3. Visi Misi</h3>
              <label>
                Judul visi
                <input value={aboutContentForm.visionMission.visionTitle} onChange={(event) => setAboutContentForm({ ...aboutContentForm, visionMission: { ...aboutContentForm.visionMission, visionTitle: event.target.value } })} />
              </label>
              <label>
                Isi visi
                <textarea value={aboutContentForm.visionMission.vision} onChange={(event) => setAboutContentForm({ ...aboutContentForm, visionMission: { ...aboutContentForm.visionMission, vision: event.target.value } })} rows="4" />
              </label>
              <label>
                Judul misi
                <input value={aboutContentForm.visionMission.missionTitle} onChange={(event) => setAboutContentForm({ ...aboutContentForm, visionMission: { ...aboutContentForm.visionMission, missionTitle: event.target.value } })} />
              </label>
              <label>
                Isi misi
                <textarea value={aboutContentForm.visionMission.mission} onChange={(event) => setAboutContentForm({ ...aboutContentForm, visionMission: { ...aboutContentForm.visionMission, mission: event.target.value } })} rows="6" />
              </label>
            </div>

            <div className="admin-field-group">
              <h3>4. Slogan</h3>
              <label>
                Label kecil
                <input value={aboutContentForm.slogan.eyebrow} onChange={(event) => setAboutContentForm({ ...aboutContentForm, slogan: { ...aboutContentForm.slogan, eyebrow: event.target.value } })} />
              </label>
              <label>
                Judul slogan
                <input value={aboutContentForm.slogan.title} onChange={(event) => setAboutContentForm({ ...aboutContentForm, slogan: { ...aboutContentForm.slogan, title: event.target.value } })} />
              </label>
              <label>
                Teks tombol
                <input value={aboutContentForm.slogan.buttonText} onChange={(event) => setAboutContentForm({ ...aboutContentForm, slogan: { ...aboutContentForm.slogan, buttonText: event.target.value } })} />
              </label>
              <label>
                URL tombol
                <input value={aboutContentForm.slogan.buttonUrl} onChange={(event) => setAboutContentForm({ ...aboutContentForm, slogan: { ...aboutContentForm.slogan, buttonUrl: event.target.value } })} />
              </label>
            </div>

            <div className="admin-form-actions">
              <button type="submit">Simpan Tentang Furusato</button>
            </div>
          </form>

          <form className="admin-panel" onSubmit={handleProgramHomeSubmit}>
            <div className="section-heading-row">
              <h2>Program Kerja Furusato</h2>
                <button type="button" className="ghost-button add-button" onClick={addAboutProgram}>Tambah Program</button>
            </div>
            {aboutContentForm.programs.map((program, index) => (
              <div
                className="admin-partner-row"
                data-admin-row="program"
                data-row-id={program.id}
                key={program.id}
              >
                <p className="admin-card-meta">ID: {program.id}</p>
                <label>
                  Judul program
                  <input value={program.title} onChange={(event) => updateAboutProgram(program.id, { title: event.target.value })} />
                </label>
                <label>
                  Deskripsi program
                  <textarea value={program.description} onChange={(event) => updateAboutProgram(program.id, { description: event.target.value })} rows="3" />
                </label>
                <label>
                  Upload gambar program
                  <input type="file" accept="image/*" onChange={(event) => handleAboutProgramImageUpload(program.id, event.target.files?.[0])} />
                </label>
                <label>
                  URL gambar program
                  <input value={program.imageUrl || ''} onChange={(event) => updateAboutProgram(program.id, { imageUrl: event.target.value })} placeholder="/uploads/program.jpg" />
                </label>
                {program.imageUrl && (
                  <img className="admin-image-preview" src={resolveMediaUrl(program.imageUrl)} alt={program.title} />
                )}
                <button type="button" className="danger-button" onClick={() => removeAboutProgram(program.id)}>Hapus Program</button>
              </div>
            ))}
            <div className="admin-form-actions">
              <button type="submit">Simpan Program Kerja</button>
            </div>
          </form>
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
      ) : activeTab === 'homeBackgrounds' ? (
        <div className="admin-grid background-home-admin-grid">
          <form className="admin-panel" onSubmit={handleSiteSubmit}>
            <h2>Background Home</h2>
            <p>Kelola semua background yang tampil di halaman beranda dari satu tempat. Sesuaikan gambar dengan layout masing-masing komponen.</p>

            <div className="admin-field-group">
              <h3>Hero Home</h3>
              <label>
                Upload background hero
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleSiteBackgroundUpload('homeHeroUrl', event.target.files?.[0])}
                />
              </label>
              <label>
                URL background hero
                <input
                  value={siteForm.backgrounds.homeHeroUrl}
                  onChange={(event) => updateSiteBackground('homeHeroUrl', event.target.value)}
                  placeholder="/uploads/background-home.jpg"
                />
              </label>
              {siteForm.backgrounds.homeHeroUrl && (
                <img className="admin-image-preview" src={resolveMediaUrl(siteForm.backgrounds.homeHeroUrl)} alt="Preview background hero home" />
              )}
            </div>

            <div className="admin-field-group">
              <h3>Tentang Kami Home</h3>
              <label>
                Upload background tentang kami
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleSiteBackgroundUpload('homeAboutUrl', event.target.files?.[0])}
                />
              </label>
              <label>
                URL background tentang kami
                <input
                  value={siteForm.backgrounds.homeAboutUrl}
                  onChange={(event) => updateSiteBackground('homeAboutUrl', event.target.value)}
                  placeholder="/uploads/background-tentang.jpg"
                />
              </label>
              {siteForm.backgrounds.homeAboutUrl && (
                <img className="admin-image-preview" src={resolveMediaUrl(siteForm.backgrounds.homeAboutUrl)} alt="Preview background tentang kami home" />
              )}
            </div>

            <div className="admin-field-group">
              <h3>Berita Home</h3>
              <label>
                Upload background informasi terbaru
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleSiteBackgroundUpload('homeNewsUrl', event.target.files?.[0])}
                />
              </label>
              <label>
                URL background informasi terbaru
                <input
                  value={siteForm.backgrounds.homeNewsUrl}
                  onChange={(event) => updateSiteBackground('homeNewsUrl', event.target.value)}
                  placeholder="/uploads/background-berita.jpg"
                />
              </label>
              {siteForm.backgrounds.homeNewsUrl && (
                <img className="admin-image-preview" src={resolveMediaUrl(siteForm.backgrounds.homeNewsUrl)} alt="Preview background berita home" />
              )}
            </div>

            <div className="admin-form-actions">
              <button type="submit">Simpan Background Home</button>
            </div>
          </form>

          <form className="admin-panel" onSubmit={handleProgramHomeSubmit}>
            <div className="section-heading-row">
              <div>
                <h2>Program Home</h2>
                <p>Kelola card program di halaman beranda, termasuk judul, deskripsi, dan background. Sesuaikan gambar dengan frame program agar isi card mudah terlihat banyak.</p>
              </div>
              <button type="button" className="ghost-button add-button" onClick={addAboutProgram}>Tambah Program</button>
            </div>

            {aboutContentForm.programs.map((program, index) => (
              <div
                className="admin-field-group"
                data-admin-row="program"
              data-row-id={program.id}
              key={program.id || program.title}
              >
                <p className="admin-card-meta">ID: {program.id}</p>
                <h3>{program.title || `Program ${index + 1}`}</h3>
                <label>
                  Judul program
                  <input
                    value={program.title}
                    onChange={(event) => updateAboutProgram(program.id, { title: event.target.value })}
                    placeholder="Judul program"
                  />
                </label>
                <label>
                  Deskripsi program
                  <textarea
                    value={program.description}
                    onChange={(event) => updateAboutProgram(program.id, { description: event.target.value })}
                    rows="3"
                    placeholder="Deskripsi singkat program"
                  />
                </label>
                <label>
                  Upload background program
                  <input type="file" accept="image/*" onChange={(event) => handleAboutProgramImageUpload(program.id, event.target.files?.[0])} />
                </label>
                <label>
                  URL background program
                  <input
                    value={program.imageUrl || ''}
                    onChange={(event) => updateAboutProgram(program.id, { imageUrl: event.target.value })}
                    placeholder="/uploads/program.jpg"
                  />
                </label>
                {program.imageUrl && (
                <img className="admin-image-preview" src={resolveMediaUrl(program.imageUrl)} alt={program.title} />
                )}
                <button type="button" className="danger-button" onClick={() => removeAboutProgram(program.id)}>Hapus Program</button>
              </div>
            ))}

            <div className="admin-form-actions">
              <button type="submit">Simpan Program Home</button>
            </div>
          </form>
        </div>
      ) : activeTab === 'site' ? (
        <form className="admin-grid site-admin-grid" onSubmit={handleSiteSubmit}>
          <div className="admin-panel">
            <h2>Logo & Media Website</h2>
            <p>Untuk setiap komponen, ikuti layout masing-masing. Page Hero cenderung lebar, sedangkan section dokumentasi mengikuti frame yang lebih padat.</p>
            <div className="admin-field-group">
              <h3>Logo Navbar</h3>
              <label>
                Upload logo navbar
                <input type="file" accept="image/*" onChange={handleLogoUpload} />
              </label>
              <label>
                URL logo
                <input value={siteForm.logoUrl} onChange={(event) => setSiteForm({ ...siteForm, logoUrl: event.target.value })} placeholder="/uploads/logo.png" />
              </label>
              {siteForm.logoUrl && (
                <img className="admin-logo-preview" src={resolveMediaUrl(siteForm.logoUrl)} alt="Preview logo" />
              )}
            </div>
            <div className="admin-field-group">
              <h3>Header Page Tentang Furusato</h3>
              <label>
                Upload background header tentang furusato
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleSiteBackgroundUpload('aboutPageUrl', event.target.files?.[0])}
                />
              </label>
              <label>
                URL background header tentang furusato
                <input
                  value={siteForm.backgrounds.aboutPageUrl}
                  onChange={(event) => updateSiteBackground('aboutPageUrl', event.target.value)}
                  placeholder="/uploads/background-page-tentang.jpg"
                />
              </label>
              {siteForm.backgrounds.aboutPageUrl && (
                <img className="admin-image-preview" src={resolveMediaUrl(siteForm.backgrounds.aboutPageUrl)} alt="Preview background page tentang furusato" />
              )}
            </div>
            <div className="admin-field-group">
              <h3>Header Page Galeri</h3>
              <label>
                Upload background header galeri
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleSiteBackgroundUpload('galleryPageUrl', event.target.files?.[0])}
                />
              </label>
              <label>
                URL background header galeri
                <input
                  value={siteForm.backgrounds.galleryPageUrl}
                  onChange={(event) => updateSiteBackground('galleryPageUrl', event.target.value)}
                  placeholder="/uploads/background-page-galeri.jpg"
                />
              </label>
              {siteForm.backgrounds.galleryPageUrl && (
                <img className="admin-image-preview" src={resolveMediaUrl(siteForm.backgrounds.galleryPageUrl)} alt="Preview background page galeri" />
              )}
            </div>
          </div>

          <div className="admin-panel">
            <h2>Informasi Website</h2>
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
          </div>
        </form>
      ) : (
        <div className="admin-grid job-mitra-admin-grid">
          <form className="admin-panel" onSubmit={(event) => event.preventDefault()}>
            <div className="admin-field-group">
              <h3>Banner Info Job</h3>
              <label>
                Label kecil
                <input
                  value={homeContentForm.jobInfo.label}
                  onChange={(event) => setHomeContentForm({
                    ...homeContentForm,
                    jobInfo: { ...homeContentForm.jobInfo, label: event.target.value },
                  })}
                  placeholder="Info Job"
                />
              </label>
              <label>
                Judul banner
                <input
                  value={homeContentForm.jobInfo.title}
                  onChange={(event) => setHomeContentForm({
                    ...homeContentForm,
                    jobInfo: { ...homeContentForm.jobInfo, title: event.target.value },
                  })}
                />
              </label>
              <label>
                Deskripsi banner
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
                Link banner
                <input
                  value={homeContentForm.jobInfo.linkUrl}
                  onChange={(event) => setHomeContentForm({
                    ...homeContentForm,
                    jobInfo: { ...homeContentForm.jobInfo, linkUrl: event.target.value },
                  })}
                  placeholder="/berita"
                />
              </label>
              <label>
                Upload gambar banner
                <input type="file" accept="image/*" onChange={handleJobBannerUpload} />
              </label>
              <label>
                URL gambar banner
                <input
                  value={homeContentForm.jobBanner.imageUrl}
                  onChange={(event) => setHomeContentForm({
                    ...homeContentForm,
                    jobBanner: {
                      ...homeContentForm.jobBanner,
                      imageUrl: event.target.value,
                      label: homeContentForm.jobInfo.label,
                      title: homeContentForm.jobInfo.title,
                      description: homeContentForm.jobInfo.description,
                      linkUrl: homeContentForm.jobInfo.linkUrl,
                    },
                  })}
                  placeholder="/uploads/banner-job.jpg"
                />
              </label>
              {homeContentForm.jobBanner.imageUrl && (
                <img className="admin-image-preview" src={resolveMediaUrl(homeContentForm.jobBanner.imageUrl)} alt="Preview banner job" />
              )}
              <div className="admin-form-actions">
                <button
                  type="button"
                  onClick={saveJobBanner}
                >
                  Simpan Banner
                </button>
                <button type="button" className="ghost-button" onClick={handlePublishJobNews}>
                  Posting Info Job ke Berita
                </button>
              </div>
            </div>
          </form>

          <form className="admin-panel" onSubmit={(event) => event.preventDefault()}>
            <div className="admin-partner-editor">
              <div className="section-heading-row">
                <h2>Mitra Kerja Sama</h2>
                <button type="button" className="ghost-button add-button" onClick={addPartner}>Tambah Mitra</button>
              </div>
              {homeContentForm.partners.map((partner, index) => (
                <div className="admin-partner-row" data-admin-row="partner" data-row-id={partner.id} key={partner.id}>
                  <p className="admin-card-meta">ID: {partner.id}</p>
                  <label>
                    Nama mitra
                    <input value={partner.name} onChange={(event) => updatePartner(partner.id, { name: event.target.value })} />
                  </label>
                  <label>
                    Upload icon
                    <input type="file" accept="image/*" onChange={(event) => handlePartnerIconUpload(partner.id, event.target.files?.[0])} />
                  </label>
                  <label>
                    URL icon
                    <input value={partner.iconUrl} onChange={(event) => updatePartner(partner.id, { iconUrl: event.target.value })} />
                  </label>
                  {partner.iconUrl && <img className="admin-logo-preview" src={resolveMediaUrl(partner.iconUrl)} alt={partner.name} />}
                  <button type="button" className="danger-button" onClick={() => removePartner(partner.id)}>Hapus Mitra</button>
                </div>
              ))}
              <div className="admin-form-actions">
                <button
                  type="button"
                  onClick={() => saveHomeContent(
                    { partners: homeContentForm.partners },
                    'Mitra kerja sama berhasil disimpan.',
                  )}
                >
                  Simpan Mitra
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

export default AdminDashboardPage;
