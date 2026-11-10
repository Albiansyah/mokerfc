# MOKER FC UNITED: BRIEF LENGKAP UNTUK CODING AGENT

Satu file berisi: router agent, arah desain, spesifikasi halaman, struktur direktori + script scaffold, skema data, dan Delivery Gate.
Taruh file ini di root proyek bersama `ANTISLOP.md`. Agent wajib membaca keduanya sebelum menulis kode.

## 0. Urutan kerja agent (wajib)

1. Baca file ini sampai habis, lalu baca `ANTISLOP.md` sebagai filter.
2. Nyatakan satu baris Pembacaan Desain (lihat bagian 2).
3. Inisialisasi proyek (jika belum): 
   `npx create-next-app@latest moker-fc --typescript --tailwind --app --src-dir --eslint --import-alias "@/*"`
4. Jalankan script scaffold di bagian 4 untuk membuat semua direktori dan file awal. Script hanya membuat file yang belum ada, tidak menimpa.
5. Isi setiap file stub dengan implementasi nyata. Tidak boleh ada stub yang tertinggal kosong.
6. Build, jalankan, uji, lalu kirim laporan Delivery Gate (bagian 9).

## 1. Konteks, aset, dan keputusan arsitektur

**Klub**: Moker FC United (@mfc.utd), klub mini soccer dari Mojokerto (Moker = Mojokerto), berdiri 2024. Klub **terbuka untuk publik**: siapa saja boleh bergabung.
**Audiens**: calon pemain (termasuk pemula), klub lain yang mengajak sparring, penonton lokal.
**Tujuan situs**: memperkenalkan klub, menampilkan jadwal laga terdekat, memajang galeri, memudahkan orang bergabung atau mengajak sparring lewat WhatsApp.

