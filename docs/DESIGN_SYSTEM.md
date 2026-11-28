# Campus Compass — Design System & Component Library

> **Sumber Kebenaran**: `ref.pdf` (Design Reference), [`AGENTS.md`](../AGENTS.md), and `src/app/globals.css`.  
> **Status**: Internal Technical Documentation & Component Guide.  
> **Akses Lokal**: Halaman showcase interaktif dapat diakses pada saat development lokal di `http://localhost:3000/design-system` (dinonaktifkan pada mode produksi demi keamanan).

---

## 1. Prinsip Desain & Visual Direction

Identitas: **satu tema gelap dengan biru tim Campus Compass, kompas, dan garis rute**. Berlaku di semua halaman.

* **Tipografi**: Wix Madefor Display. Tiro Kannada italic hanya untuk satu kata yang ditekankan pada judul besar.
* **Kompas** adalah motif utama: dial interaktif di hero landing (`CompassFinder`) dan `CompassRing` di Home serta halaman auth. `CompassRing` menunjukkan pilihan, bukan skor atau progres.
* **Glow** (`compass-glow`): hanya di belakang kompas, maksimal satu per layar.
* **Glass** (`liquid-glass`): navigasi mengambang dan panel contoh di landing, maksimal 2 per layar.
* **Garis rute** oranye: satu-satunya aksen.
* **Sudut**: tombol berbentuk pil, kartu minimal 16px, panel besar 32-40px.

---

## 2. Palet Warna (Color Palette Tokens)

Token didefinisikan di `src/app/globals.css`. Nama token mengikuti perannya.

| Token | Hex | Penggunaan |
| :--- | :--- | :--- |
| **`paper`** / **`paper-raised`** | `#04131c` / `#0a1f2c` | Latar halaman / kartu |
| **`brand-950`** | `#f1f9fd` | Judul dan teks utama |
| **`brand-900`** | `#dceff8` | Teks di panel gradasi biru |
| **`brand-800`** | `#a6c8da` | Teks sekunder (jangan di panel gradasi terang) |
| **`brand-700`** | `#7ccdee` | Link. Di panel gradasi hanya untuk teks besar |
| **`brand-600`** | `#3fb0e0` | Focus ring, lingkar kompas |
| **`brand-400`** | `#4a8aa8` | Tepi kontrol (bukan untuk teks) |
| **`brand-300`** | `#17394b` | Garis pemisah |
| **`brand-100`** | `#0e2a3a` | Latar tonal |
| **`fill`** | `#0f6d93` | Isian biru dengan teks putih |
| **`ink`** / **`frost`** | `#04202e` / `#e1f2fa` | Teks dan hover pada permukaan terang |
| **`route`** | `#f08a68` | Garis rute dan jarum kompas |

---

## 3. Skala Tipografi (Typography Scale)

| Utility Class | Weight | Ukuran |
| :--- | :--- | :--- |
| **`text-hero`** | 600 | fluid 40-76px |
| **`text-h-section`** | 600 | fluid 34-56px |
| **`text-h1`** | 600 | fluid 32-46px |
| **`text-h2`** | 600 | fluid 22-28px |
| **`text-h3`** | 600 | 18px |
| **`text-h4`** / **`text-h5`** | 500 | 16px / 14px |
| **`text-lead`** | 400 | 17px |
| **`text-body`** | 400 | 14px |
| **`text-caption`** | 400 | 12px |

---

## 4. Elevasi

Kartu memakai garis `brand-300` atau latar `paper-raised` tanpa bayangan. Jika pengguna mengaktifkan *reduced transparency*, panel kaca menjadi solid.

---

## 5. Katalog Komponen Utama (`src/components/`)

### A. Komponen Antarmuka Form (`src/components/ui/`)
1. **`Button` & `ButtonLink`**:
   - Varian: `primary` (gradasi biru), `pillOnDark` (putih), `outline` (border brand-300), `ghost` (transparan), `danger` (red-600).
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
   - `CommunityHub` & `SocialPostCard`: Feed komunitas dengan filter grup/scope, like, bookmark, dan toggle anonim.
   - `PostComposer` & `ThreadModal`: Pembuat postingan dan panel balasan diskusi yang mendukung mode anonim (*Post as Anonymous* / *Reply as Anonymous*).
   - `CreateCommunityModal`: Modal pembuatan ruang komunitas baru (interactive preview).
   - `PostCard`, `CommentThread`, & `HelpfulButton`: Komponen thread Q&A dengan dukungan upvote & *Accepted Answer*.
2. **Knowledge Hub (`src/components/knowledge/`)**:
   - `CategoryFilter` & `SmartScopeSwitcher`: Pilihan 6 kategori panduan kampus dan scope (`My Program`, `General`, `Browse another program`).
   - `GuideListCard` & `GuideContent`: Kartu daftar dan tampilan baca panduan resmi terkurasi beserta badge verifikasi (`VerifiedMeta`) dan peringatan kedaluwarsa.
   - `BookmarkButton` & `RequestGuideModal`: Simpan panduan dan formulir permintaan topik panduan baru.
3. **AI Navigator (`src/components/ai-navigator/`)**:
   - `SampleChat`: Kotak obrolan AI dengan komponen kartu sitasi rujukan `[1]`, `[2]`.

---

## 6. Keamanan & Akses Rute

* **Halaman `/design-system`**:  
  Dibatasi khusus untuk lingkungan pengembangan lokal (`NODE_ENV !== "production"`). Pada server produksi, rute ini secara otomatis mengembalikan status **404 Not Found**, sehingga aset dan skema pengujian internal tidak terekspos ke publik.
