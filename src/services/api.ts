import { getNextLongWeekend } from '../utils/dateUtils';

const SERP_API_KEY = import.meta.env.VITE_SERPAPI_KEY;

export interface ItineraryDay {
  day: number;
  title: string;
  activities: string[];
}

export interface Destination {
  id: string;
  name: string;
  location: string;
  image: string;
  flightPrice: number;
  hotelPerNight: number;
  flightDurationHours: number;
  weatherForecast: 'Sunny' | 'Rainy' | 'Cloudy';
  baseTags: { label: string; type: 'normal' | 'danger' | 'warning' | 'success' }[];
  itinerary: ItineraryDay[];
  vacationTypes: ('kota' | 'alam' | 'pantai' | 'gunung')[];
}

export type TripStyle = 'hemat' | 'balance' | 'luxury';

export interface RecommendationResult extends Destination {
  matchScore: number;
  estTotalCost: number;
  totalFlightCost: number;
  totalHotelCost: number;
  canAfford: boolean;
  dynamicTags: { label: string; type: 'normal' | 'danger' | 'warning' | 'success' }[];
}

// Basis data destinasi yang diperluas
const BASE_DESTINATIONS: (Omit<Destination, 'image' | 'weatherForecast' | 'flightPrice'> & {
  searchQuery: string;
  fallbackImage: string;
})[] = [
  {
    id: 'DPS',
    name: 'Uluwatu, Bali',
    location: 'Bali, Indonesia',
    hotelPerNight: 1200000,
    flightDurationHours: 1.5,
    searchQuery: 'Uluwatu Bali Temple cliff ocean',
    fallbackImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    vacationTypes: ['pantai'],
    baseTags: [{ label: '🏖️ Pantai', type: 'normal' }, { label: 'TRENDING', type: 'danger' }],
    itinerary: [
      { day: 1, title: 'Arrival & Beach Club', activities: ['Check-in Hotel', 'Makan siang di Single Fin', 'Sunset di Uluwatu Temple & Tari Kecak'] },
      { day: 2, title: 'Pantai Tersembunyi', activities: ['Pantai Melasti', 'Makan Seafood Jimbaran', 'Santai di Savaya'] },
      { day: 3, title: 'Kultur & Pulang', activities: ['GWK Cultural Park', 'Beli Oleh-oleh Khas Bali', 'Penerbangan pulang'] }
    ]
  },
  {
    id: 'YIA',
    name: 'Borobudur, Magelang',
    location: 'Jawa Tengah, Indonesia',
    hotelPerNight: 650000,
    flightDurationHours: 1,
    searchQuery: 'Borobudur Temple Sunrise Magelang',
    fallbackImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    vacationTypes: ['kota', 'alam'],
    baseTags: [{ label: '🏛️ Budaya', type: 'normal' }],
    itinerary: [
      { day: 1, title: 'Tiba di Yogyakarta', activities: ['Tiba di YIA', 'Kuliner Gudeg', 'Jalan-jalan Malioboro malam'] },
      { day: 2, title: 'Sunrise Magelang', activities: ['Sunrise di Punthuk Setumbu', 'Eksplorasi Candi Borobudur', 'VW Safari Tour keliling desa'] },
      { day: 3, title: 'Seni & Oleh-oleh', activities: ['Kunjungan Keraton Yogyakarta', 'Beli Bakpia Pathok', 'Penerbangan pulang'] }
    ]
  },
  {
    id: 'LBJ',
    name: 'Labuan Bajo',
    location: 'NTT, Indonesia',
    hotelPerNight: 1800000,
    flightDurationHours: 2.5,
    searchQuery: 'Labuan Bajo Padar Island aerial view',
    fallbackImage: 'https://images.unsplash.com/photo-1573790387438-4da905039392?w=800&q=80',
    vacationTypes: ['pantai', 'alam'],
    baseTags: [{ label: '🌊 Premium', type: 'warning' }],
    itinerary: [
      { day: 1, title: 'Tiba & Sail', activities: ['Tiba di Bandara Komodo', 'Check-in Kapal Phinisi', 'Sunset di Pulau Kalong'] },
      { day: 2, title: 'Kepingan Surga', activities: ['Trekking Pulau Padar', 'Pink Beach', 'Melihat Komodo di Pulau Rinca'] },
      { day: 3, title: 'Under Water', activities: ['Snorkeling di Manta Point', 'Pulau Kanawa', 'Penerbangan pulang'] }
    ]
  },
  {
    id: 'MLG',
    name: 'Gunung Bromo, Malang',
    location: 'Jawa Timur, Indonesia',
    hotelPerNight: 750000,
    flightDurationHours: 1.5,
    searchQuery: 'Mount Bromo volcano sunrise Indonesia',
    fallbackImage: 'https://images.unsplash.com/photo-1575408264798-b50b252663e6?w=800&q=80',
    vacationTypes: ['gunung', 'alam'],
    baseTags: [{ label: '⛰️ Petualangan Alam', type: 'normal' }],
    itinerary: [
      { day: 1, title: 'Tiba di Malang', activities: ['Tiba di Bandara Abdul Rachman Saleh', 'Kuliner Bakso President', 'Istirahat lebih awal'] },
      { day: 2, title: 'Sunrise Bromo', activities: ['Penanjakan 1 03:00 AM', 'Kawah Bromo', 'Bukit Teletubbies & Pasir Berbisik'] },
      { day: 3, title: 'City Tour', activities: ['Jatim Park 3', 'Oleh-oleh Apel Malang', 'Penerbangan pulang'] }
    ]
  },
  {
    id: 'LOP',
    name: 'Gili Trawangan, Lombok',
    location: 'NTB, Indonesia',
    hotelPerNight: 950000,
    flightDurationHours: 2,
    searchQuery: 'Gili Trawangan beach crystal water Indonesia',
    fallbackImage: 'https://images.unsplash.com/photo-1562337834-c23ecc0c32f7?w=800&q=80',
    vacationTypes: ['pantai'],
    baseTags: [{ label: '🚤 Island Hopping', type: 'normal' }],
    itinerary: [
      { day: 1, title: 'Lombok Tengah', activities: ['Tiba di Bandara Lombok', 'Desa Sade', 'Sunset di Pantai Kuta Mandalika'] },
      { day: 2, title: 'Gili Trawangan', activities: ['Nyebrang via Bangsal', 'Bersepeda keliling Gili', 'Sunset swing di pantai barat'] },
      { day: 3, title: 'Snorkeling', activities: ['Snorkeling 3 Gili (Meno, Air, Trawangan)', 'Beli Mutiara', 'Penerbangan pulang'] }
    ]
  },
  {
    id: 'KNO',
    name: 'Danau Toba, Samosir',
    location: 'Sumatera Utara, Indonesia',
    hotelPerNight: 850000,
    flightDurationHours: 2.5,
    searchQuery: 'Lake Toba Samosir island Indonesia aerial',
    fallbackImage: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80',
    vacationTypes: ['alam', 'kota'],
    baseTags: [{ label: '🛶 Sejarah Alam', type: 'normal' }],
    itinerary: [
      { day: 1, title: 'Tiba di Medan', activities: ['Tiba di Kualanamu', 'Kuliner Ucok Durian', 'Perjalanan darat ke Parapat'] },
      { day: 2, title: 'Eksplor Samosir', activities: ['Nyebrang Ferry', 'Desa Tomok (Makam Raja Sidabutar)', 'Air Terjun Sipiso-piso'] },
      { day: 3, title: 'Oleh-oleh & Pulang', activities: ['Beli Bolu Meranti', 'Istana Maimun', 'Penerbangan pulang'] }
    ]
  },
  {
    id: 'SOQ',
    name: 'Raja Ampat, Papua',
    location: 'Papua Barat Daya, Indonesia',
    hotelPerNight: 2800000,
    flightDurationHours: 4,
    searchQuery: 'Wayag Raja Ampat Papua karst island ocean',
    fallbackImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
    vacationTypes: ['pantai', 'alam'],
    baseTags: [{ label: '💎 Ultimate Dream', type: 'danger' }],
    itinerary: [
      { day: 1, title: 'Perjalanan Panjang', activities: ['Tiba di Sorong', 'Nyebrang ke Waisai', 'Check-in Resort'] },
      { day: 2, title: 'Piaynemo', activities: ['Trekking Puncak Piaynemo', 'Telaga Bintang', 'Arborek Village'] },
      { day: 3, title: 'Wayag & Pulang', activities: ['Opsional: Wayag Trip (Jauh)', 'Diving/Snorkeling', 'Penerbangan panjang pulang'] }
    ]
  },
  {
    id: 'BDO',
    name: 'Lembang, Bandung',
    location: 'Jawa Barat, Indonesia',
    hotelPerNight: 700000,
    flightDurationHours: 0.5,
    searchQuery: 'Lembang Bandung mountain tea plantation Indonesia',
    fallbackImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a422ed?w=800&q=80',
    vacationTypes: ['alam', 'kota', 'gunung'],
    baseTags: [{ label: '🚗 Roadtrip Recommended', type: 'success' }],
    itinerary: [
      { day: 1, title: 'Tiba & Kuliner', activities: ['Perjalanan via Tol (Jika dari Jakarta) / Pesawat', 'Makan di Kampung Daun', 'Lembang Park & Zoo'] },
      { day: 2, title: 'Wisata Alam', activities: ['Tangkuban Perahu', 'Floating Market Lembang', 'Orchid Forest Cikole'] },
      { day: 3, title: 'Belanja & Santai', activities: ['Braga City Walk', 'Oleh-oleh Kartika Sari / Brownies Amanda', 'Pulang'] }
    ]
  }
];

