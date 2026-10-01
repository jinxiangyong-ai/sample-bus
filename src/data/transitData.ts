export interface BusArrivalSlot {
  etaMinutes: number | 'Arr';
  occupancy: 'seats' | 'standing' | 'limited';
  busType: 'SD' | 'DD' | 'BD'; // Single Decker, Double Decker, Bendy
  wheelchair: boolean;
  busPlate?: string;
  speedKmH?: number;
}

export interface BusServiceArrival {
  serviceNumber: string;
  destination: string;
  category: 'Trunk Route' | 'Express Sector' | 'High Demand' | 'Feeder Service';
  viaInfo: string;
  nextBus: BusArrivalSlot;
  secondBus: BusArrivalSlot;
  thirdBus: BusArrivalSlot;
  routeStops: {
    stopCode: string;
    stopName: string;
    road: string;
    isCurrent?: boolean;
    hasBus?: boolean;
    busEta?: string;
    busPlate?: string;
    mrtInterchange?: string[];
  }[];
}

export interface BusStop {
  stopCode: string;
  stopName: string;
  roadName: string;
  towards: string;
  distanceMeters: number;
  walkMinutes: number;
  nearestMrt: string;
  lat: number;
  lng: number;
  services: BusServiceArrival[];
}

export interface TrainLineStatus {
  code: string;
  name: string;
  lineName: string;
  bgColor: string;
  textColor: string;
  status: 'Normal' | 'Delay' | 'Disrupted';
  frequency: string;
  interchangeStops: string;
  notes: string;
}

export interface TransitAlert {
  id: string;
  title: string;
  category: 'Road Closure' | 'Train Service' | 'Bus Bridging' | 'Advisory';
  date: string;
  severity: 'warning' | 'info' | 'critical';
  details: string;
  affectedServices: string[];
}

