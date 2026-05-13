const programs = [
  {
    title: 'Kelas bahasa Jepang',
    description: 'Pembelajaran dasar hingga persiapan komunikasi kerja dengan bimbingan bertahap.',
  },
  {
    title: 'Budaya dan etika kerja',
    description: 'Pembinaan kedisiplinan, kebiasaan kerja, dan kesiapan mental sebelum seleksi.',
  },
  {
    title: 'Pendampingan seleksi',
    description: 'Simulasi wawancara, dokumen, dan pengarahan bidang kerja sesuai tujuan peserta.',
  },
];

function ProgramSection() {
  return (
    <section className="program-section">
      <p className="eyebrow">Program</p>
      <div className="section-heading-row">
        <h2>Mulai karirmu dengan persiapan yang jelas.</h2>
      </div>
      <div className="program-list">
        {programs.map((program, index) => (
          <article key={program.title}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h3>{program.title}</h3>
            <p>{program.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ProgramSection;