// In-memory cache to prevent redundant proxy requests (reduces ECONNRESET risks)
const flightCache: Record<string, number> = {};
const imageCache: Record<string, string> = {};

// Helper untuk fetch Google Flights via SerpApi Proxy
async function fetchFlightPrice(destinationIATA: string, outDate: string, inDate: string): Promise<number> {
  const cacheKey = `${destinationIATA}_${outDate}_${inDate}`;
  if (flightCache[cacheKey]) return flightCache[cacheKey];
  // Jika BDO (Bandung) dari CGK, anggap kereta/mobil = 200rb (fallback logis)
  if (destinationIATA === 'BDO') return 200000;

  try {
    const url = `/api/serp/search.json?engine=google_flights&departure_id=CGK&arrival_id=${destinationIATA}&outbound_date=${outDate}&return_date=${inDate}&currency=IDR&hl=id&api_key=${SERP_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.best_flights && data.best_flights.length > 0) {
      const price = data.best_flights[0].price;
      flightCache[cacheKey] = price;
      return price;
    } else if (data.other_flights && data.other_flights.length > 0) {
      const price = data.other_flights[0].price;
      flightCache[cacheKey] = price;
      return price;
    }
  } catch (error) {
    console.warn(`Gagal mengambil harga tiket untuk ${destinationIATA}`, error);
  }
  return 0; // fallback jika gagal
}

// Helper untuk fetch Google Images via SerpApi Proxy
async function fetchImage(query: string, fallback: string): Promise<string> {
  if (imageCache[query]) return imageCache[query];
  // Jika API key tidak ada, langsung pakai fallback per-destinasi
  if (!SERP_API_KEY) return fallback;
  try {
    const url = `/api/serp/search.json?engine=google_images&q=${encodeURIComponent(query + ' tourism high quality')}&api_key=${SERP_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.images_results && data.images_results.length > 0) {
      const img = data.images_results[0].original;
      imageCache[query] = img;
      return img;
    }
  } catch (error) {
    console.warn(`Gagal mengambil gambar untuk ${query}`, error);
  }
  return fallback;
}

