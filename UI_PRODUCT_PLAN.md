# DokterPadi AI - UI, Product, and Tech Plan

## Ringkasan Konsep

**DokterPadi AI** adalah aplikasi web untuk membantu mendeteksi penyakit daun padi dari gambar. Aplikasi ini tidak hanya menampilkan hasil klasifikasi model, tetapi juga memberikan rekomendasi perawatan awal, gejala umum, tindakan cepat, pencegahan, dan riwayat hasil deteksi.

Target utama aplikasi adalah petani, mahasiswa, peneliti, dan pengguna umum di Indonesia yang membutuhkan alat bantu deteksi dini penyakit padi secara cepat dan mudah dipahami.

> Catatan penting: hasil prediksi harus ditampilkan sebagai bantuan awal, bukan pengganti diagnosis penyuluh atau ahli pertanian.

## Arah Brand

Nama yang direkomendasikan:

- **DokterPadi AI**: nama paling cocok untuk pasar Indonesia karena mudah dipahami dan langsung menggambarkan fungsi aplikasi.
- **PadiCare AI**: lebih modern dan cocok untuk demo teknologi.
- **PadiScan AI**: fokus pada fitur scan gambar.

Pilihan utama untuk project ini: **DokterPadi AI**.

Alasan:

- Mudah diingat.
- Lebih dekat dengan pengguna Indonesia.
- Menjelaskan manfaat aplikasi secara langsung.
- Tetap cocok untuk presentasi machine learning.

## Masalah Yang Diselesaikan

Petani atau pengguna sering kesulitan mengenali penyakit padi dari gejala visual di daun. Jika penyakit terlambat dikenali, risiko penurunan hasil panen menjadi lebih besar. Aplikasi ini membantu memberikan deteksi awal berbasis gambar dan rekomendasi perawatan yang mudah dibaca.

## Value Proposition

- Deteksi penyakit padi dari foto daun.
- Hasil prediksi cepat langsung di browser.
- Confidence score untuk membantu pengguna memahami tingkat keyakinan model.
- Rekomendasi perawatan awal berdasarkan jenis penyakit.
- Ensiklopedia penyakit padi yang bisa dipelajari pengguna.
- Riwayat deteksi untuk membandingkan kondisi tanaman dari waktu ke waktu.

## Target Pengguna

- Petani padi.
- Mahasiswa atau peneliti pertanian.
- Penyuluh pertanian.
- Pengguna umum yang ingin mempelajari deteksi penyakit tanaman.
- Reviewer project machine learning.

## Konsep Alur Aplikasi

1. User membuka homepage.
2. User memilih menu diagnosis atau tombol scan.
3. User upload gambar daun padi.
4. Aplikasi menampilkan preview gambar.
5. Model AI menganalisis gambar.
6. Aplikasi menampilkan hasil prediksi, confidence score, dan top 3 kemungkinan.
7. Aplikasi menampilkan rekomendasi perawatan sesuai penyakit.
8. Hasil diagnosis disimpan ke riwayat lokal.
9. User bisa membaca detail penyakit di ensiklopedia.

## Tech Stack Rekomendasi

### MVP Tanpa Backend

Stack ini paling direkomendasikan untuk tahap awal karena project sudah memiliki model TensorFlow.js.

```text
Frontend:
- React.js
- Vite
- Tailwind CSS
- TensorFlow.js
- Lucide React

Model:
- tfjs_model/model.json
- tfjs_model/group1-shard1of1.bin
- tflite/label.txt sebagai referensi label

Storage:
- LocalStorage untuk riwayat sederhana
- IndexedDB jika gambar riwayat juga ingin disimpan

Deployment:
- Vercel
- Netlify
- GitHub Pages
```

Keunggulan:

- Tidak perlu backend untuk demo.
- Model bisa berjalan langsung di browser.
- Lebih mudah dipresentasikan.
- Cocok dengan struktur project saat ini.

### Versi Lanjutan Dengan Backend

Jika aplikasi ingin dikembangkan lebih serius:

```text
Frontend:
- Next.js atau React.js

Backend:
- FastAPI atau Flask

Database:
- PostgreSQL atau Supabase

File Storage:
- Supabase Storage atau Cloudinary

AI Inference:
- TensorFlow.js di frontend, atau
- TensorFlow/Keras di backend Python
```

Versi backend cocok jika aplikasi membutuhkan akun pengguna, penyimpanan riwayat online, dashboard admin, atau monitoring penggunaan model.

## Fitur MVP

### 1. Homepage

Tujuan: menjelaskan fungsi aplikasi secara cepat dan mengarahkan user ke fitur diagnosis.

