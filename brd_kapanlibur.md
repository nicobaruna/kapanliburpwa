# Business Requirements Document (BRD) - Kapanlibur

## 1. Pendahuluan
Dokumen ini merinci kebutuhan bisnis dan fungsional untuk aplikasi **Kapanlibur** (Libur Indonesia 2026). Aplikasi ini dikembangkan untuk membantu masyarakat Indonesia, khususnya pekerja dan pelajar, dalam mengelola rencana liburan mereka dengan menggabungkan data hari libur resmi, deteksi long weekend, dan analisis dampak finansial.

## 2. Ringkasan Eksekutif
Aplikasi Kapanlibur adalah asisten perencanaan liburan berbasis mobile (Android & iOS). Berbeda dengan aplikasi kalender biasa, Kapanlibur memberikan nilai tambah melalui sistem pengingat proaktif (H-7 dan H-1) serta fitur perencana keuangan yang membantu pengguna menentukan apakah rencana liburan mereka sehat secara finansial berdasarkan gaji dan estimasi biaya.

## 3. Tujuan Bisnis & Target Audiens
### 3.1. Tujuan
*   Menyediakan sumber data hari libur nasional dan cuti bersama yang akurat sesuai ketetapan pemerintah/Bank Indonesia 2026.
*   Meningkatkan efisiensi perencanaan liburan pengguna melalui deteksi otomatis *Long Weekend*.
*   Membantu literasi keuangan pengguna melalui fitur simulasi biaya liburan.
### 3.2. Target Audiens
*   Karyawan swasta/PNS yang ingin mengoptimalkan kuota cuti.
*   Pelajar dan mahasiswa di Indonesia.
*   Travel Enthusiast yang merencanakan perjalanan jauh hari.

## 4. Cakupan Proyek (Scope of Work)
### 4.1. Dalam Cakupan (In-Scope)
*   Dashboard dengan hitung mundur (countdown) libur terdekat.
*   Kalender interaktif dengan highlight libur dan cuti bersama.
*   Daftar otomatis Long Weekend 2026.
*   Sistem notifikasi lokal terjadwal (H-7 dan H-1).
*   Fitur "Perencana Finansial" untuk simulasi dampak budget liburan terhadap gaji.
*   Sistem Onboarding dan Profil Pengguna.
### 4.2. Luar Cakupan (Out-of-Scope)
*   Pemesanan tiket pesawat atau hotel (hanya simulasi biaya).
*   Sinkronisasi dengan Google Calendar/Outlook (untuk fase pertama).
*   Data libur internasional di luar Indonesia.

## 5. Kebutuhan Fungsional (Functional Requirements)

| ID | Fitur | Deskripsi | Prioritas |
|:---|:---|:---|:---|
| F1 | **Dashboard & Countdown** | Menampilkan hitung mundur hari/jam menuju libur terdekat dan daftar 6 libur mendatang. | P1 |
| F2 | **Kalender Hari Libur** | Tampilan kalender bulanan yang menandai Hari Libur Nasional (Merah) dan Cuti Bersama (Berbeda warna/dot). | P1 |
| F3 | **Deteksi Long Weekend** | Halaman yang merangkum gabungan hari libur + weekend untuk memudahkan perencanaan perjalanan. | P2 |
| F4 | **Notifikasi Pengingat** | Mengirimkan notifikasi push pada pukul 08:00 pagi saat H-7 dan H-1 sebelum hari libur. | P1 |
| F5 | **Perencana Finansial** | Analisis input gaji, biaya trip, dan tipe cuti (paid/unpaid) untuk memberikan rekomendasi "Aman", "Perlu Pertimbangan", atau "Berat". | P2 |
| F6 | **Onboarding** | Pengenalan fitur aplikasi kepada pengguna baru saat pertama kali dibuka. | P3 |
| F7 | **Manajemen Profil** | Penyimpanan data dasar pengguna (nama/wilayah) untuk personalisasi notifikasi. | P3 |

## 6. Kebutuhan Non-Fungsional (Non-Functional Requirements)

| Kategori | Kebutuhan |
|:---|:---|
| **Aksesibilitas** | Aplikasi harus responsif dan mendukung mode gelap (jika diperlukan), namun prioritas pada tema visual premium (Indonesian Red). |
| **Reliabilitas** | Notifikasi harus muncul tepat waktu meskipun aplikasi sedang tidak aktif di latar belakang (menggunakan *Exact Alarm* di Android). |
| **Ketersediaan** | Aplikasi harus dapat berfungsi secara offline (data libur disimpan lokal di `holidays2026.ts`). |
| **Keamanan** | Data gaji pada fitur Finansial disimpan secara lokal di perangkat dan tidak dikirim ke server luar (Privacy by Design). |

## 7. Desain & Estetika (UI/UX)
*   **Tema Utama:** Indonesian Red (#C8102E) dengan latar belakang bersih (#F7F3EF).
*   **Interaksi:** Animasi halus pada transisi tab dan tombol.
*   **Visual:** Penggunaan emoji sebagai ikon utama untuk memberikan kesan ramah dan modern.
*   **Feedback:** Status badge pada hasil finansial yang menggunakan kode warna (Hijau, Kuning, Merah).

## 8. Spesifikasi Teknis (Tech Stack)
*   **Framework:** React Native (CLI).
*   **Bahasa:** TypeScript.
*   **State Management:** Context API (UserContext).
*   **Navigasi:** React Navigation (Bottom Tabs).
*   **Notifikasi:** @notifee/react-native (Local Notifications).
*   **Kalender:** react-native-calendars.

## 9. Sumber Data
*   Keputusan Bersama (SKB) 3 Menteri tentang Hari Libur Nasional dan Cuti Bersama Tahun 2026.
*   Kalender Resmi Bank Indonesia 2026.

---
**Dibuat Oleh:** Antigravity (AI Assistant)
**Tanggal:** 26 Maret 2026
