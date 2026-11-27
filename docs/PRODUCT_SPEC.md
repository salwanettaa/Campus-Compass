# Campus Compass — Master Product Specification (PRD)

> **Dokumen**: `docs/PRODUCT_SPEC.md`  
> **Status**: Aligned with Official Feature Blueprint (v1.0)  
> **Target Vibe Coding**: Selesai Senin, 23 November 2026  
> **Target Debugging & QA**: Selesai Sabtu, 28 November 2026  
> **Repositori**: `hybrid-campus-platform` (Campus Compass)

---

## 1. Product Positioning & Executive Summary

**Campus Compass** adalah platform adaptasi mahasiswa dan pusat pengetahuan komunitas (*Student Adaptation & Community Knowledge Platform*). 

### Product Positioning
> *"Reddit-inspired community, Glassdoor-organized experiences, and AI-powered guidance — designed to help students navigate academic, social, and campus life."*

```mermaid
flowchart LR
    Pillar1["<b>1. COMMUNITY</b><br/>Tanya, diskusi, berbagi, & terhubung dengan sesama mahasiswa (Reddit-inspired)"] --- Pillar2["<b>2. KNOWLEDGE</b><br/>Kurasi pengalaman senior & informasi resmi kampus (Glassdoor-organized)"]
    Pillar2 --- Pillar3["<b>3. INTELLIGENCE</b><br/>Temukan sumber relevan & ubah menjadi panduan aksi nyata (AI-powered)"]
```

### Gagasan Utama
Pengalaman mahasiswa tidak berhenti sebagai cerita atau komentar obrolan yang cepat tenggelam. Pengalaman yang relevan dapat:
1. **Dicari & Difilter** berdasarkan prodi dan semester.
2. **Dikurasi** menjadi basis pengetahuan (*Knowledge Hub*).
3. **Digunakan AI** (*AI Navigator*) sebagai sumber jawaban terpercaya yang bersitasi.
4. **Diterjemahkan Menjadi Langkah Aksi Nyata** (*My Journey*) untuk menyelesaikan masalah adaptasi perkuliahan.

---

## 2. Masalah yang Diselesaikan & Target Pengguna

### Masalah Utama:
- Informasi akademik, administratif, sosial, dan fasilitas tersebar tidak terstruktur di website kampus, media sosial, dokumen PDF tebal, serta grup WhatsApp/Telegram.
- Mahasiswa baru sering tidak tahu sumber yang tepat atau orang yang tepat untuk ditanya.
- Pengalaman berharga dari kakak tingkat mudah hilang di percakapan dan sulit ditemukan kembali.
- Jawaban AI publik generik sering kali halusinasi karena tidak memahami aturan lokal prodi/kampus.
- Mahasiswa membutuhkan bukan hanya jawaban teori, tetapi juga **langkah praktis** untuk adaptasi.

### Target Segmen Pengguna:
1. **Mahasiswa Tahun 1–2 (Pengguna Utama)**: Membutuhkan panduan adaptasi awal, jawaban cepat, dan rasa terhubung.
2. **Mahasiswa Tahun 3+ (Kontributor / Calon Mentor)**: Membagikan pengalaman, tips praktikum, dan membantu junior.
3. **Mahasiswa Pindahan**: Memahami lingkungan kampus, administrasi konversi SKS, dan prosedur baru.
4. **Moderator / Admin Kampus**: Menjaga kualitas data, memverifikasi dokumen resmi, dan mengelola komunitas.

---

## 3. Prinsip Desain Produk

1. **Community-First**: Interaksi mahasiswa menjadi sumber pengetahuan utama yang hidup.
2. **Source-Aware**: Setiap informasi penting menampilkan asal usul, konteks, dan tanggal pembaruan (bukan sekadar rumor).
3. **Action-Oriented**: Rekomendasi mengarah pada tindakan nyata yang bisa diselesaikan mahasiswa, bukan sekadar konsumsi konten pasif.
4. **Campus-Specific**: Hasil pencarian dan rekomendasi terkunci pada kampus dan program studi mahasiswa (multi-tenant isolation).
5. **Privacy-by-Design & UU PDP**: Kepatuhan penuh terhadap **UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi**. Data pribadi diminimalkan (dilarang meminta NIM atau alamat tanpa alasan jelas).

