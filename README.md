# Gemini AI API Project

Proyek chat-asisten berbasis **Google Gemini AI** dengan fitur rekomendasi produk. Project ini terdiri dari **backend
** (Node.js + Express) dan **frontend** (React + Vite + Tailwind CSS).

## Fitur

- Chat asisten AI menggunakan Google Gemini
- Rekomendasi produk berdasarkan konteks chat
- Fallback otomatis ke beberapa model Gemini
- Rate limiting pada API
- Antarmuka responsif dengan Tailwind CSS

## Screenshot

![Desain landing page sederhana simulasi customer chat bot ](/images/3.png)
![Desain landing page sederhana simulasi customer chat bot ](/images/1.png)
![Desain landing page sederhana simulasi customer chat bot ](/images/2.png)
![Desain landing page sederhana simulasi customer chat bot ](/images/4.png)

> hasil response chat:
> Halo! Saya Nusa dari Toko Nusantara. Terima kasih telah menghubungi kami.

Berikut adalah informasi mengenai opsi dan estimasi pengiriman di Toko Nusantara:

* **Opsi Kurir:** Kami melayani pengiriman ke seluruh wilayah Indonesia melalui kurir rekanan kami, yaitu **JNE, J&T,
  SiCepat, dan Anteraja**.
* **Waktu Pemrosesan:** Pesanan Anda akan diproses maksimal 1x24 jam pada hari kerja setelah pembayaran dikonfirmasi.
* **Estimasi Pengiriman:**
    * **Pulau Jawa:** 1 - 3 hari kerja.
    * **Luar Pulau Jawa:** 3 - 7 hari kerja.
* **Informasi Tambahan:**
    * Ongkos kirim dihitung otomatis berdasarkan berat produk dan alamat tujuan.
    * Nikmati **gratis ongkir** untuk pembelian minimal **Rp 500.000** di area tertentu.
    * Nomor resi pengiriman akan dikirimkan melalui email dan WhatsApp setelah paket diserahkan ke pihak kurir.

Jika ada hal lain atau produk tertentu yang ingin ditanyakan, silakan beri tahu Nusa ya!.

## Struktur Project

```
gemini-ai-api-project/
├── backend/          # API server (Node.js + Express)
├── frontend/         # UI (React + Vite)
└── README.md
```

## Prasyarat

- [Node.js](https://nodejs.org/) versi 18 ke atas
- [Google AI API Key](https://aistudio.google.com/apikey)
- npm (biasanya sudah termasuk di Node.js)

## Cara Clone Repository

```bash
git clone <url-repository>
cd gemini-ai-api-project
```

## Instalasi Package

### 1. Backend

```bash
cd backend
npm install
```

Dependencies yang diinstal:

| Package              | Keterangan                                 |
|----------------------|--------------------------------------------|
| `@google/genai`      | SDK resmi Google Gemini AI                 |
| `express`            | Framework web untuk API server             |
| `cors`               | Mengizinkan request lintas origin          |
| `dotenv`             | Load variabel environment dari file `.env` |
| `express-rate-limit` | Pembatasan jumlah request API              |
| `multer`             | Middleware untuk upload file               |
| `nodemon`            | Auto-restart server saat ada perubahan     |

#### Konfigurasi `.env`

Salin file `.env.example` (atau buat file baru bernama `.env`) di dalam folder `backend`:

```bash
cd backend
cp .env.example .env
```

Isi file `.env` sebagai berikut:

```env
GOOGLE_AI_MODEL="gemini-3.6-flash"
GOOGLE_AI_MODEL_FALLBACKS="gemini-3.5-flash,gemini-flash-latest,gemini-3.1-flash-lite"
GOOGLE_AI_API_KEY=<TEMPATKAN_API_KEY_ANDA>
PORT=3000
CONTEXT_PRODUCT_LIMIT=8
AI_MAX_ATTEMPTS_PER_MODEL=2
```

#### Jalankan Backend

```bash
cd backend
npm run dev
```

Server berjalan di `http://localhost:3000`.

### 2. Frontend

```bash
cd frontend
npm install
```

Dependencies yang diinstal:

| Package             | Keterangan                              |
|---------------------|-----------------------------------------|
| `react`             | Library UI utama                        |
| `react-dom`         | Render React ke DOM                     |
| `react-markdown`    | Render output AI dalam format markdown  |
| `lucide-react`      | Kumpulan ikon SVG                       |
| `tailwindcss`       | Framework CSS utility-first             |
| `@tailwindcss/vite` | Plugin Tailwind untuk Vite              |
| `vite`              | Build tool / dev server (devDependency) |
| `eslint` & plugins  | Linter kode (devDependency)             |

#### Jalankan Frontend

```bash
cd frontend
npm run dev
```

Frontend berjalan di `http://localhost:5173` dan sudah terproksi ke backend di `http://localhost:3000` (port backend
tidak perlu diubah).

## Menjalankan Kedua Server

Buka **dua terminal** terpisah:

| Terminal | Perintah                   | URL                   |
|----------|----------------------------|-----------------------|
| 1        | `cd backend; npm run dev`  | http://localhost:3000 |
| 2        | `cd frontend; npm run dev` | http://localhost:5173 |

## Script yang Tersedia

### Backend

| Script        | Deskripsi                         |
|---------------|-----------------------------------|
| `npm run dev` | Menjalankan server dengan nodemon |

### Frontend

| Script            | Deskripsi                    |
|-------------------|------------------------------|
| `npm run dev`     | Menjalankan dev server Vite  |
| `npm run build`   | Build untuk produksi         |
| `npm run lint`    | Menjalankan ESLint           |
| `npm run preview` | Preview hasil build produksi |

## Endpoint API

| Method | Endpoint    | Deskripsi                                   |
|--------|-------------|---------------------------------------------|
| GET    | `/`         | Cek kesehatan server                        |
| POST   | `/api/chat` | Kirim prompt chat, balas rekomendasi produk |

Contoh request:

```json
{
  "prompt": [
    {
      "role": "user",
      "text": "Rekomendasikan laptop untuk editing video"
    }
  ]
}
```

## Lisensi

Project ini menggunakan lisensi **ISC**.