export const BUS_STOPS_DATABASE: Record<string, BusStop> = {
  '03011': {
    stopCode: '03011',
    stopName: 'Fullerton Sq',
    roadName: 'Fullerton Rd',
    towards: 'Shenton Way / Raffles Place MRT',
    distanceMeters: 120,
    walkMinutes: 2,
    nearestMrt: 'EW14 / NS26 Raffles Pl',
    lat: 1.2862,
    lng: 103.8532,
    services: [
      {
        serviceNumber: '10',
        destination: 'Tampines Concourse Int',
        category: 'Trunk Route',
        viaInfo: 'Via Marine Parade • Bedok South • Tanah Merah',
        nextBus: {
          etaMinutes: 'Arr',
          occupancy: 'seats',
          busType: 'DD',
          wheelchair: true,
          busPlate: 'SBS3982H',
          speedKmH: 18,
        },
        secondBus: {
          etaMinutes: 7,
          occupancy: 'standing',
          busType: 'DD',
          wheelchair: true,
          busPlate: 'SBS7412A',
          speedKmH: 26,
        },
        thirdBus: {
          etaMinutes: 16,
          occupancy: 'seats',
          busType: 'SD',
          wheelchair: true,
          busPlate: 'SBS6201K',
          speedKmH: 34,
        },
        routeStops: [
          { stopCode: '03211', stopName: 'Shenton Way Ter', road: 'Shenton Way' },
          { stopCode: '03111', stopName: 'UIC Bldg', road: 'Shenton Way' },
          { stopCode: '03011', stopName: 'Fullerton Sq', road: 'Fullerton Rd', isCurrent: true, hasBus: true, busEta: 'ARRIVING', busPlate: 'SBS3982H' },
          { stopCode: '03019', stopName: 'OUE Bayfront', road: 'Collyer Quay' },
          { stopCode: '03021', stopName: 'Prudential Twr', road: 'Cecil St', hasBus: true, busEta: '7 mins away', busPlate: 'SBS7412A' },
          { stopCode: '01112', stopName: 'Bugis Cube', road: 'Victoria St', mrtInterchange: ['DT14', 'EW12'] },
          { stopCode: '80011', stopName: 'Marine Parade Prom', road: 'Marine Parade Rd' },
          { stopCode: '84009', stopName: 'Bedok South Ave 3', road: 'Bedok South Rd' },
          { stopCode: '75009', stopName: 'Tampines Concourse Int', road: 'Tampines Ave 5', mrtInterchange: ['EW2', 'DT32'] },
        ],
      },
      {
        serviceNumber: '70',
        destination: 'Yio Chu Kang Int',
        category: 'Express Sector',
        viaInfo: 'Via Nicoll Highway • Paya Lebar Rd • Serangoon Ctrl',
        nextBus: {
          etaMinutes: 3,
          occupancy: 'standing',
          busType: 'DD',
          wheelchair: true,
          busPlate: 'SBS6412T',
          speedKmH: 24,
        },
        secondBus: {
          etaMinutes: 12,
          occupancy: 'seats',
          busType: 'DD',
          wheelchair: true,
          busPlate: 'SBS3190C',
          speedKmH: 30,
        },
        thirdBus: {
          etaMinutes: 24,
          occupancy: 'seats',
          busType: 'SD',
          wheelchair: true,
          busPlate: 'SBS8823M',
          speedKmH: 38,
        },
        routeStops: [
          { stopCode: '03211', stopName: 'Shenton Way Ter', road: 'Shenton Way' },
          { stopCode: '03011', stopName: 'Fullerton Sq', road: 'Fullerton Rd', isCurrent: true, hasBus: true, busEta: '3 mins away', busPlate: 'SBS6412T' },
          { stopCode: '80199', stopName: 'National Stadium', road: 'Stadium Rd', mrtInterchange: ['CC6'] },
          { stopCode: '81111', stopName: 'Paya Lebar Stn', road: 'Paya Lebar Rd', mrtInterchange: ['EW8', 'CC9'] },
          { stopCode: '66009', stopName: 'Serangoon Central', road: 'Serangoon Ave 2', mrtInterchange: ['NE12', 'CC13'] },
          { stopCode: '55189', stopName: 'Yio Chu Kang Int', road: 'Ang Mo Kio Ave 8', mrtInterchange: ['NS15'] },
        ],
      },
      {
        serviceNumber: '100',
        destination: 'Serangoon Int',
        category: 'High Demand',
        viaInfo: 'Via Beach Rd • Geylang West • Upper Serangoon Rd',
        nextBus: {
          etaMinutes: 1,
          occupancy: 'limited',
          busType: 'DD',
          wheelchair: true,
          busPlate: 'SBS3800B',
          speedKmH: 15,
        },
        secondBus: {
          etaMinutes: 9,
          occupancy: 'standing',
          busType: 'DD',
          wheelchair: true,
          busPlate: 'SBS7511K',
          speedKmH: 28,
        },
        thirdBus: {
          etaMinutes: 18,
          occupancy: 'seats',
          busType: 'SD',
          wheelchair: true,
          busPlate: 'SBS6830U',
          speedKmH: 35,
        },
        routeStops: [
          { stopCode: '14119', stopName: 'HarbourFront Int', road: 'Telok Blangah Rd' },
          { stopCode: '03011', stopName: 'Fullerton Sq', road: 'Fullerton Rd', isCurrent: true, hasBus: true, busEta: '1 min away', busPlate: 'SBS3800B' },
          { stopCode: '01059', stopName: 'The Plaza', road: 'Beach Rd' },
          { stopCode: '80059', stopName: 'Geylang West CC', road: 'Upper Boon Keng Rd' },
          { stopCode: '66009', stopName: 'Serangoon Int', road: 'Serangoon Central', mrtInterchange: ['NE12', 'CC13'] },
        ],
      },
      {
        serviceNumber: '107',
        destination: 'Hougang Ctrl Int',
        category: 'Trunk Route',
        viaInfo: 'Via Lavender Stn • Kallang Bahru • Upper Paya Lebar',
        nextBus: {
          etaMinutes: 5,
          occupancy: 'seats',
          busType: 'SD',
          wheelchair: true,
          busPlate: 'SBS6122Z',
          speedKmH: 22,
        },
        secondBus: {
          etaMinutes: 14,
          occupancy: 'seats',
          busType: 'DD',
          wheelchair: true,
          busPlate: 'SBS3402P',
          speedKmH: 32,
        },
        thirdBus: {
          etaMinutes: 28,
          occupancy: 'seats',
          busType: 'DD',
          wheelchair: true,
          busPlate: 'SBS3910L',
          speedKmH: 29,
        },
        routeStops: [
          { stopCode: '03211', stopName: 'Shenton Way Ter', road: 'Shenton Way' },
          { stopCode: '03011', stopName: 'Fullerton Sq', road: 'Fullerton Rd', isCurrent: true, hasBus: true, busEta: '5 mins away', busPlate: 'SBS6122Z' },
          { stopCode: '01311', stopName: 'Lavender Stn Exit B', road: 'Kallang Rd', mrtInterchange: ['EW11'] },
          { stopCode: '60019', stopName: 'Kallang Bahru', road: 'Geylang Bahru', mrtInterchange: ['DT24'] },
          { stopCode: '64009', stopName: 'Hougang Ctrl Int', road: 'Hougang Central', mrtInterchange: ['NE14'] },
        ],
      },
      {
        serviceNumber: '130',
        destination: 'Ang Mo Kio Int',
        category: 'Trunk Route',
        viaInfo: 'Via Victoria St • Balestier Rd • Thomson • Bishan Pk',
        nextBus: {
          etaMinutes: 6,
          occupancy: 'seats',
          busType: 'SD',
          wheelchair: true,
          busPlate: 'SBS6770G',
          speedKmH: 20,
        },
        secondBus: {
          etaMinutes: 17,
          occupancy: 'standing',
          busType: 'DD',
          wheelchair: true,
          busPlate: 'SBS7890S',
          speedKmH: 27,
        },
        thirdBus: {
          etaMinutes: 31,
          occupancy: 'seats',
          busType: 'DD',
          wheelchair: true,
          busPlate: 'SBS3612J',
          speedKmH: 33,
        },
        routeStops: [
          { stopCode: '03211', stopName: 'Shenton Way Ter', road: 'Shenton Way' },
          { stopCode: '03011', stopName: 'Fullerton Sq', road: 'Fullerton Rd', isCurrent: true, hasBus: true, busEta: '6 mins away', busPlate: 'SBS6770G' },
          { stopCode: '01119', stopName: 'Victoria St / Bugis', road: 'Victoria St', mrtInterchange: ['EW12', 'DT14'] },
          { stopCode: '50109', stopName: 'Balestier Point', road: 'Balestier Rd' },
          { stopCode: '53009', stopName: 'Bishan Stn', road: 'Bishan Rd', mrtInterchange: ['NS17', 'CC15'] },
          { stopCode: '54009', stopName: 'Ang Mo Kio Int', road: 'Ang Mo Kio Ave 8', mrtInterchange: ['NS16'] },
        ],
      },
      {
        serviceNumber: '196',
        destination: 'Bedok Int',
        category: 'Trunk Route',
        viaInfo: 'Via Marine Parade Rd • Siglap • Bedok South Ave 3',
        nextBus: {
          etaMinutes: 2,
          occupancy: 'standing',
          busType: 'DD',
          wheelchair: true,
          busPlate: 'SBS3509C',
          speedKmH: 19,
        },
        secondBus: {
          etaMinutes: 11,
          occupancy: 'seats',
          busType: 'DD',
          wheelchair: true,
          busPlate: 'SBS7780D',
          speedKmH: 28,
        },
        thirdBus: {
          etaMinutes: 21,
          occupancy: 'seats',
          busType: 'SD',
          wheelchair: true,
          busPlate: 'SBS6199R',
          speedKmH: 31,
        },
        routeStops: [
          { stopCode: '17009', stopName: 'Clementi Int', road: 'Clementi Ave 3', mrtInterchange: ['EW23'] },
          { stopCode: '03011', stopName: 'Fullerton Sq', road: 'Fullerton Rd', isCurrent: true, hasBus: true, busEta: '2 mins away', busPlate: 'SBS3509C' },
          { stopCode: '03019', stopName: 'OUE Bayfront', road: 'Collyer Quay' },
          { stopCode: '92049', stopName: 'Marine Parade Ctrl', road: 'Marine Parade Rd' },
          { stopCode: '84009', stopName: 'Bedok Int', road: 'Bedok North Ave 1', mrtInterchange: ['EW5'] },
        ],
      },
    ],
  },
  '03021': {
    stopCode: '03021',
    stopName: 'Prudential Twr',
    roadName: 'Cecil St',
    towards: 'Church St / Raffles Place MRT',
    distanceMeters: 180,
    walkMinutes: 3,
    nearestMrt: 'EW14 / NS26 Raffles Pl',
    lat: 1.2835,
    lng: 103.8505,
    services: [
      {
        serviceNumber: '57',
        destination: 'Bishan Int',
        category: 'Trunk Route',
        viaInfo: 'Via Suntec City • Little India • Toa Payoh',
        nextBus: { etaMinutes: 4, occupancy: 'seats', busType: 'DD', wheelchair: true, busPlate: 'SBS3891J', speedKmH: 25 },
        secondBus: { etaMinutes: 15, occupancy: 'standing', busType: 'SD', wheelchair: true, busPlate: 'SBS6390M', speedKmH: 30 },
        thirdBus: { etaMinutes: 27, occupancy: 'seats', busType: 'DD', wheelchair: true, busPlate: 'SBS3445A', speedKmH: 32 },
        routeStops: [
          { stopCode: '03021', stopName: 'Prudential Twr', road: 'Cecil St', isCurrent: true, hasBus: true, busEta: '4 mins away' },
          { stopCode: '02151', stopName: 'Suntec Tower Two', road: 'Temasek Blvd' },
          { stopCode: '53009', stopName: 'Bishan Int', road: 'Bishan Rd', mrtInterchange: ['NS17', 'CC15'] },
        ],
      },
      {
        serviceNumber: '131',
        destination: 'Saint Michael’s Ter',
        category: 'Trunk Route',
        viaInfo: 'Via Bugis • Novena • Whampoa Rd',
        nextBus: { etaMinutes: 'Arr', occupancy: 'standing', busType: 'SD', wheelchair: true, busPlate: 'SBS6822K', speedKmH: 14 },
        secondBus: { etaMinutes: 8, occupancy: 'seats', busType: 'DD', wheelchair: true, busPlate: 'SBS7810A', speedKmH: 28 },
        thirdBus: { etaMinutes: 19, occupancy: 'seats', busType: 'DD', wheelchair: true, busPlate: 'SBS3901H', speedKmH: 34 },
        routeStops: [
          { stopCode: '03021', stopName: 'Prudential Twr', road: 'Cecil St', isCurrent: true, hasBus: true, busEta: 'ARRIVING' },
          { stopCode: '50011', stopName: 'Novena Stn', road: 'Thomson Rd', mrtInterchange: ['NS20'] },
          { stopCode: '52009', stopName: 'Saint Michael’s Ter', road: 'Whampoa Rd' },
        ],
      },
      {
        serviceNumber: '167',
        destination: 'Sembawang Int',
        category: 'Trunk Route',
        viaInfo: 'Via Orchard Blvd • Upper Thomson • Chong Pang',
        nextBus: { etaMinutes: 5, occupancy: 'seats', busType: 'DD', wheelchair: true, busPlate: 'SBS3521R', speedKmH: 22 },
        secondBus: { etaMinutes: 16, occupancy: 'standing', busType: 'DD', wheelchair: true, busPlate: 'SBS7590C', speedKmH: 29 },
        thirdBus: { etaMinutes: 29, occupancy: 'seats', busType: 'SD', wheelchair: true, busPlate: 'SBS6902B', speedKmH: 36 },
        routeStops: [
          { stopCode: '03021', stopName: 'Prudential Twr', road: 'Cecil St', isCurrent: true, hasBus: true, busEta: '5 mins away' },
          { stopCode: '09048', stopName: 'Orchard Stn', road: 'Orchard Rd', mrtInterchange: ['NS22', 'TE14'] },
          { stopCode: '58009', stopName: 'Sembawang Int', road: 'Sembawang Vista', mrtInterchange: ['NS11'] },
        ],
      },
    ],
  },
  '03059': {
    stopCode: '03059',
    stopName: 'One Raffles Quay',
    roadName: 'Raffles Quay',
    towards: 'Marina Bay / Shenton Way',
    distanceMeters: 250,
    walkMinutes: 4,
    nearestMrt: 'DT17 / TE19 Downtown',
    lat: 1.2815,
    lng: 103.8524,
    services: [
      {
        serviceNumber: '10',
        destination: 'Tampines Concourse Int',
        category: 'Trunk Route',
        viaInfo: 'Via Marine Parade • Bedok South',
        nextBus: { etaMinutes: 4, occupancy: 'seats', busType: 'DD', wheelchair: true, busPlate: 'SBS3982H' },
        secondBus: { etaMinutes: 11, occupancy: 'standing', busType: 'DD', wheelchair: true, busPlate: 'SBS7412A' },
        thirdBus: { etaMinutes: 20, occupancy: 'seats', busType: 'SD', wheelchair: true, busPlate: 'SBS6201K' },
        routeStops: [
          { stopCode: '03059', stopName: 'One Raffles Quay', road: 'Raffles Quay', isCurrent: true, hasBus: true, busEta: '4 mins away' },
          { stopCode: '84009', stopName: 'Bedok South Ave 3', road: 'Bedok South Rd' },
        ],
      },
      {
        serviceNumber: '70',
        destination: 'Yio Chu Kang Int',
        category: 'Express Sector',
        viaInfo: 'Via Nicoll Highway • Paya Lebar',
        nextBus: { etaMinutes: 7, occupancy: 'standing', busType: 'DD', wheelchair: true, busPlate: 'SBS6412T' },
        secondBus: { etaMinutes: 16, occupancy: 'seats', busType: 'DD', wheelchair: true, busPlate: 'SBS3190C' },
        thirdBus: { etaMinutes: 28, occupancy: 'seats', busType: 'SD', wheelchair: true, busPlate: 'SBS8823M' },
        routeStops: [
          { stopCode: '03059', stopName: 'One Raffles Quay', road: 'Raffles Quay', isCurrent: true },
        ],
      },
      {
        serviceNumber: '196',
        destination: 'Bedok Int',
        category: 'Trunk Route',
        viaInfo: 'Via Marine Parade Rd • Siglap',
        nextBus: { etaMinutes: 6, occupancy: 'standing', busType: 'DD', wheelchair: true, busPlate: 'SBS3509C' },
        secondBus: { etaMinutes: 15, occupancy: 'seats', busType: 'DD', wheelchair: true, busPlate: 'SBS7780D' },
        thirdBus: { etaMinutes: 25, occupancy: 'seats', busType: 'SD', wheelchair: true, busPlate: 'SBS6199R' },
        routeStops: [
          { stopCode: '03059', stopName: 'One Raffles Quay', road: 'Raffles Quay', isCurrent: true },
        ],
      },
    ],
  },
  '03019': {
    stopCode: '03019',
    stopName: 'OUE Bayfront',
    roadName: 'Collyer Quay',
    towards: 'Marina Boulevard / Promontory',
    distanceMeters: 290,
    walkMinutes: 5,
    nearestMrt: 'EW14 / NS26 Raffles Pl',
    lat: 1.2842,
    lng: 103.8538,
    services: [
      {
        serviceNumber: '10',
        destination: 'Tampines Concourse Int',
        category: 'Trunk Route',
        viaInfo: 'Via Marine Parade • Bedok South',
        nextBus: { etaMinutes: 2, occupancy: 'seats', busType: 'DD', wheelchair: true, busPlate: 'SBS3982H' },
        secondBus: { etaMinutes: 9, occupancy: 'standing', busType: 'DD', wheelchair: true, busPlate: 'SBS7412A' },
        thirdBus: { etaMinutes: 18, occupancy: 'seats', busType: 'SD', wheelchair: true, busPlate: 'SBS6201K' },
        routeStops: [{ stopCode: '03019', stopName: 'OUE Bayfront', road: 'Collyer Quay', isCurrent: true }],
      },
      {
        serviceNumber: '100',
        destination: 'Serangoon Int',
        category: 'High Demand',
        viaInfo: 'Via Beach Rd • Geylang West',
        nextBus: { etaMinutes: 3, occupancy: 'limited', busType: 'DD', wheelchair: true, busPlate: 'SBS3800B' },
        secondBus: { etaMinutes: 11, occupancy: 'standing', busType: 'DD', wheelchair: true, busPlate: 'SBS7511K' },
        thirdBus: { etaMinutes: 20, occupancy: 'seats', busType: 'SD', wheelchair: true, busPlate: 'SBS6830U' },
        routeStops: [{ stopCode: '03019', stopName: 'OUE Bayfront', road: 'Collyer Quay', isCurrent: true }],
      },
      {
        serviceNumber: '196',
        destination: 'Bedok Int',
        category: 'Trunk Route',
        viaInfo: 'Via Marine Parade Rd • Siglap',
        nextBus: { etaMinutes: 4, occupancy: 'standing', busType: 'DD', wheelchair: true, busPlate: 'SBS3509C' },
        secondBus: { etaMinutes: 13, occupancy: 'seats', busType: 'DD', wheelchair: true, busPlate: 'SBS7780D' },
        thirdBus: { etaMinutes: 23, occupancy: 'seats', busType: 'SD', wheelchair: true, busPlate: 'SBS6199R' },
        routeStops: [{ stopCode: '03019', stopName: 'OUE Bayfront', road: 'Collyer Quay', isCurrent: true }],
      },
    ],
  },
  '28009': {
    stopCode: '28009',
    stopName: 'Jurong East Int',
    roadName: 'Jurong Gateway Rd',
    towards: 'Boon Lay / Clementi / Tuas',
    distanceMeters: 450,
    walkMinutes: 6,
    nearestMrt: 'EW24 / NS1 Jurong East',
    lat: 1.3332,
    lng: 103.7423,
    services: [
      {
        serviceNumber: '51',
        destination: 'Hougang Ctrl Int',
        category: 'Trunk Route',
        viaInfo: 'Via West Coast • Alexandra • Chinatown',
        nextBus: { etaMinutes: 'Arr', occupancy: 'seats', busType: 'DD', wheelchair: true, busPlate: 'SBS3721L' },
        secondBus: { etaMinutes: 6, occupancy: 'standing', busType: 'DD', wheelchair: true, busPlate: 'SBS7690M' },
        thirdBus: { etaMinutes: 14, occupancy: 'seats', busType: 'SD', wheelchair: true, busPlate: 'SBS6119J' },
        routeStops: [{ stopCode: '28009', stopName: 'Jurong East Int', road: 'Jurong Gateway Rd', isCurrent: true }],
      },
      {
        serviceNumber: '52',
        destination: 'Bishan Int',
        category: 'Trunk Route',
        viaInfo: 'Via Clementi Rd • Upper Bukit Timah • Sin Ming',
        nextBus: { etaMinutes: 4, occupancy: 'standing', busType: 'DD', wheelchair: true, busPlate: 'SBS3822K' },
        secondBus: { etaMinutes: 12, occupancy: 'seats', busType: 'DD', wheelchair: true, busPlate: 'SBS7440T' },
        thirdBus: { etaMinutes: 21, occupancy: 'seats', busType: 'SD', wheelchair: true, busPlate: 'SBS6409P' },
        routeStops: [{ stopCode: '28009', stopName: 'Jurong East Int', road: 'Jurong Gateway Rd', isCurrent: true }],
      },
      {
        serviceNumber: '105',
        destination: 'Serangoon Int',
        category: 'Trunk Route',
        viaInfo: 'Via Holland Rd • Orchard • Toa Payoh',
        nextBus: { etaMinutes: 2, occupancy: 'seats', busType: 'DD', wheelchair: true, busPlate: 'SBS3991S' },
        secondBus: { etaMinutes: 9, occupancy: 'standing', busType: 'DD', wheelchair: true, busPlate: 'SBS7901E' },
        thirdBus: { etaMinutes: 18, occupancy: 'seats', busType: 'SD', wheelchair: true, busPlate: 'SBS6500C' },
        routeStops: [{ stopCode: '28009', stopName: 'Jurong East Int', road: 'Jurong Gateway Rd', isCurrent: true }],
      },
    ],
  },
  '14141': {
    stopCode: '14141',
    stopName: 'Harbourfront Stn / VivoCity',
    roadName: 'Telok Blangah Rd',
    towards: 'Pasir Panjang / Sentosa Gateway',
    distanceMeters: 80,
    walkMinutes: 1,
    nearestMrt: 'NE1 / CC29 HarbourFront',
    lat: 1.2644,
    lng: 103.8222,
    services: [
      {
        serviceNumber: '10',
        destination: 'Tampines Concourse Int',
        category: 'Trunk Route',
        viaInfo: 'Via Shenton Way • Fullerton • Marine Parade',
        nextBus: { etaMinutes: 3, occupancy: 'seats', busType: 'DD', wheelchair: true, busPlate: 'SBS3201P' },
        secondBus: { etaMinutes: 10, occupancy: 'standing', busType: 'DD', wheelchair: true, busPlate: 'SBS7300J' },
        thirdBus: { etaMinutes: 19, occupancy: 'seats', busType: 'SD', wheelchair: true, busPlate: 'SBS6402Z' },
        routeStops: [{ stopCode: '14141', stopName: 'Harbourfront Stn / VivoCity', road: 'Telok Blangah Rd', isCurrent: true }],
      },
      {
        serviceNumber: '100',
        destination: 'Serangoon Int',
        category: 'High Demand',
        viaInfo: 'Via Fullerton • Beach Rd • Geylang',
        nextBus: { etaMinutes: 'Arr', occupancy: 'standing', busType: 'DD', wheelchair: true, busPlate: 'SBS3900M' },
        secondBus: { etaMinutes: 8, occupancy: 'seats', busType: 'DD', wheelchair: true, busPlate: 'SBS7812L' },
        thirdBus: { etaMinutes: 17, occupancy: 'seats', busType: 'SD', wheelchair: true, busPlate: 'SBS6911K' },
        routeStops: [{ stopCode: '14141', stopName: 'Harbourfront Stn / VivoCity', road: 'Telok Blangah Rd', isCurrent: true }],
      },
      {
        serviceNumber: '143',
        destination: 'Toa Payoh Int',
        category: 'Trunk Route',
        viaInfo: 'Via Chinatown • Orchard Rd • Thomson',
        nextBus: { etaMinutes: 5, occupancy: 'seats', busType: 'DD', wheelchair: true, busPlate: 'SBS3122B' },
        secondBus: { etaMinutes: 13, occupancy: 'standing', busType: 'DD', wheelchair: true, busPlate: 'SBS7409H' },
        thirdBus: { etaMinutes: 24, occupancy: 'seats', busType: 'SD', wheelchair: true, busPlate: 'SBS6301A' },
        routeStops: [{ stopCode: '14141', stopName: 'Harbourfront Stn / VivoCity', road: 'Telok Blangah Rd', isCurrent: true }],
      },
    ],
  },
  '45139': {
    stopCode: '45139',
    stopName: 'Kranji Stn',
    roadName: 'Woodlands Rd',
    towards: 'Woodlands Checkpoint / Causeway',
    distanceMeters: 60,
    walkMinutes: 1,
    nearestMrt: 'NS7 Kranji',
    lat: 1.4253,
    lng: 103.7621,
    services: [
      {
        serviceNumber: '170',
        destination: 'Larkin Bus Ter (JB)',
        category: 'Trunk Route',
        viaInfo: 'Via Woodlands Train Checkpoint • Johor Bahru',
        nextBus: { etaMinutes: 4, occupancy: 'limited', busType: 'SD', wheelchair: true, busPlate: 'SBS6701B' },
        secondBus: { etaMinutes: 12, occupancy: 'standing', busType: 'SD', wheelchair: true, busPlate: 'SBS6702Z' },
        thirdBus: { etaMinutes: 20, occupancy: 'seats', busType: 'SD', wheelchair: true, busPlate: 'SBS6703X' },
        routeStops: [{ stopCode: '45139', stopName: 'Kranji Stn', road: 'Woodlands Rd', isCurrent: true }],
      },
      {
        serviceNumber: '160',
        destination: 'Jurong East Int',
        category: 'Trunk Route',
        viaInfo: 'Via Bukit Panjang • Bukit Batok',
        nextBus: { etaMinutes: 7, occupancy: 'seats', busType: 'SD', wheelchair: true, busPlate: 'SBS6811M' },
        secondBus: { etaMinutes: 15, occupancy: 'seats', busType: 'SD', wheelchair: true, busPlate: 'SBS6812K' },
        thirdBus: { etaMinutes: 25, occupancy: 'seats', busType: 'SD', wheelchair: true, busPlate: 'SBS6813H' },
        routeStops: [{ stopCode: '45139', stopName: 'Kranji Stn', road: 'Woodlands Rd', isCurrent: true }],
      },
    ],
  },
  '09048': {
    stopCode: '09048',
    stopName: 'Orchard Stn / Lucky Plaza',
    roadName: 'Orchard Rd',
    towards: 'Dhoby Ghaut / Bras Basah',
    distanceMeters: 90,
    walkMinutes: 1,
    nearestMrt: 'NS22 / TE14 Orchard',
    lat: 1.3039,
    lng: 103.8344,
    services: [
      {
        serviceNumber: '14',
        destination: 'Bedok Int',
        category: 'Trunk Route',
        viaInfo: 'Via Dhoby Ghaut • Mountbatten • East Coast',
        nextBus: { etaMinutes: 'Arr', occupancy: 'seats', busType: 'DD', wheelchair: true, busPlate: 'SBS3811P' },
        secondBus: { etaMinutes: 6, occupancy: 'standing', busType: 'DD', wheelchair: true, busPlate: 'SBS7612R' },
        thirdBus: { etaMinutes: 15, occupancy: 'seats', busType: 'SD', wheelchair: true, busPlate: 'SBS6599A' },
        routeStops: [{ stopCode: '09048', stopName: 'Orchard Stn / Lucky Plaza', road: 'Orchard Rd', isCurrent: true }],
      },
      {
        serviceNumber: '65',
        destination: 'Tampines Int',
        category: 'Trunk Route',
        viaInfo: 'Via Little India • MacPherson • Bedok Reservoir',
        nextBus: { etaMinutes: 3, occupancy: 'standing', busType: 'DD', wheelchair: true, busPlate: 'SBS3922B' },
        secondBus: { etaMinutes: 11, occupancy: 'seats', busType: 'DD', wheelchair: true, busPlate: 'SBS7500K' },
        thirdBus: { etaMinutes: 22, occupancy: 'seats', busType: 'SD', wheelchair: true, busPlate: 'SBS6899T' },
        routeStops: [{ stopCode: '09048', stopName: 'Orchard Stn / Lucky Plaza', road: 'Orchard Rd', isCurrent: true }],
      },
      {
        serviceNumber: '111',
        destination: 'Ghim Moh Ter (Loop)',
        category: 'Trunk Route',
        viaInfo: 'Via Tanglin • Commonwealth • Queenstown',
        nextBus: { etaMinutes: 5, occupancy: 'seats', busType: 'DD', wheelchair: true, busPlate: 'SBS3411N' },
        secondBus: { etaMinutes: 14, occupancy: 'seats', busType: 'SD', wheelchair: true, busPlate: 'SBS6419P' },
        thirdBus: { etaMinutes: 26, occupancy: 'seats', busType: 'DD', wheelchair: true, busPlate: 'SBS3790Y' },
        routeStops: [{ stopCode: '09048', stopName: 'Orchard Stn / Lucky Plaza', road: 'Orchard Rd', isCurrent: true }],
      },
    ],
  },
};

