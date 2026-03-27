export type TripStyle = 'hemat' | 'balance' | 'luxury';

export interface TripInput {
  budget: number;
  people: number;
  days: number;
  origin: string;
  style: TripStyle;
}

export interface TransportOption {
  mode: 'flight' | 'train' | 'car' | 'bus' | 'krl' | 'speedboat' | 'ferry';
  label: string;
  pricePerPersonOneWay: number;
  durationHours: number;
}

export interface DestinationPlan {
  id: string;
  name: string;
  emoji: string;
  province: string;
  transport: TransportOption;
  transportTotalCost: number;
  nights: number;
  hotelName: string;
  hotelPerNight: number;
  hotelTotalCost: number;
  foodPerDayPerPerson: number;
  foodTotalCost: number;
  otherCosts: number;
  totalCost: number;
  remainingBudget: number;
  remainingLabel: 'Sangat cukup' | 'Cukup' | 'Pas-pasan' | 'Kurang';
  highlights: string[];
  summary: string;
  canAfford: boolean;
  transportWarningTriggered: boolean;
}

export interface TripPlanResult {
  recommendations: DestinationPlan[];
  budgetPerPerson: number;
  nearbyOnly: boolean;
  notEnoughBudget: boolean;
}

export const ORIGINS = [
  { id: 'jakarta', label: 'Jakarta' },
  { id: 'surabaya', label: 'Surabaya' },
  { id: 'bandung', label: 'Bandung' },
  { id: 'yogyakarta', label: 'Yogyakarta' },
  { id: 'medan', label: 'Medan' },
  { id: 'makassar', label: 'Makassar' },
  { id: 'semarang', label: 'Semarang' },
  { id: 'bali', label: 'Bali (Denpasar)' },
  { id: 'malang', label: 'Malang' },
];

// --- Destination data ---------------------------------------------------------

interface DestinationData {
  id: string;
  name: string;
  emoji: string;
  province: string;
  foodPerDayPerPerson: number;
  hotelRanges: { budget: number; midrange: number; luxury: number };
  highlights: string[];
}

const DESTINATIONS: DestinationData[] = [
  {
    id: 'bogor',
    name: 'Bogor',
    emoji: '🌿',
    province: 'Jawa Barat',
    foodPerDayPerPerson: 75000,
    hotelRanges: { budget: 180000, midrange: 320000, luxury: 600000 },
    highlights: ['Kebun Raya Bogor', 'Kawasan Puncak', 'Curug Cilember'],
  },
  {
    id: 'bandung',
    name: 'Bandung',
    emoji: '⛰️',
    province: 'Jawa Barat',
    foodPerDayPerPerson: 100000,
    hotelRanges: { budget: 220000, midrange: 450000, luxury: 900000 },
    highlights: ['Kawah Putih', 'Lembang & Farm House', 'Factory Outlet Dago'],
  },
  {
    id: 'yogyakarta',
    name: 'Yogyakarta',
    emoji: '🏛️',
    province: 'DI Yogyakarta',
    foodPerDayPerPerson: 120000,
    hotelRanges: { budget: 250000, midrange: 500000, luxury: 1200000 },
    highlights: ['Candi Borobudur', 'Prambanan & Keraton', 'Malioboro & Gudeg'],
  },
  {
    id: 'semarang',
    name: 'Semarang',
    emoji: '🏙️',
    province: 'Jawa Tengah',
    foodPerDayPerPerson: 90000,
    hotelRanges: { budget: 200000, midrange: 380000, luxury: 750000 },
    highlights: ['Lawang Sewu', 'Kota Lama Semarang', 'Lumpia & Tahu Gimbal'],
  },
  {
    id: 'malang',
    name: 'Malang',
    emoji: '🌺',
    province: 'Jawa Timur',
    foodPerDayPerPerson: 90000,
    hotelRanges: { budget: 200000, midrange: 380000, luxury: 800000 },
    highlights: ['Gunung Bromo (day trip)', 'Coban Rondo Waterfall', 'Batu Night Spectacular'],
  },
  {
    id: 'bali',
    name: 'Bali',
    emoji: '🌴',
    province: 'Bali',
    foodPerDayPerPerson: 175000,
    hotelRanges: { budget: 350000, midrange: 700000, luxury: 1800000 },
    highlights: ['Ubud & Tegalalang', 'Seminyak Beach', 'Tanah Lot & Uluwatu'],
  },
  {
    id: 'lombok',
    name: 'Lombok',
    emoji: '🏖️',
    province: 'NTB',
    foodPerDayPerPerson: 130000,
    hotelRanges: { budget: 280000, midrange: 550000, luxury: 1400000 },
    highlights: ['Gili Trawangan', 'Gunung Rinjani', 'Kuta Lombok'],
  },
  {
    id: 'labuanbajo',
    name: 'Labuan Bajo',
    emoji: '🦎',
    province: 'NTT',
    foodPerDayPerPerson: 200000,
    hotelRanges: { budget: 400000, midrange: 800000, luxury: 2500000 },
    highlights: ['Pulau Komodo', 'Pink Beach', 'Sailing Trip Flores'],
  },
  {
    id: 'bromo',
    name: 'Bromo',
    emoji: '🌋',
    province: 'Jawa Timur',
    foodPerDayPerPerson: 100000,
    hotelRanges: { budget: 200000, midrange: 450000, luxury: 900000 },
    highlights: ['Sunrise Penanjakan', 'Lautan Pasir Bromo', 'Savana Teletubbies'],
  },
];