Komponen:

- Navbar.
- Hero section.
- CTA utama: `Scan Sekarang`.
- Ringkasan cara kerja.
- Preview kategori penyakit.
- Info singkat model.
- Footer dengan disclaimer.

Catatan dari file `paddy_disease_ui.html`:

- Struktur homepage sudah bagus: navbar, hero, how it works, disease category, footer.
- Teks sebaiknya diganti ke Bahasa Indonesia.
- Nama brand sebaiknya diganti dari `AgriAI` menjadi `DokterPadi AI`.
- Tombol `Scan Now` menjadi `Scan Sekarang`.
- `Disease Category` menjadi `Kategori Penyakit`.
- Tambahkan upload card atau CTA yang lebih jelas ke halaman diagnosis.

### 2. Halaman Diagnosis

Tujuan: tempat utama user melakukan upload gambar dan menjalankan prediksi.

Komponen:

- Upload area drag-and-drop.
- Tombol pilih file.
- Preview gambar.
- Tombol `Analisis Gambar`.
- Loading state.
- Error state jika format file salah.
- Empty state jika belum ada gambar.

Validasi:

- Format gambar: JPG, JPEG, PNG.
- Ukuran file maksimal, misalnya 5 MB.
- Tampilkan pesan jika gambar tidak bisa diproses.

### 3. Hasil Prediksi

Tujuan: menampilkan output model secara jelas dan mudah dipahami.

Komponen:

- Nama penyakit utama.
- Confidence score.
- Confidence bar.
- Badge status risiko: rendah, sedang, tinggi.
- Top 3 kemungkinan penyakit.
- Thumbnail gambar input.
- Tombol simpan ke riwayat.
- Tombol scan ulang.

Contoh data dummy:

```text
Prediksi utama: Blast
Confidence: 87%
Status risiko: Perlu Dipantau

Top 3:
- Blast: 87%
- Brown Spot: 8%
- Bacterial Leaf Blight: 5%
```

### 4. Rekomendasi Perawatan

Tujuan: membuat aplikasi lebih bernilai dibanding sekadar klasifikasi gambar.

Konten dibagi menjadi:

- Gejala umum.
- Penyebab umum.
- Tindakan cepat.
- Perawatan 7 hari.
- Pencegahan musim berikutnya.
- Catatan keamanan.

Format UI yang disarankan:

- Tab atau segmented control:
  - `Tindakan Cepat`
  - `Perawatan 7 Hari`
  - `Pencegahan`
  - `Catatan`

Catatan keamanan:

> Gunakan pestisida, fungisida, atau bakterisida hanya sesuai label resmi produk dan arahan penyuluh pertanian setempat.

### 5. Ensiklopedia Penyakit

Tujuan: memberikan edukasi penyakit padi berdasarkan kelas yang dikenali model.

Daftar kelas:

- Bacterial Leaf Blight
- Bacterial Leaf Streak
- Bacterial Panicle Blight
- Blast
- Brown Spot
- Dead Heart
- Downy Mildew
- Hispa
- Normal
- Tungro

Setiap card berisi:

- Nama penyakit.
- Nama Indonesia jika tersedia.
- Tipe: bakteri, jamur, virus, hama, atau normal.
- Ringkasan gejala.
- Badge risiko.
- Tombol `Lihat Detail`.

### 6. Detail Penyakit

Tujuan: halaman detail untuk menjelaskan satu penyakit secara lebih lengkap.

Komponen:

- Nama penyakit.
- Tipe penyakit.
- Gejala visual.
- Faktor pemicu.
- Rekomendasi tindakan.
- Pencegahan.
- Kapan harus konsultasi penyuluh.

### 7. Riwayat Deteksi

Tujuan: menyimpan hasil scan agar user dapat melihat kembali kondisi sebelumnya.

Komponen:

- Thumbnail gambar.
- Tanggal scan.
- Hasil prediksi.
- Confidence.
- Status risiko.
- Tombol detail.
- Tombol hapus riwayat.

Implementasi MVP:

- Simpan metadata ke LocalStorage.
- Untuk gambar, simpan base64 ukuran kecil atau hanya tampilkan jika user tidak menutup browser.
- Jika ingin lebih kuat, gunakan IndexedDB.

### 8. Tentang Model

Tujuan: memberi konteks teknis dan meningkatkan kredibilitas project.

Konten:

- Dataset: Paddy Disease Classification dari Kaggle.
- Jumlah gambar: 10.407.
- Jumlah kelas: 10.
- Image size: 150x150.
- Testing accuracy: 90.27%.
- Model: CNN TensorFlow/Keras.
- Format deployment: TensorFlow.js, TFLite, SavedModel.
- Disclaimer keterbatasan model.

