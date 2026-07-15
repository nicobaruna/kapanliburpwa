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

export interface RoadTripDetails {
  distanceKm: number;
  litersNeeded: number;
  pertalitePerLiter: number;
  fuelCostTotal: number;
  tollCostTotal: number;
  totalRoadTripCost: number;
}

export interface RecommendationResult extends Destination {
  matchScore: number;
  estTotalCost: number;
  totalFlightCost: number;
  totalHotelCost: number;
  canAfford: boolean;
  isRoadTrip: boolean;
  roadTripDetails?: RoadTripDetails;
  dynamicTags: { label: string; type: 'normal' | 'danger' | 'warning' | 'success' }[];
}

const BASE_DESTINATIONS: (Omit<Destination, 'image' | 'weatherForecast' | 'flightPrice'> & { searchQuery: string })[] = [
  {
    id: 'DPS',
    name: 'Uluwatu, Bali',
    location: 'Bali, Indonesia',
    hotelPerNight: 1200000,
    flightDurationHours: 1.5,
    searchQuery: 'Uluwatu Bali Temple',
    baseTags: [{ label: '🏖️ Pantai', type: 'normal' }, { label: 'TRENDING', type: 'danger' }],
    vacationTypes: ['pantai'],
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
    searchQuery: 'Borobudur Temple Sunrise',
    baseTags: [{ label: '🏛️ Budaya', type: 'normal' }],
    vacationTypes: ['kota'],
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
    searchQuery: 'Labuan Bajo Padar Island',
    baseTags: [{ label: '🌊 Premium', type: 'warning' }],
    vacationTypes: ['pantai', 'alam'],
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
    searchQuery: 'Mount Bromo Sunrise',
    baseTags: [{ label: '⛰️ Petualangan Alam', type: 'normal' }],
    vacationTypes: ['gunung', 'alam'],
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
    searchQuery: 'Gili Trawangan Beach',
    baseTags: [{ label: '🚤 Island Hopping', type: 'normal' }],
    vacationTypes: ['pantai'],
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
    searchQuery: 'Lake Toba Samosir',
    baseTags: [{ label: '🛶 Sejarah Alam', type: 'normal' }],
    vacationTypes: ['alam'],
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
    searchQuery: 'Wayag Raja Ampat',
    baseTags: [{ label: '💎 Ultimate Dream', type: 'danger' }],
    vacationTypes: ['pantai', 'alam'],
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
    searchQuery: 'Lembang Bandung',
    baseTags: [{ label: '🚗 Roadtrip Recommended', type: 'success' }],
    vacationTypes: ['alam', 'kota'],
    itinerary: [
      { day: 1, title: 'Tiba & Kuliner', activities: ['Perjalanan via Tol (Jika dari Jakarta) / Pesawat', 'Makan di Kampung Daun', 'Lembang Park & Zoo'] },
      { day: 2, title: 'Wisata Alam', activities: ['Tangkuban Perahu', 'Floating Market Lembang', 'Orchid Forest Cikole'] },
      { day: 3, title: 'Belanja & Santai', activities: ['Braga City Walk', 'Oleh-oleh Kartika Sari / Brownies Amanda', 'Pulang'] }
    ]
  }
];

// ── Road Trip constants ────────────────────────────────────────────────────────
const PERTALITE_PER_LITER = 10_000;
const KM_PER_LITER = 10;

const ROAD_TRIP_TABLE: Record<string, Record<string, { distanceKm: number; tollOneWayRp: number }>> = {
  BDO: {
    jakarta: { distanceKm: 150, tollOneWayRp: 55_000 },
    bandung: { distanceKm: 30, tollOneWayRp: 0 },
    surabaya: { distanceKm: 700, tollOneWayRp: 185_000 },
    yogyakarta: { distanceKm: 390, tollOneWayRp: 100_000 },
    semarang: { distanceKm: 340, tollOneWayRp: 95_000 },
    malang: { distanceKm: 780, tollOneWayRp: 200_000 },
    medan: { distanceKm: 2150, tollOneWayRp: 0 },
    makassar: { distanceKm: 2500, tollOneWayRp: 0 },
    bali: { distanceKm: 1250, tollOneWayRp: 0 },
  },
};