**Aset dan data nyata**
- Logo: `public/brand/logo-full.png` (atau `.svg`), latar transparan. Pakai apa adanya, jangan digambar ulang. Jika file belum ada: tampilkan teks "Moker FC United" bertipografi heading dengan komentar `// TODO: ganti logo`.
- Instagram: @mfc.utd (https://instagram.com/mfc.utd)
- WhatsApp admin: 081615334069 (Admin 1) dan 081228933141 (Admin 2). Format link: 6281615334069 dan 6281228933141.
- Email: mokerfc2026@gmail.com
- Pembayaran: Bank BRI, 6408 0101 2984 501, a.n. Ahmad Mauludin
- Tagline: tidak ada. Jangan dibuat.
- Skuad, sponsor, prestasi, statistik, testimoni, skor, biaya, jadwal latihan, lapangan: belum ada. Jangan dibuat.

**Keputusan arsitektur: TANPA BACKEND**
- Situs statis. Konten dari `content/*.json` saat build. Tidak ada database, API route, atau CMS.
- Pendaftaran dan sparring dikirim lewat link WhatsApp (`wa.me`) dan `mailto:` yang terisi otomatis. Bukti transfer dikirim user langsung di chat WhatsApp, jadi tidak ada fitur upload.
- Tidak ada data diri yang disimpan atau dikirim oleh situs ini. Jangan tambah analytics yang melacak individu, jangan tambah endpoint.
- Update konten oleh pemilik: edit JSON di GitHub (web editor) lalu commit, Vercel deploy otomatis. Foto ditaruh di `public/gallery/<album>/`.
- Jangan menambah backend, auth, atau database kecuali diminta eksplisit.

**Stack**: Next.js (App Router) + TypeScript + Tailwind CSS, deploy ke Vercel (subdomain Vercel dulu). Font lewat `next/font`: Barlow Condensed + Barlow. Tanpa library UI besar dan tanpa library animasi berat.

## 2. Arah desain

**Pembacaan Desain (nyatakan sebelum menulis kode)**
> Membaca ini sebagai: company profile klub mini soccer terbuka untuk pemain, calon anggota, klub lawan, dan penonton lokal, dengan gaya sporty-heritage minimalis berbasis lambang logo, dial ENERGI 2 / RITME 3 / GERAK 2.

**Dial**: ENERGI 2 (bertenaga tapi simple), RITME 3 (tiap section komposisi berbeda), GERAK 2 (hover + scroll-reveal halus + satu countdown).

**Palette (R-29)**. Hex estimasi dari gambar logo, verifikasi dengan eyedropper dari file asli lalu kunci di `tokens.css`.

| Token | Hex | Peran |
|---|---|---|
| `--navy` | #0F1F3D | Inti. Teks utama, section gelap |
| `--red` | #D4161C | Inti. Tombol utama, penanda laga |
| `--paper` | #F7F4EE | Netral. Latar default |
| `--gold` | #D4A94F | Aksen tunggal. Keyline, ornamen kecil |

- Emas hanya untuk garis dan ornamen, atau di atas navy. Jangan jadi warna teks di atas terang.
- Tanpa gradient, glow, glassmorphism, background grid. Hierarchy lewat blok warna datar dan keyline.

**Motif identitas**
1. Sudut chamfer (potongan miring) dari banner dan bevel perisai. Dipakai di tombol, card, label, lightbox. Token `--chamfer: 12px`. Radius bukan pil (R-11).
2. Siluet candi berundak dari logo, satu warna, sebagai pemisah section dan elemen hero. Maksimal 2 kemunculan per halaman.
3. Keyline emas 1px sebagai satu-satunya dekorasi garis.

**Tipografi (R-06)**
- Heading: Barlow Condensed bold/semibold, meniru huruf tebal banner "MOKER FC" (terasa jersey/matchday). Uppercase hanya untuk heading pendek.
- Body: Barlow, minimal 16px di mobile.
- Tanggal dan skor: Barlow Condensed tabular, besar (motif papan skor).
- Dilarang: monospace estetika, label uppercase tracking lebar.

**Ritme section (RITME 3)**
- Hero: asimetris, foto aksi terpotong chamfer, matchday card menimpa sudut foto.
- Cerita klub: satu kolom sempit, teks besar, tanpa card.
- Strip acara: baris horizontal, tanggal besar kiri, detail kanan. Bukan grid kartu.
- Galeri: grid asimetris (satu besar, beberapa kecil).
- Ajakan gabung: blok navy penuh dengan siluet candi.
- Footer: satu baris ringkas, bukan 4 kolom.

**Komponen**
- Tombol utama: merah solid, teks putih, chamfer, tinggi minimal 48px. Sekunder: outline navy.
- Label status/jenis acara: chamfer kecil, hanya bila nyata dari data.
- Shadow hanya untuk lightbox dan menu mobile (elevation nyata).
- Ikon hanya yang relevan (kalender, lokasi, WhatsApp, salin, tutup, panah lightbox). Tanpa sparkle, bintang, petir.
- Arrow hanya pada navigasi lightbox dan "Lihat semua".

**Gerak**
- Hover dan focus state di semua elemen interaktif.
- Scroll-reveal (fade 200ms, geser 8px) hanya pada heading section dan strip acara. Hormati `prefers-reduced-motion`.
- Satu momen hidup: countdown laga terdekat di matchday card.
- Tanpa floating, bounce, parallax.

**Tema**: light default (paper + navy), toggle light/dark wajib berfungsi penuh di KEDUA mode (R-34). Dark: latar navy, teks paper, merah dan emas tetap aksen. Pilihan disimpan di localStorage dengan try/catch, ikuti `prefers-color-scheme` saat pertama kali.

**Satu titik fokus per layar**: Hero = matchday card. Acara = acara terdekat. Galeri = foto unggulan. Gabung = tombol WhatsApp.

## 3. Halaman dan isi

Navbar hanya berisi halaman yang nyata: **Beranda, Acara, Galeri, Gabung, Sparring**. Tombol utama navbar: "Chat Admin" (WhatsApp).

### `/` Beranda
1. **Hero**: matchday card laga terdekat (tanggal besar, jam, lokasi, countdown, tombol "Tambah ke Kalender"). Foto aksi dari galeri; jika kosong, blok navy + siluet candi. Tanpa tagline. Empty state: "Jadwal laga berikutnya segera diumumkan" + tombol WhatsApp.
2. **Tentang klub**: dari `club.json` (`about`). Sebut: dari Mojokerto, berdiri 2024, terbuka untuk publik. Jangan karang sejarah.
3. **Strip acara**: maksimal 3 acara terdekat + link "Lihat semua acara".
4. **Galeri**: grid asimetris 5 foto + link "Lihat semua foto". Empty state jika kosong.
5. **Ajakan gabung**: blok navy, penjelasan singkat siapa saja boleh ikut, tombol "Daftar via WhatsApp".
6. **Footer** satu baris: logo kecil, @mfc.utd, WhatsApp, email, lokasi (jika ada data).

### `/acara`
- Tab **Mendatang / Selesai** (keyboard: panah kiri/kanan, Enter).
- Jenis (`type`): `pertandingan` atau `internal`, tampil sebagai label teks kecil.
- Hanya jadwal: judul, tanggal, jam, lokasi, jenis, catatan. Jangan tampilkan skor atau lawan kecuali field-nya ada.
- **Tambah ke Kalender**: file `.ics` dibuat di sisi klien, zona Asia/Jakarta, berisi judul, lokasi, deskripsi. Jika `endTime` kosong, asumsi durasi 90 menit dan tulis di deskripsi.
- **Tanya Admin**: WhatsApp dengan pesan terisi nama acara dan tanggal.
- `/acara/[slug]`: detail satu acara + metadata Open Graph.
- Empty, loading (skeleton sederhana), dan error state di tiap tab.

### `/galeri`
- Upload manual: foto di `public/gallery/<album>/`, didaftarkan di `content/gallery.json`.
- Filter per album (chip/tab keyboard-friendly).
- Grid asimetris, `next/image`, lazy, dimensi tetap, `alt` wajib dari data.
- **Lightbox**: buka klik/Enter, tutup Escape, panah kiri/kanan, focus trap, fokus kembali ke thumbnail, swipe di mobile.
- Empty state dan error state (gambar gagal: placeholder + "Foto tidak bisa dimuat").

### `/gabung`
1. **Alur** (daftar bernomor besar gaya papan skor, bukan 3 ikon bulat):
   - Chat admin lewat WhatsApp.
   - Kirim data diri: nama lengkap, usia, posisi yang diminati, nomor WhatsApp aktif.
   - Transfer ke rekening klub, kirim bukti transfer di chat yang sama.
2. Dua tombol "Chat Admin": Admin 1 dan Admin 2, pesan terisi (bagian 5).
3. **Blok pembayaran**: BRI, nomor, a.n. Tombol **Salin nomor** (Clipboard API, fallback `execCommand`, feedback "Tersalin" terlihat dan lewat `aria-live`). Data dari `club.json`.
4. **Biaya dan jadwal latihan**: jika `fee`/`trainingSchedule` null, tampilkan "Info biaya dan jadwal latihan ditanyakan ke admin". Jangan karang nominal.

### `/sparring`
- Field: nama klub (wajib), penanggung jawab (wajib), nomor WhatsApp (wajib, validasi angka), usulan tanggal (wajib), usulan jam, usulan lokasi, jumlah pemain, catatan.
- Validasi sisi klien: pesan error per field (teks, bukan hanya warna), label terhubung, `aria-invalid`, fokus ke field error pertama.
- Submit membuka WhatsApp admin dengan semua data. Tombol sekunder "Kirim lewat email" (mailto terisi).
- State sukses: ringkasan pesan + "Jika WhatsApp tidak terbuka, salin pesan ini" dengan tombol salin.
- Radio pilih admin (Admin 1 / Admin 2).

### Halaman sistem
- `not-found.tsx`, `error.tsx`, `loading.tsx` bergaya brand.
- `sitemap.ts`, `robots.ts`, Open Graph per halaman (gambar OG dari logo atau foto, bukan generate AI).

### Tidak dibuat sekarang
- `/tim`: belum ada data, klub terbuka.
- `/sponsor`: draf, noindex, tidak di navbar, label "[DRAF: belum ada sponsor]". Boleh dilewati. Jangan karang paket, harga, logo sponsor.

## 4. Struktur direktori dan script scaffold

```
moker-fc/
├─ AGENTS.md  (opsional, salin bagian 0 dan 7 file ini)
├─ MOKER-FC-BRIEF.md
├─ ANTISLOP.md
├─ content/
│  ├─ club.json
│  ├─ events.json
│  └─ gallery.json
├─ public/
│  ├─ brand/              # logo-full, logo-mark, favicon, og-image
│  └─ gallery/            # <album>/foto
└─ src/
   ├─ app/
   │  ├─ layout.tsx, page.tsx, globals.css
   │  ├─ acara/page.tsx, acara/[slug]/page.tsx
   │  ├─ galeri/page.tsx
   │  ├─ gabung/page.tsx
   │  ├─ sparring/page.tsx
   │  ├─ sponsor/page.tsx   # draf, noindex
   │  ├─ loading.tsx, error.tsx, not-found.tsx
   │  └─ sitemap.ts, robots.ts
   ├─ components/
   │  ├─ ui/        Button, Tabs, Dialog, CopyButton, Field, Label
   │  ├─ sections/  Hero, MatchdayCard, About, EventStrip, GalleryGrid, JoinBlock
   │  └─ layout/    Header, Footer, MobileMenu, ThemeToggle, SkipLink
   ├─ lib/          content.ts, dates.ts, ics.ts, whatsapp.ts, types.ts
   └─ styles/       tokens.css
```

Jalankan dari root proyek (setelah `create-next-app`). Script ini membuat direktori dan file awal, tidak menimpa file yang sudah ada. Ini scaffold file baru, bukan patching (R-33).

```bash
#!/usr/bin/env bash
set -e

mk() { # mk <path> <isi>  : buat file hanya jika belum ada
  if [ ! -e "$1" ]; then
    mkdir -p "$(dirname "$1")"
    printf '%s\n' "$2" > "$1"
  fi
}
stub() { mk "$1" "// TODO: implement sesuai MOKER-FC-BRIEF.md
export {};"; }

# direktori
mkdir -p content public/brand public/gallery \
  src/app/acara/\[slug\] src/app/galeri src/app/gabung src/app/sparring src/app/sponsor \
  src/components/ui src/components/sections src/components/layout src/lib src/styles

# konten (data nyata saja, sisanya null atau kosong)
mk content/club.json '{
  "name": "Moker FC United",
  "handle": "@mfc.utd",
  "instagram": "https://instagram.com/mfc.utd",
  "founded": 2024,
  "city": "Mojokerto",
  "about": null,
  "admins": [
    { "label": "Admin 1", "wa": "6281615334069", "display": "0816 1533 4069" },
    { "label": "Admin 2", "wa": "6281228933141", "display": "0812 2893 3141" }
  ],
  "email": "mokerfc2026@gmail.com",
  "payment": { "bank": "BRI", "number": "6408 0101 2984 501", "holder": "Ahmad Mauludin" },
  "fee": null,
  "trainingSchedule": null,
  "venue": null
}'
mk content/events.json '[]'
mk content/gallery.json '{ "albums": [] }'

# tokens
mk src/styles/tokens.css ':root {
  --navy: #0F1F3D;
  --red: #D4161C;
  --paper: #F7F4EE;
  --gold: #D4A94F;
  --chamfer: 12px;
}
/* TODO: dark mode tokens, verifikasi hex dari logo asli */'

# lib
for f in content dates ics whatsapp types; do stub "src/lib/$f.ts"; done

# components
for f in Button Tabs Dialog CopyButton Field Label; do stub "src/components/ui/$f.tsx"; done
for f in Hero MatchdayCard About EventStrip GalleryGrid JoinBlock; do stub "src/components/sections/$f.tsx"; done
for f in Header Footer MobileMenu ThemeToggle SkipLink; do stub "src/components/layout/$f.tsx"; done

# routes (layout.tsx, page.tsx, globals.css sudah dibuat create-next-app, jangan ditimpa)
for r in acara galeri gabung sparring sponsor; do stub "src/app/$r/page.tsx"; done
stub "src/app/acara/[slug]/page.tsx"
for f in loading error not-found sitemap robots; do stub "src/app/$f.ts"; done
mv -n src/app/loading.ts src/app/loading.tsx 2>/dev/null || true
mv -n src/app/error.ts src/app/error.tsx 2>/dev/null || true
mv -n src/app/not-found.ts src/app/not-found.tsx 2>/dev/null || true

echo "Scaffold selesai. Isi semua file stub sebelum build."
```

Aturan setelah scaffold:
- Stub `// TODO` dan `export {};` hanya penanda awal. Semua harus diganti implementasi nyata sebelum penyerahan.
- `events.json` dan `gallery.json` sengaja kosong supaya empty state teruji. Untuk menguji state berisi, pakai data uji sementara dan **hapus sebelum penyerahan**.
- `loading`, `error`, `not-found` adalah `.tsx`. Script mengganti ekstensinya, jangan tinggalkan versi `.ts`.

## 5. Skema data dan pesan otomatis

`content/events.json` (array, tiap entri):
```json
{
  "slug": "string-unik",
  "title": "string",
  "type": "pertandingan | internal",
  "date": "YYYY-MM-DD",
  "startTime": "HH:mm",
  "endTime": "HH:mm | null",
  "venue": "string",
  "note": "string | null"
}
```
Status Mendatang/Selesai dihitung dari tanggal, bukan diketik manual.

`content/gallery.json`:
```json
{
  "albums": [
    {
      "slug": "string-unik",
      "title": "string",
      "date": "YYYY-MM-DD",
      "photos": [{ "src": "/gallery/<album>/01.jpg", "alt": "deskripsi", "w": 1600, "h": 1067 }]
    }
  ]
}
```

`src/lib/content.ts` memvalidasi JSON dan mengembalikan state error (bukan crash) jika format rusak.

**Pesan WhatsApp** (`encodeURIComponent`, builder di `whatsapp.ts`):
- Gabung:
  "Halo admin Moker FC United, saya mau bergabung.
  Nama lengkap:
  Usia:
  Posisi yang diminati:
  Nomor WhatsApp:
  Bukti transfer saya lampirkan di chat ini."
- Tanya acara: "Halo admin, saya mau tanya soal acara: {judul} ({tanggal})."
- Sparring: "Halo admin Moker FC United, kami dari klub {nama klub} mengajak sparring." diikuti semua field form, satu per baris.

## 6. Aturan data, state, aksesibilitas, responsif

**Data (R-17, R-18, R-36, R-38)**
- Tidak ada angka, statistik, testimoni, skor, nama pemain, sponsor, biaya, atau jadwal yang tidak ada di brief ini.
- Tidak ada FAQ untuk sekarang.
- Tidak ada klaim "klub terbaik", "terpercaya", dan sejenisnya.
- Data kosong = empty state jujur atau `[REAL DATA]`.

**State**: empty, loading, error untuk acara, galeri, dan konten JSON.

**Aksesibilitas**
- Keyboard penuh: Tab/Shift+Tab, Enter/Space, Escape untuk dialog dan lightbox. Focus ring terlihat (tidak ada `outline: none` tanpa pengganti).
- Skip link "Lewati ke konten".
- Kontras WCAG AA di kedua tema. Teks di atas foto pakai overlay solid, bukan gradient.

**Responsif**: mobile-first, uji 360px dan 390px. Tanpa overflow horizontal, tap target minimal 44px, menu mobile bisa dibuka/ditutup (Escape, fokus kembali ke tombol).

**Performa**: `next/image`, font `display: swap`, tanpa library animasi berat.

## 7. Aturan keras untuk agent (inti AGENTS.md)

- Dilarang em dash di teks apa pun (R-02). Pakai koma, titik, titik dua, atau kurung.
- Tanpa buzzword. Tanpa CTA generik (Get Started, Learn More, dst). CTA spesifik: "Chat Admin", "Daftar via WhatsApp", "Tambah ke Kalender", "Ajak Sparring".
- Tanpa gradient, glow, glassmorphism, background grid, badge kapsul "New/AI", ilustrasi Undraw/Storyset.
- Tanpa tombol atau link mati. Elemen tanpa tujuan dihapus.
- Navbar hanya halaman yang ada (R-24).
- Tanpa script patch yang menulis ulang file atau CSS (R-33). Tulis langsung di source.
- Logo asli dipakai apa adanya. Jangan gambar ulang atau karang aset.
- Nomor rekening dan WhatsApp hanya ada di `content/club.json`, komponen membacanya dari sana.
- Tanpa backend, auth, database, atau endpoint kecuali diminta eksplisit.

## 8. Alasan keputusan (R-31)

Sebelum menyerahkan, tulis alasan satu baris untuk: warna, layout hero, tipografi, spacing, penggunaan card (atau tidak), ikon, dan motif candi.

## 9. Delivery Gate

Jalankan `npm run build` dan `npm run lint`, buka situs, uji semua elemen interaktif, kedua tema, dan mobile 360px. Lampirkan laporan PASS/FAIL per blok (Hard Gate, Purpose-Gate, Liveliness, Craftsmanship) sesuai `ANTISLOP.md`, setiap PASS dengan bukti konkret. Tambahan cek khusus proyek ini:
- Link WhatsApp, mailto, dan unduhan `.ics` benar-benar terbuka dan isinya benar.
- Tombol salin nomor rekening berfungsi dan memberi feedback.
- Lightbox: Escape, panah, focus trap, fokus kembali.
- Tidak ada em dash: `grep -rn "—" src content` hasilnya kosong.
- Tidak ada data uji tersisa di `content/`.

Jika ada FAIL, perbaiki dulu dan jalankan ulang. Jangan serahkan dengan FAIL.
