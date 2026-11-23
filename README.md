# Campus Compass — Student Adaptation & Community Knowledge Platform

> **Status**: Documentation & Architecture Approved (Aligned with Feature Blueprint v1.0)  
> **Repository**: `hybrid-campus-platform`  
> **Blueprint Acuan**: `Campus_Compass_Feature_Blueprint.pdf`  
> **Deadline Vibe Coding MVP**: Senin, 23 November 2026  
> **Deadline Testing & QA**: Sabtu, 28 November 2026  
> **Kanban Jira**: [campuscompassstack2026.atlassian.net](https://campuscompassstack2026.atlassian.net/jira/software/projects/KAN/boards/1)

---

## 1. Executive Summary & Product Positioning

**Campus Compass** adalah platform adaptasi mahasiswa yang mengumpulkan pengalaman antarmahasiswa, diskusi komunitas, dan informasi resmi kampus ke dalam satu ekosistem terpadu.

> *"Reddit-inspired community, Glassdoor-organized experiences, and AI-powered guidance — designed to help students navigate academic, social, and campus life."*

Platform ini dibangun di atas 3 pilar utama:
1. **Community**: Ruang interaksi mahasiswa untuk saling bertanya, berdiskusi, berbagi pengalaman, dan saling membantu (*Reddit-inspired*).
2. **Knowledge**: Pengorganisasian pengalaman senior berformat dan informasi resmi kampus ke dalam panduan yang terkurasi (*Glassdoor-organized*).
3. **Intelligence**: Pencarian sumber relevan dan pengubahan informasi menjadi panduan tindakan adaptasi yang nyata (*AI-powered with RAG*).

---

## 2. 5 Area Utama Aplikasi

Aplikasi dirancang sebagai *responsive web app* dengan 5 modul inti:

| Area Utama | Peran & Fungsi | Pertanyaan yang Dijawab |
| :--- | :--- | :--- |
| **1. Home** | Dashboard personal, snapshot adaptasi, rekomendasi topik, quick actions. | *Apa yang relevan untuk saya sekarang?* |
| **2. Community** | Feed diskusi, pertanyaan, jawaban, voting helpful, accepted answer, bookmark. | *Siapa yang bisa membantu dan apa pengalaman orang lain?* |
| **3. Knowledge Hub** | 6 Kategori panduan kampus terkurasi & pengalaman senior berformat. | *Di mana informasi yang dapat saya gunakan kembali?* |
| **4. My Journey** | Peta langkah adaptasi, rekomendasi tindakan, checklist, dan refleksi progres. | *Apa langkah berikutnya yang bisa saya lakukan?* |
| **5. AI Navigator** | Chatbot RAG berbasis retrieval dokumen resmi dan konten komunitas yang diizinkan. | *Apa jawaban yang relevan dan dari mana sumbernya?* |

---

## 3. Pembagian Peran Tim

| Anggota Tim | Peran | Fokus Tanggung Jawab Utama |
| :--- | :--- | :--- |
| **Rifal** | Product & UI/UX Direction | Visi produk, visual style, moodboard, panduan UI/UX, dan storytelling demo hackathon. |
| **Kalya** | Frontend & User Experience | Alur onboarding tantangan, navigasi responsif 5 modul, dan implementasi antarmuka Next.js. |
| **Erick** | Technical Setup & AI Dev | Konfirmasi tech stack, pipeline RAG, integrasi Google Gemini API, dan grounding anti-halusinasi. |
| **Netta** | Backend, Database & AI Architecture | Skema database PostgreSQL Supabase (7 kelompok tabel), pgvector, RLS, dan kepatuhan UU PDP. |

---

## 4. Struktur Repositori Inti (The Lean Spec)

```
hybrid-campus-platform/
├── Campus_Compass_Feature_Blueprint.pdf # Dokumen acuan fitur & konsep hackathon resmi
├── AGENTS.md                          # Master Prompt & Guardrails untuk AI Coding Agent
├── README.md                          # Ringkasan proyek & status kanban
├── CONTRIBUTING.md                    # Panduan branching Git & commit convention
├── .env.example                       # Template konfigurasi environment variable
├── docs/
│   ├── PRODUCT_SPEC.md                # PRD lengkap: 5 modul, skenario demo hackathon, akun, UU PDP
│   ├── TECH_AND_DATABASE.md           # Tech stack, DDL SQL Supabase (7 kelompok tabel), RLS & Gemini RAG
│   └── TEAM_ASSESSMENT_GUIDE.md       # Panduan review & checklist assessment per anggota tim
├── assets/
│   ├── moodboard/                     # Aset palet warna & visual theme (Rifal)
│   ├── references/                    # Benchmark UI dashboard & mobile drawer (Rifal & Kalya)
│   └── diagrams/                      # Ekspor diagram arsitektur & flow (Erick & Netta)
├── research/
│   ├── interview-notes/               # Rekap respon survei Google Form mahasiswa teranonimkan
│   ├── findings/                      # Rangkuman temuan & affinity mapping riset
│   └── synthetic-data/                # Mock fixture terisolasi untuk unit testing ([SYNTHETIC])
└── src/                               # Tempat kode aplikasi Next.js (Mulai Vibe Coding 23 Nov)
```

---

## 5. Dokumentasi Acuan untuk Vibe Coding

| Kebutuhan | Dokumen Acuan | Keterangan |
| :--- | :--- | :--- |
| **Biar Produk Gak Goyah** | [`docs/PRODUCT_SPEC.md`](docs/PRODUCT_SPEC.md) | Batasan scope, 5 modul, alur onboarding, UU PDP, dan skenario demo. |
| **Biar Kode & Data Gak Goyah** | [`docs/TECH_AND_DATABASE.md`](docs/TECH_AND_DATABASE.md) | DDL SQL Supabase lengkap, RPC pgvector, prompt Gemini, struktur `src/`. |
| **Review Tim Sebelum Coding** | [`docs/TEAM_ASSESSMENT_GUIDE.md`](docs/TEAM_ASSESSMENT_GUIDE.md) | Checklist pengecekan spesifik untuk Rifal, Kalya, Erick, dan Netta. |
| **Instruksi Coding Agent** | [`AGENTS.md`](AGENTS.md) | Master prompt hemat token untuk coding assistant. |

---

## 6. Skenario Demo Hackathon (6 Adegan Utama)

1. **Onboarding**: Mahasiswa baru memilih kampus, prodi, semester, dan tantangan *Time Management*.
2. **Home**: Dashboard memprioritaskan panduan dan diskusi yang sesuai konteks secara instan.
3. **Community**: Pengguna membuat pertanyaan; rekan mahasiswa memberi jawaban; penanya menandai *Helpful*.
4. **Knowledge Hub**: Pengalaman atau diskusi berkualitas tersedia sebagai panduan terkurasi 6 kategori.
5. **AI Navigator**: AI menjawab pertanyaan dengan sumber asli dari database (*RAG with source cards*).
6. **My Journey**: Mahasiswa memperoleh langkah berikutnya dan menandai progres tindakan adaptasi.
