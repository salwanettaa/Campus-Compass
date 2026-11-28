# Campus Compass — Design System & Component Library

> **Sumber Kebenaran**: `ref.pdf` (Design Reference), [`AGENTS.md`](../AGENTS.md), and `src/app/globals.css`.  
> **Status**: Internal Technical Documentation & Component Guide.  
> **Akses Lokal**: Halaman showcase interaktif dapat diakses pada saat development lokal di `http://localhost:3000/design-system` (dinonaktifkan pada mode produksi demi keamanan).

---

## 1. Prinsip Desain & Visual Direction

Identitas: **tema terang yang tenang dan tegas**: permukaan putih, aksen biru langit, teks slate, dengan kompas dan garis rute sebagai motif. Berlaku di semua halaman.

* **Hierarki** dibentuk oleh ukuran, bobot, dan jarak. Kartu putih di atas latar `paper`, dipisah garis 1px `brand-300`.
* **Satu aksi utama per tampilan** (tombol biru isi). Aksi lain memakai `outline` atau tautan.
* **Tanpa** gradasi CSS dan glow. Bayangan (`shadow-overlay`) hanya untuk lapisan mengambang: dialog, Quick jump, menu bawah HP, dan kartu di atas artwork.
* **Glass** (`glass-card`) hanya untuk dua kartu di atas artwork halaman login dan register.
* **Tipografi**: Wix Madefor Display untuk semua teks.
* **Kompas**: dial interaktif di landing (`CompassFinder`) dan `CompassRing` di Home serta halaman auth. `CompassRing` menunjukkan pilihan, bukan skor.
* **Oranye `route`** hanya untuk jarum kompas, garis rute, dan penanda arah atau pertanyaan.
* **Sudut**: tombol dan input `rounded-lg` (8px), kartu `rounded-xl` (12px), panel besar `rounded-2xl`. Pil (`rounded-full`) hanya untuk label, avatar, dan titik di dial.
* **Gerak**: kelas `press` memberi respons tekan 150ms. Semua gerak mati saat *reduced motion* aktif.

### Logo
`LogoMark` (`src/components/ui/logo-mark.tsx`): huruf C yang terbuka dengan jarum kompas keluar lewat celahnya. Cincin mengikuti warna teks, jarum selalu oranye (`#ea580c`, atau `#fb923c` di latar gelap). Favicon ada di `src/app/icon.svg`. Jangan diputar, diberi efek, atau diganti warnanya.

### Artwork
`public/art/compass-flow.jpg`: pita biru dengan satu garis rute oranye, dibuat khusus untuk proyek ini. Dipakai di hero landing, panel penutup landing, dan halaman auth. Teks di atasnya harus berada di kartu, atau berupa judul besar putih di sudut kiri atas yang gelap.

### Peta rute
`RouteMap` (`src/components/journey/route-map.tsx`) menggambar tahap My Journey sebagai rute, dengan `LogoMark` sebagai penanda "You are here". Semua angkanya dari data journey asli. Dipakai di Home dan My Journey.

### Quick jump
`QuickJumpDialog` dipasang sekali di `(dashboard)/layout.tsx`. `QuickJumpButton` boleh dipakai di mana saja. Dibuka dengan **Ctrl/Cmd + K**. Halaman baru perlu ditambahkan ke daftar `DESTINATIONS` di `quick-jump.tsx`.

---

## 2. Palet Warna (Color Palette Tokens)

Token didefinisikan di `src/app/globals.css`. Nama token mengikuti perannya.

| Token | Hex | Penggunaan |
| :--- | :--- | :--- |
| **`paper`** / **`paper-raised`** | `#f8fafc` / `#ffffff` | Latar halaman / kartu |
| **`brand-950`** | `#0f172a` | Judul dan teks utama |
| **`brand-900`** | `#1e293b` | Teks kuat, isian gelap berteks putih |
| **`brand-800`** | `#475569` | Teks sekunder |
| **`brand-700`** | `#0369a1` | Link dan teks aksen |
| **`brand-600`** | `#0284c7` | Focus ring, lingkar kompas |
| **`brand-400`** | `#7c8ba1` | Tepi kontrol (bukan untuk teks) |
| **`brand-300`** | `#e2e8f0` | Garis pemisah |
| **`brand-100`** | `#e8f5fd` | Latar azure: item aktif, hover |
| **`fill`** | `#0369a1` | Isian biru dengan teks putih |
| **`ink`** / **`frost`** | `#0f172a` / `#f3f9fe` | Slate gelap / azure paling tipis |
| **`route`** | `#c2410c` | Jarum kompas dan garis rute |

---

## 3. Skala Tipografi (Typography Scale)

| Utility Class | Weight | Ukuran |
| :--- | :--- | :--- |
| **`text-welcome`** | 500 | fluid 34-48px, sapaan di login dan register |
| **`text-hero`** | 700 | fluid 38-64px |
| **`text-h-section`** | 700 | fluid 28-40px |
| **`text-h1`** | 700 | fluid 26-34px |
| **`text-h2`** | 600 | fluid 20-24px |
| **`text-h3`** | 600 | 17px |
| **`text-h4`** | 600 | 15px |
| **`text-h5`** | 500 | 14px |
| **`text-lead`** | 400 | 17px |
| **`text-body`** | 400 | 14px |
| **`text-caption`** | 400 | 12px |

Input memakai 16px di HP agar iOS tidak memperbesar halaman saat fokus. Kelas tipografi baru harus didaftarkan di `src/lib/utils.ts`.

---

## 4. Elevasi

Kartu memakai garis `brand-300` tanpa bayangan. `shadow-overlay` hanya untuk lapisan yang benar-benar mengambang.

---

## 5. Katalog Komponen Utama (`src/components/`)

### A. Komponen Antarmuka Form (`src/components/ui/`)
1. **`Button` & `ButtonLink`**:
   - Varian: `primary` (biru isi), `outline` (putih bergaris), `ghost` (transparan).
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
