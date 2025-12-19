# CATATAN DUIT 💸 (Markas Keuangan Lo)

Woi, selamat datang di **Catatan Duit**! Aplikasi pencatat keuangan paling **brutal**, paling **jujur**, dan paling **gak pake basa-basi**. Buat lo yang dompetnya sering bocor alus tapi males pake aplikasi ribet, gass pake ini!

![Banner](https://img.shields.io/badge/STYLE-BRUTALISM-black?style=for-the-badge) ![Tech](https://img.shields.io/badge/POWERED_BY-NEXT.JS-white?style=for-the-badge&logo=next.js&logoColor=black)

---

## 🔥 FITUR-FITUR SAKTI

### 1. **DASHBOARD SKELETON & NORMAL**
*   **Normal Mode**: Liat semua dosa (pengeluaran) dan pahala (pemasukan) lo secara transparan.
*   **Skeleton Mode (Survival)**: Klik tombol "MISKIN MODE" buat nyaring cuma pengeluaran PENTING/ESSENTIAL aja. Berguna banget pas tanggal tua biar gak stress liat jajan boba.

### 2. **ANALISA SKELETON (GAUGE METER)**
Indikator canggih yang bakal nge-judge lo secara live:
*   **Hijau**: "AMAN TERKENDALI" (Lo pinter ngatur duit).
*   **Kuning**: "MULAI WASPADA" (Hati-hati, lampu kuning).
*   **Merah**: "JEBOL BOS!!!" (Tobat woi!).
*   Kalau **Mode Survival** nyala, dia bakal ngitung seberapa efisien hidup lo (Rasio Essensial).

### 3. **LOCK BUDGET**
Set limit bulanan lo biar gak kalap. Kalau lewat, indikator bakal teriak merah. Tapi kita kasih fitur "0" buat yang ngerasa sultan (unlimited).

### 4. **STATISTIK**
Grafik batang simpel buat ngeliat duit lo lari ke mana aja. Kategori **ESSENTIAL** bakal nyala ijo neon biar lo tau mana prioritas.

### 5. **AUDIT LOG**
Setiap lo nambah, ngedit, atau ngehapus transaksi, jejak digital lo kecatet. Gak ada istilah "Lupa ingatan".

---

## 🛠 TEKNOLOGI YANG DIPAKE (BUAT ANAK IT)

Aplikasi ini dibangun pake stack yang gak kaleng-kaleng:

*   **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Actions).
*   **Database**: [PostgreSQL](https://www.postgresql.org/) (Hosted di Neon/Vercel).
*   **ORM**: [Prisma](https://www.prisma.io/) (Type-safe banget).
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Penuh dengan `border-2`, `uppercase`, `font-mono`).
*   **Auth**: [NextAuth.js](https://next-auth.js.org/) (Aman sentosa).
*   **Chart**: [Recharts](https://recharts.org/) (Buat grafik batang itu loh).
*   **Animations**: [Framer Motion](https://www.framer.com/motion/) (Biar transisinya mulus kayak jalan tol).

---

## 🚀 CARA INSTALL LOKAL (BUAT YG MAU OPREK)

1.  **Clone Repo Ini**
    ```bash
    git clone https://github.com/mrhdayat/catatan-duit.git
    cd catatan-duit
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    # atau
    pnpm install
    ```

3.  **Setup Database (Lokal)**
    Secara default repo ini disetting buat **Postgres**. Kalau mau jalanin lokal tanpa internet (SQLite), ubah `schema.prisma`:
    ```prisma
    provider = "sqlite"
    url      = "file:./dev.db"
    ```
    Lalu jalanin:
    ```bash
    npx prisma generate
    npx prisma db push
    ```

4.  **Jalanin Server**
    ```bash
    npm run dev
    ```
    Buka `http://localhost:3000` di browser.

---

## 🌍 DEPLOYMENT (VERCEL)

Gampang banget deploy ini:

1.  Push ke GitHub.
2.  Import project di Vercel.
3.  Vercel bakal otomatis nawarin bikin Database Postgres (Pilih **Neon**).
4.  Isi Environment variable `NEXTAUTH_SECRET` (Wajib, isi asal aja yg penting panjang).
5.  **DONE!** Aplikasi lo online.

---

## ⚠️ DISCLAIMER
Aplikasi ini menggunakan bahasa santai/gaul. Kalau lo tersinggung dibilang "MISKIN MODE", mohon maaf, ini fitur biar kita sadar diri 🤣.

---

**Dibuat dengan 💻 & ☕ oleh [DracoSeven](https://github.com/mrhdayat)**
