import { useState } from 'react';

const LAYANAN = [
  { nama: 'Poli Umum', desc: 'Pemeriksaan kesehatan umum dan keluhan ringan hingga sedang.', icon: '🩺' },
  { nama: 'Poli Gigi', desc: 'Scaling, tambal gigi, cabut gigi, hingga konsultasi behel.', icon: '🦷' },
  { nama: 'Poli Anak', desc: 'Tumbuh kembang anak, imunisasi, dan penanganan penyakit anak.', icon: '🧸' },
  { nama: 'Poli Kandungan', desc: 'Pemeriksaan kehamilan, USG, KB, dan kesehatan reproduksi.', icon: '🤰' },
  { nama: 'Poli Penyakit Dalam', desc: 'Penanganan diabetes, hipertensi, dan gangguan pencernaan.', icon: '💊' },
  { nama: 'Poli Kulit & Kelamin', desc: 'Konsultasi masalah kulit, alergi, dan perawatan estetik dasar.', icon: '🧴' },
];

const JADWAL_DOKTER = [
  { nama: 'dr. Andi Prasetyo', spesialisasi: 'Poli Umum', hari: 'Senin, Selasa, Rabu, Jumat', jam: '08:00 - 14:00' },
  { nama: 'drg. Sinta Wulandari', spesialisasi: 'Poli Gigi', hari: 'Senin, Rabu, Kamis, Sabtu', jam: '09:00 - 15:00' },
  { nama: 'dr. Budi Santoso, Sp.A', spesialisasi: 'Poli Anak', hari: 'Selasa, Kamis, Sabtu', jam: '10:00 - 16:00' },
  { nama: 'dr. Ratna Dewi, Sp.OG', spesialisasi: 'Poli Kandungan', hari: 'Senin, Rabu, Jumat', jam: '13:00 - 18:00' },
  { nama: 'dr. Hendra Wijaya, Sp.PD', spesialisasi: 'Poli Penyakit Dalam', hari: 'Selasa, Kamis', jam: '14:00 - 19:00' },
  { nama: 'dr. Maya Kusuma, Sp.KK', spesialisasi: 'Poli Kulit & Kelamin', hari: 'Jumat, Sabtu', jam: '10:00 - 15:00' },
];

const PROSEDUR = [
  { step: 1, title: 'Datang / Daftar Online', desc: 'Datang langsung ke loket atau daftar via WhatsApp minimal 1 jam sebelum praktik.' },
  { step: 2, title: 'Siapkan Dokumen', desc: 'Siapkan KTP dan Kartu BPJS/asuransi (jika ada) untuk pasien baru.' },
  { step: 3, title: 'Isi Data / Tunjukkan Kartu', desc: 'Pasien baru mengisi formulir data diri, pasien lama menunjukkan kartu berobat.' },
  { step: 4, title: 'Ambil Nomor Antrian', desc: 'Petugas memberikan nomor antrian sesuai poli tujuan.' },
  { step: 5, title: 'Tunggu Panggilan', desc: 'Tunggu panggilan nomor antrian di ruang tunggu ber-AC.' },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Profil', href: '#profil' },
    { label: 'Layanan', href: '#layanan' },
    { label: 'Dokter', href: '#dokter' },
    { label: 'Prosedur', href: '#prosedur' },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏥</span>
            <span className="font-bold text-lg text-teal-700">Klinik Sehat Sentosa</span>
          </div>

          <div className="hidden md:flex gap-8">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="text-gray-600 hover:text-teal-600 font-medium transition">
                {link.label}
              </a>
            ))}
          </div>

          <button
            className="md:hidden text-gray-600 text-2xl"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Buka menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)} className="text-gray-600 hover:text-teal-600 font-medium">
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="bg-gradient-to-br from-teal-600 to-teal-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center text-center">
        <h1 className="text-3xl sm:text-5xl font-bold mb-4 leading-tight">Kesehatan Anda, Prioritas Kami</h1>
        <p className="text-teal-100 max-w-2xl mb-8 text-base sm:text-lg">
          Klinik Sehat Sentosa melayani konsultasi kesehatan umum hingga spesialis, dilengkapi asisten virtual AI
          yang siap menjawab pertanyaan Anda kapan saja, 24 jam sehari.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a href="#layanan" className="bg-white text-teal-700 font-semibold px-6 py-3 rounded-full hover:bg-teal-50 transition shadow-lg">
            Lihat Layanan Kami
          </a>
          <a href="#chat" className="border-2 border-white text-white font-semibold px-6 py-3 rounded-full hover:bg-white hover:text-teal-700 transition">
            💬 Tanya Asisten AI
          </a>
        </div>
      </div>
    </section>
  );
}