function calcRoadTrip(destId: string, origin: string): RoadTripDetails | null {
  const table = ROAD_TRIP_TABLE[destId];
  if (!table) return null;
  const data = table[origin] ?? table['jakarta'];
  const distanceKm = data.distanceKm;
  const litersNeeded = (distanceKm * 2) / KM_PER_LITER;
  const fuelCostTotal = Math.round(litersNeeded * PERTALITE_PER_LITER);
  const tollCostTotal = data.tollOneWayRp * 2;
  return {
    distanceKm,
    litersNeeded,
    pertalitePerLiter: PERTALITE_PER_LITER,
    fuelCostTotal,
    tollCostTotal,
    totalRoadTripCost: fuelCostTotal + tollCostTotal,
  };
}

const ROAD_TRIP_IDS = new Set(['BDO']);

// ── Caches ────────────────────────────────────────────────────────────────────
const flightCache: Record<string, number> = {};
const imageCache: Record<string, string> = {};

// ── Image fallbacks per destination ──────────────────────────────────────────
const IMAGE_FALLBACKS: Record<string, string> = {
  DPS: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
  YIA: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800',
  LBJ: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800',
  MLG: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=800',
  LOP: 'https://images.unsplash.com/photo-1520402099678-4c9e02b0e7c5?w=800',
  KNO: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
  SOQ: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
  BDO: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800',
};

async function fetchFlightPrice(destinationIATA: string, outDate: string, inDate: string): Promise<number> {
  if (ROAD_TRIP_IDS.has(destinationIATA)) return 0;
  const cacheKey = `${destinationIATA}_${outDate}_${inDate}`;
  if (flightCache[cacheKey]) return flightCache[cacheKey];

  try {
    const url = `/api/serp/search.json?engine=google_flights&departure_id=CGK&arrival_id=${destinationIATA}&outbound_date=${outDate}&return_date=${inDate}&currency=IDR&hl=id&api_key=${SERP_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.best_flights?.length > 0) {
      flightCache[cacheKey] = data.best_flights[0].price;
      return flightCache[cacheKey];
    } else if (data.other_flights?.length > 0) {
      flightCache[cacheKey] = data.other_flights[0].price;
      return flightCache[cacheKey];
    }
  } catch (error) {
    console.warn(`Gagal mengambil harga tiket untuk ${destinationIATA}`, error);
  }
  return 0;
}

// FIX 3: added required `fallback` parameter
async function fetchImage(query: string, fallback: string): Promise<string> {
  if (imageCache[query]) return imageCache[query];
  if (!SERP_API_KEY) return fallback;
  try {
    const url = `/api/serp/search.json?engine=google_images&q=${encodeURIComponent(query + ' tourism high quality')}&api_key=${SERP_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.images_results?.length > 0) {
      imageCache[query] = data.images_results[0].original;
      return imageCache[query];
    }
  } catch (error) {
    console.warn(`Gagal mengambil gambar untuk ${query}`, error);
  }
  return fallback;
}

