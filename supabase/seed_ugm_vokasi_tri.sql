-- =============================================================================
-- SEED DATA PILOT UGM & SEKOLAH VOKASI D4 TEKNOLOGI REKAYASA INTERNET (TRI)
-- Generated/augmented from public official pages at https://tri.sv.ugm.ac.id/
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

    -- 4. Guides — Real Public Official Content from https://tri.sv.ugm.ac.id/
    INSERT INTO public.guides (
        id, campus_id, program_id, title, category, is_general, content_raw,
        source_type, source_reference, source_url, is_published, last_verified_at
    ) VALUES
    (
        '41000000-0000-4000-8000-000000000001',
        v_ugm, v_tri,
        'Layanan & Panduan Akademik Prodi D4 TRI SV UGM',
        'academic_survival', false,
        'Silakan pilih layanan sesuai kebutuhan melalui menu di bawah ini.

Kalender Akademik 

Jadwal Kuliah 

Kurikulum 

Mata Kuliah 

Panduan Akademik 

Informasi Akademik

- Panduan Akademik 

- Kalender Akademik 

- Kurikulum 

- Daftar Mata Kuliah 

- Jadwal Kuliah 

Magang

- Panduan Praktik Industri 

- Form Rekomendasi Magang 

- Template Penilaian Magang 

Proyek Akhir

- Alur Proyek Akhir 

- Dosen Pembimbing 

- Pedoman Penulisan 

- Lembar Pengesahan 

- Template Laporan 

- Upload Laporan Proyek Akhir 

- Sidang Proyek Akhir 

Administrasi Akademik

- Surat Keterangan Prodi 

- Panduan KRS 

- Tata Tertib Ujian 

- Praktikum 

- KKN 

- SOP 

Yudisium

- Panduan Yudisium 

- Persyaratan Yudisium 

- Form Permohonan Yudisium 

Laboratorium

- Lab TAJ 

- Lab Layanan Internet 

- Lab Jaringan Komputer 

- Lab Keamanan Siber 

- Lab Komputasi Awan 

- Peminjaman Ruangan & Alat 

- Formulir Peminjaman VPS 

- Formulir Peminjaman VPN 

- Surat Permohonan Bebas Laboratorium 

Riset

- Riset Dosen 

- Riset Mahasiswa 

- Publikasi 

- Daftar Penelitian 

Alumni & Tracer Study

- Daftar Wisudawan 

- Tracer Study',
        'official_campus_source', 'Official Prodi D4 TRI SV UGM — Layanan & Panduan Akademik Prodi D4 TRI SV UGM', 'https://tri.sv.ugm.ac.id/akademik/',
        true, '2026-11-18T05:09:07Z'::timestamptz
    ),
    (
        '41000000-0000-4000-8000-000000000002',
        v_ugm, v_tri,
        'Rekognisi Pembelajaran Lampau (RPL)',
        'academic_survival', false,
        'Pengertian 
Alur Pendaftaran 
Persyaratan 
Kelengkapan Dokumen 
Penilaian Profisiensi 
Jadwal Seleksi 

Penyelenggara RPL Tipe A Sekolah Vokasi adalah seluruh program studi yang telah meluluskan mahasiswa atau telah dinyatakan eligible di laman Sistem E-Rekomendasi Rekognisi Pembelajaran Lampau (SIERRA), memiliki kapasitas SDM yang cukup dan sarana serta prasarana yang memadai untuk menyelenggarakan program RPL.

Dalam menempuh program RPL Sarjana Terapan, di luar mata kuliah yang masih harus ditempuh, seluruh mahasiswa tetap harus menempuh mata kuliah wajib yang terdiri dari:

- Agama kontekstual

- Pancasila

- Kewarganegaraan

- Bahasa Indonesia

- Kuliah Kerja Nyata (KKN)

- Metode Penelitian/Penulisan Ilmiah

- Tugas akhir/proyek akhir

Keterangan: Untuk butir a sampai dengan d, dapat diakui dari Capaian Pembelajaran (CP) yang didapatkan dari perguruan tinggi sebelumnya

Informasi Biaya Kuliah: Uang Kuliah Tunggal (UKT) program RPL Sarjana Terapan Sekolah Vokasi UGM sama dengan UKT Pendidikan Unggul yang ditetapkan oleh Rektor untuk Sekolah Vokasi. Informasi besaran UKT dapat diakses melalui admissions.ugm.ac.id 

Berikut merupakan alur pendaftaran program Rekognisi Pembelajaran Lampau (RPL) di Sekolah Vokasi UGM:

- Calon mahasiswa mengisi formulir pendaftaran secara online melalui laman SIERRA.

- Calon mahasiswa melengkapi dan mengunggah dokumen persyaratan yang ditentukan.

- Panitia melakukan verifikasi kelengkapan dokumen.

- Calon mahasiswa yang lolos seleksi administrasi mengikuti penilaian profisiensi.

- Pengumuman hasil seleksi dan penerimaan mahasiswa RPL.

- Calon mahasiswa yang diterima melakukan daftar ulang dan pembayaran UKT.

Persyaratan umum calon peserta program RPL Sekolah Vokasi UGM:

- Memiliki ijazah paling tidak Diploma III dari program studi yang terakreditasi minimal B atau Baik Sekali.

- Memiliki Indeks Prestasi Kumulatif (IPK) minimal 2,50.

- Dinyatakan lulus seleksi program RPL.

Persyaratan khusus Program Studi Teknologi Rekayasa Internet :

- Memiliki pengalaman kerja di bidang telekomunikasi dan teknologi informasi atau bidang pekerjaan yang relevan minimal 2 tahun dibuktikan dengan surat keterangan bekerja.

- Memiliki ijazah minimal D3 dari bidang ilmu teknologi informasi atau ilmu komputer atau bidang ilmu sejenis, dan minimal terakreditasi B atau Baik Sekali

- IPK minimal 3.00


(Selengkapnya dapat dibaca pada tautan sumber resmi di bawah.)',
        'official_campus_source', 'Official Prodi D4 TRI SV UGM — Rekognisi Pembelajaran Lampau (RPL)', 'https://tri.sv.ugm.ac.id/rekognisi-pembelajaran-lampau-rpl/',
        true, '2026-05-05T05:46:44Z'::timestamptz
    ),
    (
        '41000000-0000-4000-8000-000000000003',
        v_ugm, v_tri,
        'Pengajuan Keringanan & Penyesuaian UKT Sarjana Terapan TRI',
        'administrative_guide', false,
        'Keringanan UKT (Semester 9 dan 10 – Proyek Akhir)

Pengajuan keringanan UKT khusus bagi mahasiswa Sarjana Terapan Semester 9 dan 10 yang hanya mengambil mata kuliah Proyek Akhir.

Batas waktu pengajuan: 23 Januari 2026

Media pengajuan: Melalui simaster.ugm.ac.id

Dokumen pendukung: Mengisi Form Keringanan UKT (untuk yang tinggal TA semester 9-10 DIV) 

Keringanan UKT (Persentase Tertentu)

Pengajuan keringanan UKT berdasarkan persentase tertentu bagi mahasiswa Sarjana Terapan.

Mahasiswa WAJIB mengunggah Surat Rekomendasi dari Dosen Pembimbing Akademik

Surat rekomendasi menggunakan format form resmi yang telah disediakan

Batas waktu pengajuan: 23 Januari 2026

Media pengajuan: Melalui simaster.ugm.ac.id

Dokumen Wajib:

Form Surat Rekomendasi Dosen Pembimbing Akademik (terlampir)',
        'official_campus_source', 'Official Prodi D4 TRI SV UGM — Pengajuan Keringanan & Penyesuaian UKT Sarjana Terapan TRI', 'https://tri.sv.ugm.ac.id/penyesuaian-ukt/',
        true, '2026-01-22T12:19:30Z'::timestamptz
    ),
    (
        '41000000-0000-4000-8000-000000000004',
        v_ugm, v_tri,
        'Portal Layanan Administrasi Akademik Mahasiswa D4 TRI',
        'administrative_guide', false,
        'Halaman ini menyediakan berbagai layanan akademik yang dapat diakses oleh mahasiswa, dosen, dan staf. Silakan pilih layanan yang sesuai kebutuhan melalui pilihan di bawah ini.

Surat & Permohonan Resmi

Permohonan Yudisium

Template Surat Peminjaman Alat/Ruangan LAB

Template Surat Bebas LAB

Pengumpulan Laporan & Proyek

Pengumpulan Laporan Akhir Praktik Industri

Template Laporan Praktik Industri

Upload Laporan Proyek Akhir

Formulir Permohonan & Peminjaman

Peminjaman VPS

Permintaan Akses VPN

Pengajuan Peminjaman Ruangan/Alat Lab

Dokumen Panduan & Template

Buku Panduan Akademik

Kelengkapan Dokumen Praktik Industri

Form Rekomendasi Magang TRI

Daftar Mata Kuliah & Tracer Alumni

Daftar Mata Kuliah

Tracer Alumni',
        'official_campus_source', 'Official Prodi D4 TRI SV UGM — Portal Layanan Administrasi Akademik Mahasiswa D4 TRI', 'https://tri.sv.ugm.ac.id/layanan-akademik/',
        true, '2026-09-17T02:41:32Z'::timestamptz
    ),
    (
        '41000000-0000-4000-8000-000000000005',
        v_ugm, v_tri,
        'Ketentuan Wisuda Program Sarjana dan Sarjana Terapan',
        'administrative_guide', false,
        '- Pendaftaran Wisuda Periode I Tahun Akademik 2026/2027 dilakukan melalui laman https://simaster.ugm.ac.id dengan menggunakan akun Single Sign On (SSO) masing-masing. Apabila belum memiliki akun SSO UGM, dapat menghubungi Direktorat Teknologi Informasi (DTI).

- Tahapan pendaftaran wisuda:

- Calon wisudawan/wati melakukan pemutakhiran nomor telepon (HP) dan email non UGM pada menu pengaturan, sub menu data akun;

- Calon wisudawan/wati memeriksa data pokok pada SIMASTER dan menyetujui apabila data sudah sesuai, melalui menu: Akademik Kemahasiswaan- Akademik-Data Mahasiswa-Data PDDikti;

- Calon wisudawan/wati melihat dan membandingkan data transaksi akademik antara SIMASTER dengan PDDikti melalui menu: Akademik Kemahasiswaan- AkademikData Mahasiswa-KHS Simaster-KHS PDDikti. Silakan hubungi Operator SIA Akademik Program Studi apabila terdapat perbedaan data Kode dan Nama Matakuliah, Jumlah SKS, dan Nilai ;

- Memilih menu akademik, sub menu yudisium dan melengkapi biodata untuk keperluan penulisan ijazah, mengunggah scan dokumen ijazah terakhir, scan KTP atau paspor (bagi WNA), foto berwarna, dan dokumen pendukung perubahan data diri (jika ada), unggah SK Yudisium/SKL yang ditandatangan oleh Dekan/Wakil Dekan (sesuai Peraturan Rektor No 23 Tahun 2024 Pasal 48);

- Melengkapi persyaratan antara lain:

- Mengisi data untuk keperluan Kartu Alumni GAMA Co-Brand dan Exit Survey, dapat dilakukan secara on-line melalui laman https://simaster.ugm.ac.id pada menu alumni, sub menu kartu GAMA Co-Brand.

- Mengisi data Exit Survey, dapat dilakukan secara on-line melalui laman https://simaster.ugm.ac.id menu survei.

- Mengunggah file VERSI FINAL karya tulis akhir (Tesis/Disertasi/Tugas Akhir) melalui laman https://simaster.ugm.ac.id dengan menggunakan akun email UGM/SSO UGM sesuai format pada list lampiran edaran ini.

- Memilih periode yudisium yang sudah ditawarkan oleh Fakultas/Sekolah Sarjana dan Sarjana Terapan/Program Studi;

- Melakukan pengecekan dan persetujuan isian data ijazah dengan klik preview ijazah;

- Mendaftar Wisuda Periode I Tahun Akademik 2026/2027 paling lambat tanggal 30 Oktober 2026 pukul 12:00 WIB dengan klik Daftar Wisuda (bagi peserta yang terlambat mendaftar dari tanggal penutupan, peserta dapat mendaftar pada periode berikutnya, yaitu Periode Februari 2027);

- Ketentuan unggah foto untuk proses Ijazah :

Ukuran Foto 

- Foto berwarna background putih


(Selengkapnya dapat dibaca pada tautan sumber resmi di bawah.)',
        'official_campus_source', 'Official Prodi D4 TRI SV UGM — Ketentuan Wisuda Program Sarjana dan Sarjana Terapan', 'https://tri.sv.ugm.ac.id/ketentuan-wisuda/',
        true, '2026-10-01T03:24:41Z'::timestamptz
    ),
    (
        '41000000-0000-4000-8000-000000000006',
        v_ugm, v_tri,
        'Persyaratan & Kelengkapan Dokumen Yudisium D4 TRI SV UGM',
        'administrative_guide', false,
        'Persyaratan Yudisium Prodi TRI

1. Proses Pengajuan Yudisium 
Mahasiswa yang ingin mengajukan permohonan Yudisium harus mengisi formulir berikut: 

- Mengisi formulir permohonan Yudisium melalui tautan: ugm.id/YudisiumDTEDI 

2. Dokumen Persyaratan Yudisium 
Mahasiswa diwajibkan mengunggah dan mengumpulkan dokumen berikut: 

- Formulir Permohonan Yudisium 

- Formulir Pembatalan Mata Kuliah Pilihan 

- Formulir Ceklist Judul Proyek Akhir 

- Pas Foto Format .JPG (Rasio 4:6) dengan ketentuan: 
- Kemeja putih, blazer/jas hitam (bukan jas almamater) 

- Latar belakang biru tua, tidak memakai kacamata hitam 

- Foto jelas/tajam, bukan hasil scan/repro 

- Transkrip Nilai Sementara dari Simaster 
- Pastikan tidak ada nilai kosong atau "T" 

- Jika ada nilai kosong, segera lengkapi dan laporkan ke bagian akademik 

- Scan Surat Tanda Terima Menyerahkan Skripsi & Bebas Perpustakaan UGM 
- Unggah Proyek Akhir secara mandiri melalui: simaster.ugm.ac.id 

- Scan Ijazah Terakhir (Bukan sertifikat hasil ujian) 

- Scan Transkrip Nilai D3 (Untuk mahasiswa Alih Jenjang) 

- Scan Sertifikat PPSMB 

- Persentase Hasil Cek Plagiasi 
- Similarity Index maksimal 25% (ditandatangani oleh DPPA) 

- Scan Sertifikat Kemampuan Bahasa Inggris 
- 1. TEVocS dengan nilai minimal 60;
2. AcEPT dengan nilai minimal 209;
3. IELTS dengan nilai minimal 4.5;
4. TOEFL IBT dengan nilai minimal 52; atau
5. TOEIC dengan nilai minimal 495.

- Ketentuan selengkapnya: https://tri.sv.ugm.ac.id/syarat-inggris/ 

- Surat Sertifikat Kompetensi (Wajib untuk mahasiswa reguler mulai angkatan 2019) 
- Sertifikat internasional minimal level associate expert: CCNA, MTCNA, HCIA, atau ACA 

- Sertifikat nasional yang diterbitkan oleh Badan Nasional Sertifikasi Profesi (BNSP) 

- Sertifikat kompetensi dari departemen 

- Sertifikat yang terdaftar dan dapat pengesahan dari ketua program studi 

- Dicantumkan dalam Berita Acara Yudisium 

- Screenshot bukti Unggah Laporan Proyek Akhir dan Scan Lembar Pengesahan 
- Unggah melalui tautan: ugm.id/ProyekAkhirDTEDI 

- Bukti Pengajuan Publikasi/Makalah 
- Berupa prosiding konferensi, HAKI, atau jurnal (berlaku untuk mahasiswa mulai angkatan 2019) 

- Surat Keterangan Bebas Lab 
- Pemohon melapor ke laboran untuk mengajukan bebas lab dengan melampirkan surat permohonan bebas lab 

- Unduh form template surat permohonan bebas lab: ugm.id/TemplateSuratBebasLabTAJ 

3. Proses Sidang Yudisium 

- Sidang Yudisium dilaksanakan melalui Rapat Pengurus Departemen . 


(Selengkapnya dapat dibaca pada tautan sumber resmi di bawah.)',
        'official_campus_source', 'Official Prodi D4 TRI SV UGM — Persyaratan & Kelengkapan Dokumen Yudisium D4 TRI SV UGM', 'https://tri.sv.ugm.ac.id/dokumen-yudisium/',
        true, '2026-10-13T05:08:45Z'::timestamptz
    ),
    (
        '41000000-0000-4000-8000-000000000007',
        v_ugm, v_tri,
        'FORKOMTRI — Forum Komunikasi Mahasiswa Teknologi Rekayasa Internet',
        'social_community', false,
        'Donor Darah 2025 

Yogyakarta, 22 November 2025 - Aksi kemanusiaan hasil kerja sama dengan PMI yang terbuka bagi mahasiswa dan masyarakat umum. Bertujuan untuk membantu pemenuhan stok darah medis sekaligus mengedukasi pentingnya pola ... 

Berbagi dan Beraksi 2025 

Yogyakarta, 20 September 2025  - Program pengabdian dan kepedulian sosial berupa aksi nyata penyaluran bantuan/kegiatan bakti sosial yang dilaksanakan di Panti Jompo. Kegiatan ini bertujuan menumbuhkan rasa empati sosial dan ... 

Open House ForkomTRI 

Yogyakarta, 13 September 2025 - Agenda sosialisasi dan pengenalan organisasi HIMA Forkomtri kepada mahasiswa baru. Berisi pemaparan peran tiap divisi, program kerja unggulan, serta ajakan untuk berpartisipasi aktif dalam dinamika ... 

Cyber League 2025 

Yogyakarta, 29 Agustus 2025 - Wadah penyaluran bakat olahraga dan ajang keakraban antar angkatan melalui pertandingan olahraga (Mini Soccer). Kegiatan ini dirancang untuk menjaga kebugaran fisik, sarana refreshing, serta memupuk ... 

Wisudaan TRI Agustus 2025 

Yogyakarta, 28 Agustus 2025 - Agenda apresiasi dan selebrasi pelepasan bagi para wisudawan/wisudawati Teknologi Rekayasa Internet SV UGM. Meliputi acara penyambutan khusus, penyerahan kenang-kenangan dari himpunan, serta sesi foto bersama ... 

Rilis Berita

Donor Darah 2025 

08 October 2026 

Yogyakarta, 22 November 2025 - Aksi kemanusiaan hasil kerja sama dengan PMI yang terbuka bagi mahasiswa dan masyarakat umum. Bertujuan untuk membantu pemenuhan stok darah medis sekaligus mengedukasi pentingnya pola ... 

View All 

Agenda dan Galeri

Donor Darah 2025 

08 October 2026 

Yogyakarta, 22 November 2025 - Aksi kemanusiaan hasil kerja sama dengan PMI yang terbuka bagi mahasiswa dan masyarakat umum. Bertujuan untuk membantu pemenuhan stok darah medis sekaligus mengedukasi pentingnya pola ... 

Berbagi dan Beraksi 2025 

08 October 2026 

Yogyakarta, 20 September 2025  - Program pengabdian dan kepedulian sosial berupa aksi nyata penyaluran bantuan/kegiatan bakti sosial yang dilaksanakan di Panti Jompo. Kegiatan ini bertujuan menumbuhkan rasa empati sosial dan ... 

Open House ForkomTRI 

08 October 2026 

Yogyakarta, 13 September 2025 - Agenda sosialisasi dan pengenalan organisasi HIMA Forkomtri kepada mahasiswa baru. Berisi pemaparan peran tiap divisi, program kerja unggulan, serta ajakan untuk berpartisipasi aktif dalam dinamika ... 

Cyber League 2025 

08 October 2026 


(Selengkapnya dapat dibaca pada tautan sumber resmi di bawah.)',
        'official_campus_source', 'Official Prodi D4 TRI SV UGM — FORKOMTRI — Forum Komunikasi Mahasiswa Teknologi Rekayasa Internet', 'https://tri.sv.ugm.ac.id/forkomtri/',
        true, '2026-10-07T17:28:16Z'::timestamptz
    ),
    (
        '41000000-0000-4000-8000-000000000008',
        v_ugm, v_tri,
        'Hasil Hearing Program Studi Semester Ganjil 2025/2026',
        'social_community', false,
        'Pada semester ganjil 2025/2026, Program Studi Teknologi Rekayasa Internet (TRI) Sekolah Vokasi UGM telah mengadakan hearing dengan mahasiswa untuk membahas berbagai kebijakan akademik dan program ke depannya. Berikut adalah rangkuman Hearing Prodi yang telah dilaksanakan:

Program Magang dan Praktik Industri (PI)

Program magang tetap akan dilaksanakan mulai semester depan dengan beberapa perubahan signifikan:

Kurikulum 2026: 

- Magang akan diintegrasikan dengan Proyek Integrasi (PI)

- Waktu pelaksanaan PI tidak lagi dilaksanakan pada semester 4, melainkan digabung dengan magang pada semester 6 atau 7

- Mahasiswa harus telah menyelesaikan minimal 20 SKS sebagai syarat mengikuti program

Durasi Magang: 

- Minimal 4 bulan untuk perusahaan pada umumnya

- Minimal 3 bulan untuk perusahaan besar (masih diperbolehkan)

- Sistem penilaian akan berbeda antara perusahaan besar dan perusahaan kecil

Status Angkatan 2024

Pelaksanaan PI untuk angkatan 2024 masih dipending dan akan dilaksanakan sekaligus dengan magang pada semester 6 atau 7.

Magang dengan Mitra

Untuk program magang dengan mitra seperti HINO, ketersediaannya bergantung pada kebijakan perusahaan mitra. Informasi lebih lanjut akan dibagikan melalui grup WhatsApp prodi.

Proyek Magang sebagai Tugas Akhir

Proyek magang dapat dijadikan tugas akhir dengan ketentuan:

- Memenuhi 5 Profil Lulusan TRI

- Perlu didiskusikan dengan dosen pembimbing terkait pengembangan proyek

Sertifikasi

Sertifikasi yang Tersedia

Program studi akan menyediakan berbagai sertifikasi tambahan, antara lain:

- Oracle (banyak pilihan gratis)

- Sertifikasi BNSP

- Sertifikasi pihak ketiga: DTS Kominfo dan beberapa kementerian

Catatan: Rekognisi akademik hanya diberikan untuk kegiatan magang.

Sertifikasi Oracle untuk Yudisium

Sertifikasi Oracle dapat digunakan sebagai syarat yudisium dengan ketentuan:

- Berada pada level Associate

- Tidak dikenakan biaya

Sertifikasi MTCNA dan Bahasa Inggris

- Informasi teknis dapat ditanyakan kepada Pak Alif

- Angkatan 2022 (IDP): Masih diperbolehkan menggunakan sertifikat bahasa Inggris

- Angkatan 2023 ke bawah: Dapat menggunakan sertifikat lomba nasional juara 1-3 sebagai pengganti sertifikat bahasa Inggris

Sertifikat untuk asisten dosen tidak diberikan secara otomatis. Mahasiswa harus mengajukan permohonan ke bagian akademik.

Kurikulum dan Pembelajaran

Pembaruan Kurikulum

- Mahasiswa semester 4 saat ini masih menggunakan kurikulum lama


(Selengkapnya dapat dibaca pada tautan sumber resmi di bawah.)',
        'official_campus_source', 'Official Prodi D4 TRI SV UGM — Hasil Hearing Program Studi Semester Ganjil 2025/2026', 'https://tri.sv.ugm.ac.id/hearing/',
        true, '2026-01-04T07:36:20Z'::timestamptz
    ),
    (
        '41000000-0000-4000-8000-000000000009',
        v_ugm, v_tri,
        'National Networking Competition (NETCOMP) — Ajang Kompetisi D4 TRI',
        'scholarship_growth', false,
        'TechNetworkers Unite : Empowering Networks, Safeguarding Integrity

National Networking Competition (NETCOMP) 4.0 is a premier national event that empowers the next generation of tech enthusiasts in networking and cybersecurity . This year, NETCOMP introduces a Special Edition Workshop featuring the latest innovations in DevOps and Cloud Computing, offering participants hands-on experience with modern digital infrastructure and automation. Through competitions, workshops, national seminar, and industry expo NETCOMP 4.0 aims to inspire collaboration, innovation, and excellence in shaping Indonesia’s secure and connected digital future.

Poster

More Information

Our Sponsors

Our Media Partners

Presented By',
        'official_campus_source', 'Official Prodi D4 TRI SV UGM — National Networking Competition (NETCOMP) — Ajang Kompetisi D4 TRI', 'https://tri.sv.ugm.ac.id/netcompugm/',
        true, '2026-01-19T08:00:44Z'::timestamptz
    ),
    (
        '41000000-0000-4000-8000-000000000010',
        v_ugm, v_tri,
        'Mahasiswa TRI SV UGM Raih Juara 1 PKM-KC PIMNAS 2026',
        'scholarship_growth', false,
        'Prestasi membanggakan kembali ditorehkan oleh mahasiswa Program Studi Teknologi Rekayasa Internet (TRI), Sekolah Vokasi, Universitas Gadjah Mada. Attahya Dzikra Hidayat berhasil meraih Juara 1 Presentasi dan Juara 2 Poster pada Pekan Ilmiah Mahasiswa Nasional (PIMNAS) 2026 melalui skema Program Kreativitas Mahasiswa Karsa Cipta (PKM-KC).

Dalam ajang tersebut, Attahya mengembangkan inovasi bertajuk “ PERIOTECT: Inovasi Perangkat Mulut Pemindai Periodontal Berbasis Near-Infrared (NIR) Terintegrasi IoT Berbasis Deep Learning sebagai Upaya Deteksi Dini Penyakit Gusi.” Inovasi ini berfokus pada pengembangan perangkat pemindai periodontal portabel yang memanfaatkan teknologi Near-Infrared (NIR), Internet of Things (IoT), dan Deep Learning untuk mendukung deteksi dini penyakit gusi.

PERIOTECT dirancang sebagai perangkat pemeriksaan yang dapat membantu mengidentifikasi kondisi periodontal melalui pemindaian menggunakan sensor optik. Perangkat ini mengintegrasikan beberapa komponen, antara lain sensor Near-Infrared 940 nm, LED merah 660 nm, mikrokamera, fotodioda, dan mikrokontroler ESP32-C6 Supermini. Data hasil pemeriksaan kemudian diproses menggunakan model Deep Learning dan ditampilkan melalui antarmuka berbasis web secara real-time .

Berdasarkan hasil pengujian yang ditampilkan dalam poster, sistem PERIOTECT berhasil mencapai akurasi model kecerdasan buatan sebesar 97,71%. Selain itu, perangkat ini juga dilengkapi dengan integrasi IoT yang memungkinkan hasil pemeriksaan tersimpan secara otomatis dan dapat digunakan sebagai riwayat rekam medis digital pasien.

Keberhasilan meraih Juara 1 Presentasi dan Juara 2 Poster pada kategori PKM-KC menjadi bukti kontribusi mahasiswa dalam mengembangkan inovasi teknologi yang dapat diterapkan untuk menjawab permasalahan di bidang kesehatan.',
        'official_campus_source', 'Official Prodi D4 TRI SV UGM — Mahasiswa TRI SV UGM Raih Juara 1 PKM-KC PIMNAS 2026', 'https://tri.sv.ugm.ac.id/periotect-pimnas/',
        true, '2026-11-18T12:58:09Z'::timestamptz
    ),
    (
        '41000000-0000-4000-8000-000000000011',
        v_ugm, v_tri,
        'Tim El Wiwok Dtok ft Sorry Yee Raih Juara 1 Innovation Competition pada Indonesia Security Summit 2026',
        'career_preparation', false,
        'Prestasi membanggakan kembali diraih oleh mahasiswa Program Studi Teknologi Rekayasa Internet (TRI), Sekolah Vokasi, Universitas Gadjah Mada. Tim El Wiwok Dtok ft Sorry Yee berhasil meraih Juara 1 kategori Innovation Competition dalam ajang Indonesia Security Summit (ISS) 2026 yang diselenggarakan oleh Asosiasi Pengguna Jasa Sekuriti Indonesia (APJASI).

Tim tersebut beranggotakan Arkha Rama Harisha (TRI 24), Fauzan Putra Ramadhan (TRI 24), dan Muhammad Luqman Hakim (TRI 24)  . Penghargaan ini diraih melalui rangkaian kegiatan final presentation yang berlangsung pada Senin–Selasa, 16–17 November 2026, bertempat di Catur Dharma Hall, Menara Astra Lantai 5, Jakarta.

Dalam kompetisi tersebut, tim mengembangkan sebuah platform middleware berbasis kecerdasan buatan ( Artificial Intelligence /AI) untuk membantu proses analisis rekaman kamera pengawas atau CCTV. Platform ini dirancang untuk meningkatkan efisiensi pengelolaan rekaman CCTV sekaligus mendukung kebutuhan keamanan dan investigasi melalui empat fitur utama.

Fitur pertama memungkinkan petugas melakukan analisis rekaman CCTV menggunakan AI. Petugas dapat mencari dan mengidentifikasi kejadian tertentu ] dalam rekaman secara lebih cepat dengan fitur chatbot tanpa harus menelusuri seluruh rekaman secara manual. Fitur kedua berfokus pada optimalisasi penyimpanan rekaman CCTV menggunakan teknologi SVT-AV1 sehingga penggunaan kapasitas penyimpanan dapat lebih efisien.

