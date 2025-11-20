import { Candidate, NewsItem } from "./types";

export const MOCK_CANDIDATES: Candidate[] = [
  {
    id: '1',
    name: 'Ahmad Rizky & Siti Aminah',
    vision: 'Mewujudkan OSIS yang Progresif, Kreatif, dan Berintegritas.',
    mission: [
      'Meningkatkan partisipasi siswa dalam kegiatan akademik.',
      'Mengadakan event seni dan budaya bulanan.',
      'Digitalisasi sistem aspirasi siswa.'
    ],
    imageUrl: 'https://picsum.photos/400/400?random=1',
    voteCount: 120
  },
  {
    id: '2',
    name: 'Budi Santoso & Dewi Ratna',
    vision: 'Sekolah Unggul, Siswa Berkarakter, Lingkungan Nyaman.',
    mission: [
      'Program penghijauan sekolah berkelanjutan.',
      'Pelatihan leadership rutin untuk pengurus kelas.',
      'Kerjasama dengan alumni untuk mentoring.'
    ],
    imageUrl: 'https://picsum.photos/400/400?random=2',
    voteCount: 95
  },
  {
    id: '3',
    name: 'Citra Kirana & Dimas Anggara',
    vision: 'Inovasi Teknologi untuk Kemajuan Bersama.',
    mission: [
      'Penerapan E-Library yang lebih masif.',
      'Kompetisi E-Sports antar kelas.',
      'Workshop coding dan desain grafis.'
    ],
    imageUrl: 'https://picsum.photos/400/400?random=3',
    voteCount: 150
  }
];

export const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'Prestasi Gemilang di LKS Tingkat Provinsi',
    category: 'Prestasi',
    date: '10 Oktober 2023',
    excerpt: 'Siswa SMK LPPMRI 2 Kedungreja berhasil membawa pulang medali emas dalam ajang LKS...',
    content: 'Siswa SMK LPPMRI 2 Kedungreja berhasil membawa pulang medali emas dalam ajang LKS tingkat provinsi. Prestasi ini merupakan hasil kerja keras siswa dan bimbingan guru. Kami berharap prestasi ini dapat memotivasi siswa lain untuk terus berkarya dan berprestasi.',
    imageUrl: 'https://picsum.photos/600/400?random=10'
  },
  {
    id: '2',
    title: 'Jadwal Ujian Tengah Semester Ganjil',
    category: 'Akademik',
    date: '12 Oktober 2023',
    excerpt: 'Diberitahukan kepada seluruh siswa bahwa UTS akan dilaksanakan mulai tanggal...',
    content: 'Diberitahukan kepada seluruh siswa bahwa Ujian Tengah Semester (UTS) Ganjil akan dilaksanakan mulai tanggal 20 Oktober 2023. Jadwal lengkap mata pelajaran dapat dilihat di papan pengumuman sekolah atau diunduh melalui portal siswa. Harap persiapkan diri dengan baik.',
    imageUrl: 'https://picsum.photos/600/400?random=11'
  },
  {
    id: '3',
    title: 'Penerimaan Anggota Baru OSIS 2024/2025',
    category: 'Organisasi',
    date: '15 Oktober 2023',
    excerpt: 'Pendaftaran calon pengurus OSIS periode baru telah dibuka. Siapkan diri kalian!',
    content: 'Pendaftaran calon pengurus OSIS periode 2024/2025 telah dibuka. Kami mencari siswa-siswi yang memiliki jiwa kepemimpinan, integritas, dan semangat untuk memajukan sekolah. Formulir pendaftaran dapat diambil di ruang OSIS mulai hari ini.',
    imageUrl: 'https://picsum.photos/600/400?random=12'
  },
  {
    id: '4',
    title: 'Workshop Kewirausahaan Digital',
    category: 'Event',
    date: '20 Oktober 2023',
    excerpt: 'Mengundang pakar digital marketing untuk berbagi ilmu kepada siswa kelas XII.',
    content: 'Sekolah akan mengadakan Workshop Kewirausahaan Digital dengan mengundang pakar digital marketing terkemuka. Acara ini dikhususkan bagi siswa kelas XII untuk membekali mereka dengan keterampilan bisnis di era digital. Jangan lewatkan kesempatan emas ini!',
    imageUrl: 'https://picsum.photos/600/400?random=13'
  },
];