export async function getRecommendations(
  userBudget: number,
  people: number = 2,
  days: number = 3,
  style: TripStyle = 'balance',
  origin: string = 'jakarta',
  // FIX 2: added vacationType as an explicit optional parameter
  vacationType?: 'kota' | 'alam' | 'pantai' | 'gunung',
): Promise<RecommendationResult[]> {
  const nextLW = getNextLongWeekend();
  const outDate = nextLW ? nextLW.startDate : new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0];
  const inDate = nextLW ? nextLW.endDate : new Date(Date.now() + 86400000 * 10).toISOString().split('T')[0];

  const results = await Promise.all(BASE_DESTINATIONS.map(async (baseDest) => {
    const isRoadTrip = ROAD_TRIP_IDS.has(baseDest.id);
    const rawFlight = await fetchFlightPrice(baseDest.id, outDate, inDate);
    // FIX 3: pass per-destination fallback URL to fetchImage
    const image = await fetchImage(baseDest.searchQuery, IMAGE_FALLBACKS[baseDest.id] ?? '');
    // FIX 4: match the full union type from the Destination interface
    const weatherForecast: 'Sunny' | 'Rainy' | 'Cloudy' = Math.random() > 0.3 ? 'Sunny' : 'Rainy';

    const flightFallbacks: Record<string, number> = {
      DPS: 1_200_000, YIA: 800_000, LBJ: 2_500_000, MLG: 1_100_000,
      LOP: 1_300_000, KNO: 1_900_000, SOQ: 4_500_000,
    };

    let totalFlightCost: number;
    let pricePerPerson: number;
    let roadTripDetails: RoadTripDetails | undefined;

    if (isRoadTrip) {
      roadTripDetails = calcRoadTrip(baseDest.id, origin) ?? {
        distanceKm: 150, litersNeeded: 30, pertalitePerLiter: PERTALITE_PER_LITER,
        fuelCostTotal: 300_000, tollCostTotal: 110_000, totalRoadTripCost: 410_000,
      };
      totalFlightCost = roadTripDetails.totalRoadTripCost;
      pricePerPerson = 0;
    } else {
      pricePerPerson = rawFlight || flightFallbacks[baseDest.id] || 0;
      totalFlightCost = pricePerPerson * people;
    }

    const totalHotelCost = baseDest.hotelPerNight * days;
    const estTotalCost = totalFlightCost + totalHotelCost;
    const canAfford = estTotalCost <= userBudget;

    const tags = [...baseDest.baseTags] as { label: string; type: 'normal' | 'danger' | 'warning' | 'success' }[];
    let score = 0;

    // ── Bonus berdasarkan tipe liburan user ──────────────────────────────
    if (vacationType && baseDest.vacationTypes.includes(vacationType)) {
      score += 25;
      tags.push({ label: '⭐ Sesuai Preferensi', type: 'success' });
    }

    // ── Syarat utama: total biaya tidak melebihi budget ──────────────────
    if (canAfford) {
      tags.push({ label: '💰 Pas Budget', type: 'success' });
    } else {
      score -= 60;
      tags.push({ label: '⚠️ Melebihi Budget', type: 'danger' });
    }

    // ── Skor berdasarkan gaya liburan ────────────────────────────────────
    if (style === 'hemat') {
      const ratio = estTotalCost / userBudget;
      if (ratio <= 0.5) score += 50;
      else if (ratio <= 0.7) score += 35;
      else if (ratio <= 0.9) score += 20;
      else if (ratio <= 1.0) score += 5;
      if (baseDest.hotelPerNight > 1_000_000) score -= 25;
      if (baseDest.hotelPerNight > 1_800_000) score -= 25;
      if (isRoadTrip) score += 15;
    } else if (style === 'luxury') {
      if (baseDest.hotelPerNight >= 2_500_000) score += 50;
      else if (baseDest.hotelPerNight >= 1_500_000) score += 30;
      else if (baseDest.hotelPerNight >= 1_000_000) score += 10;
      else score -= 30;
      if (['SOQ', 'LBJ', 'DPS'].includes(baseDest.id)) score += 20;
      if (canAfford) score += 20;
    } else {
      // balance
      if (canAfford) score += 30;
      if (baseDest.flightDurationHours <= 2 && days <= 3) score += 20;
      else if (baseDest.flightDurationHours > 2 && days > 3) score += 20;
      else if (baseDest.flightDurationHours > 3 && days <= 3) score -= 20;
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
      isRoadTrip,
      roadTripDetails,
      dynamicTags: tags,
      vacationTypes: baseDest.vacationTypes,
      baseTags: baseDest.baseTags,
    } as RecommendationResult;
  }));

  return results.sort((a, b) => b.matchScore - a.matchScore);
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}