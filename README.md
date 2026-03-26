# KapanLibur – Kalender Libur Indonesia 2026

Progressive Web App (PWA) untuk melihat hari libur nasional, cuti bersama, dan long weekend berdasarkan Kalender Resmi Bank Indonesia 2026.

---

## Fitur

| Fitur | Keterangan |
|-------|------------|
| **Dashboard** | Countdown libur berikutnya + daftar 6 libur mendatang |
| **Kalender** | Kalender bulanan dengan highlight libur & cuti bersama |
| **Long Weekend** | Deteksi otomatis semua long weekend 2026 |
| **Financial Planner** | Perencana anggaran liburan |
| **Installable PWA** | Bisa di-install ke homescreen (Android/iOS/Desktop) |
| **Offline Support** | Bisa diakses tanpa koneksi internet (via Service Worker) |

---

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** + **vite-plugin-pwa** (Service Worker & Web App Manifest)
- **React Router v6**

---

## Instalasi & Development

### Prasyarat
- Node.js >= 18

### Clone & install dependencies

```bash
git clone <repo-url>
cd kapanliburpwa
npm install
```

### Jalankan development server

```bash
npm run dev
```

Buka `http://localhost:5173` di browser.

### Build production

```bash
npm run build
```

Output tersimpan di folder `dist/`. Preview hasil build:

```bash
npm run preview
```

---

## Struktur Project

```
kapanliburpwa/
├── public/
│   ├── icon-192.png             # PWA icon
│   └── icon-512.png             # PWA icon
├── src/
│   ├── components/
│   │   └── BottomNav.tsx        # Navigasi bawah
│   ├── context/
│   │   └── UserContext.tsx      # Global user state
│   ├── data/
│   │   └── holidays2026.ts      # Data libur 2026 (sumber: Bank Indonesia)
│   ├── pages/
│   │   ├── DashboardPage.tsx    # Halaman utama
│   │   ├── CalendarPage.tsx     # Kalender interaktif
│   │   ├── LongWeekendPage.tsx  # Daftar long weekend
│   │   ├── FinancialPlannerPage.tsx  # Perencana keuangan
│   │   ├── LoginPage.tsx        # Login
│   │   ├── OnboardingPage.tsx   # Onboarding
│   │   └── ProfilePage.tsx      # Profil pengguna
│   ├── services/
│   │   └── FinancialAnalysisService.ts
│   ├── utils/
│   │   └── dateUtils.ts         # Helper tanggal & waktu
│   ├── App.tsx                  # Routing utama
│   └── main.tsx                 # Entry point
├── vite.config.ts               # Konfigurasi Vite + PWA
└── package.json
```

---

## Data Libur 2026

### Hari Libur Nasional (17 hari)
| Tanggal | Nama |
|---------|------|
| 1 Jan | Tahun Baru 2026 |
| 16 Jan | Isra Mikraj |
| 17 Feb | Tahun Baru Imlek |
| 19 Mar | Hari Raya Nyepi |
| 21–22 Mar | Idul Fitri 1447 H |
| 3 Apr | Wafat Yesus (Jumat Agung) |
| 5 Apr | Paskah |
| 1 Mei | Hari Buruh |
| 14 Mei | Kenaikan Yesus |
| 27 Mei | Idul Adha 1447 H |
| 31 Mei | Waisak |
| 1 Jun | Hari Lahir Pancasila |
| 16 Jun | Tahun Baru Islam 1448 H |
| 17 Ags | HUT RI ke-81 |
| 25 Ags | Maulid Nabi |
| 25 Des | Natal |

### Cuti Bersama (8 hari)
16 Feb · 18 Mar · 20, 23, 24 Mar (Lebaran) · 15 Mei · 28 Mei · 24 Des

---

## Long Weekend 2026

| Periode | Durasi |
|---------|--------|
| 18–24 Mar | **7 hari** (Nyepi + Lebaran mega-holiday!) |
| 3–5 Apr | 3 hari (Jumat Agung + weekend) |
| 1–3 Mei | 3 hari (Hari Buruh + weekend) |
| 14–17 Mei | 4 hari (Kenaikan Yesus + cuti + weekend) |
| 29–31 Mei | 3 hari (Waisak + weekend) |
| 15–17 Ags | 3 hari (HUT RI + weekend) |
| 24–28 Des | 4 hari (Cuti Natal + Natal + weekend) |

---

## Sumber Data

Data hari libur dan cuti bersama bersumber dari:
> **Kalender Hari Libur dan Cuti Bersama Bank Indonesia Tahun 2026**
> Berdasarkan Keputusan Bersama Menteri Agama, Menteri Ketenagakerjaan, dan Menteri Pendayagunaan Aparatur Negara dan Reformasi Birokrasi Republik Indonesia.