// --- Transport routes ---------------------------------------------------------

interface RouteEntry {
  to: string;
  options: TransportOption[];
}

const ROUTES: Record<string, RouteEntry[]> = {
  jakarta: [
    {
      to: 'bogor',
      options: [
        { mode: 'krl', label: 'KRL Commuter Line', pricePerPersonOneWay: 10000, durationHours: 1.5 },
        { mode: 'bus', label: 'Bus Damri', pricePerPersonOneWay: 50000, durationHours: 2 },
      ],
    },
    {
      to: 'bandung',
      options: [
        { mode: 'train', label: 'Kereta Parahyangan', pricePerPersonOneWay: 80000, durationHours: 3 },
        { mode: 'train', label: 'Kereta Argo Parahyangan Eks', pricePerPersonOneWay: 350000, durationHours: 2.5 },
        { mode: 'bus', label: 'Bus Primajasa', pricePerPersonOneWay: 100000, durationHours: 3.5 },
      ],
    },
    {
      to: 'yogyakarta',
      options: [
        { mode: 'train', label: 'Kereta Ekonomi', pricePerPersonOneWay: 350000, durationHours: 8 },
        { mode: 'train', label: 'Kereta Eksekutif', pricePerPersonOneWay: 550000, durationHours: 7 },
        { mode: 'flight', label: 'Pesawat (CGK-JOG)', pricePerPersonOneWay: 500000, durationHours: 1 },
      ],
    },
    {
      to: 'semarang',
      options: [
        { mode: 'train', label: 'Kereta Tawang Jaya', pricePerPersonOneWay: 200000, durationHours: 6 },
        { mode: 'train', label: 'Kereta Eksekutif', pricePerPersonOneWay: 400000, durationHours: 5 },
        { mode: 'flight', label: 'Pesawat (CGK-SRG)', pricePerPersonOneWay: 350000, durationHours: 1 },
      ],
    },
    {
      to: 'malang',
      options: [
        { mode: 'train', label: 'Kereta Ekonomi', pricePerPersonOneWay: 450000, durationHours: 14 },
        { mode: 'flight', label: 'Pesawat (CGK-MLG)', pricePerPersonOneWay: 550000, durationHours: 1.5 },
      ],
    },
    {
      to: 'bali',
      options: [
        { mode: 'flight', label: 'Pesawat Low-cost (CGK-DPS)', pricePerPersonOneWay: 550000, durationHours: 2 },
        { mode: 'flight', label: 'Pesawat Full Service', pricePerPersonOneWay: 900000, durationHours: 2 },
      ],
    },
    {
      to: 'lombok',
      options: [
        { mode: 'flight', label: 'Pesawat (CGK-LOP)', pricePerPersonOneWay: 650000, durationHours: 2 },
      ],
    },
    {
      to: 'labuanbajo',
      options: [
        { mode: 'flight', label: 'Pesawat (CGK-LBJ) 1 stop', pricePerPersonOneWay: 1100000, durationHours: 4 },
      ],
    },
    {
      to: 'bromo',
      options: [
        { mode: 'flight', label: 'Pesawat (CGK-MLG)', pricePerPersonOneWay: 550000, durationHours: 1.5 },
      ],
    },
  ],

  surabaya: [
    {
      to: 'malang',
      options: [
        { mode: 'train', label: 'Kereta Penataran', pricePerPersonOneWay: 30000, durationHours: 2.5 },
        { mode: 'bus', label: 'Bus Patas', pricePerPersonOneWay: 50000, durationHours: 2 },
      ],
    },
    {
      to: 'yogyakarta',
      options: [
        { mode: 'train', label: 'Kereta Ekonomi', pricePerPersonOneWay: 200000, durationHours: 6 },
        { mode: 'train', label: 'Kereta Eksekutif', pricePerPersonOneWay: 350000, durationHours: 5 },
      ],
    },
    {
      to: 'bali',
      options: [
        { mode: 'flight', label: 'Pesawat (SUB-DPS)', pricePerPersonOneWay: 350000, durationHours: 1 },
        { mode: 'ferry', label: 'Feri + Bus Gilimanuk', pricePerPersonOneWay: 150000, durationHours: 6 },
      ],
    },
    {
      to: 'bandung',
      options: [
        { mode: 'train', label: 'Kereta Turangga', pricePerPersonOneWay: 300000, durationHours: 10 },
        { mode: 'flight', label: 'Pesawat (SUB-BDO)', pricePerPersonOneWay: 400000, durationHours: 1 },
      ],
    },
    {
      to: 'lombok',
      options: [
        { mode: 'flight', label: 'Pesawat (SUB-LOP)', pricePerPersonOneWay: 400000, durationHours: 1.5 },
      ],
    },
    {
      to: 'bromo',
      options: [
        { mode: 'bus', label: 'Bus Damri ke Probolinggo', pricePerPersonOneWay: 60000, durationHours: 3 },
      ],
    },
  ],

  bandung: [
    {
      to: 'yogyakarta',
      options: [
        { mode: 'train', label: 'Kereta Lodaya', pricePerPersonOneWay: 250000, durationHours: 7 },
        { mode: 'train', label: 'Kereta Eksekutif', pricePerPersonOneWay: 450000, durationHours: 6.5 },
      ],
    },
    {
      to: 'jakarta',
      options: [
        { mode: 'train', label: 'Kereta Parahyangan', pricePerPersonOneWay: 80000, durationHours: 3 },
      ],
    },
    {
      to: 'bali',
      options: [
        { mode: 'flight', label: 'Pesawat (BDO-DPS)', pricePerPersonOneWay: 500000, durationHours: 2 },
      ],
    },
    {
      to: 'semarang',
      options: [
        { mode: 'train', label: 'Kereta Harina', pricePerPersonOneWay: 200000, durationHours: 6 },
      ],
    },
    {
      to: 'bogor',
      options: [
        { mode: 'bus', label: 'Bus Primajasa', pricePerPersonOneWay: 80000, durationHours: 3 },
      ],
    },
  ],

  yogyakarta: [
    {
      to: 'bali',
      options: [
        { mode: 'flight', label: 'Pesawat (JOG-DPS)', pricePerPersonOneWay: 400000, durationHours: 1.5 },
      ],
    },
    {
      to: 'semarang',
      options: [
        { mode: 'train', label: 'Kereta Kaligung', pricePerPersonOneWay: 80000, durationHours: 2 },
        { mode: 'bus', label: 'Bus Semarang', pricePerPersonOneWay: 50000, durationHours: 2.5 },
      ],
    },
    {
      to: 'jakarta',
      options: [
        { mode: 'train', label: 'Kereta Eksekutif', pricePerPersonOneWay: 550000, durationHours: 7 },
      ],
    },
    {
      to: 'bandung',
      options: [
        { mode: 'train', label: 'Kereta Lodaya', pricePerPersonOneWay: 250000, durationHours: 7 },
      ],
    },
    {
      to: 'malang',
      options: [
        { mode: 'train', label: 'Kereta Malioboro', pricePerPersonOneWay: 200000, durationHours: 7 },
      ],
    },
    {
      to: 'bromo',
      options: [
        { mode: 'train', label: 'Kereta Malioboro', pricePerPersonOneWay: 200000, durationHours: 7 },
      ],
    },
  ],

  semarang: [
    {
      to: 'yogyakarta',
      options: [
        { mode: 'train', label: 'Kereta Kaligung', pricePerPersonOneWay: 80000, durationHours: 2 },
        { mode: 'bus', label: 'Bus Semarang', pricePerPersonOneWay: 50000, durationHours: 2.5 },
      ],
    },
    {
      to: 'jakarta',
      options: [
        { mode: 'train', label: 'Kereta Eksekutif', pricePerPersonOneWay: 400000, durationHours: 5 },
        { mode: 'flight', label: 'Pesawat (SRG-CGK)', pricePerPersonOneWay: 350000, durationHours: 1 },
      ],
    },
    {
      to: 'bandung',
      options: [
        { mode: 'train', label: 'Kereta Harina', pricePerPersonOneWay: 200000, durationHours: 6 },
      ],
    },
    {
      to: 'bali',
      options: [
        { mode: 'flight', label: 'Pesawat (SRG-DPS)', pricePerPersonOneWay: 500000, durationHours: 2 },
      ],
    },
    {
      to: 'malang',
      options: [
        { mode: 'train', label: 'Kereta', pricePerPersonOneWay: 150000, durationHours: 5 },
      ],
    },
  ],

  bali: [
    {
      to: 'lombok',
      options: [
        { mode: 'speedboat', label: 'Speedboat Gili Fast Boat', pricePerPersonOneWay: 200000, durationHours: 2 },
        { mode: 'flight', label: 'Pesawat (DPS-LOP)', pricePerPersonOneWay: 350000, durationHours: 0.5 },
      ],
    },
    {
      to: 'labuanbajo',
      options: [
        { mode: 'flight', label: 'Pesawat (DPS-LBJ)', pricePerPersonOneWay: 600000, durationHours: 1.5 },
      ],
    },
    {
      to: 'yogyakarta',
      options: [
        { mode: 'flight', label: 'Pesawat (DPS-JOG)', pricePerPersonOneWay: 400000, durationHours: 1.5 },
      ],
    },
    {
      to: 'jakarta',
      options: [
        { mode: 'flight', label: 'Pesawat Low-cost (DPS-CGK)', pricePerPersonOneWay: 550000, durationHours: 2 },
      ],
    },
    {
      to: 'bromo',
      options: [
        { mode: 'bus', label: 'Bus + Jeep wisata', pricePerPersonOneWay: 200000, durationHours: 5 },
      ],
    },
  ],

  malang: [
    {
      to: 'bali',
      options: [
        { mode: 'flight', label: 'Pesawat (MLG-DPS)', pricePerPersonOneWay: 350000, durationHours: 1 },
      ],
    },
    {
      to: 'jakarta',
      options: [
        { mode: 'flight', label: 'Pesawat (MLG-CGK)', pricePerPersonOneWay: 550000, durationHours: 1.5 },
      ],
    },
    {
      to: 'yogyakarta',
      options: [
        { mode: 'train', label: 'Kereta Malioboro', pricePerPersonOneWay: 200000, durationHours: 7 },
      ],
    },
    {
      to: 'bromo',
      options: [
        { mode: 'bus', label: 'Bus + Jeep wisata', pricePerPersonOneWay: 80000, durationHours: 2 },
      ],
    },
    {
      to: 'surabaya',
      options: [
        { mode: 'train', label: 'Kereta Penataran', pricePerPersonOneWay: 30000, durationHours: 2.5 },
      ],
    },
  ],

  medan: [
    {
      to: 'bali',
      options: [
        { mode: 'flight', label: 'Pesawat (KNO-DPS) 1 stop', pricePerPersonOneWay: 800000, durationHours: 4 },
      ],
    },
    {
      to: 'yogyakarta',
      options: [
        { mode: 'flight', label: 'Pesawat (KNO-JOG) 1 stop', pricePerPersonOneWay: 600000, durationHours: 3 },
      ],
    },
    {
      to: 'jakarta',
      options: [
        { mode: 'flight', label: 'Pesawat (KNO-CGK)', pricePerPersonOneWay: 500000, durationHours: 2.5 },
      ],
    },
    {
      to: 'bandung',
      options: [
        { mode: 'flight', label: 'Pesawat (KNO-BDO)', pricePerPersonOneWay: 550000, durationHours: 2.5 },
      ],
    },
    {
      to: 'lombok',
      options: [
        { mode: 'flight', label: 'Pesawat (KNO-LOP) 1 stop', pricePerPersonOneWay: 900000, durationHours: 4.5 },
      ],
    },
  ],

  makassar: [
    {
      to: 'bali',
      options: [
        { mode: 'flight', label: 'Pesawat (UPG-DPS)', pricePerPersonOneWay: 400000, durationHours: 2 },
      ],
    },
    {
      to: 'lombok',
      options: [
        { mode: 'flight', label: 'Pesawat (UPG-LOP)', pricePerPersonOneWay: 400000, durationHours: 1.5 },
      ],
    },
    {
      to: 'labuanbajo',
      options: [
        { mode: 'flight', label: 'Pesawat (UPG-LBJ)', pricePerPersonOneWay: 500000, durationHours: 1.5 },
      ],
    },
    {
      to: 'jakarta',
      options: [
        { mode: 'flight', label: 'Pesawat (UPG-CGK)', pricePerPersonOneWay: 500000, durationHours: 2.5 },
      ],
    },
    {
      to: 'yogyakarta',
      options: [
        { mode: 'flight', label: 'Pesawat (UPG-JOG)', pricePerPersonOneWay: 450000, durationHours: 2 },
      ],
    },
  ],
};