export const CONNECTING_TRAIN_LINES: TrainLineStatus[] = [
  {
    code: 'EW14 / NS26',
    name: 'Raffles Place Stn',
    lineName: 'East West • North South Lines',
    bgColor: '#009640',
    textColor: '#ffffff',
    status: 'Normal',
    frequency: '2 - 3 mins peak',
    interchangeStops: 'Cross-platform transfer between EWL and NSL',
    notes: 'Platform screen doors operating smoothly with optimal crowd clearance.',
  },
  {
    code: 'DT18',
    name: 'Telok Ayer Stn',
    lineName: 'Downtown Line (Via Exit B)',
    bgColor: '#0055B8',
    textColor: '#ffffff',
    status: 'Normal',
    frequency: '3 - 4 mins peak',
    interchangeStops: 'Direct underground pass from Cross Street & Shenton Way',
    notes: 'Regular train intervals across all 34 stations from Bukit Panjang to Expo.',
  },
  {
    code: 'NE5',
    name: 'Clarke Quay Stn',
    lineName: 'North East Line (Via Bus 100/107)',
    bgColor: '#702082',
    textColor: '#ffffff',
    status: 'Normal',
    frequency: '2.5 - 3.5 mins peak',
    interchangeStops: 'Transfer via Eu Tong Sen St / New Bridge Rd corridor',
    notes: 'Punggol Coast extension trial runs on track; normal revenue service.',
  },
];

