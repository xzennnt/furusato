export const LANGUAGE_STORAGE_KEY = 'furusato-language';

const localizedCopy = {
  id: {
    nav: {
      ariaLabel: 'Navigasi utama',
      links: {
        home: 'Home',
        about: 'Tentang Furusato',
        map: 'Map',
        gallery: 'Galeri',
        job: 'Lulus Job',
        news: 'Berita',
      },
    },
    hero: {
      eyebrow: 'LPK Furusato',
      title: 'Raih mimpi kerja ke Jepang bersama Furusato.',
      description: 'Kelas bahasa Jepang, pembinaan karakter, budaya kerja, dan persiapan seleksi dibuat terarah agar peserta siap memasuki dunia kerja.',
      primaryAction: 'Tentang Furusato',
      secondaryAction: 'Hubungi Kami',
    },
    about: {
      eyebrow: 'Tentang Furusato Temanggung',
      title: 'Pelatihan kerja di Temanggung yang dekat dengan kebutuhan peserta dan mitra.',
      body: 'Furusato Temanggung adalah lembaga pelatihan kerja yang berfokus pada persiapan peserta agar siap memasuki lingkungan kerja profesional. Materi pelatihan mencakup kedisiplinan, komunikasi, dasar bahasa, etika kerja, dan praktik keterampilan yang disesuaikan dengan kebutuhan mitra kerja tujuan.',
    },
    program: {
      eyebrow: 'Program',
      title: 'Mulai karirmu dengan persiapan yang jelas.',
    },
    job: {
      newsEyebrow: 'Berita Terkini',
      newsTitle: 'Informasi kelas, seleksi, dan kegiatan peserta.',
      bannerPlaceholder: 'UPLOAD BANNER INFORMASI',
      partnerEyebrow: 'Mitra Kerja Sama',
      partnerTitle: 'Perusahaan dan LPK rekanan',
      defaultJobLabel: 'Info Job',
      defaultJobTitle: 'Informasi Job Terbaru',
      defaultJobDescription: 'Update peluang kerja, seleksi, dan kelas persiapan akan ditampilkan di area ini.',
    },
    gallery: {
      eyebrow: 'Galeri',
      title: 'Dokumentasi kegiatan Furusato',
      action: 'Lihat semua galeri',
      placeholder: 'UPLOAD GAMBAR',
    },
    news: {
      eyebrow: 'Berita',
      title: 'Informasi terbaru',
      action: 'Lihat semua berita',
    },
    map: {
      eyebrow: 'Map',
      title: 'Lokasi pelatihan yang mudah ditemukan.',
      body: 'Peta Google Maps ini memakai titik lokasi LPK Furusato.',
      action: 'Buka lokasi',
    },
    footer: {
      brandNote: 'Lembaga pelatihan kerja bahasa Jepang di Temanggung.',
      companyHeading: 'Perusahaan',
      newsHeading: 'Berita',
      newsDescription: 'Dapatkan informasi terbaru terkait pelatihan, seleksi, dan kegiatan Furusato.',
      socialHeading: 'Sosial Media',
      contactHeading: 'Kontak',
      links: {
        about: 'Tentang Furusato',
        map: 'Map',
        gallery: 'Galeri',
        news: 'Berita',
      },
    },
    notFound: {
      eyebrow: 'Halaman tidak tersedia',
      title: 'URL ini tidak dipublikasikan untuk pengunjung.',
      body: 'Gunakan halaman yang tersedia: Home, Tentang Furusato, Map, Galeri, Lulus Job, Berita, dan Kontak.',
      action: 'Kembali ke Home',
    },
    pageTitles: {
      home: 'Furusato Temanggung | LPK Jepang',
      map: 'Furusato | Map',
      about: 'Tentang Furusato Temanggung',
      gallery: 'Galeri Furusato Temanggung',
      job: 'Lulus Job Furusato Temanggung',
      news: 'Berita Furusato Temanggung',
      contact: 'Kontak Furusato Temanggung',
      adminLogin: 'Furusato Admin | Login',
      adminDashboard: 'Furusato Admin | Dashboard',
      notFound: 'Furusato Temanggung | Halaman Tidak Ditemukan',
    },
  },
  ja: {
    nav: {
      ariaLabel: 'メインナビゲーション',
      links: {
        home: 'ホーム',
        about: 'ふるさとについて',
        map: 'アクセス',
        gallery: 'ギャラリー',
        job: '就職者の声',
        news: 'ニュース',
      },
    },
    hero: {
      eyebrow: 'LPK FURUSATO',
      title: 'ふるさとと一緒に、日本で働く夢を叶えよう。',
      description: '日本語クラス、人物育成、職場文化の理解、選考対策まで、参加者が安心して就職準備を進められるように段階的にサポートします。',
      primaryAction: 'ふるさとについて',
      secondaryAction: 'お問い合わせ',
    },
    about: {
      eyebrow: 'LPK Furusato Temanggungについて',
      title: '参加者と提携先のニーズに寄り添う、Temanggungの職業訓練。',
      body: 'Furusato Temanggungは、参加者が専門的な職場へ自信を持って進めるように支援する職業訓練機関です。訓練内容には、規律、コミュニケーション、基礎言語、職場でのマナー、提携先のニーズに合わせた実践的なスキルが含まれます。',
    },
    program: {
      eyebrow: 'プログラム',
      title: '明確な準備からキャリアを始めよう。',
    },
    job: {
      newsEyebrow: '最新ニュース',
      newsTitle: 'クラス、選考、受講生の活動情報。',
      bannerPlaceholder: '情報バナーをアップロード',
      partnerEyebrow: '提携パートナー',
      partnerTitle: '提携企業とLPK',
      defaultJobLabel: '求人情報',
      defaultJobTitle: '最新の求人情報',
      defaultJobDescription: '採用情報、選考、準備クラスの最新情報をここに表示します。',
    },
    gallery: {
      eyebrow: 'ギャラリー',
      title: 'ふるさとの活動記録',
      action: 'すべてのギャラリーを見る',
      placeholder: '画像をアップロード',
    },
    news: {
      eyebrow: 'ニュース',
      title: '最新情報',
      action: 'すべてのニュースを見る',
    },
    map: {
      eyebrow: 'アクセス',
      title: '見つけやすい研修拠点。',
      body: 'このGoogleマップはLPK Furusatoの位置を表示しています。',
      action: '場所を開く',
    },
    footer: {
      brandNote: 'Temanggungにある日本語の職業訓練機関。',
      companyHeading: '会社案内',
      newsHeading: 'ニュース',
      newsDescription: '研修、選考、ふるさとの活動に関する最新情報をお届けします。',
      socialHeading: 'ソーシャルメディア',
      contactHeading: 'お問い合わせ',
      links: {
        about: 'ふるさとについて',
        map: 'アクセス',
        gallery: 'ギャラリー',
        news: 'ニュース',
      },
    },
    notFound: {
      eyebrow: 'ページが見つかりません',
      title: 'このURLは一般公開されていません。',
      body: '利用できるページ: ホーム、ふるさとについて、アクセス、ギャラリー、就職者の声、ニュース、お問い合わせ。',
      action: 'ホームへ戻る',
    },
    pageTitles: {
      home: 'Furusato Temanggung | 日本語研修',
      map: 'Furusato | アクセス',
      about: 'Furusato Temanggungについて',
      gallery: 'Furusato Temanggung | ギャラリー',
      job: 'Furusato Temanggung | 就職者の声',
      news: 'Furusato Temanggung | ニュース',
      contact: 'Furusato Temanggung | お問い合わせ',
      adminLogin: 'Furusato 管理 | ログイン',
      adminDashboard: 'Furusato 管理 | ダッシュボード',
      notFound: 'Furusato Temanggung | ページが見つかりません',
    },
  },
};

export function getLocalizedCopy(language) {
  return localizedCopy[language] || localizedCopy.id;
}

export function getPageTitle(pathname, hash, language = 'id') {
  const pageTitles = getLocalizedCopy(language).pageTitles;

  if (pathname === '/' && hash === '#map') {
    return pageTitles.map;
  }

  if (pathname === '/') {
    return pageTitles.home;
  }

  if (pathname === '/tentang') {
    return pageTitles.about;
  }

  if (pathname === '/galeri') {
    return pageTitles.gallery;
  }

  if (pathname === '/lulus-job') {
    return pageTitles.job;
  }

  if (pathname === '/berita') {
    return pageTitles.news;
  }

  if (pathname === '/kontak') {
    return pageTitles.contact;
  }

  if (pathname === '/admin/login') {
    return pageTitles.adminLogin;
  }

  if (pathname === '/admin/dashboard') {
    return pageTitles.adminDashboard;
  }

  return pageTitles.notFound;
}

