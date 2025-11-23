# MBGSecure

Website manajemen laporan MBG untuk lomba **JYCC (JATIM YOUTH CODEPRENEUR CHALLENGE)**.

## Cara Menjalankan

### 1. Clone repo

```bash
git clone https://github.com/AhmadRadith/jycc
cd jycc
```

### 2. Install package

```bash
npm install
```

### 3. Buat file `.env`

Ubah nama file `.env.example` jadi `.env`.

Lalu isi bagian ini:

```env
MONGODB_URI=
SESSION_SECRET=janlup-diganti
SESSION_TTL_SECONDS=86400 # 1 day
```

Penjelasan tiap key di `.env`
(`*` = wajib diganti):

- `MONGODB_URI`\*
  Isi dengan link database MongoDB kamu.
  Bisa buat database di:
  [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)

- `SESSION_SECRET`\*
  Kunci rahasia untuk session (harus diganti, jangan pakai contoh).

- `SESSION_TTL_SECONDS`
  Lama session sebelum hangus (86400 detik = 1 hari).
- `GEMINI_API_KEY`
  API key untuk Gemini (harus diganti).

### 4. Isi database dengan data test

Setelah `.env` sudah diisi, jalankan:

```bash
node dbscripts/masukindatates.js
```

### 5. Jalankan project

```bash
npm run dev
```

Setelah command jalan dan server aktif, buka browser dan akses:

```text
http://localhost:3000
```

atau link yang muncul di console.

## Demo Online

[https://test.jycc.my.id](https://test.jycc.my.id)
