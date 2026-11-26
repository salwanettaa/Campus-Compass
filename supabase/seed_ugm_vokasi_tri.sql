-- =============================================================================
-- SEED DATA PILOT UGM & SEKOLAH VOKASI D4 TEKNOLOGI REKAYASA INTERNET (TRI)
-- Generated automatically by scripts/sync-sources.mjs from data/curated/guides.json
-- Jalankan di Supabase SQL Editor SETELAH schema v2 di docs/TECH_AND_DATABASE.md
-- dan patches 01 & 02. Aman dijalankan berulang kali (idempotent).
-- =============================================================================
DO $$
DECLARE
    v_ugm     UUID;
    v_sv      UUID;
    v_ft      UUID;
    v_fmipa   UUID;
    v_feb     UUID;
    v_tri     UUID;
    v_trpl    UUID;
    v_ti      UUID;
BEGIN
    -- 1. Campus: Universitas Gadjah Mada
    INSERT INTO public.campuses (name, slug, domain, is_active)
    VALUES ('Universitas Gadjah Mada', 'ugm', 'ugm.ac.id', true)
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, is_active = true;

    SELECT id INTO v_ugm FROM public.campuses WHERE slug = 'ugm';

    -- 2. Faculties
    INSERT INTO public.faculties (campus_id, name, code)
    SELECT v_ugm, 'Sekolah Vokasi', 'SV'
    WHERE NOT EXISTS (SELECT 1 FROM public.faculties WHERE campus_id = v_ugm AND code = 'SV');

    INSERT INTO public.faculties (campus_id, name, code)
    SELECT v_ugm, 'Fakultas Teknik', 'FT'
    WHERE NOT EXISTS (SELECT 1 FROM public.faculties WHERE campus_id = v_ugm AND code = 'FT');

    INSERT INTO public.faculties (campus_id, name, code)
    SELECT v_ugm, 'Fakultas Matematika dan Ilmu Pengetahuan Alam', 'FMIPA'
    WHERE NOT EXISTS (SELECT 1 FROM public.faculties WHERE campus_id = v_ugm AND code = 'FMIPA');

    INSERT INTO public.faculties (campus_id, name, code)
    SELECT v_ugm, 'Fakultas Ekonomika dan Bisnis', 'FEB'
    WHERE NOT EXISTS (SELECT 1 FROM public.faculties WHERE campus_id = v_ugm AND code = 'FEB');

    SELECT id INTO v_sv    FROM public.faculties WHERE campus_id = v_ugm AND code = 'SV';
    SELECT id INTO v_ft    FROM public.faculties WHERE campus_id = v_ugm AND code = 'FT';
    SELECT id INTO v_fmipa FROM public.faculties WHERE campus_id = v_ugm AND code = 'FMIPA';
    SELECT id INTO v_feb   FROM public.faculties WHERE campus_id = v_ugm AND code = 'FEB';

    -- 3. Programs
    INSERT INTO public.programs (campus_id, faculty_id, name, code, degree_level, is_pilot)
    VALUES
        (v_ugm, v_sv,    'D4 Teknologi Rekayasa Internet',         'TRI',   'D4',            true),
        (v_ugm, v_sv,    'D4 Teknologi Rekayasa Perangkat Lunak',  'TRPL',  'D4',            false),
        (v_ugm, v_ft,    'S1 Teknologi Informasi',                 'TI',    'Undergraduate', false),
        (v_ugm, v_fmipa, 'S1 Ilmu Komputer',                       'ILKOM', 'Undergraduate', false),
        (v_ugm, v_feb,   'S1 Manajemen',                           'MN',    'Undergraduate', false)
    ON CONFLICT (campus_id, code) DO UPDATE
    SET name = EXCLUDED.name, faculty_id = EXCLUDED.faculty_id, is_pilot = EXCLUDED.is_pilot;

    SELECT id INTO v_tri  FROM public.programs WHERE campus_id = v_ugm AND code = 'TRI';
    SELECT id INTO v_trpl FROM public.programs WHERE campus_id = v_ugm AND code = 'TRPL';
    SELECT id INTO v_ti   FROM public.programs WHERE campus_id = v_ugm AND code = 'TI';

    -- Remove legacy uncurated IDs from earlier seed iterations if present
    DELETE FROM public.guides
    WHERE id IN (
        '41000000-0000-4000-8000-000000000008',
        '41000000-0000-4000-8000-000000000009',
        '41000000-0000-4000-8000-000000000010',
        '41000000-0000-4000-8000-000000000011'
    );

    -- 4. Guides — Program-specific & General Campus Guides
    INSERT INTO public.guides (
        id, campus_id, program_id, title, category, is_general, content_raw,
        source_type, source_reference, source_url, is_published, last_verified_at
    ) VALUES
    (
        '41000000-0000-4000-8000-000000000001',
        v_ugm, v_tri,
        'Kebijakan Magang, Praktik Industri & Sertifikasi D4 TRI (Hearing Prodi)',
        'career_preparation', false,
        'Pada semester ganjil 2025/2026, Program Studi Teknologi Rekayasa Internet (TRI) Sekolah Vokasi UGM telah mengadakan hearing dengan mahasiswa untuk membahas berbagai kebijakan akademik dan program ke depannya. Berikut adalah rangkuman Hearing Prodi yang telah dilaksanakan:

## Program Magang dan Praktik Industri (PI)

Program magang tetap akan dilaksanakan mulai semester depan dengan beberapa perubahan signifikan:

### Kurikulum 2026
- Magang akan diintegrasikan dengan Proyek Integrasi (PI)
- Waktu pelaksanaan PI tidak lagi dilaksanakan pada semester 4, melainkan digabung dengan magang pada semester 6 atau 7
- Mahasiswa harus telah menyelesaikan minimal 20 SKS sebagai syarat mengikuti program

### Durasi Magang
- Minimal 4 bulan untuk perusahaan pada umumnya
- Minimal 3 bulan untuk perusahaan besar (masih diperbolehkan)
- Sistem penilaian akan berbeda antara perusahaan besar dan perusahaan kecil

### Status Angkatan 2024

Pelaksanaan PI untuk angkatan 2024 masih dipending dan akan dilaksanakan sekaligus dengan magang pada semester 6 atau 7.

### Magang dengan Mitra

Untuk program magang dengan mitra seperti HINO, ketersediaannya bergantung pada kebijakan perusahaan mitra. Informasi lebih lanjut akan dibagikan melalui grup WhatsApp prodi.

### Proyek Magang sebagai Tugas Akhir

Proyek magang dapat dijadikan tugas akhir dengan ketentuan:
- Memenuhi 5 Profil Lulusan TRI
- Perlu didiskusikan dengan dosen pembimbing terkait pengembangan proyek

## Sertifikasi

### Sertifikasi yang Tersedia

Program studi akan menyediakan berbagai sertifikasi tambahan, antara lain:
- Oracle (banyak pilihan gratis)
- Sertifikasi BNSP
- Sertifikasi pihak ketiga: DTS Kominfo dan beberapa kementerian

**Catatan:** Rekognisi akademik hanya diberikan untuk kegiatan magang.

### Sertifikasi Oracle untuk Yudisium

Sertifikasi Oracle dapat digunakan sebagai syarat yudisium dengan ketentuan:
- Berada pada level Associate
- Tidak dikenakan biaya

### Sertifikasi MTCNA dan Bahasa Inggris
- Informasi teknis dapat ditanyakan kepada Pak Alif
- Angkatan 2022 (IDP): Masih diperbolehkan menggunakan sertifikat bahasa Inggris
- Angkatan 2023 ke bawah: Dapat menggunakan sertifikat lomba nasional juara 1-3 sebagai pengganti sertifikat bahasa Inggris

Sertifikat untuk asisten dosen tidak diberikan secara otomatis. Mahasiswa harus mengajukan permohonan ke bagian akademik.',
        'official_campus_source', 'Official Prodi D4 TRI SV UGM — Kebijakan Magang, Praktik Industri & Sertifikasi D4 TRI (Hearing Prodi)', 'https://tri.sv.ugm.ac.id/hearing/',
        true, '2026-01-04T07:36:20Z'::timestamptz
    ),
    (
        '41000000-0000-4000-8000-000000000002',
        v_ugm, v_tri,
        'Pengajuan Keringanan & Penyesuaian UKT Sarjana Terapan TRI',
        'administrative_guide', false,
        '## Keringanan UKT (Semester 9 dan 10 – Proyek Akhir)

Pengajuan keringanan UKT khusus bagi mahasiswa Sarjana Terapan Semester 9 dan 10 yang hanya mengambil mata kuliah Proyek Akhir.
- Batas waktu pengajuan: 23 Januari 2026
- Media pengajuan: Melalui simaster.ugm.ac.id
- Dokumen pendukung: Mengisi [Form Keringanan UKT (untuk yang tinggal TA semester 9-10 DIV)](http://tri.sv.ugm.ac.id/wp-content/uploads/sites/712/2026/01/Form-Keringanan-UKT-untuk-yang-tinggal-TA-semester-9-10-DIV.docx)

## Keringanan UKT (Persentase Tertentu)

Pengajuan keringanan UKT berdasarkan persentase tertentu bagi mahasiswa Sarjana Terapan.
- Mahasiswa WAJIB mengunggah Surat Rekomendasi dari Dosen Pembimbing Akademik
- Surat rekomendasi menggunakan format form resmi yang telah disediakan
- Batas waktu pengajuan: 23 Januari 2026
- Media pengajuan: Melalui simaster.ugm.ac.id
- Dokumen Wajib: Form [Surat Rekomendasi Dosen Pembimbing Akademik (terlampir)](https://docs.google.com/document/d/1CkpcDaaAZParBY78vLzbpBDScm8ox895)',
        'official_campus_source', 'Official Prodi D4 TRI SV UGM — Pengajuan Keringanan & Penyesuaian UKT Sarjana Terapan TRI', 'https://tri.sv.ugm.ac.id/penyesuaian-ukt/',
        true, '2026-01-22T12:19:30Z'::timestamptz
    ),
    (
        '41000000-0000-4000-8000-000000000003',
        v_ugm, v_tri,
        'Persyaratan & Kelengkapan Dokumen Yudisium D4 TRI SV UGM',
        'administrative_guide', false,
        '## 1. Proses Pengajuan Yudisium

Mahasiswa yang ingin mengajukan permohonan Yudisium harus mengisi formulir berikut:
- Mengisi formulir permohonan Yudisium melalui tautan: [ugm.id/YudisiumDTEDI](http://ugm.id/YudisiumDTEDI)

## 2. Dokumen Persyaratan Yudisium

Mahasiswa diwajibkan mengunggah dan mengumpulkan dokumen berikut:
a. **Formulir Permohonan Yudisium**
b. **Formulir Pembatalan Mata Kuliah Pilihan**
c. **Formulir Ceklist Judul Proyek Akhir**
d. **Pas Foto Format .JPG** (Rasio 4:6) dengan ketentuan:
  - Kemeja putih, blazer/jas hitam (bukan jas almamater)
  - Latar belakang biru tua, tidak memakai kacamata hitam
  - Foto jelas/tajam, bukan hasil scan/repro
e. **Transkrip Nilai Sementara dari Simaster**
  - Pastikan tidak ada nilai kosong atau "T"
  - Jika ada nilai kosong, segera lengkapi dan laporkan ke bagian akademik
f. **Scan Surat Tanda Terima Menyerahkan Skripsi & Bebas Perpustakaan UGM**
  - Unggah Proyek Akhir secara mandiri melalui: [simaster.ugm.ac.id](https://simaster.ugm.ac.id)
g. **Scan Ijazah Terakhir** (Bukan sertifikat hasil ujian)
h. **Scan Transkrip Nilai D3** (Untuk mahasiswa Alih Jenjang)
i. **Scan Sertifikat PPSMB**
j. **Persentase Hasil Cek Plagiasi**
  - Similarity Index maksimal 25% (ditandatangani oleh DPPA)
k. **Scan Sertifikat Kemampuan Bahasa Inggris**
  - 1. TEVocS dengan nilai minimal 60; 2. AcEPT dengan nilai minimal 209; 3. IELTS dengan nilai minimal 4.5; 4. TOEFL IBT dengan nilai minimal 52; atau 5. TOEIC dengan nilai minimal 495.
  - Ketentuan selengkapnya: [tri.sv.ugm.ac.id/syarat-inggris/](https://tri.sv.ugm.ac.id/syarat-inggris/)
l. **Surat Sertifikat Kompetensi** (Wajib untuk mahasiswa reguler mulai angkatan 2019)
  - Sertifikat internasional minimal level associate expert: CCNA, MTCNA, HCIA, atau ACA
  - Sertifikat nasional yang diterbitkan oleh Badan Nasional Sertifikasi Profesi (BNSP)
  - Sertifikat kompetensi dari departemen
  - Sertifikat yang terdaftar dan dapat pengesahan dari ketua program studi
  - Dicantumkan dalam Berita Acara Yudisium
m. **Screenshot bukti Unggah Laporan Proyek Akhir dan Scan Lembar Pengesahan**
  - Unggah melalui tautan: [ugm.id/ProyekAkhirDTEDI](http://ugm.id/ProyekAkhirDTEDI)
n. **Bukti Pengajuan Publikasi/Makalah**
  - Berupa prosiding konferensi, HAKI, atau jurnal (berlaku untuk mahasiswa mulai angkatan 2019)
o. **Surat Keterangan Bebas Lab**
  - Pemohon melapor ke laboran untuk mengajukan bebas lab dengan melampirkan surat permohonan bebas lab
  - Unduh form template surat permohonan bebas lab: [ugm.id/TemplateSuratBebasLabTAJ](http://ugm.id/TemplateSuratBebasLabTAJ)

## 3. Proses Sidang Yudisium
a. Sidang Yudisium dilaksanakan melalui **Rapat Pengurus Departemen**.
b. **Berita Acara Yudisium** akan dikirimkan ke peserta melalui email.

## Dokumen Penting
- [Template Surat Permohonan Bebas Lab](https://tri.sv.ugm.ac.id/wp-content/uploads/sites/712/2025/03/Template-Surat-Permohonan-Bebas-Lab.doc)
- [Lembar Perbaikan Proyek Akhir](https://tri.sv.ugm.ac.id/wp-content/uploads/sites/712/2025/03/Lembar-Perbaikan-PA.doc)
- [Template Laporan Proyek Akhir DTEDI UGM v1.3](https://tri.sv.ugm.ac.id/wp-content/uploads/sites/712/2025/03/Template-PA-DTEDI-v3.doc)
- [Pedoman Penulisan Laporan Proyek Akhir DTEDI](https://tri.sv.ugm.ac.id/wp-content/uploads/sites/712/2025/03/Ver-1.5-PEDOMAN-PENULISAN-PROYEK-AKHIR-DTEDI-1.docx-1.pdf)
- [Panduan Penamaan File Karya Tugas Akhir](https://tri.sv.ugm.ac.id/wp-content/uploads/sites/712/2025/03/panduan_penamaan_file.pdf)',
        'official_campus_source', 'Official Prodi D4 TRI SV UGM — Persyaratan & Kelengkapan Dokumen Yudisium D4 TRI SV UGM', 'https://tri.sv.ugm.ac.id/dokumen-yudisium/',
        true, '2026-10-13T05:08:45Z'::timestamptz
    ),
    (
        '41000000-0000-4000-8000-000000000004',
        v_ugm, v_tri,
        'Alur Pendaftaran Wisuda Program Sarjana & Sarjana Terapan UGM',
        'administrative_guide', false,
        '1. Pendaftaran Wisuda Periode I Tahun Akademik 2026/2027 dilakukan melalui laman [simaster.ugm.ac.id](https://simaster.ugm.ac.id) dengan menggunakan akun Single Sign On (SSO) masing-masing. Apabila belum memiliki akun SSO UGM, dapat menghubungi Direktorat Teknologi Informasi (DTI).
2. Tahapan pendaftaran wisuda:
  a. Calon wisudawan/wati melakukan pemutakhiran nomor telepon (HP) dan email non UGM pada menu pengaturan, sub menu data akun;
  b. Calon wisudawan/wati memeriksa data pokok pada SIMASTER dan menyetujui apabila data sudah sesuai, melalui menu: Akademik Kemahasiswaan- Akademik-Data Mahasiswa-Data PDDikti;
  c. Calon wisudawan/wati melihat dan membandingkan data transaksi akademik antara SIMASTER dengan PDDikti melalui menu: Akademik Kemahasiswaan- AkademikData Mahasiswa-KHS Simaster-KHS PDDikti. Silakan hubungi Operator SIA Akademik Program Studi apabila terdapat perbedaan data Kode dan Nama Matakuliah, Jumlah SKS, dan Nilai;
  d. Memilih menu akademik, sub menu yudisium dan melengkapi biodata untuk keperluan penulisan ijazah, mengunggah scan dokumen ijazah terakhir, scan KTP atau paspor (bagi WNA), foto berwarna, dan dokumen pendukung perubahan data diri (jika ada), unggah SK Yudisium/SKL yang ditandatangan oleh Dekan/Wakil Dekan (sesuai Peraturan Rektor No 23 Tahun 2024 Pasal 48);
  e. Melengkapi persyaratan antara lain:
    1. Mengisi data untuk keperluan Kartu Alumni GAMA Co-Brand dan Exit Survey, dapat dilakukan secara on-line melalui laman [simaster.ugm.ac.id](https://simaster.ugm.ac.id) pada menu alumni, sub menu kartu GAMA Co-Brand.
    2. Mengisi data Exit Survey, dapat dilakukan secara on-line melalui laman [simaster.ugm.ac.id](https://simaster.ugm.ac.id) menu survei.
    3. Mengunggah file VERSI FINAL karya tulis akhir (Tesis/Disertasi/Tugas Akhir) melalui laman [simaster.ugm.ac.id](https://simaster.ugm.ac.id) dengan menggunakan akun email UGM/SSO UGM sesuai format pada list lampiran edaran ini.
  f. Memilih periode yudisium yang sudah ditawarkan oleh Fakultas/Sekolah Sarjana dan Sarjana Terapan/Program Studi;
  g. Melakukan pengecekan dan persetujuan isian data ijazah dengan klik preview ijazah;
  h. Mendaftar Wisuda Periode I Tahun Akademik 2026/2027 paling lambat tanggal 30 Oktober 2026 pukul 12:00 WIB dengan klik Daftar Wisuda (bagi peserta yang terlambat mendaftar dari tanggal penutupan, peserta dapat mendaftar pada periode berikutnya, yaitu Periode Februari 2027);',
        'official_campus_source', 'Official Prodi D4 TRI SV UGM — Alur Pendaftaran Wisuda Program Sarjana & Sarjana Terapan UGM', 'https://tri.sv.ugm.ac.id/ketentuan-wisuda/',
        true, '2026-10-01T03:24:41Z'::timestamptz
    ),
    (
        '41000000-0000-4000-8000-000000000005',
        v_ugm, v_tri,
        'FORKOMTRI — Himpunan Mahasiswa Teknologi Rekayasa Internet SV UGM',
        'social_community', false,
        '### [Donor Darah 2025](https://tri.sv.ugm.ac.id/donor-darah-2025/)

Yogyakarta, 22 November 2025 - Aksi kemanusiaan hasil kerja sama dengan PMI yang terbuka bagi mahasiswa dan masyarakat umum. Bertujuan untuk membantu pemenuhan stok darah medis sekaligus mengedukasi pentingnya pola ...

### [Berbagi dan Beraksi 2025](https://tri.sv.ugm.ac.id/berbagi-dan-beraksi-2025/)

Yogyakarta, 20 September 2025 - Program pengabdian dan kepedulian sosial berupa aksi nyata penyaluran bantuan/kegiatan bakti sosial yang dilaksanakan di Panti Jompo. Kegiatan ini bertujuan menumbuhkan rasa empati sosial dan ...

### [Open House ForkomTRI](https://tri.sv.ugm.ac.id/open-house-forkomtri/)

Yogyakarta, 13 September 2025 - Agenda sosialisasi dan pengenalan organisasi HIMA Forkomtri kepada mahasiswa baru. Berisi pemaparan peran tiap divisi, program kerja unggulan, serta ajakan untuk berpartisipasi aktif dalam dinamika ...

### [Cyber League 2025](https://tri.sv.ugm.ac.id/cyber-league-2025/)

Yogyakarta, 29 Agustus 2025 - Wadah penyaluran bakat olahraga dan ajang keakraban antar angkatan melalui pertandingan olahraga (Mini Soccer). Kegiatan ini dirancang untuk menjaga kebugaran fisik, sarana refreshing, serta memupuk ...

### [Wisudaan TRI Agustus 2025](https://tri.sv.ugm.ac.id/wisudaan-tri-agustus-2025/)

Yogyakarta, 28 Agustus 2025 - Agenda apresiasi dan selebrasi pelepasan bagi para wisudawan/wisudawati Teknologi Rekayasa Internet SV UGM. Meliputi acara penyambutan khusus, penyerahan kenang-kenangan dari himpunan, serta sesi foto bersama ...',
        'official_campus_source', 'Official Prodi D4 TRI SV UGM — FORKOMTRI — Himpunan Mahasiswa Teknologi Rekayasa Internet SV UGM', 'https://tri.sv.ugm.ac.id/forkomtri/',
        true, '2026-10-07T17:28:16Z'::timestamptz
    ),
    (
        '41000000-0000-4000-8000-000000000006',
        v_ugm, v_tri,
        'National Networking Competition (NETCOMP) D4 TRI SV UGM',
        'scholarship_growth', false,
        '## TechNetworkers Unite: Empowering Networks, Safeguarding Integrity

National Networking Competition (NETCOMP) 4.0 is a premier national event that empowers the next generation of tech enthusiasts in networking and cybersecurity. This year, NETCOMP introduces a Special Edition Workshop featuring the latest innovations in DevOps and Cloud Computing, offering participants hands-on experience with modern digital infrastructure and automation. Through competitions, workshops, national seminar, and industry expo NETCOMP 4.0 aims to inspire collaboration, innovation, and excellence in shaping Indonesia’s secure and connected digital future.',
        'official_campus_source', 'Official Prodi D4 TRI SV UGM — National Networking Competition (NETCOMP) D4 TRI SV UGM', 'https://tri.sv.ugm.ac.id/netcompugm/',
        true, '2026-01-19T08:00:44Z'::timestamptz
    ),
    (
        '41000000-0000-4000-8000-000000000007',
        v_ugm, v_tri,
        'Direktori Layanan Akademik, Praktikum & Laboratorium D4 TRI SV UGM',
        'academic_survival', false,
        'Halaman ini menyediakan berbagai layanan akademik yang dapat diakses oleh mahasiswa, dosen, dan staf. Silakan pilih layanan yang sesuai kebutuhan melalui pilihan di bawah ini.

## Surat & Permohonan Resmi
- [Permohonan Yudisium](http://ugm.id/YudisiumDTEDI)
- [Template Surat Peminjaman Alat/Ruangan LAB](http://ugm.id/templateLABTAJ)
- [Template Surat Bebas LAB](http://ugm.id/TemplateSuratBebasLabTAJ)

## Pengumpulan Laporan & Proyek
- [Pengumpulan Laporan Akhir Praktik Industri](https://ugm.id/FormLapAkhirPIDTEDI)
- [Template Laporan Praktik Industri](https://tri.sv.ugm.ac.id/file/template-kp/)
- [Upload Laporan Proyek Akhir](http://ugm.id/ProyekAkhirDTEDI)

## Formulir Permohonan & Peminjaman
- [Peminjaman VPS](http://ugm.id/FormPeminjamanVPS20242025)
- [Permintaan Akses VPN](http://ugm.id/PengajuanAksesVpnTRI)
- [Pengajuan Peminjaman Ruangan/Alat Lab](http://ugm.id/FormPeminjamanLabdanAlat)

## Dokumen Panduan & Template
- [Buku Panduan Akademik](https://drive.google.com/file/d/1wHrGFufT5n4EnzdTVrY8ge5ighaLTxSQ/view?usp=sharing)
- [Kelengkapan Dokumen Praktik Industri](https://drive.google.com/drive/folders/16FDv2nJyCPyFMQlXdUp14DtZWK7z4aqk)
- [Form Rekomendasi Magang TRI](http://ugm.id/formmagangtri)

## Daftar Mata Kuliah & Tracer Alumni
- [Daftar Mata Kuliah](http://ugm.id/krstri)
- [Tracer Alumni](http://bit.ly/TracerAlumniDTEDI)',
        'official_campus_source', 'Official Prodi D4 TRI SV UGM — Direktori Layanan Akademik, Praktikum & Laboratorium D4 TRI SV UGM', 'https://tri.sv.ugm.ac.id/layanan-akademik/',
        true, '2026-09-17T02:41:32Z'::timestamptz
    ),
    (
        '42000000-0000-4000-8000-000000000011',
        NULL, NULL,
        'Fasilitas Penunjang Mahasiswa UGM: Olahraga, Asrama, Trans Gadjah Mada & Parkir',
        'campus_essentials', true,
        '## Stadion Pancasila

Stadion ini terletak di kawasan lembah UGM dan digunakan untuk kegiatan sepak bola, atletik, hoki, serta kegiatan-kegiatan lain yang diizinkan Rektor UGM.

## Lapangan Tenis

Lapangan ini berlokasi di lembah UGM dan digunakan oleh Unit Tenis UGM, mahasiswa, dan sivitas akademika UGM lainnya.

## GOR Pancasila

GOR Pancasila terdiri dari hall, tribun penonton, Sekretariat Manajemen GOR, ruang ganti, loket tiket dan ruang VIP. Hall dapat digunakan untuk kegiatan oleharaga Bola Basket, Bola Voli, Bulutangkis, dan Futsal.

## Lapangan Softball/Baseball

**Lapangan Soft Ball/Base Ball**,

Lapangan khusus untuk soft ball/base ball yang tersedia dapat pula digunakan oleh pihak eksternal setelah memperoleh izin dari Rektor/Direktur Kemahasiswaan.

## Asrama Mahasiswa

UGM menyediakan fasilitas asrama sebagai tempat tinggal sekaligus wahana interaksi lintas kultural. Universitas Gadjah Mada Residence adalah fasilitas hunian yang disediakan untuk mahasiswa, dosen, peserta pelatihan, tamu fakultas, program Studi, lembaga maupun pusat studi di lingkungan UGM.

Lokasi asrama mahasiswa
- **Asrama Putra Darma Putra** Jl. Andong, Baciro (3 km dari kampus) – 3 lantai, 96 kamar
- **Asrama Putra Cemaralima** Karanggayam, Depok, Sleman (1 km dari kampus) – 4 lantai, 48 kamar
- **Asrama Putri Ratnaningsih** Jl. Kartini, Sagan, Yogyakarta (500 m dari kampus) – 2 lantai, 30 kamar
- **Bulaksumur Residence** Sisi timur UGM (dekat Fakultas Peternakan) – 4 lantai, 168 kamar

## Sarana Transportasi Lokal UGM

**Transportasi lokal UGM**

Sebagai implementasi gerakan UGM Green Campus maka Universitas menghadirkan Green Transportation berupa layanan Trans Gadjah Mada, yaitu layanan bus listrik yang merupakan salah satu moda transportasi ramah lingkungan yang beroperasi di dalam kampus.
Moda transportasi tersebut dimaksudkan untuk mempermudah mobilitas sivitas UGM di lingkungan kampus.

Sarana-prasarana transportasi di dalam kampus ditata dengan mempertimbangkan berbagai aspek, yakni keselamatan, kenyamanan, terciptanya udara bersih, dan keterhubungan antar berbagai bagian kampus. Untuk itu, prioritas diberikan berbeda pada berbagai jenis moda transportasi ramah lingkungan seperti sepeda kampus, mobil listrik dan bus listrik Trans Gadjah Mada.

[Rute dan Estimasi Waktu Trans Gadjah Mada](https://dppa.ugm.ac.id/bus-listrik-trans-gajah-mada-sebagai-alternatif-transportasi-masal-yang-ramah-lingkungan/)

Layanan Sepeda Kampus disediakan bagi mahasiswa, dosen dan tenaga kependidikan serta tamu Universitas Gadjah Mada. Sepeda Kampus beroperasi di dalam area kampus UGM dan melayani pergerakan antar stasiun. Untuk meminjam Sepeda Kampus, silakan datangi stasiun sepeda terdekat, tunjukkan single ID Card anda (KTM bagi Mahasiswa, Kartu Pegawai bagi Dosen dan Tenaga Kependidikan), petugas akan meng-input data peminjam dalam Sistem Informasi Sepeda Kampus setelah itu Sepeda Kampus langsung bisa digunakan.

## Kantong Parkir UGM

Pengelolaan parkir dilingkungan Universitas Gadjah Mada dilakukan dalam upaya mengatur parkir bagi komuter civitas akademika UGM mendukung program **kampus educopolis**

UGM menyediakan kantong parkir kendaraan di setiap fakultas dan unit kerja, serta kantong parkir yang bersifat umum. Guna menjaga keamanan dan ketertiban lingkungan Kampus UGM, Sivitas akademika dilarang untuk meninggalkan kendaraan bermotor secara sengaja di lingkungan kampus.

## Perpustakaan Pusat UGM

Perpustakaan merupakan unit kerja yang membantu pelaksanaan Tri Dharma lembaga induknya melalui penyediaan sumberdaya informasi, fasilitas fisik penunjang kegiatan pendidikan dan pembelajaran, serta lay anan lain yang mendorong peningkatan literasi informasi, softskills, kinerja dan visibilitas sivitas akademika Universitas Gadjah Mada maupun pembelajaran sepanjang hayat.

[Fasilitas Perpustakaan Pusat UGM](https://lib.ugm.ac.id/)',
        'official_campus_source', 'Direktorat Kemahasiswaan UGM (Ditmawa) — Fasilitas Penunjang Mahasiswa UGM: Olahraga, Asrama, Trans Gadjah Mada & Parkir', 'https://ditmawa.ugm.ac.id/fasilitas-kemahasiswaan/',
        true, '2023-01-17T05:23:10Z'::timestamptz
    ),
    (
        '42000000-0000-4000-8000-000000000012',
        NULL, NULL,
        'Direktori Layanan & Pedoman Kemahasiswaan Ditmawa UGM (Pendanaan, PKM, Wirausaha & Difabel)',
        'scholarship_growth', true,
        'UGM melalui Direktorat Kemahasiswaan menyediakan layanan esensial terkait kebutuhan mahasiswa dalam melaksanakan kegiatan belajar mengajar baik intra dan extra-kurikuler. Layanan ini termasuk: bantuan dana untuk kegiatan kemahasiswaan, fasilitas gelanggang mahasiswa, pemilihan mahasiswa berprestasi, beasiswa, wirausaha, serta program kreativitas/pekan ilmiah mahasiswa nasional.

UGM juga memberikan layanan terkait kebutuhan individu/keluarga seperti layanan: Kesehatan jiwa dan mental, advokasi hukum, dan layanan penitipan anak bagi mahasiswa yang berstatus sebagai Ibu.

Untuk membantu memperlancar mahasiswa difable dalam melakukan kegiatan belajar mengajar di lingkungan kampus, dan extra-kurikuler melalui kegiatan UKM, UGM juga menyediakan beberapa layanan terkait. Informasi mengenai layanan tersebut dapat di akses pada berkas Layanan Fasilitas Difabel (no. 10 dan no. 11).
- [PEDOMAN PROGRAM BANTUAN DANA UNTUK KEGIATAN KEMAHASISWAAN](http://ditmawa.ugm.ac.id/prosedur-layanan/pedoman-program-bantuan-dana-untuk-kegiatan-kemahasiswaan/)
- [PEDOMAN PELAYANAN FASILITAS GELANGGANG MAHASISWA](http://ditmawa.ugm.ac.id/prosedur-layanan/pedoman-pelayanan-fasilitas-gelanggang-mahasiswa/)
- [PEDOMAN PEMILIHAN MAHASISWA BERPRESTASI](http://ditmawa.ugm.ac.id/prosedur-layanan/pedoman-pemilihan-mahasiswa-berprestasi/)
- [PEDOMAN PELAYANAN BEASISWA](http://ditmawa.ugm.ac.id/prosedur-layanan/pedoman-pelayanan-beasiswa/)
- [PEDOMAN PROGRAM MAHASISWA WIRAUSAHA](http://ditmawa.ugm.ac.id/prosedur-layanan/pedoman-program-mahasiswa-wirausaha/)
- [PEDOMAN PROGRAM KREATIVITAS MAHASISWA/ PEKAN ILMIAH MAHASISWA NASIONAL](http://ditmawa.ugm.ac.id/prosedur-layanan/pedoman-program-kreativitas-mahasiswa-pekan-ilmiah-mahasiswa-nasional/)
- [LAYANAN KESEHATAN DAN BIMBINGAN KONSELING](http://ditmawa.ugm.ac.id/prosedur-layanan/layanan-kesehatan-dan-bimbingan-konseling-mahasiswa/)
- [LAYANAN ADVOKASI HUKUM KEPADA MAHASISWA](http://ditmawa.ugm.ac.id/prosedur-layanan/layanan-advokasi-hukum-kepada-mahasiswa/)
- [LAYANAN PENITIPAN ANAK BAGI MAHASISWA BERSTATUS IBU](http://ditmawa.ugm.ac.id/prosedur-layanan/layanan-penitipan-anak-bagi-mahasiswa-berstatus-ibu/)
- [LAYANAN FASILITAS DIFABEL](https://ukm.ugm.ac.id/khusus/peduli-difabel/)
- [Buku Saku Lingkungan Sehat & Difabel Friendly Untuk New Normal](https://hpu.ugm.ac.id/2020/12/03/buku-saku-lingkungan-sehat-difabel-friendly-untuk-new-normal/)',
        'official_campus_source', 'Direktorat Kemahasiswaan UGM (Ditmawa) — Direktori Layanan & Pedoman Kemahasiswaan Ditmawa UGM (Pendanaan, PKM, Wirausaha & Difabel)', 'https://ditmawa.ugm.ac.id/prosedur-layanan/',
        true, '2021-11-09T03:45:26Z'::timestamptz
    ),
    (
        '42000000-0000-4000-8000-000000000021',
        NULL, NULL,
        'Aturan Akademik Umum UGM: Registrasi, Herregistrasi, KRS & Cuti Akademik',
        'administrative_guide', true,
        '### Pendaftaran/registrasi mahasiswa

Setiap semester akademik, mahasiswa wajib melaksanakan dua jenis registrasi, yaitu:
  a. **Registrasi administrasi,** yaitu melunasi kewajiban pembayaran biaya pendidikan melalui Bank yang telah ditunjuk oleh UGM. Mahasiswa kemudian memperoleh status terdaftar dengan pengesahan (pemberian tanda terdaftar) pada Kartu Mahasiswa atau Gamacard oleh petugas registrasi.
  b. **Registrasi akademik,** yaitu mencatatkan diri di fakultas masing-masing (dengan menunjukkan bukti pembayaran dari Bank tadi) untuk dapat mengikuti kegiatan akademik semester yang bersangkutan.

Bagi mahasiswa yang tidak melakukan pendaftaran ulang atau cuti akademik, status kemahasiswaannya pada semester yang bersangkutan menjadi batal dan tidak diperkenankan mengikuti kegiatan akademik serta menggunakan fasilitas yang tersedia.

### Cuti akademik dan herregistrasi setelah cuti akademik
  a. **Cuti akademik**
    1. Cuti akademik hanya diperbolehkan apabila mahasiswa sudah memiliki izin tertulis dari dekan atau rektor.
    2. Cuti akademik lebih dari 2 tahun, baik berturut-turut maupun tidak, harus mengajukan surat permohonan cuti akademik kepada rektor dengan tembusan dekan.
    3. Masa cuti akademik tidak diperhitungkan sebagai masa aktif dalam kaitannya dengan batas waktu studi.
    4. Selama masa cuti akademik mahasiswa tidak perlu membayar SPP.
    5. Mahasiswa tidak diperkenankan mengambil cuti akademik sebelum evaluasi empat semester pertama. Apabila ada alasan tertentu (misal: hamil/melahirkan, sakit dan harus dirawat di rumah sakit) dan hal tersebut mendapatkan persetujuan rektor dapat diberi izin cuti akademik, namun masa cutinya tetap akan diperhitungkan sebagai masa studi aktif dan dipakai sebagai dasar perhitungan dalam evaluasi.
  b. **Herregistrasi setelah cuti akademik**
Mahasiswa yang ingin aktif kuliah kembali setelah menjalani cuti akademik harus melaksanakan tahapan-tahapan sbb.:
    1. Mengajukan surat permohon aktif kuliah kepada dekan (bagi yang sebelumnya mendapat izin cuti dari dekan) atau kepada rektor (bagi yang sebelumnya mendapat izin cuti dari rektor). Surat permohonan ini harus sudah diajukan paling lambat 1 bulan sebelum kegiatan semester bersangkutan berjalan.
    2. Melakukan herregistrasi dengan menunjukkan surat izin aktif kuliah dan Kartu Mahasiswa di Kantor Registrasi UGM dan melakukan pembayaran SPP/BOP.

### Kartu Rencana Studi

Pada saat memasuki semester baru, setiap mahasiswa harus menentukan program belajarnya untuk semester yang akan berjalan. Matakuliah yang akan ditempuh harus didaftarkan di Seksi Akademik dan Kemahasiswaan Fakultas dengan cara mengisikan Daftar Rencana Studi ke Sistem Informasi Akademik di masing-masing fakultas/jurusan. Rencana Studi tersebut juga harus mendapat persetujuan dari Dosen Pembimbing Akademik yang telah ditunjuk. Beban SKS yang hendak ditempuh harus berdasarkan perolehan IP pada semester sebelumnya dengan aturan sebagai berikut:

**IP Semester** — ** Beban belajar**

0.00 - 1,49 — 12 sks

1,50 - 1,99 — 15 sks

2,00 - 2,49 — 18 sks

2,50 - 2,99 — 21 sks

3,00 - 4,00 — 24 sks

Apabila pada semester sebelumnya mahasiswa melaksanakan cuti akademik maka besarnya beban sks yang dapat ditempuh adalah beban minimal (12 sks).

Bagi mahasiswa baru, jumlah beban belajar per-semester ditentukan oleh struktur kurikulum dan kebijakan masing-masing fakultas.

### Perkuliahan

Mahasiswa yang kehadirannya di kelas kurang dari 75% dari jadwal yang ditentukan tidak diperkenankan mengikuti ujian matakuliah yang bersangkutan.

### Evaluasi Studi

Evaluasi studi dilakukan dalam 3 tahap, yaitu:
  a. **Evaluasi pertama** yang diterapkan setelah mahasiswa mengikuti pendidikan selama 4 semester pertama berturut-turut sejak diterima sebagai mahasiswa baru. Evaluasi dilakukan pada akhir semester 4. Pada evaluasi ini mahasiswa harus sudah mengumpulkan minimal 30 sks dengan IPK minimal 2,00. Apabila tidak memenuhi syarat tersebut, mahasiswa bersangkutan tidak diperkenankan lagi untuk melanjutkan studinya di UGM atau drop out.
  b. **Evaluasi tahap kedua** yang diterapkan menjelang masa studi kesarjanaan terprogram akan berakhir sesuai dengan jangka waktu yan ditentukan oleh masing-masing program studi. Evaluasi tahap ini diterapkan kepada mahasiswa yang mempunyai masalah dengan pencapaian prestasi akademik yang jauh dari ketentuan yang berlaku.
  c. **Evaluasi akhir** yang diberlakukan pada akhir batas masa studi yaitu pada semester ke-14 atau setelah 7 tahun masa studi.',
        'official_campus_source', 'Direktorat Pendidikan dan Pengajaran UGM — Aturan Akademik Umum UGM: Registrasi, Herregistrasi, KRS & Cuti Akademik', 'https://akademik.ugm.ac.id/aturan-akademik/',
        true, '2016-11-30T04:53:31Z'::timestamptz
    ),
    (
        '41000000-0000-4000-8000-000000000091',
        v_ugm, v_trpl,
        'Standar Version Control Git & CI/CD Praktikum TRPL SV UGM [Sample]',
        'academic_survival', false,
        'Panduan contoh untuk eksplorasi prodi lain: mahasiswa D4 TRPL mengikuti konvensi commit terstruktur dan workflow Git pada mata kuliah proyek perangkat lunak.',
        'curated_guide', 'Sample Program Exploration Entry (TRPL)', NULL,
        true, timezone('utc'::text, now())
    ),
    (
        '41000000-0000-4000-8000-000000000092',
        v_ugm, v_ti,
        'Panduan Jalur Minat Riset AI & Sistem Cerdas FT UGM [Sample]',
        'academic_survival', false,
        'Panduan contoh untuk eksplorasi prodi lain: informasi pemilihan peminatan AI dan Sistem Cerdas dibuka pada pertengahan masa studi sarjana.',
        'curated_guide', 'Sample Program Exploration Entry (TI)', NULL,
        true, timezone('utc'::text, now())
    ),
    (
        '42000000-0000-4000-8000-000000000001',
        NULL, NULL,
        'Panduan Lengkap Simaster, Presensi QR & Aktivasi Email SSO UGM',
        'administrative_guide', true,
        'SIMASTER ([simaster.ugm.ac.id](https://simaster.ugm.ac.id)) adalah platform terintegrasi UGM untuk seluruh layanan akademik, presensi QR, KRS, jadwal ujian, hingga pengecekan status UKT.

## Cara Masuk ke SIMASTER
1. Buka portal [simaster.ugm.ac.id](https://simaster.ugm.ac.id) (tersedia versi **Simaster UGM Student vNEXT** dan **Parent vNEXT**).
2. Login memakai username SSO (bagian depan email UGM sebelum `@mail.ugm.ac.id`) dan kata sandi SSO.
3. Pastikan **Status UKT** lunas atau mengantongi surat dispensasi sebelum masa pengisian KRS, lalu hubungi DPA setelah submit KRS.

## Dokumen Panduan Resmi (PIONIRPEDIA 2026)
- [Panduan Aktivasi Email Universitas Gadjah Mada (PDF)](https://pionir.ugm.ac.id/2026/dokumen/Ketentuan/Panduan%20Aktivasi%20Email%20Universitas%20Gadjah%20Mada.pdf)
- [Panduan Akses Simaster Universitas Gadjah Mada (PDF)](https://pionir.ugm.ac.id/2026/dokumen/Ketentuan/Panduan%20Akses%20Simaster%20Universitas%20Gadjah%20Mada.pdf)',
        'official_campus_source', 'PIONIRPEDIA 2026 & Portal Akademik UGM (Simaster)', 'https://pionir.ugm.ac.id/2026/pionirpedia/',
        true, '2026-07-25T08:00:00Z'::timestamptz
    ),
    (
        '42000000-0000-4000-8000-000000000002',
        NULL, NULL,
        'Layanan Kesehatan Mahasiswa di Gadjah Mada Medical Center (GMC)',
        'campus_essentials', true,
        'Gadjah Mada Medical Center ([gmc.ugm.ac.id](https://gmc.ugm.ac.id)) adalah pusat layanan kesehatan primer resmi di bawah naungan UGM yang berlokasi di **Jalan SEKIP Blok L3, Sendowo, Sinduadi, Sleman**.

## Layanan & Jam Operasional
- **Layanan:** Poli Umum, Poli Gigi, Konseling Psikologi, Fitness Center, serta armada ambulans darurat (dan rujukan ke RSA UGM bila diperlukan).
- **Jam Operasional:** Senin–Jumat 07.30–19.30 WIB, Sabtu 08.00–18.00 WIB.

## Alur Pendaftaran Poli Umum
1. **Pasien Baru:** Datang ke loket pendaftaran, siapkan identitas kepesertaan (KTM / e-KTM Simaster), sampaikan keluhan, dan tunggu nomor antrean.
2. **Pasien Lama:** Gunakan mesin anjungan mandiri, pilih kategori & masukkan identitas, pilih klinik umum, lalu konfirmasi persetujuan umum.

- Info resmi & pembaruan: [Instagram @klinik_gmc](https://www.instagram.com/klinik_gmc/)',
        'official_campus_source', 'PIONIRPEDIA 2026 — Gadjah Mada Medical Center (GMC) UGM', 'https://gmc.ugm.ac.id/',
        true, '2026-07-25T08:00:00Z'::timestamptz
    ),
    (
        '42000000-0000-4000-8000-000000000003',
        NULL, NULL,
        'Portal Beasiswa & Kemahasiswaan UGM (Ditmawa)',
        'scholarship_growth', true,
        'Direktorat Kemahasiswaan (Ditmawa) UGM mengelola pengajuan beasiswa mitra yayasan, korporasi, dan pemerintah melalui portal terpadu.

1. **Portal Resmi:** Cek pengumuman dan syarat berkas di [ditmawa.ugm.ac.id](https://ditmawa.ugm.ac.id) atau [simaster.ugm.ac.id](https://simaster.ugm.ac.id).
2. **Berkas Umum:** Transkrip nilai terbaru, surat keterangan aktif, dan esai kontribusi.',
        'official_campus_source', 'Direktorat Kemahasiswaan (Ditmawa) UGM', 'https://ditmawa.ugm.ac.id',
        true, timezone('utc'::text, now())
    ),
    (
        '42000000-0000-4000-8000-000000000004',
        NULL, NULL,
        'Akses Wi-Fi Kampus (UGM-Hotspot) & Jaringan Eduroam',
        'campus_essentials', true,
        'Akses internet nirkabel tersedia di area gedung kuliah, perpustakaan, dan ruang terbuka kampus UGM ([dssdi.ugm.ac.id](https://dssdi.ugm.ac.id)).

1. **UGM-Hotspot:** Login menggunakan akun SSO (@mail.ugm.ac.id).
2. **Eduroam:** Autentikasi 802.1x EAP menggunakan email UGM lengkap dan kata sandi SSO.',
        'official_campus_source', 'DSSDI Universitas Gadjah Mada', 'https://dssdi.ugm.ac.id',
        true, timezone('utc'::text, now())
    ),
    (
        '42000000-0000-4000-8000-000000000005',
        NULL, NULL,
        'Perpustakaan Pusat UGM: Cara Masuk QR Gate, Ruang Belajar & Jam Buka',
        'campus_essentials', true,
        'Perpustakaan Pusat UGM ([lib.ugm.ac.id](https://lib.ugm.ac.id/)) di kawasan Bulaksumur menyediakan ruang belajar mandiri/diskusi, koleksi cetak & digital, jurnal ilmiah, Wi-Fi, serta lebih dari 100 unit komputer.

## Cara Masuk Menggunakan QR Code Gate
1. Buka fitur **Presensi / Attendance** di Simaster / aplikasi kampus.
2. Pindai QR Code pada **Gate IN** dengan layar HP menyala terang menghadap scanner.
3. Gunakan QR Code yang sama saat keluar melalui **Gate OUT**.

## Jam Operasional Layanan
- **08.00–16.00 WIB:** Ruang Koleksi Langka, Koleksi Ilmu Sosial, dan Terbitan Berkala.
- **08.00–20.00 WIB:** Ruang ETD, Ruang Sirkulasi, dan Ruang Belajar Mandiri Lantai 5.
- **08.00–22.00 WIB:** Ruang WOW, Ruang Belajar Mandiri Lantai 1, Ruang Diskusi, TGCL, dan Information Desk.

- Info layanan perpustakaan: [Instagram @perpustakaan_ugm](https://www.instagram.com/perpustakaan_ugm/)',
        'official_campus_source', 'PIONIRPEDIA 2026 — Perpustakaan Pusat UGM', 'https://lib.ugm.ac.id/',
        true, '2026-07-25T08:00:00Z'::timestamptz
    ),
    (
        '42000000-0000-4000-8000-000000000006',
        NULL, NULL,
        'Organisasi Kemahasiswaan & Unit Kegiatan Mahasiswa (UKM) UGM',
        'social_community', true,
        'Unit Kegiatan Mahasiswa (UKM) di UGM berperan sebagai wadah pengembangan soft skills, minat, dan bakat yang terbagi dalam **4 Sekretariat Bersama (Sekber)**:

- **Sekber Kerohanian:** Jama''ah Salahuddin, Kamadhis, KMHD, dan Unit Kerohanian Kristen (UKK).
- **Sekber Kesenian:** GMCO (orkestra), Teater Gadjah Mada, Unit Seni Rupa (USER), Swagayugama, UKJGS, dan Unit Tari Bali.
- **Sekber Olahraga:** Sepakbola & Futsal, Bulutangkis, Tenis Lapangan, Softball-Baseball, Merpati Putih, PSHT, Perisai Diri, dan Karate Inkai.
- **Sekber Khusus:** MAPAGAMA (pecinta alam), Gama Cendekia (penalaran), UPII, Peduli Difabel, Pers Mahasiswa (Bulaksumur & Balairung), English Debating Society, MENWA, SEMA, dan KOPMA UGM.

- Informasi orientasi & daftar direktori kampus lengkap: [PIONIRPEDIA 2026](https://pionir.ugm.ac.id/2026/pionirpedia/)',
        'official_campus_source', 'PIONIRPEDIA 2026 — Organisasi Kemahasiswaan UGM', 'https://pionir.ugm.ac.id/2026/pionirpedia/',
        true, '2026-07-25T08:00:00Z'::timestamptz
    )
    ON CONFLICT (id) DO UPDATE
    SET campus_id = EXCLUDED.campus_id,
        program_id = EXCLUDED.program_id,
        title = EXCLUDED.title,
        category = EXCLUDED.category,
        is_general = EXCLUDED.is_general,
        content_raw = EXCLUDED.content_raw,
        source_type = EXCLUDED.source_type,
        source_reference = EXCLUDED.source_reference,
        source_url = EXCLUDED.source_url,
        last_verified_at = EXCLUDED.last_verified_at;

    -- 5. Senior Experiences — Labeled Synthetic Entries for Pilot Demo
    INSERT INTO public.experiences (
        id, campus_id, program_id, author_id, title, semester_context,
        situation, challenge, solution, result, advice_for_juniors, tags
    ) VALUES
    (
        '51000000-0000-4000-8000-000000000001',
        v_ugm, v_tri, NULL,
        '[Synthetic Demo] Persiapan Praktikum Jaringan & Pembagian Waktu Semester 3 D4 TRI', 3,
        'Pada semester 3, beban mata kuliah praktikum jaringan meningkat cukup tajam dengan asistensi dan laporan mingguan.',
        'Kesulitan membagi waktu antara konfigurasi lab, laporan praktikum, dan kegiatan organisasi mahasiswa FORKOMTRI.',
        'Menyelesaikan analisis hasil praktikum langsung di hari yang sama sebelum pulang dan membuat kelompok belajar kecil berisi 3-4 orang.',
        'Tugas lab selesai tepat waktu sebelum tenggat asistensi dan aktivitas organisasi tetap berjalan seimbang.',
        'Jangan menumpuk laporan praktikum hingga malam sebelum asistensi. Aktif berdiskusi di kelompok belajar atau forum mahasiswa sangat membantu.',
        ARRAY['synthetic-example', 'praktikum', 'time-management', 'vokasi-tri']
    ),
    (
        '51000000-0000-4000-8000-000000000002',
        v_ugm, v_tri, NULL,
        '[Synthetic Demo] Menyiapkan Portofolio & Pelatihan Kompetensi Sebelum Magang D4 TRI', 6,
        'Menjelang semester akhir D4 TRI, mahasiswa perlu menyiapkan diri untuk praktik industri dan sertifikasi kompetensi jaringan.',
        'Bingung menentukan proyek portofolio dan sertifikasi yang relevan dengan kebutuhan industri jaringan dan cloud.',
        'Mengikuti informasi pelatihan kompetensi dari website resmi prodi (tri.sv.ugm.ac.id), mendokumentasikan topologi lab, serta berlatih melalui kompetisi jaringan seperti NETCOMP.',
        'Lebih siap menghadapi wawancara teknis magang karena sudah memiliki dokumentasi proyek nyata dan pemahaman standar sertifikasi.',
        'Pantau pengumuman pelatihan kompetensi dan kegiatan lomba di situs resmi Prodi TRI sejak semester 4 atau 5.',
        ARRAY['synthetic-example', 'magang', 'sertifikasi', 'vokasi-tri']
    )
    ON CONFLICT (id) DO NOTHING;

    UPDATE public.experiences
    SET is_verified_contributor = true, helpful_count = 14
    WHERE id = '51000000-0000-4000-8000-000000000001' AND helpful_count = 0;

    UPDATE public.experiences
    SET is_verified_contributor = true, helpful_count = 11
    WHERE id = '51000000-0000-4000-8000-000000000002' AND helpful_count = 0;
END $$;
