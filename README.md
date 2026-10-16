# Storan Dashboard — Root GitHub + Vercel

Folder ini sudah disusun agar isi proyek berada langsung di ROOT repository GitHub. File utama website adalah `index.html` (bukan di dalam folder `public`). Tampilan HTML asli disalin tanpa perubahan.

## Struktur root

- `index.html` — halaman dashboard asli
- `api/` — Vercel Functions untuk signup, login, dan validasi sesi
- `supabase/schema.sql` — skema database akun
- `package.json` — dependensi backend
- `vercel.json` — konfigurasi Vercel
- `.env.example` — nama environment variables contoh

## 1. Siapkan database Supabase

1. Buat project di https://supabase.com/.
2. Buka SQL Editor.
3. Jalankan isi `supabase/schema.sql`.
4. Dari Project Settings → API, salin Project URL dan `service_role` key. **Jangan** taruh service role key di `index.html` atau file repository.

## 2. Upload ke GitHub dari HP atau komputer

1. Ekstrak ZIP ini.
2. Buat repository baru di https://github.com/.
3. Buka repository → Add file → Upload files.
4. Pilih SEMUA ISI folder hasil ekstrak, bukan folder pembungkus ZIP. Pastikan `index.html`, `package.json`, `vercel.json`, `api/`, dan `supabase/` terlihat langsung di halaman utama repository.
5. Klik Commit changes. Jangan unggah file `.env` yang berisi rahasia; `.env.example` aman.

## 3. Deploy ke Vercel

1. Buka https://vercel.com/ lalu impor repository GitHub tersebut.
2. Tambahkan Environment Variables berikut di Project Settings → Environment Variables:
   - `SUPABASE_URL` = Project URL Supabase
   - `SUPABASE_SERVICE_ROLE_KEY` = service role key (rahasia)
   - `AUTH_SECRET` = string acak rahasia minimal 32 karakter
3. Deploy. Jika sudah pernah deploy, lakukan redeploy setelah mengatur environment variables.
4. Endpoint backend tersedia di `/api/auth/signup`, `/api/auth/login`, dan `/api/auth/me`.

## Status fitur dan batasan penting

Paket ini menyediakan fondasi API username/password, tetapi **belum merupakan migrasi penuh semua fitur dashboard**. HTML asli masih menggunakan `localStorage` untuk state dashboard seperti saldo, setoran, penarikan, daftar generate, pengaturan admin, dan riwayat. Form HTML juga belum sepenuhnya dihubungkan ke endpoint autentikasi. Jadi jangan gunakan untuk transaksi atau saldo uang sungguhan dulu.

Sebelum produksi, frontend harus dihubungkan ke API auth, lalu semua data penting dan perubahan saldo harus dipindahkan ke database dengan validasi server-side, kontrol akses admin, dan transaksi database yang aman.

## Contoh payload pendaftaran

```json
{
  "username": "pengguna_01",
  "password": "password-yang-kuat",
  "name": "Nama Pengguna",
  "referral": ""
}
```

## Mengatur akun admin

Setelah akun dibuat, jalankan SQL ini di Supabase SQL Editor dengan username yang benar:

```sql
update public.app_users set is_admin = true where username = 'username_anda';
```

Jangan memberikan hak admin otomatis kepada pendaftar pertama.
