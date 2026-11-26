/**
 * SAMPLE DATA ONLY. Synthetic text, not real campus rules. Do not treat any
 * deadline, requirement, or procedure below as official information.
 */
import type { ExperienceRow, GuideRow } from "./types";

const DAY = 86_400_000;
const daysAgo = (days: number) => new Date(Date.now() - days * DAY).toISOString();

const CAMPUS_ID = "00000000-0000-4000-8000-000000000001";
const PROGRAM_ID = "00000000-0000-4000-8000-000000000011";

function guide(
  n: number,
  fields: Pick<
    GuideRow,
    "title" | "category" | "content_raw" | "source_type" | "last_verified_at"
  > &
    Partial<GuideRow>,
): GuideRow {
  return {
    id: `40000000-0000-4000-8000-${String(n).padStart(12, "0")}`,
    campus_id: null,
    program_id: null,
    is_general: true,
    source_reference: null,
    source_url: null,
    is_published: true,
    created_at: fields.last_verified_at,
    updated_at: fields.last_verified_at,
    ...fields,
  };
}

export const MOCK_GUIDES: GuideRow[] = [
  guide(1, {
    title: "How to plan your semester course load",
    category: "academic_survival",
    source_type: "official_campus_source",
    source_reference: "Sample Academic Handbook, chapter 3",
    last_verified_at: daysAgo(20),
    content_raw:
      "Start from your study plan and list the courses you must take this semester.\n\nCheck prerequisites before registering, and keep a lighter load if you work part-time.\n\nTalk to your academic advisor if two courses clash or you want to take extra credits.",
  }),
  guide(2, {
    title: "Building a weekly study routine that lasts",
    category: "academic_survival",
    source_type: "curated_guide",
    last_verified_at: daysAgo(60),
    content_raw:
      "Block fixed study slots in your calendar, and keep them short but regular.\n\nReview lecture notes within 24 hours, then practice with past questions one or two weeks before exams.\n\nStudy groups work best with three or four people and a clear agenda.",
  }),
  guide(3, {
    title: "Finding and joining a student organization",
    category: "social_community",
    source_type: "curated_guide",
    last_verified_at: daysAgo(45),
    content_raw:
      "Visit the organization fair, or ask senior students about activity levels.\n\nStart with one organization and measure the weekly time it takes before joining a second.",
  }),
  guide(4, {
    title: "Course registration step by step",
    category: "administrative_guide",
    source_type: "official_campus_source",
    source_reference: "Sample Registrar Office notice",
    source_url: "https://example.com/sample-registration",
    last_verified_at: daysAgo(10),
    content_raw:
      "Log in to the academic portal on the registration date for your cohort.\n\nSelect courses from your study plan, confirm the schedule, and save a copy of the confirmation.\n\nIf the portal shows an error, contact the faculty office within the registration period.",
  }),
  guide(5, {
    title: "Where to find campus services and facilities",
    category: "campus_essentials",
    source_type: "official_campus_source",
    source_reference: "Sample Campus Map and Services page",
    last_verified_at: daysAgo(300),
    content_raw:
      "The library, health clinic, and student affairs office are listed on the campus services page.\n\nOpening hours change during exam weeks, so check the notice board.",
  }),
  guide(6, {
    title: "Preparing a scholarship application",
    category: "scholarship_growth",
    source_type: "curated_guide",
    source_reference: "Compiled from sample senior experiences",
    last_verified_at: daysAgo(35),
    content_raw:
      "Read the official announcement first, and list every required document.\n\nAsk for recommendation letters at least two weeks ahead.\n\nAlways confirm the latest requirements on the official page before submitting.",
  }),
  guide(7, {
    title: "Getting ready for your first internship search",
    category: "career_preparation",
    source_type: "curated_guide",
    last_verified_at: daysAgo(80),
    content_raw:
      "Update your CV with coursework and projects, and ask a lecturer or senior to review it.\n\nStart with companies that list junior roles, and keep a simple tracking sheet of applications.",
  }),
  guide(8, {
    title: "Draft: exam retake rules",
    category: "administrative_guide",
    source_type: "official_campus_source",
    last_verified_at: daysAgo(5),
    is_published: false,
    content_raw: "Unpublished draft. Must never appear in the Knowledge Hub.",
  }),
  // --- REALISTIC PILOT MAJOR: D4 TEKNOLOGI REKAYASA INTERNET (SV UGM) ---
  guide(9, {
    title: "SOP Laboratorium Jaringan & Praktikum TEDI SV UGM",
    category: "academic_survival",
    source_type: "official_campus_source",
    source_reference: "Buku Pedoman Praktikum Lab Jaringan SV UGM 2024",
    program_id: "prog-d4-tri",
    is_general: false,
    last_verified_at: daysAgo(12),
    content_raw:
      "Praktikum D4 TRI berpusat di Laboratorium Jaringan Gedung TILC (Teaching Industry Learning Center) dan Lab TEDI Sekip SV UGM.\n\n1. Presensi & Akses Lab: Wajib hadir 10 menit sebelum jam praktikum dengan pakaian berkerah, jas lab resmi, dan modul praktikum.\n\n2. Rak Server & Router Cisco: Konfigurasi switch & router wajib melalui kabel console sebelum disambungkan ke live topology. Dilarang mereset startup-config tanpa izin asisten lab.\n\n3. Akun NetAcad & LMS: Pastikan akun Cisco Networking Academy dan elok.ugm.ac.id aktif sebelum modul switching & routing dimulai.",
  }),
  guide(10, {
    title: "Alur Magang Industri 6 Bulan Kurikulum Vokasi D4 TRI",
    category: "career_preparation",
    source_type: "official_campus_source",
    source_reference: "Buku Panduan Magang Industri MBKM SV UGM",
    program_id: "prog-d4-tri",
    is_general: false,
    last_verified_at: daysAgo(15),
    content_raw:
      "Kurikulum Sarjana Terapan (D4) TRI mewajibkan magang industri minimal 6 bulan penuh pada Semester 7.\n\n1. Kriteria Perusahaan Mitra: Mitra bergerak di bidang Internet Service Provider (ISP), Data Center, Cloud Infrastructure, Cyber Security, atau Telekomunikasi (misal: Telkom Indonesia, Lintasarta, Indosat, Biznet).\n\n2. Pengajuan Berkas: Proposal magang diserahkan ke Koordinator Magang Prodi TRI paling lambat 2 bulan sebelum semester ganjil dimulai.\n\n3. Konversi 20 SKS: Penilaian akhir mencakup laporan teknis komprehensif, logbook mingguan, dan evaluasi langsung mentor industri.",
  }),
  guide(11, {
    title: "Panduan Proyek Akhir Terapan (Capstone Project) D4 TRI",
    category: "academic_survival",
    source_type: "official_campus_source",
    source_reference: "Panduan Skripsi Terapan Departemen TEDI SV UGM",
    program_id: "prog-d4-tri",
    is_general: false,
    last_verified_at: daysAgo(25),
    content_raw:
      "Proyek Akhir D4 TRI berfokus pada rancang bangun solusi jaringan terapan (hardware/software/networking prototype) yang diuji coba pada lingkungan nyata.\n\n1. Syarat Pengajuan Judul: Lulus minimal 120 SKS dengan IPK >= 2.50 dan telah menyelesaikan mata kuliah Metodologi Riset Terapan.\n\n2. Produk Akhir: Wajib menyertakan prototipe perangkat keras/jaringan fungsional atau deployment sistem berbasis cloud beserta dokumentasi teknis.\n\n3. Sidang Terbuka: Mahasiswa mempresentasikan hasil karya di depan 3 dosen penguji disertai demo live pengujian sistem.",
  }),
  guide(12, {
    title: "Daftar Sertifikasi Kompetensi Resmi & Subsidi Voucher SV UGM",
    category: "career_preparation",
    source_type: "curated_guide",
    source_reference: "LSP SV UGM & Cisco Academy UGM",
    program_id: "prog-d4-tri",
    is_general: false,
    last_verified_at: daysAgo(30),
    content_raw:
      "Lulusan D4 TRI dibekali Surat Keterangan Pendamping Ijazah (SKPI) dengan sertifikasi standar industri internasional.\n\n1. Sertifikasi yang Direkomendasikan: MTCNA (MikroTik), CCNA (Cisco Certified Network Associate), dan Red Hat Certified System Administrator (RHCSA).\n\n2. Fasilitas Bootcamp: SV UGM menyelenggarakan ujian sertifikasi bersubsidi secara periodik tiap semester genap melalui Cisco Academy SV UGM.\n\n3. Verifikasi SKPI: Unggah sertifikat yang terbit ke Simaster UGM menu SKPI untuk diverifikasi pengelola prodi.",
  }),
  guide(13, {
    title: "Keluarga Mahasiswa Departemen TEDI (KMTEDI) SV UGM",
    category: "social_community",
    source_type: "curated_guide",
    source_reference: "Panduan Mahasiswa Baru KMTEDI SV UGM",
    program_id: "prog-d4-tri",
    is_general: false,
    last_verified_at: daysAgo(40),
    content_raw:
      "KMTEDI adalah organisasi kemahasiswaan resmi yang menaungi mahasiswa D4 TRI dan D4 TRPL di Departemen TEDI SV UGM.\n\n1. Divisi Utama: PSDM, Riset & Teknologi (Ristek), Kominfo, dan Pengabdian Masyarakat.\n\n2. Study Club & Lab Community: Networking Study Group, Linux Community, dan Cyber Security Club rutin mengadakan sharing session konfigurasi mingguan.\n\n3. Event Tahunan: Informatics & Computer Festival (ICON) dan National Network Competition.",
  }),
  // --- UNIVERSITAS GADJAH MADA GENERAL GUIDES ---
  guide(14, {
    title: "Panduan Lengkap Simaster & Pengisian KRS Tiap Semester",
    category: "academic_survival",
    source_type: "official_campus_source",
    source_reference: "Direktorat Pendidikan dan Pengajaran (DPP) UGM",
    source_url: "https://simaster.ugm.ac.id",
    is_general: true,
    last_verified_at: daysAgo(8),
    content_raw:
      "KRS (Kartu Rencana Studi) wajib diisi oleh seluruh mahasiswa UGM melalui Simaster pada jadwal kalender akademik resmi.\n\n1. Status UKT: Pastikan tagihan UKT sudah berstatus lunas atau mengantongi surat dispensasi fakultas sebelum periode pengisian dibuka.\n\n2. Batas SKS: Sesuaikan pengambilan SKS dengan IPK semester sebelumnya (IPK >= 3.00 berhak mengambil maksimal 24 SKS).\n\n3. Persetujuan DPA: Setelah menyimpan KRS, segera hubungi Dosen Pembimbing Akademik untuk proses validasi dan persetujuan.",
  }),
  guide(15, {
    title: "Layanan Kesehatan Bebas Biaya Mahasiswa di GMC UGM",
    category: "campus_essentials",
    source_type: "official_campus_source",
    source_reference: "Gadjah Mada Medical Center (GMC) UGM",
    source_url: "https://gmc.ugm.ac.id",
    is_general: true,
    last_verified_at: daysAgo(18),
    content_raw:
      "Mahasiswa aktif UGM berhak mengakses fasilitas kesehatan primer di Gadjah Mada Medical Center (GMC), Jl. Colombo.\n\n1. Fasilitas: Dokter umum, dokter gigi, konseling psikologi, farmasi, dan layanan gawat darurat 24 jam.\n\n2. Syarat Berobat: Tunjukkan KTM fisik atau e-KTM Simaster aktif. Layanan rawat jalan dasar bebas biaya.\n\n3. Rujukan Spesialis: Jika memerlukan penanganan lanjutan, dokter GMC akan menerbitkan rujukan ke Rumah Sakit Akademik (RSA) UGM.",
  }),
  guide(16, {
    title: "Strategi & Timeline Pendaftaran Beasiswa KSE & Djarum UGM",
    category: "scholarship_growth",
    source_type: "curated_guide",
    source_reference: "Direktorat Kemahasiswaan (Ditmawa) UGM",
    source_url: "https://ditmawa.ugm.ac.id",
    is_general: true,
    last_verified_at: daysAgo(22),
    content_raw:
      "Ditmawa UGM mengelola puluhan kemitraan beasiswa yayasan dan perusahaan untuk jenjang Sarjana dan Sarjana Terapan.\n\n1. Portal Terpadu: Seluruh pengajuan rekomendasi beasiswa wajib melalui beasiswa.ugm.ac.id.\n\n2. Berkas Wajib: Transkrip nilai legalisir, slip penghasilan orang tua, dan esai rencana kontribusi.\n\n3. Larangan Beasiswa Ganda: Mahasiswa dilarang keras menerima dua beasiswa bernilai tunjangan hidup sekaligus.",
  }),
  guide(17, {
    title: "Konfigurasi Wi-Fi Kampus (UGM-Hotspot) & Eduroam Internasional",
    category: "campus_essentials",
    source_type: "official_campus_source",
    source_reference: "Direktorat Sistem dan Sumber Daya Informasi (DSSDI) UGM",
    is_general: true,
    last_verified_at: daysAgo(14),
    content_raw:
      "Akses internet nirkabel berkecepatan tinggi tersedia di seluruh area gedung fakultas dan ruang terbuka hijau UGM.\n\n1. SSID UGM-Hotspot: Sambungkan perangkat ke 'UGM-Hotspot', lalu buka peramban untuk login SSO menggunakan akun @mail.ugm.ac.id.\n\n2. Eduroam: Menggunakan autentikasi 802.1x EAP. Username menggunakan email lengkap UGM dan password SSO. Otomatis terhubung di kampus mitra luar negeri.\n\n3. Helpdesk: Layanan pemulihan akun SSO dapat diakses di Gedung Pusat UGM Sayap Selatan.",
  }),
  // --- MOCKUP OTHER MAJORS ---
  guide(18, {
    title: "Standar Version Control Git & CI/CD Praktikum TRPL SV UGM",
    category: "academic_survival",
    source_type: "curated_guide",
    source_reference: "Laboratorium Software Rekayasa SV UGM",
    program_id: "prog-d4-trpl",
    is_general: false,
    last_verified_at: daysAgo(45),
    content_raw:
      "Mahasiswa D4 TRPL wajib mengikuti konvensi Conventional Commits dan branching model GitFlow pada setiap tugas besar rekayasa perangkat lunak.",
  }),
  guide(19, {
    title: "Panduan Jalur Minat Riset AI & Data Science FT UGM",
    category: "academic_survival",
    source_type: "curated_guide",
    source_reference: "Departemen Teknik Elektro dan Teknologi Informasi FT UGM",
    program_id: "prog-s1-ti",
    is_general: false,
    last_verified_at: daysAgo(50),
    content_raw:
      "Pemilihan peminatan AI dan Data Science dibuka pada akhir semester 4 dengan prasyarat kelulusan Struktur Data dan Probabilitas Statistik.",
  }),
];