---

## 4. Arsitektur 4 Area Utama Aplikasi

Aplikasi dirancang sebagai *responsive web app* dengan **4 modul utama** (Home & My Journey, Community, Knowledge Hub, dan AI Navigator):

```mermaid
flowchart TD
    User([Mahasiswa]) --> Onboarding["Onboarding: Kampus, Prodi, Semester & Tantangan Utama"]

    Onboarding --> Nav{"4 Main Navigation Areas"}

    Nav --> M1["1. HOME<br/>Personalized Dashboard & My Journey"]
    Nav --> M2["2. COMMUNITY<br/>Diskusi dan Interaksi Mahasiswa"]
    Nav --> M3["3. KNOWLEDGE HUB<br/>Panduan Terkurasi & Senior Experiences"]
    Nav --> M4["4. AI NAVIGATOR<br/>RAG-Based Campus Guidance"]

    subgraph HOME["1. HOME — Personalized Dashboard & My Journey"]
        H1["Welcome Context"]
        H2["Adaptation Snapshot"]
        H3["My Journey: Full Adaptation Roadmap"]
        H4["Recommended for You"]
        H5["Trending Discussions & Unanswered Questions"]
        H6["Quick Actions"]
    end

    M1 --> HOME
    H2 --> H3
    H3 --> H4

    M2 --> C1["Questions, Experiences, Guides & Opportunities"]
    M3 --> K1["Curated Guides & Structured Senior Experiences"]
    M4 --> A1["RAG Chat with Source Citations"]

    C1 --> K1
    K1 --> A1
    A1 --> H3

    style M1 fill:#dbeafe,stroke:#2563eb,color:#1e3a8a
    style M2 fill:#dcfce7,stroke:#16a34a,color:#14532d
    style M3 fill:#fef3c7,stroke:#d97706,color:#78350f
    style M4 fill:#ede9fe,stroke:#7c3aed,color:#4c1d95
```

---

### Area 1: Home (Personalized Dashboard & My Journey)

Home merupakan titik masuk utama mahasiswa yang menggabungkan informasi personal, rekomendasi relevan, dan peta perjalanan adaptasi. Halaman ini menjawab pertanyaan: *"Apa yang relevan untuk saya sekarang dan apa yang perlu saya lakukan selanjutnya?"*

#### A. Personalized Dashboard

-   **Welcome Context**: Menampilkan sapaan personal, nama kampus, program studi, dan semester mahasiswa.
-   **Adaptation Snapshot**: Menampilkan ringkasan progres My Journey, terrmasuk jumlah milestone yang sudah selesai, sedang dikerjakan, dan
    belum dimulai.
-   **Recommended for You**: Rekomendasi panduan dan diskusi berdasarkan  kombinasi program studi, semester, dan tantangan yang dipilih saat
    onboarding.
-   **Trending Discussions & Unanswered Questions**: Menampilkan diskusi  yang sedang hangat atau pertanyaan baru yang membutuhkan bantuan
    jawaban untuk mendorong interaksi komunitas.
-   **Quick Actions**: Tombol akses cepat untuk membuat pertanyaan,  membagikan pengalaman, mencari panduan, atau membuka AI Navigator.

#### B. My Journey --- Personalized Adaptation Journey

My Journey merupakan bagian terintegrasi dari Home yang menerjemahkan kebutuhan mahasiswa menjadi daftar tindakan nyata (*actionable
roadmap*).

Fitur ini memiliki dua tingkat tampilan:

1.  **Journey Snapshot**: Ringkasan progres adaptasi yang ditampilkan langsung di dashboard Home.
2.  **Full Journey Roadmap**: Tampilan detail seluruh milestone, eskripsi aktivitas, dan pengelolaan status progres yang dapat diakses dari Home.

**Input Personalisasi:**

-   Semester / Tahun masuk.
-   Area Adaptasi: Akademik, Sosial, Pribadi/Pengelolaan Diri,
    Fasilitas, dan Peluang.
-   Tantangan Utama: Misalnya *Time Management*, Adaptasi Silabus Dosen, dan Mencari Komunitas.

**Contoh Tahap & Milestone:**