/**
 * Algoritma Rekomendasi (SerpApi Google Flights + Google Images)
 *
 * - estTotalCost = (tiketPP × people) + (hotelPerMalam × days)
 * - Destinasi hanya lolos jika estTotalCost <= budget
 * - Gaya liburan mempengaruhi prioritas skor:
 *     hemat   → utamakan harga terendah
 *     balance → seimbangkan harga & kenyamanan
 *     luxury  → utamakan kenyamanan (hotel mahal, destinasi premium)
 * - vacationType mempengaruhi bonus skor destinasi yang sesuai
 */
export async function getRecommendations(
  userBudget: number,
  people: number = 2,
  days: number = 3,
  style: TripStyle = 'balance',
  vacationType?: string,
): Promise<RecommendationResult[]> {
  const nextLW = getNextLongWeekend();

  const outDate = nextLW ? nextLW.startDate : new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0];
  const inDate  = nextLW ? nextLW.endDate   : new Date(Date.now() + 86400000 * 10).toISOString().split('T')[0];

  const results = await Promise.all(BASE_DESTINATIONS.map(async (baseDest) => {
    const rawFlight = await fetchFlightPrice(baseDest.id, outDate, inDate);
    const image     = await fetchImage(baseDest.searchQuery, baseDest.fallbackImage);
    const weatherForecast: 'Sunny' | 'Rainy' = Math.random() > 0.3 ? 'Sunny' : 'Rainy';

    const fallbacks: Record<string, number> = {
      DPS: 1200000, YIA: 800000, LBJ: 2500000, MLG: 1100000,
      LOP: 1300000, KNO: 1900000, SOQ: 4500000, BDO: 200000,
    };
    // Harga tiket per orang (PP). Kalikan dengan jumlah orang.
    const pricePerPerson  = rawFlight || fallbacks[baseDest.id];
    const totalFlightCost = pricePerPerson * people;
    // Hotel per malam untuk seluruh grup. Kalikan dengan durasi.
    const totalHotelCost  = baseDest.hotelPerNight * days;
    const estTotalCost    = totalFlightCost + totalHotelCost;
    const canAfford       = estTotalCost <= userBudget;

    const tags = [...baseDest.baseTags] as { label: string; type: 'normal' | 'danger' | 'warning' | 'success' }[];
    let score = 0;

    // ── Bonus berdasarkan tipe liburan user ──────────────────────────────
    if (vacationType && baseDest.vacationTypes.includes(vacationType as 'kota' | 'alam' | 'pantai' | 'gunung')) {
      score += 25;
      tags.push({ label: '⭐ Sesuai Preferensi', type: 'success' });
    }

    // ── Syarat utama: total biaya tidak melebihi budget ──────────────────
    if (canAfford) {
      tags.push({ label: '💰 Pas Budget', type: 'success' });
    } else {
      // Destinasi melebihi budget mendapat penalti besar — tetap muncul di
      // bawah daftar sebagai referensi tapi tidak direkomendasikan.
      score -= 60;
      tags.push({ label: '⚠️ Melebihi Budget', type: 'danger' });
    }

    // ── Skor berdasarkan gaya liburan ────────────────────────────────────
    if (style === 'hemat') {
      // Utamakan harga serendah mungkin
      const ratio = estTotalCost / userBudget;
      if (ratio <= 0.5)      score += 50;
      else if (ratio <= 0.7) score += 35;
      else if (ratio <= 0.9) score += 20;
      else if (ratio <= 1.0) score += 5;
      // Penalti hotel mahal
      if (baseDest.hotelPerNight > 1_000_000) score -= 25;
      if (baseDest.hotelPerNight > 1_800_000) score -= 25;
    } else if (style === 'luxury') {
      // Utamakan kenyamanan — hotel premium dan destinasi prestisius
      if (baseDest.hotelPerNight >= 2_500_000) score += 50;
      else if (baseDest.hotelPerNight >= 1_500_000) score += 30;
      else if (baseDest.hotelPerNight >= 1_000_000) score += 10;
      else score -= 30; // Hotel murah tidak cocok untuk luxury
      // Bonus destinasi premium (Raja Ampat, Labuan Bajo, Bali)
      if (['SOQ', 'LBJ', 'DPS'].includes(baseDest.id)) score += 20;
      if (canAfford) score += 20;
    } else {
      // balance: seimbangkan harga & durasi perjalanan
      if (canAfford) score += 30;
      // Bonus jika durasi terbang cocok dengan panjang liburan
      if (baseDest.flightDurationHours <= 2 && days <= 3)       score += 20;
      else if (baseDest.flightDurationHours > 2 && days > 3)    score += 20;
      else if (baseDest.flightDurationHours > 3 && days <= 3)   score -= 20;
      // Sisa budget setelah biaya pokok (kenyamanan)
      const remaining = userBudget - estTotalCost;
      if (canAfford && remaining > 1_000_000) score += 10;
    }

    // ── Cuaca ────────────────────────────────────────────────────────────
    if (weatherForecast === 'Sunny') {
      score += 20;
      tags.push({ label: '🟢 Cerah', type: 'success' });
    } else {
      score -= 20;
      tags.push({ label: '⛈️ Potensi Hujan', type: 'warning' });
    }

    return {
      id: baseDest.id,
      name: baseDest.name,
      location: baseDest.location,
      itinerary: baseDest.itinerary,
      image,
      flightPrice: pricePerPerson,
      hotelPerNight: baseDest.hotelPerNight,
      flightDurationHours: baseDest.flightDurationHours,
      weatherForecast,
      matchScore: score,
      estTotalCost,
      totalFlightCost,
      totalHotelCost,
      canAfford,
      dynamicTags: tags,
      vacationTypes: baseDest.vacationTypes,
    } as RecommendationResult;
  }));

  // Urutkan: skor tertinggi dulu; yang tidak terjangkau di paling bawah
  return results.sort((a, b) => b.matchScore - a.matchScore);
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}