// --- Helpers ------------------------------------------------------------------

function formatRp(n: number): string {
  return 'Rp ' + n.toLocaleString('id-ID');
}

function pickTransport(options: TransportOption[], style: TripStyle): TransportOption {
  if (options.length === 1) return options[0];
  const sorted = [...options].sort((a, b) => a.pricePerPersonOneWay - b.pricePerPersonOneWay);
  if (style === 'hemat') return sorted[0];
  if (style === 'luxury') return sorted[sorted.length - 1];
  const midIndex = Math.floor((sorted.length - 1) / 2);
  return sorted[midIndex];
}

// --- Main export --------------------------------------------------------------

export function planTrip(input: TripInput): TripPlanResult {
  const { budget, people, days, origin, style } = input;
  const budgetPerPerson = Math.round(budget / people);

  const routes = ROUTES[origin] ?? [];
  const destMap = new Map<string, DestinationData>(DESTINATIONS.map(d => [d.id, d]));

  const plans: DestinationPlan[] = [];

  for (const route of routes) {
    if (route.to === origin) continue;
    const dest = destMap.get(route.to);
    if (!dest) continue;

    const transport = pickTransport(route.options, style);

    const transportTotalCost = transport.pricePerPersonOneWay * 2 * people;
    const nights = Math.max(days - 1, 1);
    const rooms = Math.ceil(people / 2);

    const hotelPerNight =
      style === 'hemat'
        ? dest.hotelRanges.budget
        : style === 'balance'
        ? dest.hotelRanges.midrange
        : dest.hotelRanges.luxury;

    const hotelName =
      style === 'hemat'
        ? 'Homestay/Penginapan Budget'
        : style === 'balance'
        ? 'Hotel Bintang 2-3'
        : 'Hotel Bintang 4-5';

    const hotelTotalCost = hotelPerNight * nights * rooms;
    const foodTotalCost = dest.foodPerDayPerPerson * days * people;
    const otherCosts = 50000 * days * people;
    const totalCost = transportTotalCost + hotelTotalCost + foodTotalCost + otherCosts;
    const remainingBudget = budget - totalCost;
    const canAfford = remainingBudget >= 0;
    const transportWarningTriggered = transportTotalCost > budget * 0.5;

    let remainingLabel: DestinationPlan['remainingLabel'];
    if (remainingBudget >= totalCost * 0.4) {
      remainingLabel = 'Sangat cukup';
    } else if (remainingBudget >= totalCost * 0.15) {
      remainingLabel = 'Cukup';
    } else if (remainingBudget >= 0) {
      remainingLabel = 'Pas-pasan';
    } else {
      remainingLabel = 'Kurang';
    }

    const summary =
      `Dengan ${formatRp(budget)}, kamu bisa ke ${dest.name}. ` +
      `${transport.label} PP (${formatRp(transportTotalCost)}), ` +
      `Hotel ${nights} malam (${formatRp(hotelTotalCost)}), ` +
      `Sisa ${formatRp(Math.abs(remainingBudget))} ` +
      `${remainingBudget >= 0 ? 'untuk' : 'kurang untuk'} makan & wisata (${remainingLabel}).`;

    plans.push({
      id: dest.id,
      name: dest.name,
      emoji: dest.emoji,
      province: dest.province,
      transport,
      transportTotalCost,
      nights,
      hotelName,
      hotelPerNight,
      hotelTotalCost,
      foodPerDayPerPerson: dest.foodPerDayPerPerson,
      foodTotalCost,
      otherCosts,
      totalCost,
      remainingBudget,
      remainingLabel,
      highlights: dest.highlights,
      summary,
      canAfford,
      transportWarningTriggered,
    });
  }

  // Sort: affordable first, then by remainingBudget descending
  plans.sort((a, b) => {
    if (a.canAfford !== b.canAfford) return a.canAfford ? -1 : 1;
    return b.remainingBudget - a.remainingBudget;
  });

  const affordablePlans = plans.filter(p => p.canAfford);

  const nearbyOnly =
    affordablePlans.length > 0 &&
    affordablePlans.every(p => p.transportWarningTriggered);

  const notEnoughBudget = affordablePlans.length === 0;

  // Return top 5: up to 4 affordable + 1-2 stretch goals
  const affordable = plans.filter(p => p.canAfford).slice(0, 4);
  const stretch = plans.filter(p => !p.canAfford).slice(0, 2);
  const recommendations = [...affordable, ...stretch].slice(0, 5);

  return {
    recommendations,
    budgetPerPerson,
    nearbyOnly,
    notEnoughBudget,
  };
}