export const TRANSIT_ALERTS: TransitAlert[] = [
  {
    id: 'alert-1',
    title: 'Service 16 & 16M Route Diversion for Joo Chiat Car-Free Day',
    category: 'Road Closure',
    date: 'Active Today • 06:00 - 22:00',
    severity: 'warning',
    details: 'Due to road closures along Joo Chiat Road between East Coast Rd and Dunman Rd, Service 16 and 16M will skip 4 bus stops. Commuters may alight at Still Road or Dunman Road stops.',
    affectedServices: ['16', '16M'],
  },
  {
    id: 'alert-2',
    title: 'Downtown Line Track Power Maintenance',
    category: 'Train Service',
    date: 'Scheduled Maintenance • Completed at 05:15',
    severity: 'info',
    details: 'Early morning preventive rail grinding and electrical feeder switch tests along Expo - Tampines completed. Train service running at full weekday schedule.',
    affectedServices: ['DTL'],
  },
  {
    id: 'alert-3',
    title: 'Bukit Panjang LRT Segment Bus Bridging Standby',
    category: 'Bus Bridging',
    date: 'Special Transit Support',
    severity: 'warning',
    details: 'Free bus bridging services active between Choa Chu Kang and Bukit Panjang LRT loop during dual-cabin renewal testing phase.',
    affectedServices: ['BP LRT Bridging'],
  },
  {
    id: 'alert-4',
    title: 'Extended Train & Selected Bus Hours for Public Eve',
    category: 'Advisory',
    date: 'Upcoming • Next Friday',
    severity: 'info',
    details: 'North East Line and Downtown Line last train departing HarbourFront and Bukit Panjang extended by 30 minutes. Complementary trunk feeder buses 222, 225G, 261, 315 extended accordingly.',
    affectedServices: ['NEL', 'DTL', '222', '225G', '315'],
  },
];