export const MOCK_EXPERIENCES: ExperienceRow[] = [
  {
    id: "50000000-0000-4000-8000-000000000001",
    campus_id: CAMPUS_ID,
    program_id: PROGRAM_ID,
    author_id: "20000000-0000-4000-8000-000000000001",
    title: "Surviving my first semester with a heavy course load",
    semester_context: 1,
    situation:
      "I registered for the maximum credits because everything looked interesting.",
    challenge:
      "By week five I was behind on two courses and sleeping very little.",
    solution:
      "I dropped one elective within the allowed period and made a weekly plan.",
    result: "My grades recovered and I finished the semester with time to rest.",
    advice_for_juniors:
      "Start with a realistic load. You can always add courses later.",
    tags: ["course-load", "first-semester"],
    is_verified_contributor: true,
    helpful_count: 14,
    created_at: daysAgo(25),
  },
  {
    id: "50000000-0000-4000-8000-000000000002",
    campus_id: CAMPUS_ID,
    program_id: PROGRAM_ID,
    author_id: "20000000-0000-4000-8000-000000000002",
    title: "How I found my study group in semester 3",
    semester_context: 3,
    situation: "I studied alone and felt stuck on difficult topics.",
    challenge: "I did not know anyone in my class outside of my dorm.",
    solution:
      "I asked two classmates to practice questions together after lectures.",
    result: "We now meet weekly and our understanding improved a lot.",
    advice_for_juniors: "Ask early. Most people are happy to study together.",
    tags: ["study-group"],
    is_verified_contributor: false,
    helpful_count: 6,
    created_at: daysAgo(70),
  },
  // --- REALISTIC EXPERIENCES D4 TRI SV UGM ---
  {
    id: "50000000-0000-4000-8000-000000000003",
    campus_id: CAMPUS_ID,
    program_id: "prog-d4-tri",
    author_id: "20000000-0000-4000-8000-000000000003",
    title: "Lolos Magang Network Engineer di PT Telkom lewat Jalur Vokasi",
    semester_context: 7,
    situation:
      "Di semester 6, saya harus memilih mitra magang industri 6 bulan kurikulum sarjana terapan TRI. Persaingan di Telkom Regional IV cukup ketat.",
    challenge:
      "Wawancara teknis menguji konfigurasi live BGP, switching VLAN, dan troubleshooting arsitektur hybrid cloud yang belum semua ada di teori kelas.",
    solution:
      "Saya memaksimalkan praktikum di Lab Jaringan Gedung TILC dan mengambil sertifikasi MikroTik MTCNA bersubsidi dari SV UGM. Saya juga menyusun portofolio topologi di GitHub.",
    result:
      "Diterima di Divisi Enterprise Network Telkom selama 6 bulan, terlibat konfigurasi metro ethernet, dan mendapatkan tawaran project lanjutan.",
    advice_for_juniors:
      "Mahasiswa Vokasi punya jam terbang praktikum tinggi! Dokumentasikan portofolio lab kalian dan ambil sertifikasi industri sebelum semester 6.",
    tags: ["magang-industri", "network-engineer", "telkom", "vokasi-tri"],
    is_verified_contributor: true,
    helpful_count: 28,
    created_at: daysAgo(10),
  },
  {
    id: "50000000-0000-4000-8000-000000000004",
    campus_id: CAMPUS_ID,
    program_id: "prog-d4-tri",
    author_id: "20000000-0000-4000-8000-000000000004",
    title: "Strategi Menyeimbangkan 4 Praktikum Lab Jaringan dengan Organisasi KMTEDI",
    semester_context: 3,
    situation:
      "Semester 3 adalah fase kaget karena ada 4 modul praktikum dengan laporan asistensi mingguan dan tugas jaringan intensif.",
    challenge:
      "Saya menjabat staf divisi Ristek KMTEDI dan sempat keteteran waktu tidur hingga nilai pre-test praktikum sempat turun.",
    solution:
      "Saya menerapkan aturan 'Laporan Selesai di Hari Praktikum'. Begitu lab selesai, langsung tuntaskan analisa data di perpustakaan SV bersama 3 rekan kelompok.",
    result:
      "IPK semester 3 bertahan di 3.68, kepanitiaan ICON KMTEDI berjalan lancar, dan ritme istirahat tetap terjaga.",
    advice_for_juniors:
      "Jangan menunda laporan praktikum sampai malam sebelum deadline asistensi. Bentuk kelompok belajar yang solid sejak awal semester!",
    tags: ["time-management", "kmtedi", "praktikum-lab", "vokasi-tri"],
    is_verified_contributor: true,
    helpful_count: 19,
    created_at: daysAgo(18),
  },
  {
    id: "50000000-0000-4000-8000-000000000005",
    campus_id: CAMPUS_ID,
    program_id: "prog-d4-tri",
    author_id: "20000000-0000-4000-8000-000000000005",
    title: "Tips Lolos Beasiswa Unggulan Kemendikbudristek untuk Mahasiswa Vokasi",
    semester_context: 4,
    situation:
      "Kebutuhan alat praktikum dan perangkat lab mandiri cukup besar, sehingga saya bertekad mencari beasiswa mandiri.",
    challenge:
      "Persyaratan esai dan wawancara menuntut rencana kontribusi nyata keilmuan vokasi bagi masyarakat.",
    solution:
      "Saya berkonsultasi dengan DPA merancang roadmap proyek akhir jaringan pedesaan di DIY. Esai saya fokuskan pada solusi kesenjangan digital.",
    result:
      "Lolos pendanaan penuh biaya UKT dan biaya hidup bulanan hingga lulus dari Kemendikbudristek.",
    advice_for_juniors:
      "Pihak beasiswa sangat menghargai mahasiswa vokasi yang memiliki rencana terapan konkret. Tunjukkan dampak nyata dari keilmuanmu!",
    tags: ["beasiswa-unggulan", "ditmawa-ugm", "vokasi-tri"],
    is_verified_contributor: true,
    helpful_count: 22,
    created_at: daysAgo(35),
  },
];