function Profil() {
  return (
    <section id="profil" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Profil Klinik</h2>
          <p className="text-gray-600 mb-6">
            Klinik Sehat Sentosa berdiri untuk memberikan pelayanan kesehatan yang cepat, ramah, dan terpercaya
            bagi masyarakat Yogyakarta dan sekitarnya, didukung tenaga medis profesional dan fasilitas lengkap.
          </p>
          <ul className="space-y-2 text-gray-600">
            <li>📍 Jl. Kesehatan Raya No. 45, Yogyakarta, DIY</li>
            <li>🕐 Senin–Jumat: 07:00–20:00 | Sabtu: 07:00–17:00 | Minggu: 08:00–14:00 (IGD 24 jam)</li>
            <li>☎️ (0274) 123456 &nbsp;|&nbsp; 📱 WhatsApp 0812-3456-7890</li>
            <li>✉️ info@kliniksehatsentosa.co.id</li>
          </ul>
        </div>
        <div className="bg-teal-50 rounded-2xl p-8 grid grid-cols-2 gap-4">
          {['Ruang tunggu ber-AC', 'Apotek internal', 'Laboratorium klinik', 'IGD 24 jam'].map((f) => (
            <div key={f} className="bg-white rounded-xl p-4 text-center shadow-sm">
              <p className="text-sm font-medium text-gray-700">{f}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Layanan() {
  return (
    <section id="layanan" className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 text-center">Layanan & Poliklinik</h2>
        <p className="text-gray-500 text-center mb-10">Kami menyediakan berbagai layanan kesehatan untuk seluruh keluarga</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {LAYANAN.map((item) => (
            <div key={item.nama} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition border border-gray-100">
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">{item.nama}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function JadwalDokter() {
  return (
    <section id="dokter" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 text-center">Jadwal Dokter</h2>
      <p className="text-gray-500 text-center mb-10">Jadwal praktik dokter kami setiap minggunya</p>
      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-teal-600 text-white">
            <tr>
              <th className="px-4 py-3">Nama Dokter</th>
              <th className="px-4 py-3">Spesialisasi</th>
              <th className="px-4 py-3">Hari Praktik</th>
              <th className="px-4 py-3">Jam Praktik</th>
            </tr>
          </thead>
          <tbody>
            {JADWAL_DOKTER.map((dokter, idx) => (
              <tr key={dokter.nama} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 font-medium text-gray-800">{dokter.nama}</td>
                <td className="px-4 py-3 text-gray-600">{dokter.spesialisasi}</td>
                <td className="px-4 py-3 text-gray-600">{dokter.hari}</td>
                <td className="px-4 py-3 text-gray-600">{dokter.jam}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Prosedur() {
  return (
    <section id="prosedur" className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 text-center">Prosedur Pendaftaran Pasien</h2>
        <p className="text-gray-500 text-center mb-10">Ikuti langkah mudah berikut untuk mendapatkan pelayanan kami</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {PROSEDUR.map((item) => (
            <div key={item.step} className="bg-white rounded-2xl p-6 shadow-sm text-center border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid sm:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white font-bold text-lg mb-3">Klinik Sehat Sentosa</h3>
          <p className="text-sm text-gray-400">
            Melayani kesehatan Anda dan keluarga dengan sepenuh hati, didukung asisten AI 24/7.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Kontak</h4>
          <ul className="text-sm space-y-1 text-gray-400">
            <li>📍 Jl. Kesehatan Raya No. 45, Yogyakarta</li>
            <li>☎️ (0274) 123456</li>
            <li>✉️ info@kliniksehatsentosa.co.id</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Jam Operasional</h4>
          <ul className="text-sm space-y-1 text-gray-400">
            <li>Senin–Jumat: 07:00–20:00</li>
            <li>Sabtu: 07:00–17:00</li>
            <li>Minggu: 08:00–14:00 (IGD 24 jam)</li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs text-gray-500 mt-8">
        © {new Date().getFullYear()} Klinik Sehat Sentosa. Seluruh hak cipta dilindungi.
      </div>
    </footer>
  );
}

function Home() {
  return (
    <div className="font-sans">
      <Navbar />
      <Hero />
      <Profil />
      <Layanan />
      <JadwalDokter />
      <Prosedur />
      <Footer />
    </div>
  );
}

export default Home;
