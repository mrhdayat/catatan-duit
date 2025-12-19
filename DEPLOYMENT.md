# Panduan Deployment Catatan Duit (Next.js + Prisma)

Aplikasi ini dibangun menggunakan **Next.js**, yang artinya Frontend dan Backend (Server Actions) sudah menjadi satu paket. Kamu tidak perlu deploy secara terpisah.

Namun, ada satu hal penting: **Database**.
Saat ini kita menggunakan **SQLite** (file `dev.db`), yang cocok untuk lokal tapi **TIDAK BISA** dipakai di hosting serverless seperti Vercel (karena datanya bakal hilang setiap kali deploy).

## Opsi Deployment Terbaik: Vercel + Vercel Postgres

Ini adalah cara termudah dan gratis untuk pemula.

### Langkah 1: Persiapan Database (Postgres)
Karena SQLite tidak bisa dipakai, kita harus switch kembali ke Postgres untuk production.

1.  Buat akun di [Vercel](https://vercel.com).
2.  Install Vercel CLI di terminal: `npm i -g vercel`
3.  Login via terminal: `vercel login`

### Langkah 2: Buat Project di Vercel
Jalankan perintah ini di folder project:
```bash
vercel
```
Ikuti instruksinya (pilih default `Y` untuk semuanya).

### Langkah 3: Koneksikan Database Postgres
1.  Buka Dashboard Project kamu di website Vercel.
2.  Ke tab **Storage** -> Klik **Create Database** -> Pilih **Postgres**.
3.  Beri nama (misal: `catatan-duit-db`) dan create.
4.  Setelah jadi, masuk ke menu **.env.local** di dashboard storage tadi, copy connect stringnya (`POSTGRES_PRISMA_URL` dll).
5.  Atau lebih mudah: Di dashboard project, masuk **Settings** -> **Environment Variables**. Biasanya Vercel otomatis menambahkan variabelnya setela create DB.

### Langkah 4: Sesuaikan Code untuk Production
Kita perlu mengubah `prisma/schema.prisma` agar support Postgres lagi (seperti awal).

**Edit `prisma/schema.prisma`:**
```prisma
datasource db {
  provider = "postgresql" // Ganti dari sqlite
  url      = env("POSTGRES_PRISMA_URL") // Variable dari Vercel
  directUrl = env("POSTGRES_URL_NON_POOLING") // Penting buat Vercel
}
```

**Edit `lib/prisma.ts`:**
Pastikan inisialisasi Prisma Client standar (code yang sekarang sudah aman).

### Langkah 5: Push Database
Jalankan perintah ini untuk sinkronisasi skema ke database Postgres Vercel:
```bash
npx prisma db push
```
*(Pastikan kamu sudah set environment variable `POSTGRES_PRISMA_URL` di file .env lokal kamu kalau mau test connect dari laptop).*

### Langkah 6: Deploy Akhir
Jalankan lagi:
```bash
vercel --prod
```

---

## FAQ

**Q: Kenapa gak bisa pake SQLite aja di Vercel?**
A: Vercel itu "Serverless". Filesystem-nya read-only atau bakal ke-reset setiap function selesai jalan. File `dev.db` kamu bakal abis terus alias balik kosong.

**Q: Kalau mau tetep SQLite?**
A: Kamu harus sewa **VPS** (seperti DigitalOcean Droplet atau Coolify). Di sana kamu bisa hosting file `dev.db` secara permanen. Tapi setup-nya jauh lebih ribet (harus setup Linux, Nginx, PM2, dll).

**Rekomendasinya:** Pakai **Vercel + Postgres** (Free Tier-nya cukup banget buat aplikasi personal).
