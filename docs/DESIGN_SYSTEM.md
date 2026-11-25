# Campus Compass — Design System & Component Library

> **Sumber Kebenaran**: `ref.pdf` (Design Reference), [`AGENTS.md`](../AGENTS.md), and `src/app/globals.css`.  
> **Status**: Internal Technical Documentation & Component Guide.  
> **Akses Lokal**: Halaman showcase interaktif dapat diakses pada saat development lokal di `http://localhost:3000/design-system` (dinonaktifkan pada mode produksi demi keamanan).

---

## 1. Prinsip Desain & Visual Direction

Campus Compass menggabungkan kehangatan komunitas mahasiswa dengan kejelasan utilitas akademik:
* **Tipografi**: Menggunakan font **Poppins** di seluruh antarmuka dengan skala tipe terstruktur.
* **Palet Warna**: Palet biru 7-tingkat (dari `brand-950` yang solid hingga `brand-100` yang lembut) dengan rasio kontras ramah aksesibilitas (**WCAG AA 4.5:1**).
* **Elevasi & Sudut**: Mengutamakan *rounded corners* modern (`rounded-3xl` dan `rounded-2xl`) serta bayangan lembut (`shadow-card` dan `shadow-nav`).

---

## 2. Palet Warna (Color Palette Tokens)

Semua token warna didefinisikan secara resmi di `src/app/globals.css`:

| Token | Nilai Hex | Penggunaan Utama | Standar Aksesibilitas |
| :--- | :--- | :--- | :--- |
| **`brand-950`** | `#04202e` | Teks judul utama (*headings*), background navbar gelap | Kontras tertinggi terhadap putih (> 15:1) |
| **`brand-900`** | `#0a3c55` | Tombol primer (*default*), ikon aktif, header card | Lolos WCAG AAA |
| **`brand-800`** | `#0f5d83` | Teks sekunder, label formulir, teks paragraf pendukung | Lolos WCAG AA (7:1) |
| **`brand-700`** | `#1279a2` | Teks aksen, link interaktif, button hover | Lolos WCAG AA (4.9:1) |
| **`brand-600`** | `#1786b4` | Focus ring (`outline`), border aktif, badge kategori | Aksesibilitas fokus |
| **`brand-400`** | `#4fb2db` | Garis batas dekoratif, divider sekunder | Bukan untuk teks tipis |
| **`brand-300`** | `#98d4ee` | Border kartu (*card borders*), garis pemisah | Pemisah konten |
| **`brand-100`** | `#e1f2fa` | Background chip, kartu aktif, hover background | Warna dasar netral |

### Background Gradien Aplikasi
```css
background: linear-gradient(160deg, #e1f2fa 0%, #f3f9fc 45%, #ffffff 100%) fixed;
```

---

## 3. Skala Tipografi (Typography Scale)

Seluruh teks menggunakan utility class bawaan Tailwind yang dipetakan langsung ke Poppins:

| Utility Class | Spesifikasi Font | Ukuran / Line Height | Contoh Penggunaan |
| :--- | :--- | :--- | :--- |
| **`text-h1`** | Poppins Bold (700) | `32px` / `40px` (`2rem` / `2.5rem`) | Judul utama halaman landing & dashboard |
| **`text-h2`** | Poppins SemiBold (600) | `26px` / `34px` (`1.625rem` / `2.125rem`) | Header modul, judul wizard onboarding |
| **`text-h3`** | Poppins SemiBold (600) | `20px` / `28px` (`1.25rem` / `1.75rem`) | Sub-judul kategori, judul panduan |
| **`text-h4`** | Poppins Medium (500) | `16px` / `24px` (`1rem` / `1.5rem`) | Judul kartu artikel, teks tombol besar |
| **`text-h5`** | Poppins Medium (500) | `14px` / `20px` (`0.875rem` / `1.25rem`) | Label navigasi, metadata penting |
| **`text-body`** | Poppins Regular (400) | `14px` / `22px` (`0.875rem` / `1.375rem`) | Teks paragraf, isi konten diskusi, panduan |
| **`text-caption`** | Poppins Regular (400) | `12px` / `18px` (`0.75rem` / `1.125rem`) | Timestamp, sitasi `[1]`, badge keterangan |

---

## 4. Elevasi & Bayangan (Shadows)

* **`shadow-card`**: `0 10px 28px -12px rgb(4 32 46 / 0.28)`  
  Digunakan pada container formulir, kartu panduan, kartu pengalaman, dan container dashboard.
* **`shadow-nav`**: `0 12px 32px -16px rgb(4 32 46 / 0.45)`  
  Digunakan khusus pada header navigasi mengambang (*floating navbar*) dan *sidebar*.

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