## Rekomendasi Knowledge Base Penyakit

Untuk rekomendasi perawatan, buat file data terpisah:

```text
src/data/diseaseKnowledge.json
```

Contoh struktur:

```json
{
  "blast": {
    "name_id": "Blas",
    "name_en": "Blast",
    "type": "Jamur",
    "risk": "Sedang-Tinggi",
    "symptoms": [
      "Bercak pada daun",
      "Bercak dapat berbentuk belah ketupat",
      "Daun mengering jika serangan berat"
    ],
    "causes": [
      "Kelembapan tinggi",
      "Pemupukan nitrogen berlebihan",
      "Varietas rentan"
    ],
    "quick_actions": [
      "Pantau penyebaran bercak pada daun",
      "Hindari pemupukan nitrogen berlebihan",
      "Pisahkan pengamatan antara area ringan dan berat"
    ],
    "care_plan": [
      "Jaga kondisi air sawah tetap stabil",
      "Periksa tanaman sekitar dalam 3-7 hari",
      "Konsultasikan fungisida sesuai arahan penyuluh jika serangan meluas"
    ],
    "prevention": [
      "Gunakan varietas tahan",
      "Gunakan benih sehat",
      "Terapkan pemupukan berimbang"
    ],
    "safety_note": "Rekomendasi ini bersifat umum. Ikuti label produk dan arahan penyuluh untuk penggunaan bahan kimia."
  }
}
```

## Mapping Solusi Awal Per Kelas

### Bacterial Leaf Blight

- Nama Indonesia: hawar daun bakteri.
- Tipe: bakteri.
- Fokus rekomendasi: benih sehat, varietas tahan, sanitasi lahan, pengelolaan air, hindari nitrogen berlebihan.

### Bacterial Leaf Streak

- Nama Indonesia: garis daun bakteri.
- Tipe: bakteri.
- Fokus rekomendasi: benih sehat, kurangi kelembapan berlebih, sanitasi sisa tanaman, hindari luka pada daun.

### Bacterial Panicle Blight

- Nama Indonesia: hawar malai bakteri.
- Tipe: bakteri.
- Fokus rekomendasi: benih sehat, pemupukan seimbang, pantau fase malai, sanitasi residu tanaman.

### Blast

- Nama Indonesia: blas.
- Tipe: jamur.
- Fokus rekomendasi: varietas tahan, pemupukan seimbang, pengaturan air, pantau penyebaran bercak.

### Brown Spot

- Nama Indonesia: bercak cokelat.
- Tipe: jamur.
- Fokus rekomendasi: benih sehat, perbaikan nutrisi tanah, hindari stres kekeringan, pemupukan berimbang.

### Dead Heart

- Nama Indonesia: gejala mati pucuk akibat penggerek batang.
- Tipe: hama/gejala.
- Fokus rekomendasi: monitoring hama, sanitasi jerami dan tunggul, tanam serempak, pengendalian berbasis ambang.

### Downy Mildew

- Nama Indonesia: embun bulu.
- Tipe: jamur/oomycete.
- Fokus rekomendasi: drainase baik, hindari kondisi terlalu basah, sanitasi tanaman, varietas tahan jika tersedia.

### Hispa

- Nama Indonesia: hama hispa padi.
- Tipe: hama.
- Fokus rekomendasi: monitoring daun, konservasi musuh alami, pengendalian hama hanya jika serangan melewati ambang.

### Normal

- Nama Indonesia: sehat.
- Tipe: normal.
- Fokus rekomendasi: lanjutkan monitoring, pemupukan seimbang, jaga air, scan berkala.

### Tungro

- Nama Indonesia: tungro.
- Tipe: virus.
- Fokus rekomendasi: kendalikan vektor wereng hijau, cabut tanaman terinfeksi berat, tanam serempak, gunakan varietas tahan.

## Struktur Halaman

```text
/
Homepage

/diagnosis
Upload gambar dan hasil prediksi

/diseases
Ensiklopedia penyakit padi

/diseases/:id
Detail penyakit dan rekomendasi perawatan

/history
Riwayat hasil deteksi

/about
Tentang model dan dataset
```

## Struktur Folder React Yang Disarankan

