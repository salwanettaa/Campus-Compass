# Campus Compass — Design System & Component Library

> **Sumber Kebenaran**: `ref.pdf` (Design Reference), [`AGENTS.md`](../AGENTS.md), and `src/app/globals.css`.  
> **Status**: Internal Technical Documentation & Component Guide.  
> **Akses Lokal**: Halaman showcase interaktif dapat diakses pada saat development lokal di `http://localhost:3000/design-system` (dinonaktifkan pada mode produksi demi keamanan).

---

## 1. Prinsip Desain & Visual Direction

Identitas: **biru Campus Compass, Poppins, dan peta dengan garis rute**.
* **Struktur landing**: navbar mengambang, hero 2 baris, grid 6 kategori, panel contoh, rute 4 langkah, panel ajakan, footer.
* **Liquid glass** (`liquid-glass`, `liquid-glass-dark`): hanya untuk lapisan mengambang (navbar landing, panel contoh, menu bawah HP). Maksimal 2 per layar.
* **Motif rute**: garis putus-putus oranye di hero dan di antara langkah 01-04.
* **Sudut**: tombol berbentuk pil, kartu `rounded-md` (16px).

---

## 2. Palet Warna (Color Palette Tokens)

Token didefinisikan di `src/app/globals.css`:

| Token | Hex | Penggunaan |
| :--- | :--- | :--- |
| **`brand-950`** | `#04202e` | Judul dan teks utama |
| **`brand-900`** | `#0a3c55` | Item aktif, awal gradasi |
| **`brand-800`** | `#0f5d83` | Teks sekunder |
| **`brand-700`** | `#0f6d93` | Link (digelapkan agar teks kecil mencapai 4.5:1) |
| **`brand-600`** | `#1786b4` | Focus ring |
| **`brand-400`** | `#4a8aa8` | Tepi kontrol (bukan untuk teks) |
| **`brand-300`** | `#c3e3f2` | Garis pemisah, teks aksen di latar gelap |
| **`brand-100`** | `#e1f2fa` | Latar tonal |
| **`route`** / **`route-on-dark`** | `#d46747` / `#f08a68` | Garis rute (dekorasi identitas) |

Latar aplikasi: `linear-gradient(160deg, #e1f2fa 0%, #f3f9fc 45%, #ffffff 100%)`.

---

## 3. Skala Tipografi (Typography Scale)

Semua memakai **Poppins**.

| Utility Class | Weight | Ukuran |
| :--- | :--- | :--- |
| **`text-display`** | 700 | fluid 40-76px |
| **`text-h1`** | 600 | fluid 32-46px |
| **`text-h2`** | 600 | fluid 22-28px |
| **`text-h3`** | 600 | 18px |
| **`text-h4`** / **`text-h5`** | 500 | 16px / 14px |
| **`text-lead`** | 400 | 17px |
| **`text-body`** | 400 | 14px |
| **`text-caption`** | 400 | 12px |

---

## 4. Elevasi

Kartu memakai garis `brand-300` tanpa bayangan. Bayangan hanya ada pada lapisan liquid glass untuk menandai bahwa lapisan itu mengambang. Jika pengguna mengaktifkan *reduced transparency*, panel kaca menjadi solid.

---

## 5. Katalog Komponen Utama (`src/components/`)

### A. Komponen Antarmuka Form (`src/components/ui/`)
1. **`Button` & `ButtonLink`**:
   - Varian: `primary` (brand-900), `secondary` (brand-100), `outline` (border brand-300), `ghost` (transparan), `danger` (red-600).
   - Ukuran: `sm`, `md` (default), `lg`.
2. **`Input` & `PasswordInput`**:
   - Dilengkapi focus ring `brand-600` dan toggle visibility kata sandi.
3. **`Select`**:
   - Dropdown ramah keyboard dengan opsi terstruktur (kampus, fakultas, prodi, semester).
4. **`ChoiceCard` & `Checkbox`**:
   - Kartu pilihan interaktif untuk wizard onboarding dan filter kategori.
5. **`Field`**:
   - Wrapper standar input yang mengintegrasikan label teks, pesan error validasi Zod, dan hint teks.
6. **`Alert`**:
   - Alert info/error/success untuk respon Server Actions.

### B. Komponen Navigasi & Tata Letak (`src/components/layout/`)
1. **`Navbar`**:
   - Navigasi responsif desktop dengan dukungan tema `dark` (landing) dan `light` (dashboard).
2. **`Sidebar`**:
   - Navigasi vertikal sisi kiri untuk desktop view di modul utama (`/home`, `/community`, `/knowledge`, `/ai-navigator`).
3. **`BottomNav`**:
   - Navigasi tab bar bawah khusus perangkat mobile (< 768px).
4. **`Logo`**:
   - Komponen brand Campus Compass dengan ikon `Compass` adaptif terhadap background terang/gelap.

### C. Komponen Modul Spesifik
1. **Community (`src/components/community/`)**:
   - `PostCard`: Kartu ringkasan postingan forum (vote count, tag kategori, status diterima).
   - `CommentThread`: Komponen komentar bertingkat dengan tombol *Accept Answer* dan upvote.
   - `HelpfulButton`: Tombol interaktif untuk menambah/mengurangi vote count.
2. **Knowledge Hub (`src/components/knowledge/`)**:
   - `CategoryFilter`: Pilihan 6 kategori panduan kampus.
   - `ExperienceCard`: Kartu cerita senior berformat STAR (Situation, Challenge, Solution, Result).
   - `ExperienceForm`: Formulir kurasi pengalaman dengan filter data pribadi (tanpa NIM/No HP).
3. **AI Navigator (`src/components/ai-navigator/`)**:
   - `SampleChat`: Kotak obrolan AI dengan komponen kartu sitasi rujukan `[1]`, `[2]`.

---

## 6. Keamanan & Akses Rute

* **Halaman `/design-system`**:  
  Dibatasi khusus untuk lingkungan pengembangan lokal (`NODE_ENV !== "production"`). Pada server produksi, rute ini secara otomatis mengembalikan status **404 Not Found**, sehingga aset dan skema pengujian internal tidak terekspos ke publik.
