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
    aboutPage: {
      heroEyebrow: 'Tentang Kami',
      heroTitle: 'Tentang Furusato',
      breadcrumb: 'Beranda / Tentang Furusato',
      programEyebrow: 'Program Kerja Furusato',
      programTitle: 'Program yang disiapkan untuk peserta.',
      programPlaceholder: 'PROGRAM',
    },
    program: {
      eyebrow: 'Program',
      title: 'Mulai karirmu dengan persiapan yang jelas.',
    },
    seoSection: {
      eyebrow: 'LPK Jepang Temanggung',
      title: 'Persiapan kerja ke Jepang dari Temanggung, Jawa Tengah.',
      body: 'Furusato membantu calon peserta di Temanggung dan sekitarnya memahami proses belajar bahasa Jepang, budaya kerja, disiplin, seleksi, serta jalur kerja Jepang seperti magang, Tokutei Ginou, dan bidang kaigo secara bertahap.',
      listLabel: 'Fokus pencarian Furusato',
      points: [
        'LPK Jepang di Temanggung',
        'Pelatihan Bahasa Jepang untuk kerja',
        'Persiapan magang dan Tokutei Ginou',
        'Informasi Kerja Ke Jepang dan seleksi kerja Jepang',
        'Pendampingan peserta dari Jawa Tengah',
      ],
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
    galleryPage: {
      eyebrow: 'Galeri',
      title: 'Dokumentasi ruang belajar dan aktivitas peserta.',
      description: 'Halaman ini disiapkan untuk menampung foto kegiatan, fasilitas, kelas, dan dokumentasi terbaru Furusato dari dashboard admin.',
      placeholder: 'UPLOAD GAMBAR',
    },
    news: {
      eyebrow: 'Berita',
      title: 'Informasi terbaru',
      action: 'Lihat semua berita',
    },
    newsPage: {
      eyebrow: 'Berita',
      title: 'Berita Furusato',
      breadcrumb: 'Beranda / Berita',
      closeAction: 'Tutup berita',
      readAction: 'Baca selengkapnya',
    },
    lulusJobPage: {
      eyebrow: 'Lulus Job',
      title: 'Jejak siswa Furusato yang sudah siap melangkah ke dunia kerja.',
      description: 'Halaman ini menampilkan kartu siswa lulus job berisi foto, nama, asal, dan pesan singkat mereka setelah melalui pembinaan di Furusato Temanggung.',
      placeholder: 'UPLOAD FOTO',
    },
    contactPage: {
      heroEyebrow: 'Kontak Furusato',
      heroTitle: 'Mari bicara tentang kelas, pendaftaran, dan rencana kerja ke Jepang dari Temanggung.',
      contactLabel: 'Hubungi Kami',
      addressTitle: 'Alamat',
      addressDescription: 'Furusato Temanggung melayani peserta dari Temanggung, Jawa Tengah, dan sekitarnya.',
      serviceTitle: 'Jam Layanan',
      serviceDescription: 'Senin - Sabtu, 09.00 - 17.00. Jadwal dapat disesuaikan melalui admin.',
      socialTitle: 'Media Sosial',
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
    aboutPage: {
      heroEyebrow: '私たちについて',
      heroTitle: 'Furusatoについて',
      breadcrumb: 'ホーム / Furusatoについて',
      programEyebrow: 'Furusatoの研修プログラム',
      programTitle: '参加者のために準備されたプログラム。',
      programPlaceholder: 'プログラム',
    },
    program: {
      eyebrow: 'プログラム',
      title: '明確な準備からキャリアを始めよう。',
    },
    seoSection: {
      eyebrow: 'Temanggungの日本向け職業訓練',
      title: '中部ジャワ・Temanggungから日本就労を目指す準備を支援します。',
      body: 'FurusatoはTemanggung周辺の参加者に、日本語、職場文化、規律、選考準備、技能実習、特定技能、介護分野など、日本で働くための情報と準備を段階的にサポートします。',
      listLabel: 'Furusatoの重点分野',
      points: [
        'TemanggungのLPK日本語研修',
        '就労に向けた日本語学習',
        '技能実習と特定技能の準備',
        '介護分野と選考情報',
        '中部ジャワの参加者サポート',
      ],
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
    galleryPage: {
      eyebrow: 'ギャラリー',
      title: '学習環境と参加者の活動記録。',
      description: 'このページでは、Furusatoの活動、施設、クラス、最新の記録写真を管理画面から掲載できます。',
      placeholder: '画像をアップロード',
    },
    news: {
      eyebrow: 'ニュース',
      title: '最新情報',
      action: 'すべてのニュースを見る',
    },
    newsPage: {
      eyebrow: 'ニュース',
      title: 'Furusatoニュース',
      breadcrumb: 'ホーム / ニュース',
      closeAction: '閉じる',
      readAction: '詳しく読む',
    },
    lulusJobPage: {
      eyebrow: '就職者の声',
      title: 'Furusatoで準備を重ね、仕事の世界へ進む参加者の歩み。',
      description: 'このページでは、Furusato Temanggungでの指導を終えた参加者の写真、名前、出身地、短いメッセージを紹介します。',
      placeholder: '写真をアップロード',
    },
    contactPage: {
      heroEyebrow: 'お問い合わせ',
      heroTitle: 'クラス、入学相談、Temanggungから日本で働く準備についてご相談ください。',
      contactLabel: 'お問い合わせ',
      addressTitle: '住所',
      addressDescription: 'Furusato Temanggungは、Temanggung、中央ジャワ、周辺地域の参加者をサポートしています。',
      serviceTitle: '受付時間',
      serviceDescription: '月曜日 - 土曜日、09.00 - 17.00。詳しいスケジュールは管理者にご確認ください。',
      socialTitle: 'ソーシャルメディア',
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

export const SITE_URL = 'https://furusato-seven.vercel.app';

const SHARE_IMAGE_URL = `${SITE_URL}/api/share-preview?v=2`;

const commonKeywords = [
  'lpk jepang temanggung',
  'lpk di temanggung',
  'kerja di jepang temanggung jawa tengah',
  'lpk tokutei gino kaigo temanggung',
  'lpk tokutei ginou kaigo temanggung',
  'lpk magang temanggung',
  'furusato temanggung',
  'lembaga pelatihan kerja jepang temanggung',
  'kursus bahasa jepang temanggung',
  'pelatihan kerja ke jepang jawa tengah',
];

const seoDefaults = {
  id: {
    title: 'LPK Jepang Temanggung | Furusato - Kerja ke Jepang Jawa Tengah',
    description: 'LPK Furusato Temanggung membantu persiapan kerja ke Jepang melalui bahasa Jepang, budaya kerja, seleksi, magang, Tokutei Ginou, dan kaigo di Jawa Tengah.',
    keywords: commonKeywords.join(', '),
  },
  ja: {
    title: 'Furusato Temanggung | 日本就労に向けた日本語研修',
    description: 'Furusato Temanggungは、中部ジャワの参加者に日本語、職場文化、選考準備、技能実習、特定技能、介護分野の情報を段階的にサポートします。',
    keywords: [
      'Furusato Temanggung',
      'Temanggung 日本語研修',
      'インドネシア LPK 日本',
      '特定技能 介護 インドネシア',
      '技能実習 Temanggung',
      ...commonKeywords,
    ].join(', '),
  },
};

const seoMetaByRoute = {
  id: {
    home: seoDefaults.id,
    map: {
      title: 'Lokasi LPK Furusato Temanggung | LPK Jepang Jawa Tengah',
      description: 'Temukan lokasi LPK Furusato Temanggung untuk konsultasi kelas bahasa Jepang, persiapan kerja ke Jepang, Tokutei Ginou, kaigo, dan magang Jepang.',
    },
    about: {
      title: 'Tentang LPK Furusato Temanggung | LPK Jepang Jawa Tengah',
      description: 'Profil LPK Furusato Temanggung, lembaga pelatihan kerja bahasa Jepang di Jawa Tengah untuk persiapan kerja ke Jepang dan seleksi peserta.',
    },
    gallery: {
      title: 'Galeri LPK Furusato Temanggung | Kegiatan Pelatihan Jepang',
      description: 'Lihat dokumentasi kelas, kegiatan, fasilitas, dan aktivitas peserta LPK Furusato Temanggung dalam persiapan kerja ke Jepang.',
    },
    job: {
      title: 'Lulus Job Furusato Temanggung | Persiapan Kerja Jepang',
      description: 'Kisah dan dokumentasi peserta Furusato Temanggung yang mengikuti pembinaan untuk siap seleksi, lulus job, dan kerja ke Jepang.',
    },
    news: {
      title: 'Berita LPK Furusato Temanggung | Info Kelas dan Seleksi Jepang',
      description: 'Informasi terbaru Furusato Temanggung tentang kelas bahasa Jepang, seleksi kerja Jepang, kegiatan peserta, magang, Tokutei Ginou, dan kaigo.',
    },
    contact: {
      title: 'Kontak LPK Furusato Temanggung | Konsultasi Kerja ke Jepang',
      description: 'Hubungi LPK Furusato Temanggung untuk informasi pendaftaran, kelas bahasa Jepang, persiapan kerja ke Jepang, Tokutei Ginou, kaigo, dan magang.',
    },
    adminLogin: {
      title: 'Furusato Admin | Login',
      description: 'Halaman login admin Furusato.',
    },
    adminDashboard: {
      title: 'Furusato Admin | Dashboard',
      description: 'Dashboard admin Furusato.',
    },
    notFound: {
      title: 'Furusato Temanggung | Halaman Tidak Ditemukan',
      description: 'Halaman ini tidak tersedia untuk pengunjung Furusato Temanggung.',
    },
  },
  ja: {
    home: seoDefaults.ja,
    map: {
      title: 'Furusato Temanggung | アクセス',
      description: 'Furusato Temanggungの所在地。日本語研修、日本就労、技能実習、特定技能、介護分野について相談できます。',
    },
    about: {
      title: 'Furusato Temanggungについて | 日本語職業訓練',
      description: 'Furusato Temanggungは、中部ジャワで日本就労を目指す参加者を支援する日本語と職業準備のLPKです。',
    },
    gallery: {
      title: 'Furusato Temanggung | 活動ギャラリー',
      description: 'Furusato Temanggungの授業、施設、参加者の活動、日本就労に向けた研修の記録をご覧ください。',
    },
    job: {
      title: 'Furusato Temanggung | 就職準備の記録',
      description: 'Furusato Temanggungで日本就労に向けて準備を進めた参加者の活動と歩みを紹介します。',
    },
    news: {
      title: 'Furusato Temanggung | ニュースと選考情報',
      description: 'Furusato Temanggungの日本語クラス、選考、参加者活動、技能実習、特定技能、介護分野に関する最新情報です。',
    },
    contact: {
      title: 'Furusato Temanggung | お問い合わせ',
      description: 'Furusato Temanggungへのお問い合わせ。日本語研修、日本就労、技能実習、特定技能、介護分野の情報をご相談ください。',
    },
    adminLogin: {
      title: 'Furusato 管理 | ログイン',
      description: 'Furusato管理者ログインページ。',
    },
    adminDashboard: {
      title: 'Furusato 管理 | ダッシュボード',
      description: 'Furusato管理ダッシュボード。',
    },
    notFound: {
      title: 'Furusato Temanggung | ページが見つかりません',
      description: 'このページはFurusato Temanggungの一般公開ページではありません。',
    },
  },
};

function getRouteKey(pathname, hash) {
  if (pathname === '/' && hash === '#map') {
    return 'map';
  }

  if (pathname === '/') {
    return 'home';
  }

  if (pathname === '/tentang') {
    return 'about';
  }

  if (pathname === '/galeri') {
    return 'gallery';
  }

  if (pathname === '/lulus-job') {
    return 'job';
  }

  if (pathname === '/berita') {
    return 'news';
  }

  if (pathname === '/kontak') {
    return 'contact';
  }

  if (pathname === '/admin/login') {
    return 'adminLogin';
  }

  if (pathname === '/admin/dashboard') {
    return 'adminDashboard';
  }

  return 'notFound';
}

function getCanonicalUrl(pathname) {
  if (pathname === '/' || pathname === '') {
    return `${SITE_URL}/`;
  }

  return `${SITE_URL}${pathname.replace(/\/$/, '')}`;
}

export function getSeoMeta(pathname, hash, language = 'id') {
  const selectedLanguage = language === 'ja' ? 'ja' : 'id';
  const routeKey = getRouteKey(pathname, hash);
  const routeMeta = seoMetaByRoute[selectedLanguage][routeKey] || seoMetaByRoute[selectedLanguage].notFound;
  const defaults = seoDefaults[selectedLanguage];
  const isPrivateRoute = routeKey === 'adminLogin' || routeKey === 'adminDashboard' || routeKey === 'notFound';

  return {
    ...defaults,
    ...routeMeta,
    canonical: getCanonicalUrl(pathname),
    image: SHARE_IMAGE_URL,
    locale: selectedLanguage === 'ja' ? 'ja_JP' : 'id_ID',
    robots: isPrivateRoute ? 'noindex, nofollow' : 'index, follow',
    routeKey,
  };
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