```text
src/
|-- assets/
|-- components/
|   |-- Navbar.jsx
|   |-- Footer.jsx
|   |-- UploadCard.jsx
|   |-- ResultCard.jsx
|   |-- ConfidenceBar.jsx
|   |-- RiskBadge.jsx
|   |-- DiseaseCard.jsx
|   |-- RecommendationTabs.jsx
|-- data/
|   |-- diseaseKnowledge.json
|   |-- labels.js
|-- pages/
|   |-- Home.jsx
|   |-- Diagnosis.jsx
|   |-- Diseases.jsx
|   |-- DiseaseDetail.jsx
|   |-- History.jsx
|   |-- About.jsx
|-- services/
|   |-- modelService.js
|   |-- historyService.js
|-- utils/
|   |-- imagePreprocess.js
|   |-- riskLevel.js
|-- App.jsx
|-- main.jsx
```

## Integrasi Model TensorFlow.js

Tahapan teknis:

1. Pindahkan folder `tfjs_model` ke folder `public/model`.
2. Load model dari `/model/model.json`.
3. Resize gambar ke 150x150.
4. Normalisasi pixel sesuai preprocessing saat training.
5. Jalankan prediksi.
6. Mapping index output ke label.
7. Ambil top 3 confidence.
8. Ambil rekomendasi dari `diseaseKnowledge.json`.

Hal yang perlu diverifikasi:

- Urutan label harus sama dengan urutan output model.
- Preprocessing harus sama dengan notebook training.
- Confidence score harus ditampilkan sebagai probabilitas, bukan akurasi model.

## Prioritas Implementasi

### Tahap 1 - UI Dasar

- Konversi HTML statis ke React.
- Ubah brand menjadi `DokterPadi AI`.
- Ubah teks ke Bahasa Indonesia.
- Buat halaman homepage, diagnosis, diseases, history, about.
- Gunakan data dummy untuk hasil prediksi.

### Tahap 2 - Knowledge Base

- Buat `diseaseKnowledge.json`.
- Hubungkan hasil dummy dengan rekomendasi penyakit.
- Buat halaman detail penyakit.

### Tahap 3 - Integrasi Model

- Pasang TensorFlow.js.
- Load `tfjs_model`.
- Implementasi image preprocessing.
- Tampilkan hasil prediksi asli.

### Tahap 4 - Riwayat Deteksi

- Simpan hasil ke LocalStorage.
- Tampilkan daftar riwayat.
- Tambahkan tombol hapus riwayat.

### Tahap 5 - Polish dan Validasi

- Responsive mobile.
- Loading state.
- Error state.
- Empty state.
- Accessibility dasar.
- Optimasi ukuran gambar.
- Test dengan beberapa gambar.

## Acceptance Criteria MVP

Aplikasi MVP dianggap selesai jika:

- User bisa upload gambar.
- Gambar tampil sebagai preview.
- User bisa menjalankan analisis.
- Aplikasi menampilkan hasil prediksi dummy atau asli.
- Aplikasi menampilkan top 3 confidence.
- Aplikasi menampilkan rekomendasi sesuai label penyakit.
- Tersedia ensiklopedia 10 kelas penyakit.
- Riwayat deteksi tersimpan lokal.
- UI responsive di desktop dan mobile.
- Ada disclaimer bahwa hasil prediksi bukan diagnosis final.

## Catatan UI

Gaya visual yang cocok:

- Modern agritech.
- Warna utama hijau tua, putih, hijau muda, dan aksen kuning padi.
- Banyak ruang kosong agar mudah dibaca.
- Gunakan card hanya untuk item penting.
- Jangan terlalu banyak efek dekoratif.
- Gunakan ikon untuk upload, diagnosis, rekomendasi, riwayat, dan model.

Tone teks:

- Bahasa Indonesia sederhana.
- Hindari istilah teknis berlebihan di halaman utama.
- Istilah teknis boleh muncul di halaman `Tentang Model`.

Contoh copywriting:

```text
Deteksi penyakit daun padi dari gambar.
Unggah foto daun padi dan dapatkan prediksi awal beserta rekomendasi perawatan.
```

```text
Hasil prediksi bersifat bantuan awal dan bukan pengganti diagnosis penyuluh atau ahli pertanian.
```

## Risiko Dan Batasan

- Model bisa salah jika gambar buram, terlalu gelap, atau objek bukan daun padi.
- Confidence tinggi tidak selalu berarti diagnosis pasti.
- Rekomendasi perawatan harus bersifat umum dan aman.
- Jangan memberikan dosis pestisida spesifik tanpa rujukan resmi.
- Penyakit dengan gejala mirip dapat tertukar.

## Referensi Tampilan Yang Bisa Diamati

- Plantix: referensi alur crop doctor dan diagnosis tanaman.
- Pl@ntNet: referensi identifikasi berbasis foto yang sederhana.
- Kindwise: referensi tampilan AI plant health yang modern.
- Kaggle Paddy Disease Classification: referensi dataset dan konteks model.