export const ALL_BUS_SERVICES_CATALOG = [
  {
    service: '10',
    type: 'Trunk',
    origin: 'Tampines Concourse Int',
    dest: 'Kent Ridge Ter',
    firstBus: '05:30',
    lastBus: '23:45',
    peakFreq: '6 - 9 mins',
    offPeakFreq: '10 - 13 mins',
    loop: false,
    routeOverview: 'Connects East Coast, Tanjong Katong, Central Business District, Telok Blangah, and National University of Singapore.',
  },
  {
    service: '70',
    type: 'Express Sector',
    origin: 'Yio Chu Kang Int',
    dest: 'Shenton Way Ter',
    firstBus: '05:45',
    lastBus: '23:30',
    peakFreq: '7 - 11 mins',
    offPeakFreq: '12 - 15 mins',
    loop: false,
    routeOverview: 'High speed route along Nicoll Highway connecting Ang Mo Kio, Serangoon, and Paya Lebar to Shenton Way.',
  },
  {
    service: '100',
    type: 'Trunk',
    origin: 'Serangoon Int',
    dest: 'Ghim Moh Ter',
    firstBus: '05:35',
    lastBus: '23:40',
    peakFreq: '5 - 8 mins',
    offPeakFreq: '9 - 14 mins',
    loop: false,
    routeOverview: 'Scenic arterial service traversing Beach Rd, CBD, Chinatown, Alexandra, and Queenstown.',
  },
  {
    service: '107',
    type: 'Trunk',
    origin: 'Hougang Ctrl Int',
    dest: 'Shenton Way Ter',
    firstBus: '05:50',
    lastBus: '23:15',
    peakFreq: '8 - 12 mins',
    offPeakFreq: '14 - 18 mins',
    loop: false,
    routeOverview: 'Direct express trunk route linking Hougang Central, Potong Pasir, Lavender, and Marina Centre.',
  },
  {
    service: '130',
    type: 'Trunk',
    origin: 'Ang Mo Kio Int',
    dest: 'Shenton Way Ter',
    firstBus: '05:40',
    lastBus: '23:35',
    peakFreq: '6 - 10 mins',
    offPeakFreq: '11 - 15 mins',
    loop: false,
    routeOverview: 'Key radial corridor serving Thomson, Balestier, Bugis, and financial core.',
  },
  {
    service: '147',
    type: 'Trunk',
    origin: 'Hougang Ctrl Int',
    dest: 'Clementi Int',
    firstBus: '05:30',
    lastBus: '23:45',
    peakFreq: '5 - 8 mins',
    offPeakFreq: '8 - 12 mins',
    loop: false,
    routeOverview: 'Heavy cross-island trunk across Serangoon, Chinatown, Bukit Merah, Queenstown, and Clementi.',
  },
  {
    service: '196',
    type: 'Trunk',
    origin: 'Bedok Int',
    dest: 'Clementi Int',
    firstBus: '05:30',
    lastBus: '23:45',
    peakFreq: '6 - 9 mins',
    offPeakFreq: '10 - 13 mins',
    loop: false,
    routeOverview: 'Iconic coastal trunk connecting East Coast Park corridor to Shenton Way and western residential hubs.',
  },
];