Selanjutnya, platform ini dilengkapi fitur integrasi antara data hasil analisis rekaman CCTV dengan sistem akses kontrol, khususnya data biometrik yang digunakan untuk mengakses ruangan. Integrasi tersebut diharapkan dapat membantu proses penelusuran dan investigasi apabila terjadi insiden keamanan. Fitur keempat berfungsi untuk membantu pengelolaan masa berlaku kredensial biometrik pengunjung agar penggunaannya tetap sesuai dengan ketentuan perlindungan data pribadi berdasarkan Undang-Undang Pelindungan Data Pribadi (UU PDP).

Pencapaian ini menjadi salah satu bentuk kontribusi mahasiswa TRI SV UGM dalam menghadirkan inovasi teknologi yang dapat diterapkan untuk menjawab kebutuhan di bidang keamanan. Keberhasilan tersebut juga menunjukkan kemampuan mahasiswa dalam mengintegrasikan kecerdasan buatan, pengolahan video, sistem akses kontrol, dan pengelolaan data pribadi ke dalam sebuah solusi teknologi yang terintegrasi.',
        'official_campus_source', 'Official Prodi D4 TRI SV UGM — Tim El Wiwok Dtok ft Sorry Yee Raih Juara 1 Innovation Competition pada Indonesia Security Summit 2026', 'https://tri.sv.ugm.ac.id/isc-2026/',
        true, '2026-11-18T12:57:51Z'::timestamptz
    ),
    -- Mockup guides untuk perbandingan program lain (TRPL & TI)
    (
        '41000000-0000-4000-8000-000000000091',
        v_ugm, v_trpl,
        'Standar Version Control Git & CI/CD Praktikum TRPL SV UGM [Sample]',
        'academic_survival', false,
        'Panduan contoh untuk eksplorasi prodi lain: mahasiswa D4 TRPL mengikuti konvensi commit terstruktur dan workflow Git pada mata kuliah proyek perangkat lunak.',
        'curated_guide', 'Sample Program Exploration Entry (TRPL)', NULL,
        true, timezone('utc'::text, now()) - interval '30 days'
    ),
    (
        '41000000-0000-4000-8000-000000000092',
        v_ugm, v_ti,
        'Panduan Jalur Minat Riset AI & Sistem Cerdas FT UGM [Sample]',
        'academic_survival', false,
        'Panduan contoh untuk eksplorasi prodi lain: informasi pemilihan peminatan AI dan Sistem Cerdas dibuka pada pertengahan masa studi sarjana.',
        'curated_guide', 'Sample Program Exploration Entry (TI)', NULL,
        true, timezone('utc'::text, now()) - interval '30 days'
    )
    ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        category = EXCLUDED.category,
        content_raw = EXCLUDED.content_raw,
        source_reference = EXCLUDED.source_reference,
        source_url = EXCLUDED.source_url,
        last_verified_at = EXCLUDED.last_verified_at;

    -- 5. Guides — General UGM (is_general = true requires campus_id IS NULL per chk_guide_scope)
    INSERT INTO public.guides (
        id, campus_id, program_id, title, category, is_general, content_raw,
        source_type, source_reference, source_url, is_published, last_verified_at
    ) VALUES
    (
        '42000000-0000-4000-8000-000000000001',
        NULL, NULL,
        'Panduan Lengkap Simaster & Pengisian KRS Tiap Semester',
        'administrative_guide', true,
        E'KRS (Kartu Rencana Studi) wajib diisi seluruh mahasiswa UGM melalui portal Simaster.

1. Cek Status UKT: Pastikan tagihan lunas atau mengantongi surat dispensasi.

2. Batas SKS: Sesuaikan dengan IPK semester sebelumnya.

3. Persetujuan DPA: Hubungi Dosen Pembimbing Akademik setelah submit KRS.',
        'official_campus_source', 'Portal Akademik UGM (Simaster)', 'https://simaster.ugm.ac.id',
        true, timezone('utc'::text, now()) - interval '8 days'
    ),
    (
        '42000000-0000-4000-8000-000000000002',
        NULL, NULL,
        'Layanan Kesehatan Mahasiswa di Gadjah Mada Medical Center (GMC)',
        'campus_essentials', true,
        E'Mahasiswa aktif UGM berhak mengakses layanan kesehatan primer di Gadjah Mada Medical Center (GMC), Jl. Colombo.

1. Layanan: Dokter umum, gigi, konseling psikologi, dan farmasi.

2. Syarat: Tunjukkan KTM fisik atau e-KTM Simaster aktif.

3. Rujukan: Dokter GMC menerbitkan rujukan ke RSA UGM bila diperlukan.',
        'official_campus_source', 'Gadjah Mada Medical Center (GMC) UGM', 'https://gmc.ugm.ac.id',
        true, timezone('utc'::text, now()) - interval '14 days'
    ),
    (
        '42000000-0000-4000-8000-000000000003',
        NULL, NULL,
        'Portal Beasiswa & Kemahasiswaan UGM (Ditmawa)',
        'scholarship_growth', true,
        E'Direktorat Kemahasiswaan (Ditmawa) UGM mengelola pengajuan beasiswa mitra yayasan, korporasi, dan pemerintah melalui portal terpadu.

1. Portal Resmi: Cek pengumuman dan syarat berkas di ditmawa.ugm.ac.id / simaster.

2. Berkas Umum: Transkrip nilai terbaru, surat keterangan aktif, dan esai kontribusi.',
        'official_campus_source', 'Direktorat Kemahasiswaan (Ditmawa) UGM', 'https://ditmawa.ugm.ac.id',
        true, timezone('utc'::text, now()) - interval '18 days'
    ),
    (
        '42000000-0000-4000-8000-000000000004',
        NULL, NULL,
        'Akses Wi-Fi Kampus (UGM-Hotspot) & Jaringan Eduroam',
        'campus_essentials', true,
        E'Akses internet nirkabel tersedia di area gedung kuliah, perpustakaan, dan ruang terbuka kampus UGM.

1. UGM-Hotspot: Login menggunakan akun SSO (@mail.ugm.ac.id).

2. Eduroam: Autentikasi 802.1x EAP menggunakan email UGM lengkap dan kata sandi SSO.',
        'official_campus_source', 'DSSDI Universitas Gadjah Mada', 'https://dssdi.ugm.ac.id',
        true, timezone('utc'::text, now()) - interval '14 days'
    )
    ON CONFLICT (id) DO UPDATE
    SET title = EXCLUDED.title,
        category = EXCLUDED.category,
        content_raw = EXCLUDED.content_raw,
        source_reference = EXCLUDED.source_reference,
        source_url = EXCLUDED.source_url;

    -- 6. Senior Experiences — Labeled Synthetic Entries for Pilot Demo
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