-   **Understand Campus**: Mengenali layanan administrasi dan fasilitas
    utama kampus.
-   **Understand Academics**: Memahami sistem KRS, LMS kampus, kalender
    akademik, dan prasyarat mata kuliah.
-   **Build Study Routine**: Membuat jadwal belajar mandiri dan
    memetakan tenggat tugas praktikum.
-   **Find Community**: Menjelajahi UKM, kelompok belajar, dan
    kesempatan networking.
-   **Explore Opportunities**: Mengikuti informasi magang, riset dosen,
    dan beasiswa.
-   **Reflect and Adjust**: Melakukan evaluasi berkala terhadap hal yang
    sudah terbantu dan tantangan yang masih dihadapi.

**Status Progres:**

-   `Not Started`
-   `In Progress`
-   `Completed`
-   `Skipped`

Mahasiswa dapat memperbarui status setiap milestone secara mandiri.
Perubahan progres akan tercermin pada Adaptation Snapshot di dashboard
Home.

------------------------------------------------------------------------

### Area 2: Community (Reddit-Inspired Interaction)

Ruang interaksi antar-mahasiswa untuk saling bertanya dan membantu.

#### Jenis Postingan

-   `Question`: Pertanyaan yang membutuhkan jawaban atau saran.
-   `Experience`: Mahasiswa berbagi pengalaman personal.
-   `Guide`: Panduan langkah demi langkah yang dibuat mahasiswa.
-   `Opportunity`: Informasi lomba, beasiswa, kepanitiaan, atau lowongan
    magang.

#### Mekanisme Interaksi Kunci

-   **Helpful Vote**: Penandaan postingan atau jawaban yang bermanfaat.
    MVP tidak memerlukan downvote.
-   **Accepted Answer**: Penanya dapat menandai satu jawaban yang paling
    menyelesaikan masalahnya.
-   **Bookmark & Report**: Menyimpan diskusi penting dan melaporkan spam
    atau konten bermasalah.
-   **Filter Cepat**: Berdasarkan topik, program studi, semester, dan
    status jawaban (terjawab / belum terjawab).

------------------------------------------------------------------------

### Area 3: Knowledge Hub (Curated Campus Guides)

Menyimpan panduan terkurasi dari regulasi resmi universitas dan fakultas/program studi yang dapat digunakan kembali sebagai referensi jangka panjang dengan tautan sumber resmi dan stempel verifikasi kedaluwarsa (180 hari).

*(Catatan Arsitektur: Cerita pengalaman dan tips adaptasi mahasiswa senior dipusatkan di modul Community melalui jenis postingan `experience` agar diskusi dan tanya-jawab berlangsung dua arah).*

#### Six Knowledge Hub Categories

1.  **Academic Survival**: Metode belajar, strategi tugas, praktikum,
    ujian, dan sistem perkuliahan.
2.  **Social & Community**: Organisasi, UKM, komunitas pertemanan, dan
    kegiatan mahasiswa.
3.  **Administrative Guide**: Pengisian KRS, layanan akademik fakultas,
    kontak birokrasi, dan kalender penting.
4.  **Campus Essentials**: Fasilitas penting, perpustakaan, transportasi
    kampus, kantin, dan ruang belajar.
5.  **Scholarship & Growth**: Informasi beasiswa, kompetisi, volunteer,
    dan pengembangan diri.
6.  **Career Preparation**: CV, portofolio, persiapan magang (KP), dan
    seleksi kerja.

------------------------------------------------------------------------

### Area 4: AI Campus Navigator (Retrieval-Augmented Guidance)

Asisten cerdas berbasis RAG yang menjawab pertanyaan mahasiswa
menggunakan bahasa sehari-hari dengan mengacu pada sumber informasi yang
tersedia dan relevan.

#### A. AI Principles

AI Navigator bukan chatbot umum. Sistem tidak diperbolehkan mengarang
kebijakan, prosedur, atau informasi spesifik kampus yang tidak memiliki
bukti pendukung.

#### B. Permitted Knowledge Sources

1.  **Official Campus Sources**: Prosedur resmi, kalender akademik, dan
    dokumen kurikulum program studi.
