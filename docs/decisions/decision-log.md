# Architectural Decision Log (ADR)

> **Dokumen**: `docs/decisions/decision-log.md`  
> **Owner**: Seluruh Tim (Koordinator: Netta & Erick)  
> **Status**: Active Living Document (Pending Review)  
> **Last Updated**: 2026-11-20

---

## 1. Tujuan Dokumen

Dokumen ini mencatat keputusan-keputusan arsitektur, produk, dan teknis (Architectural Decision Records / ADR) yang diambil oleh tim beserta alasannya, agar arah proyek tetap konsisten dan transparan.

---

## 2. Status Keputusan

> [!NOTE]
> Proyek saat ini berada pada tahap inisiasi fondasi (Phase 0). Keputusan di bawah ini masih berstatus **Draft / Proposed** dan akan difinalisasi oleh masing-masing owner sebelum implementasi kode dimulai.

---

## 3. Indeks Usulan Keputusan (ADR List)

| ID | Tanggal | Judul Keputusan | Owner | Status |
| :--- | :--- | :--- | :--- | :--- |
| **ADR-001** | 2026-11-20 | Pendekatan Dokumentasi Awal (Documentation-First) & Panduan Agent | Netta & Erick | **Proposed** |
| **ADR-002** | 2026-11-20 | Batasan Ruang Lingkup Pilot (1 Universitas, 1 Program Studi) | Rifal & Netta | **Proposed** |
| **ADR-003** | 2026-11-20 | Model Hybrid Knowledge (General vs Campus-Scoped) | Erick & Netta | **Proposed** |
| **ADR-004** | 2026-11-20 | Penggunaan Supabase (Postgres, RLS, pgvector) untuk Data Layer | Netta | **Proposed** |
| **ADR-005** | 2026-11-20 | Penggunaan Google Gemini API untuk Pipeline RAG & Sitasi | Erick | **Proposed** |
| **ADR-006** | 2026-11-20 | Pemisahan Rekomendasi Deterministik dari Model Generatif | Netta | **Proposed** |
| **ADR-007** | 2026-11-20 | Standar Isolasi Data Sintetis Selama Masa Prototyping | Rifal & Netta | **Proposed** |
| **ADR-008** | 2026-11-20 | Usulan Framework Next.js App Router & Tailwind CSS | Kalya & Erick | **Proposed** |
| **ADR-009** | 2026-11-20 | Model Akun Akademik & Personal Workspace (Menolak Model Full Sosmed) | Rifal & Netta | **Approved** |

---

## 4. Rincian Rekaman Keputusan (Approved ADRs)

### ADR-009: Model Akun Akademik & Personal Workspace (Menolak Model Full Sosmed)
- **Tanggal**: 2026-11-20
- **Status**: **Approved**
- **Owner**: Rifal & Netta
- **Konteks**: Muncul pertanyaan apakah sistem akun mahasiswa sebaiknya mengadopsi model media sosial penuh (follow/followers, timeline feed publik, DM) atau model utilitas akademik.
- **Keputusan**: Mengadopsi model **Akun Utilitas Akademik & Personal Workspace** dan menolak model media sosial penuh. Akun difokuskan pada:
  1. *Context Anchor*: Mengunci prodi, kampus, dan semester mahasiswa untuk personalisasi RAG dan kartu rekomendasi.
  2. *Personal Workspace*: Menyimpan riwayat chat AI, bookmark artikel/tips, dan checklist progress semester.
  3. *Interaksi Komunitas Ringan*: Tombol upvote ("Membantu 👍") pada tips dan opsi berkontribusi/bertanya secara anonim (*Anonymous*).
- **Konsekuensi**: Mencegah *scope creep*, mengeliminasi beban berat moderasi postingan bebas di MVP, menjaga privasi mahasiswa, dan memastikan mahasiswa fokus mendapatkan navigasi akademik yang faktual.

---

## 5. Format Pengisian ADR Baru

Setiap keputusan baru yang disetujui tim wajib mencantumkan:
1. **Konteks**: Masalah atau kebutuhan yang dihadapi.
2. **Keputusan**: Pilihan teknis/produk yang diambil.
3. **Konsekuensi**: Dampak positif dan kompromi dari keputusan tersebut.
4. **Owner**: Anggota tim yang bertanggung jawab.
