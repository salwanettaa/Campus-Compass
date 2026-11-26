-- =============================================================================
-- SEED DATA PILOT UGM & SEKOLAH VOKASI D4 TEKNOLOGI REKAYASA INTERNET (TRI)
-- Jalankan di Supabase SQL Editor SETELAH schema v2 di docs/TECH_AND_DATABASE.md.
-- Aman dijalankan berulang kali (idempotent).
-- =============================================================================
DO $$
DECLARE
    v_ugm     UUID;
    v_sv      UUID;
    v_ft      UUID;
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
    SELECT v_ugm, 'Fakultas Ekonomika dan Bisnis', 'FEB'
    WHERE NOT EXISTS (SELECT 1 FROM public.faculties WHERE campus_id = v_ugm AND code = 'FEB');

    SELECT id INTO v_sv  FROM public.faculties WHERE campus_id = v_ugm AND code = 'SV';
    SELECT id INTO v_ft  FROM public.faculties WHERE campus_id = v_ugm AND code = 'FT';
    SELECT id INTO v_feb FROM public.faculties WHERE campus_id = v_ugm AND code = 'FEB';

    -- 3. Programs
    INSERT INTO public.programs (campus_id, faculty_id, name, code, degree_level, is_pilot)
    VALUES
        (v_ugm, v_sv,  'D4 Teknologi Rekayasa Internet',         'TRI',  'D4',            true),
        (v_ugm, v_sv,  'D4 Teknologi Rekayasa Perangkat Lunak',  'TRPL', 'D4',            false),
        (v_ugm, v_ft,  'S1 Teknologi Informasi',                 'TI',   'Undergraduate', false),
        (v_ugm, v_feb, 'S1 Manajemen',                           'MN',   'Undergraduate', false)
    ON CONFLICT (campus_id, code) DO UPDATE
    SET name = EXCLUDED.name, faculty_id = EXCLUDED.faculty_id, is_pilot = EXCLUDED.is_pilot;

    SELECT id INTO v_tri  FROM public.programs WHERE campus_id = v_ugm AND code = 'TRI';
    SELECT id INTO v_trpl FROM public.programs WHERE campus_id = v_ugm AND code = 'TRPL';
    SELECT id INTO v_ti   FROM public.programs WHERE campus_id = v_ugm AND code = 'TI';

    -- 4. Guides — D4 TRI Sekolah Vokasi (Program-specific)
    INSERT INTO public.guides (
        id, campus_id, program_id, title, category, is_general, content_raw,
        source_type, source_reference, is_published, last_verified_at
    ) VALUES
    (
        '41000000-0000-4000-8000-000000000001',
        v_ugm, v_tri,
        'SOP Laboratorium Jaringan & Praktikum TEDI SV UGM',
        'academic_survival', false,
        E'Praktikum D4 TRI berpusat di Laboratorium Jaringan Gedung TILC dan Lab TEDI Sekip SV UGM.\n\n1. Presensi & Akses Lab: Wajib hadir 10 menit sebelum praktikum dengan pakaian berkerah, jas lab, dan modul praktikum.\n\n2. Rak Server & Router Cisco: Konfigurasi switch dan router wajib melalui kabel console sebelum disambungkan ke topologi live.\n\n3. Akun NetAcad & LMS: Pastikan akun Cisco Networking Academy dan elok.ugm.ac.id aktif sebelum modul dimulai.',
        'official_campus_source', 'Buku Pedoman Praktikum Lab Jaringan SV UGM',
        true, timezone('utc'::text, now()) - interval '12 days'
    ),
    (
        '41000000-0000-4000-8000-000000000002',
        v_ugm, v_tri,
        'Alur Magang Industri 6 Bulan Kurikulum Vokasi D4 TRI',
        'career_preparation', false,
        E'Kurikulum Sarjana Terapan (D4) TRI mewajibkan magang industri minimal 6 bulan penuh pada Semester 7.\n\n1. Kriteria Perusahaan Mitra: Perusahaan ISP, Data Center, Cloud Infrastructure, Cyber Security, atau Telekomunikasi.\n\n2. Pengajuan Berkas: Proposal diserahkan ke Koordinator Magang Prodi TRI paling lambat 2 bulan sebelum semester dimulai.\n\n3. Konversi 20 SKS: Penilaian mencakup laporan teknis, logbook mingguan, dan evaluasi mentor industri.',
        'official_campus_source', 'Buku Panduan Magang Industri MBKM SV UGM',
        true, timezone('utc'::text, now()) - interval '15 days'
    ),
    (
        '41000000-0000-4000-8000-000000000003',
        v_ugm, v_tri,
        'Panduan Proyek Akhir Terapan (Capstone Project) D4 TRI',
        'academic_survival', false,
        E'Proyek Akhir D4 TRI berfokus pada rancang bangun solusi jaringan terapan (hardware/software/networking prototype).\n\n1. Syarat Judul: Lulus minimal 120 SKS dengan IPK >= 2.50 dan lulus Metodologi Riset Terapan.\n\n2. Produk Akhir: Prototipe fungsional atau deployment cloud beserta dokumentasi teknis.\n\n3. Sidang Terbuka: Presentasi dan demo live sistem di hadapan 3 dosen penguji.',
        'official_campus_source', 'Panduan Skripsi Terapan Departemen TEDI SV UGM',
        true, timezone('utc'::text, now()) - interval '25 days'
    ),
    (
        '41000000-0000-4000-8000-000000000004',
        v_ugm, v_tri,
        'Daftar Sertifikasi Kompetensi Resmi & Subsidi Voucher SV UGM',
        'career_preparation', false,
        E'Lulusan D4 TRI dibekali SKPI dengan sertifikasi standar industri internasional.\n\n1. Sertifikasi Direkomendasikan: MTCNA (MikroTik), CCNA (Cisco), dan RHCSA (Red Hat).\n\n2. Subsidi Voucher: SV UGM mengadakan ujian bersubsidi periodik melalui Cisco Academy SV UGM.\n\n3. Verifikasi SKPI: Unggah sertifikat ke Simaster menu SKPI.',
        'curated_guide', 'LSP SV UGM & Cisco Academy UGM',
        true, timezone('utc'::text, now()) - interval '30 days'
    ),
    (
        '41000000-0000-4000-8000-000000000005',
        v_ugm, v_tri,
        'Keluarga Mahasiswa Departemen TEDI (KMTEDI) SV UGM',
        'social_community', false,
        E'KMTEDI adalah organisasi kemahasiswaan resmi yang menaungi mahasiswa D4 TRI dan D4 TRPL di Departemen TEDI SV UGM.\n\n1. Divisi Utama: PSDM, Riset & Teknologi (Ristek), Kominfo, dan Pengabdian Masyarakat.\n\n2. Study Club: Networking Study Group, Linux Community, dan Cyber Security Club.\n\n3. Event Tahunan: Informatics & Computer Festival (ICON).',
        'curated_guide', 'Panduan Mahasiswa Baru KMTEDI SV UGM',
        true, timezone('utc'::text, now()) - interval '40 days'
    ),
    -- Mockup guides untuk program lain (TRPL & TI)
    (
        '41000000-0000-4000-8000-000000000006',
        v_ugm, v_trpl,
        'Standar Version Control Git & CI/CD Praktikum TRPL SV UGM',
        'academic_survival', false,
        'Mahasiswa D4 TRPL wajib mengikuti konvensi Conventional Commits dan branching model GitFlow pada tugas besar rekayasa perangkat lunak.',
        'curated_guide', 'Laboratorium Software Rekayasa SV UGM',
        true, timezone('utc'::text, now()) - interval '45 days'
    ),
    (
        '41000000-0000-4000-8000-000000000007',
        v_ugm, v_ti,
        'Panduan Jalur Minat Riset AI & Data Science FT UGM',
        'academic_survival', false,
        'Pemilihan peminatan AI dan Data Science dibuka pada akhir semester 4 dengan prasyarat Struktur Data dan Probabilitas Statistik.',
        'curated_guide', 'Departemen Teknik Elektro dan Teknologi Informasi FT UGM',
        true, timezone('utc'::text, now()) - interval '50 days'
    )
    ON CONFLICT (id) DO NOTHING;

    -- 5. Guides — General (is_general = true requires campus_id IS NULL per chk_guide_scope)
    INSERT INTO public.guides (
        id, campus_id, program_id, title, category, is_general, content_raw,
        source_type, source_reference, source_url, is_published, last_verified_at
    ) VALUES
    (
        '42000000-0000-4000-8000-000000000001',
        NULL, NULL,
        'Panduan Lengkap Simaster & Pengisian KRS Tiap Semester',
        'administrative_guide', true,
        E'KRS (Kartu Rencana Studi) wajib diisi seluruh mahasiswa UGM melalui portal Simaster.\n\n1. Cek Status UKT: Pastikan tagihan lunas atau mengantongi surat dispensasi.\n\n2. Batas SKS: Sesuaikan dengan IPK semester sebelumnya (IPK >= 3.00 maksimal 24 SKS).\n\n3. Persetujuan DPA: Hubungi Dosen Pembimbing Akademik setelah submit KRS.',
        'official_campus_source', 'Direktorat Pendidikan dan Pengajaran (DPP) UGM', 'https://simaster.ugm.ac.id',
        true, timezone('utc'::text, now()) - interval '8 days'
    ),
    (
        '42000000-0000-4000-8000-000000000002',
        NULL, NULL,
        'Layanan Kesehatan Bebas Biaya Mahasiswa di GMC UGM',
        'campus_essentials', true,
        E'Mahasiswa aktif UGM berhak mengakses layanan kesehatan primer di Gadjah Mada Medical Center (GMC), Jl. Colombo.\n\n1. Layanan: Dokter umum, gigi, psikologi, farmasi, dan gawat darurat.\n\n2. Syarat: Tunjukkan KTM fisik atau e-KTM Simaster aktif.\n\n3. Rujukan: Dokter GMC menerbitkan rujukan ke RSA UGM jika perlu spesialis.',
        'official_campus_source', 'Gadjah Mada Medical Center (GMC) UGM', 'https://gmc.ugm.ac.id',
        true, timezone('utc'::text, now()) - interval '18 days'
    ),
    (
        '42000000-0000-4000-8000-000000000003',
        NULL, NULL,
        'Strategi & Timeline Pendaftaran Beasiswa KSE & Djarum UGM',
        'scholarship_growth', true,
        E'Ditmawa UGM mengelola puluhan kemitraan beasiswa yayasan dan perusahaan.\n\n1. Portal Terpadu: Pengajuan rekomendasi melalui beasiswa.ugm.ac.id.\n\n2. Berkas Wajib: Transkrip nilai, slip penghasilan orang tua, dan esai kontribusi.\n\n3. Aturan: Mahasiswa dilarang menerima dua beasiswa tunjangan hidup sekaligus.',
        'curated_guide', 'Direktorat Kemahasiswaan (Ditmawa) UGM', 'https://ditmawa.ugm.ac.id',
        true, timezone('utc'::text, now()) - interval '22 days'
    ),
    (
        '42000000-0000-4000-8000-000000000004',
        NULL, NULL,
        'Konfigurasi Wi-Fi Kampus (UGM-Hotspot) & Eduroam Internasional',
        'campus_essentials', true,
        E'Akses internet nirkabel kampus tersedia di seluruh fakultas dan ruang terbuka.\n\n1. UGM-Hotspot: Login SSO dengan akun @mail.ugm.ac.id.\n\n2. Eduroam: Autentikasi 802.1x EAP dengan email UGM lengkap.\n\n3. Helpdesk: Gedung Pusat UGM Sayap Selatan.',
        'official_campus_source', 'DSSDI UGM', NULL,
        true, timezone('utc'::text, now()) - interval '14 days'
    )
    ON CONFLICT (id) DO NOTHING;

    -- 6. Senior Experiences — D4 TRI Sekolah Vokasi
    INSERT INTO public.experiences (
        id, campus_id, program_id, author_id, title, semester_context,
        situation, challenge, solution, result, advice_for_juniors, tags
    ) VALUES
    (
        '51000000-0000-4000-8000-000000000001',
        v_ugm, v_tri, NULL,
        'Lolos Magang Network Engineer di PT Telkom lewat Jalur Vokasi', 7,
        'Di semester 6, saya harus memilih mitra magang industri 6 bulan kurikulum sarjana terapan TRI. Persaingan di Telkom Regional IV cukup ketat.',
        'Wawancara teknis menguji konfigurasi live BGP, switching VLAN, dan troubleshooting hybrid cloud yang belum semua ada di teori kelas.',
        'Saya memaksimalkan praktikum di Lab Jaringan Gedung TILC dan mengambil sertifikasi MikroTik MTCNA bersubsidi dari SV UGM, lalu menyusun portofolio topologi di GitHub.',
        'Diterima di Divisi Enterprise Network Telkom selama 6 bulan, terlibat konfigurasi metro ethernet, dan mendapatkan tawaran project lanjutan.',
        'Mahasiswa Vokasi punya jam terbang praktikum tinggi! Dokumentasikan portofolio lab kalian dan ambil sertifikasi industri sebelum semester 6.',
        ARRAY['magang-industri', 'network-engineer', 'telkom', 'vokasi-tri']
    ),
    (
        '51000000-0000-4000-8000-000000000002',
        v_ugm, v_tri, NULL,
        'Strategi Menyeimbangkan 4 Praktikum Lab Jaringan dengan Organisasi KMTEDI', 3,
        'Semester 3 adalah fase kaget karena ada 4 modul praktikum dengan laporan asistensi mingguan dan tugas jaringan intensif.',
        'Saya menjabat staf divisi Ristek KMTEDI dan sempat keteteran waktu tidur hingga nilai pre-test praktikum turun.',
        'Saya menerapkan aturan Laporan Selesai di Hari Praktikum di perpustakaan SV bersama 3 rekan kelompok sebelum pulang.',
        'IPK semester 3 bertahan di 3.68, kepanitiaan ICON KMTEDI berjalan lancar, dan ritme istirahat tetap terjaga.',
        'Jangan menunda laporan praktikum sampai malam sebelum deadline asistensi. Bentuk kelompok belajar yang solid sejak awal semester!',
        ARRAY['time-management', 'kmtedi', 'praktikum-lab', 'vokasi-tri']
    )
    ON CONFLICT (id) DO NOTHING;

    UPDATE public.experiences
    SET is_verified_contributor = true, helpful_count = 28
    WHERE id = '51000000-0000-4000-8000-000000000001' AND helpful_count = 0;

    UPDATE public.experiences
    SET is_verified_contributor = true, helpful_count = 19
    WHERE id = '51000000-0000-4000-8000-000000000002' AND helpful_count = 0;
END $$;
