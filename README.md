# Smart Farming Rice Disease Detection Using Convolutional Neural Network

## Deskripsi Proyek

Proyek ini merupakan implementasi model klasifikasi gambar untuk mendeteksi jenis penyakit pada daun padi menggunakan arsitektur Convolutional Neural Network (CNN) berbasis TensorFlow/Keras. Model dilatih untuk mengenali 10 kategori kondisi daun padi, termasuk kondisi normal dan berbagai jenis penyakit, berdasarkan citra daun.

Tujuan utama proyek ini adalah membangun sistem deteksi dini penyakit padi yang dapat membantu petani dalam mengidentifikasi penyakit tanaman secara cepat dan akurat, sehingga penanganan dapat dilakukan lebih awal untuk meminimalkan kerugian hasil panen.

## Dataset

- **Sumber:** Paddy Disease Classification - Kaggle Competition
- **URL:** https://www.kaggle.com/competitions/paddy-disease-classification/data
- **Jumlah Gambar:** 10.407 gambar
- **Jumlah Kelas:** 10 kategori penyakit dan kondisi daun padi
- **Resolusi:** Beragam (tidak seragam), di-resize ke 150x150 piksel saat preprocessing

### Pembagian Dataset

| Split      | Persentase | Jumlah Gambar |
| ---------- | ---------- | ------------- |
| Training   | 70%        | 7.284         |
| Validation | 15%        | 1.561         |
| Testing    | 15%        | 1.562         |

Pembagian dilakukan secara stratified berdasarkan label untuk menjaga distribusi kelas yang proporsional di setiap subset.

## Arsitektur Model

Model menggunakan arsitektur Sequential CNN dengan konfigurasi sebagai berikut:

- 5 blok konvolusi dengan filter bertingkat: 32 - 64 - 128 - 256 - 512
- Setiap blok terdiri dari Conv2D, BatchNormalization, MaxPooling2D, dan Dropout
- GlobalAveragePooling2D sebagai penghubung ke fully connected layer
- Dense layer (256 unit) dengan Dropout 0.5 sebelum output layer
- Output layer dengan aktivasi softmax untuk 10 kelas

### Hyperparameter

| Parameter     | Nilai                     |
| ------------- | ------------------------- |
| Image Size    | 150 x 150 piksel          |
| Batch Size    | 32                        |
| Optimizer     | Adam (lr: 1e-3)           |
| Loss Function | Categorical Crossentropy  |
| Epochs        | 50 (dengan EarlyStopping) |

## Hasil Evaluasi

| Metrik            | Nilai  |
| ----------------- | ------ |
| Training Accuracy | 94.62% |
| Testing Accuracy  | 90.27% |

## Callback yang Digunakan

- **EarlyStopping:** Menghentikan training jika val_accuracy tidak membaik selama 10 epoch berturut-turut.
- **ReduceLROnPlateau:** Menurunkan learning rate sebesar faktor 0.5 jika val_loss stagnan selama 5 epoch.
- **ModelCheckpoint:** Menyimpan model dengan val_accuracy terbaik selama proses training.

## Format Output Model

Model diekspor ke dalam tiga format untuk mendukung deployment di berbagai platform:

| Format     | Lokasi                           | Keterangan                               |
| ---------- | -------------------------------- | ---------------------------------------- |
| SavedModel | `submission/saved_model/`        | Format standar TensorFlow untuk server   |
| TF-Lite    | `submission/tflite/model.tflite` | Optimasi untuk perangkat mobile/embedded |
| TFJS       | `submission/tfjs_model/`         | Untuk aplikasi berbasis browser          |

## Inference

Inference dilakukan menggunakan TF-Lite Interpreter untuk memvalidasi bahwa model yang diekspor berfungsi dengan benar. Bukti inferensi tersedia di dalam notebook, menampilkan gambar input, label aktual, label prediksi, dan confidence score.

## Teknologi dan Library

- Python 3.x
- TensorFlow / Keras
- TensorFlow Lite
- TensorFlow.js
- NumPy, Pandas
- Matplotlib
- Scikit-learn
- Pillow
- KaggleHub

## Struktur Direktori

```
submission/
|-- saved_model/
|   |-- saved_model.pb
|   |-- variables/
|-- tflite/
|   |-- model.tflite
|   |-- label.txt
|-- tfjs_model/
|   |-- model.json
|   |-- group1-shard1of1.bin
|-- notebook.ipynb
|-- README.md
|-- requirements.txt
```

## Cara Menjalankan

1. Buka file `notebook.ipynb` di Google Colab.
2. Pastikan runtime menggunakan GPU (Runtime > Change runtime type > T4 GPU).
3. Upload file `kaggle.json` untuk autentikasi dataset Kaggle.
4. Jalankan seluruh cell secara berurutan (Runtime > Run all).
5. File zip submission akan dibuat secara otomatis di akhir notebook.