2.  **Curated Guides**: Panduan terkurasi dari Knowledge Hub.
3.  **Verified Community Experiences**: Pengalaman senior dan jawaban
    komunitas yang telah memenuhi kriteria untuk digunakan sebagai
    sumber retrieval.

#### C. Source Cards & Citations

Setiap jawaban wajib menampilkan kartu sumber rujukan (*source cards*)
yang berisi judul dokumen atau konten, tautan sumber, dan informasi
pendukung yang relevan.

#### D. Insufficient Evidence Handling

Jika bukti dalam basis data tidak memadai, AI harus menyatakan bahwa
informasi belum tersedia atau belum dapat dipastikan.

Selanjutnya, AI dapat mengarahkan pengguna untuk:

-   Membuat pertanyaan di forum Community.
-   Membaca panduan terkait di Knowledge Hub.
-   Menghubungi kontak resmi kampus yang relevan.

## 5. Batasan Ruang Lingkup MVP (P0 vs P1 vs P2)

| Prioritas | Fitur / Komponen | Kriteria Selesai (Target 23 Nov 2026) |
| :--- | :--- | :--- |
| **P0 (Wajib MVP)** | Autentikasi Supabase, Profil & Onboarding tantangan, Home Dashboard personal, Community feed & create post/comment, Helpful vote, Knowledge Hub dasar, Report dasar. | Mahasiswa dapat mendaftar, memilih prodi/tantangan, bertanya, menjawab, dan membaca panduan terkurasi. |
| **P1 (Pembeda Utama)** | **AI Navigator** dengan RAG bersitasi sumber, **My Journey** adaptation checklist rule-based, rekomendasi dashboard otomatis. | AI menjawab dengan sumber valid dan My Journey memberikan langkah adaptasi konkret. |
| **P2 (Ekspansi Masa Depan)** | *Peer matching* lanjut, *private messaging* langsung, peta interaktif gedung kampus (*interactive campus map*), analitik dashboard prodi multi-kampus. | Ditunda untuk fase berikutnya agar tidak menambah beban moderasi dan privasi di MVP. |

---

## 6. Skenario Demo Hackathon (6 Adegan Utama)

Skenario alur presentasi yang disiapkan untuk demo aplikasi:

| No | Adegan Demo | Yang Diperlihatkan | Nilai Produk yang Dibuktikan |
| :---: | :--- | :--- | :--- |
| **1** | **Onboarding** | Mahasiswa baru login, memilih kampus pilot, prodi pilot, semester 1, dan memilih tantangan *Time Management*. | Produk langsung memahami konteks dan kebutuhan personal pengguna. |
| **2** | **Home** | Dashboard menampilkan sapaan personal, kartu snapshot adaptasi, serta rekomendasi panduan sesuai tantangan. | Personalisasi berjalan instan tanpa *cold-start*. |
| **3** | **Community** | Pengguna membuat pertanyaan tentang praktikum; mahasiswa lain memberikan jawaban berformat; penanya memberi *helpful vote*. | Interaksi *peer-to-peer* yang saling membantu berjalan nyata. |
| **4** | **Knowledge Hub** | Menjelajahi panduan terkurasi 6 kategori dan membaca pengalaman senior berformat (situasi $\rightarrow$ tantangan $\rightarrow$ solusi). | Pengetahuan berharga tersimpan rapi dan tidak tenggelam di feed. |
| **5** | **AI Navigator** | Mahasiswa bertanya: *"Apa prasyarat lab fisika dasar?"*; AI menjawab cepat lengkap dengan *source card* dokumen resmi. | RAG terintegrasi dan faktual, bukan chatbot generik halusinasi. |
| **6** | **My Journey** | Mahasiswa membuka peta adaptasi semester 1 dan menandai checklist selesai (*completed*). | Informasi diterjemahkan menjadi tindakan nyata mahasiswa. |

---

## 7. North Star Metric & Keberhasilan Produk

> **NORTH STAR METRIC**: **Successful Student Help Sessions**  
> *(Jumlah sesi interaksi ketika mahasiswa benar-benar menemukan panduan, jawaban, atau langkah tindakan yang dinilai membantu adaptasi mereka).*

Fokus keberhasilan bukan sekadar jumlah akun atau *page views*, melainkan seberapa efektif mahasiswa terbantu mengatasi kebingungan perkuliahan mereka.
