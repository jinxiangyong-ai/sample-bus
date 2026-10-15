import { BusStop, BusRoute, ActiveBusVehicle, BusServiceArrival, BusArrivalTiming } from '../types/bus';

// Authentic Singapore Bus Stops
export const SINGAPORE_BUS_STOPS: BusStop[] = [
  // Bugis & Bras Basah Corridor
  {
    BusStopCode: '01012',
    RoadName: 'Victoria St',
    Description: 'Hotel Grand Pacific / Bugis Stn Exit C',
    Latitude: 1.29685,
    Longitude: 103.85312,
    services: ['7', '12', '175', '190', '851', '960'],
  },
  {
    BusStopCode: '01013',
    RoadName: 'Victoria St',
    Description: 'Bugis Junction / Stn Exit D',
    Latitude: 1.29962,
    Longitude: 103.85521,
    services: ['7', '12', '65', '190', '851', '960'],
  },
  {
    BusStopCode: '04121',
    RoadName: 'Fullerton Rd',
    Description: 'Fullerton Sq / Raffles Place Stn',
    Latitude: 1.28581,
    Longitude: 103.85292,
    services: ['10', '65', '106', '166', '190'],
  },
  {
    BusStopCode: '04111',
    RoadName: 'Connaught Dr',
    Description: 'Opp Singapore Cricket Club',
    Latitude: 1.29011,
    Longitude: 103.85324,
    services: ['10', '190', '960'],
  },
  {
    BusStopCode: '03011',
    RoadName: 'Bras Basah Rd',
    Description: 'Raffles Hotel / City Hall Stn',
    Latitude: 1.29445,
    Longitude: 103.85412,
    services: ['7', '14', '36', '65', '106', '147', '190'],
  },

  // Orchard Road Shopping Belt
  {
    BusStopCode: '09048',
    RoadName: 'Orchard Rd',
    Description: 'Orchard Stn / Lucky Plaza',
    Latitude: 1.30412,
    Longitude: 103.83415,
    services: ['7', '65', '106', '174', '190'],
  },
  {
    BusStopCode: '09038',
    RoadName: 'Orchard Rd',
    Description: 'Orchard Stn / Tangs',
    Latitude: 1.30491,
    Longitude: 103.83295,
    services: ['7', '14', '65', '106', '147', '174', '190'],
  },
  {
    BusStopCode: '09037',
    RoadName: 'Orchard Rd',
    Description: 'Opp Mandarin Orchard / 313@Somerset',
    Latitude: 1.30198,
    Longitude: 103.83782,
    services: ['7', '65', '106', '147', '174', '190'],
  },
  {
    BusStopCode: '08057',
    RoadName: 'Orchard Rd',
    Description: 'Dhoby Ghaut Stn Exit B',
    Latitude: 1.29892,
    Longitude: 103.84571,
    services: ['7', '14', '36', '65', '106', '147', '174', '190'],
  },
  {
    BusStopCode: '08058',
    RoadName: 'Penang Rd',
    Description: 'Dhoby Ghaut Stn Exit A',
    Latitude: 1.29958,
    Longitude: 103.84491,
    services: ['7', '65', '106', '174', '190', '851'],
  },

  // Marina Bay & Downtown
  {
    BusStopCode: '03509',
    RoadName: 'Bayfront Ave',
    Description: 'Marina Bay Sands Theatre',
    Latitude: 1.28315,
    Longitude: 103.85892,
    services: ['97', '106', '133'],
  },
  {
    BusStopCode: '03511',
    RoadName: 'Bayfront Ave',
    Description: 'Bayfront Stn Exit B / MBS Hotel',
    Latitude: 1.28212,
    Longitude: 103.85987,
    services: ['97', '106', '133'],
  },
  {
    BusStopCode: '03019',
    RoadName: 'Stamford Rd',
    Description: 'SMU / Capitol Building',
    Latitude: 1.29415,
    Longitude: 103.85192,
    services: ['7', '14', '106', '147', '190', '851'],
  },

  // Chinatown & Outram
  {
    BusStopCode: '05013',
    RoadName: 'New Bridge Rd',
    Description: 'Chinatown Stn Exit E / People\'s Park Ctr',
    Latitude: 1.28512,
    Longitude: 103.84412,
    services: ['12', '147', '190', '851', '960'],
  },
  {
    BusStopCode: '05022',
    RoadName: 'Eu Tong Sen St',
    Description: 'Chinatown Stn Exit C / People\'s Park Complex',
    Latitude: 1.28392,
    Longitude: 103.84305,
    services: ['12', '147', '190', '851'],
  },
  {
    BusStopCode: '05019',
    RoadName: 'New Bridge Rd',
    Description: 'New Bridge Rd Ter',
    Latitude: 1.27892,
    Longitude: 103.83981,
    services: ['12', '174', '190'],
  },

  // Jurong East Transit Hub (West)
  {
    BusStopCode: '28009',
    RoadName: 'Jurong Gateway Rd',
    Description: 'Jurong East Temp Int / Westgate',
    Latitude: 1.33315,
    Longitude: 103.74212,
    services: ['66', '105', '147', '160', '197'],
  },
  {
    BusStopCode: '28011',
    RoadName: 'Jurong Gateway Rd',
    Description: 'Bef Jurong East Stn / JEM',
    Latitude: 1.33405,
    Longitude: 103.74325,
    services: ['66', '105', '147', '160'],
  },

  // Tampines Transit Hub (East)
  {
    BusStopCode: '75009',
    RoadName: 'Tampines Ave 4',
    Description: 'Tampines Int / Tampines Mall',
    Latitude: 1.35345,
    Longitude: 103.94512,
    services: ['10', '65', '67', '72'],
  },
  {
    BusStopCode: '76141',
    RoadName: 'Tampines Ave 4',
    Description: 'Opp Century Sq / Tampines Stn',
    Latitude: 1.35282,
    Longitude: 103.94415,
    services: ['10', '65', '67'],
  },

  // Woodlands Regional Hub (North)
  {
    BusStopCode: '46009',
    RoadName: 'Woodlands Sq',
    Description: 'Woodlands Integrated Transport Hub / Causeway Point',
    Latitude: 1.43612,
    Longitude: 103.78652,
    services: ['161', '168', '900', '903', '960'],
  },
  {
    BusStopCode: '46639',
    RoadName: 'Woodlands Ave 3',
    Description: 'Opp Woodlands Stn Exit 1',
    Latitude: 1.43491,
    Longitude: 103.78589,
    services: ['960', '961', '963'],
  },
];

// Presets for Singapore Commuter Hubs for instant quick navigation
export const SINGAPORE_HUBS = [
  { name: 'City Hall & Bugis', lat: 1.29685, lng: 103.85312, stopCode: '01012' },
  { name: 'Orchard Shopping Belt', lat: 1.30412, lng: 103.83415, stopCode: '09048' },
  { name: 'Raffles Place / CBD', lat: 1.28581, lng: 103.85292, stopCode: '04121' },
  { name: 'Dhoby Ghaut', lat: 1.29892, lng: 103.84571, stopCode: '08057' },
  { name: 'Chinatown', lat: 1.28512, lng: 103.84412, stopCode: '05013' },
  { name: 'Marina Bay Sands', lat: 1.28315, lng: 103.85892, stopCode: '03509' },
  { name: 'Jurong East', lat: 1.33315, lng: 103.74212, stopCode: '28009' },
  { name: 'Tampines', lat: 1.35345, lng: 103.94512, stopCode: '75009' },
  { name: 'Woodlands', lat: 1.43612, lng: 103.78652, stopCode: '46009' },
];

// Bus Routes definitions with sequence of stops and simulated active buses
export const SINGAPORE_ROUTES: BusRoute[] = [
  {
    ServiceNo: '190',
    Direction: 1,
    Origin: 'Choa Chu Kang Int',
    OriginCode: '44009',
    Destination: 'New Bridge Rd Ter',
    DestinationCode: '05019',
    Category: 'Trunk',
    Operator: 'SMRT',
    path: [
      [1.30491, 103.83295],
      [1.30412, 103.83415],
      [1.30198, 103.83782],
      [1.29958, 103.84491],
      [1.29892, 103.84571],
      [1.29685, 103.85312],
      [1.29445, 103.85412],
      [1.29011, 103.85324],
      [1.28581, 103.85292],
      [1.28512, 103.84412],
      [1.27892, 103.83981],
    ],
    stops: [
      {
        BusStopCode: '09038',
        StopSequence: 1,
        Distance: 14.2,
        RoadName: 'Orchard Rd',
        Description: 'Orchard Stn / Tangs',
        Latitude: 1.30491,
        Longitude: 103.83295,
      },
      {
        BusStopCode: '09048',
        StopSequence: 2,
        Distance: 14.6,
        RoadName: 'Orchard Rd',
        Description: 'Orchard Stn / Lucky Plaza',
        Latitude: 1.30412,
        Longitude: 103.83415,
      },
      {
        BusStopCode: '09037',
        StopSequence: 3,
        Distance: 15.1,
        RoadName: 'Orchard Rd',
        Description: 'Opp Mandarin Orchard / 313@Somerset',
        Latitude: 1.30198,
        Longitude: 103.83782,
      },
      {
        BusStopCode: '08057',
        StopSequence: 4,
        Distance: 16.0,
        RoadName: 'Orchard Rd',
        Description: 'Dhoby Ghaut Stn Exit B',
        Latitude: 1.29892,
        Longitude: 103.84571,
      },
      {
        BusStopCode: '01012',
        StopSequence: 5,
        Distance: 16.8,
        RoadName: 'Victoria St',
        Description: 'Hotel Grand Pacific / Bugis Stn Exit C',
        Latitude: 1.29685,
        Longitude: 103.85312,
      },
      {
        BusStopCode: '03011',
        StopSequence: 6,
        Distance: 17.3,
        RoadName: 'Bras Basah Rd',
        Description: 'Raffles Hotel / City Hall Stn',
        Latitude: 1.29445,
        Longitude: 103.85412,
      },
      {
        BusStopCode: '04121',
        StopSequence: 7,
        Distance: 18.2,
        RoadName: 'Fullerton Rd',
        Description: 'Fullerton Sq / Raffles Place Stn',
        Latitude: 1.28581,
        Longitude: 103.85292,
      },
      {
        BusStopCode: '05013',
        StopSequence: 8,
        Distance: 19.1,
        RoadName: 'New Bridge Rd',
        Description: 'Chinatown Stn Exit E',
        Latitude: 1.28512,
        Longitude: 103.84412,
      },
      {
        BusStopCode: '05019',
        StopSequence: 9,
        Distance: 20.0,
        RoadName: 'New Bridge Rd',
        Description: 'New Bridge Rd Ter',
        Latitude: 1.27892,
        Longitude: 103.83981,
      },
    ],
    activeBuses: [
      {
        id: 'SMB3112K',
        serviceNo: '190',
        lat: 1.30325,
        lng: 103.83592,
        bearing: 125,
        speedKmH: 28,
        load: 'SEA',
        type: 'DD',
        isWab: true,
        nextBusStopCode: '09037',
        nextBusStopName: 'Opp Mandarin Orchard / 313@Somerset',
        minutesToNextStop: 2,
      },
      {
        id: 'SG5941M',
        serviceNo: '190',
        lat: 1.29742,
        lng: 103.85125,
        bearing: 110,
        speedKmH: 32,
        load: 'SDA',
        type: 'DD',
        isWab: true,
        nextBusStopCode: '01012',
        nextBusStopName: 'Hotel Grand Pacific',
        minutesToNextStop: 1,
      },
      {
        id: 'SG1788P',
        serviceNo: '190',
        lat: 1.28712,
        lng: 103.85121,
        bearing: 175,
        speedKmH: 22,
        load: 'LSD',
        type: 'SD',
        isWab: true,
        nextBusStopCode: '04121',
        nextBusStopName: 'Fullerton Sq',
        minutesToNextStop: 2,
      },
    ],
  },
  {
    ServiceNo: '65',
    Direction: 1,
    Origin: 'Tampines Int',
    OriginCode: '75009',
    Destination: 'HarbourFront Int',
    DestinationCode: '14009',
    Category: 'Trunk',
    Operator: 'SBST',
    path: [
      [1.35345, 103.94512],
      [1.35282, 103.94415],
      [1.29962, 103.85521],
      [1.29892, 103.84571],
      [1.30198, 103.83782],
      [1.30412, 103.83415],
      [1.28581, 103.85292],
    ],
    stops: [
      {
        BusStopCode: '75009',
        StopSequence: 1,
        Distance: 0.0,
        RoadName: 'Tampines Ave 4',
        Description: 'Tampines Int / Tampines Mall',
        Latitude: 1.35345,
        Longitude: 103.94512,
      },
      {
        BusStopCode: '01013',
        StopSequence: 18,
        Distance: 13.5,
        RoadName: 'Victoria St',
        Description: 'Bugis Junction / Stn Exit D',
        Latitude: 1.29962,
        Longitude: 103.85521,
      },
      {
        BusStopCode: '08057',
        StopSequence: 19,
        Distance: 14.8,
        RoadName: 'Orchard Rd',
        Description: 'Dhoby Ghaut Stn Exit B',
        Latitude: 1.29892,
        Longitude: 103.84571,
      },
      {
        BusStopCode: '09037',
        StopSequence: 20,
        Distance: 15.6,
        RoadName: 'Orchard Rd',
        Description: 'Opp Mandarin Orchard / 313@Somerset',
        Latitude: 1.30198,
        Longitude: 103.83782,
      },
      {
        BusStopCode: '09048',
        StopSequence: 21,
        Distance: 16.2,
        RoadName: 'Orchard Rd',
        Description: 'Orchard Stn / Lucky Plaza',
        Latitude: 1.30412,
        Longitude: 103.83415,
      },
      {
        BusStopCode: '04121',
        StopSequence: 24,
        Distance: 18.0,
        RoadName: 'Fullerton Rd',
        Description: 'Fullerton Sq / Raffles Place Stn',
        Latitude: 1.28581,
        Longitude: 103.85292,
      },
    ],
    activeBuses: [
      {
        id: 'SBS3890T',
        serviceNo: '65',
        lat: 1.30112,
        lng: 103.84125,
        bearing: 260,
        speedKmH: 26,
        load: 'SEA',
        type: 'DD',
        isWab: true,
        nextBusStopCode: '09037',
        nextBusStopName: 'Opp Mandarin Orchard',
        minutesToNextStop: 3,
      },
      {
        id: 'SBS6821X',
        serviceNo: '65',
        lat: 1.35312,
        lng: 103.94481,
        bearing: 190,
        speedKmH: 15,
        load: 'SDA',
        type: 'SD',
        isWab: true,
        nextBusStopCode: '75009',
        nextBusStopName: 'Tampines Int',
        minutesToNextStop: 1,
      },
    ],
  },
  {
    ServiceNo: '106',
    Direction: 1,
    Origin: 'Bukit Batok Int',
    OriginCode: '43009',
    Destination: 'Shenton Way Ter',
    DestinationCode: '03239',
    Category: 'Trunk',
    Operator: 'TTS',
    path: [
      [1.30491, 103.83295],
      [1.30412, 103.83415],
      [1.30198, 103.83782],
      [1.29892, 103.84571],
      [1.29415, 103.85192],
      [1.28581, 103.85292],
      [1.28212, 103.85987],
      [1.28315, 103.85892],
    ],
    stops: [
      {
        BusStopCode: '09038',
        StopSequence: 12,
        Distance: 11.2,
        RoadName: 'Orchard Rd',
        Description: 'Orchard Stn / Tangs',
        Latitude: 1.30491,
        Longitude: 103.83295,
      },
      {
        BusStopCode: '09037',
        StopSequence: 13,
        Distance: 11.8,
        RoadName: 'Orchard Rd',
        Description: 'Opp Mandarin Orchard / 313@Somerset',
        Latitude: 1.30198,
        Longitude: 103.83782,
      },
      {
        BusStopCode: '08057',
        StopSequence: 14,
        Distance: 12.6,
        RoadName: 'Orchard Rd',
        Description: 'Dhoby Ghaut Stn Exit B',
        Latitude: 1.29892,
        Longitude: 103.84571,
      },
      {
        BusStopCode: '04121',
        StopSequence: 16,
        Distance: 14.1,
        RoadName: 'Fullerton Rd',
        Description: 'Fullerton Sq / Raffles Place Stn',
        Latitude: 1.28581,
        Longitude: 103.85292,
      },
      {
        BusStopCode: '03509',
        StopSequence: 17,
        Distance: 15.0,
        RoadName: 'Bayfront Ave',
        Description: 'Marina Bay Sands Theatre',
        Latitude: 1.28315,
        Longitude: 103.85892,
      },
      {
        BusStopCode: '03511',
        StopSequence: 18,
        Distance: 15.5,
        RoadName: 'Bayfront Ave',
        Description: 'Bayfront Stn Exit B / MBS Hotel',
        Latitude: 1.28212,
        Longitude: 103.85987,
      },
    ],
    activeBuses: [
      {
        id: 'TTS2011M',
        serviceNo: '106',
        lat: 1.28389,
        lng: 103.85712,
        bearing: 115,
        speedKmH: 30,
        load: 'SEA',
        type: 'DD',
        isWab: true,
        nextBusStopCode: '03509',
        nextBusStopName: 'Marina Bay Sands Theatre',
        minutesToNextStop: 2,
      },
    ],
  },
  {
    ServiceNo: '960',
    Direction: 1,
    Origin: 'Woodlands Integrated Transport Hub',
    OriginCode: '46009',
    Destination: 'Marina Ctr Ter',
    DestinationCode: '02099',
    Category: 'Trunk',
    Operator: 'SMRT',
    path: [
      [1.43612, 103.78652],
      [1.43491, 103.78589],
      [1.29962, 103.85521],
      [1.29685, 103.85312],
      [1.29011, 103.85324],
      [1.28512, 103.84412],
    ],
    stops: [
      {
        BusStopCode: '46009',
        StopSequence: 1,
        Distance: 0.0,
        RoadName: 'Woodlands Sq',
        Description: 'Woodlands Integrated Transport Hub',
        Latitude: 1.43612,
        Longitude: 103.78652,
      },
      {
        BusStopCode: '46639',
        StopSequence: 2,
        Distance: 0.5,
        RoadName: 'Woodlands Ave 3',
        Description: 'Opp Woodlands Stn Exit 1',
        Latitude: 1.43491,
        Longitude: 103.78589,
      },
      {
        BusStopCode: '01013',
        StopSequence: 28,
        Distance: 24.2,
        RoadName: 'Victoria St',
        Description: 'Bugis Junction / Stn Exit D',
        Latitude: 1.29962,
        Longitude: 103.85521,
      },
      {
        BusStopCode: '01012',
        StopSequence: 29,
        Distance: 24.8,
        RoadName: 'Victoria St',
        Description: 'Hotel Grand Pacific / Bugis Stn Exit C',
        Latitude: 1.29685,
        Longitude: 103.85312,
      },
      {
        BusStopCode: '04111',
        StopSequence: 31,
        Distance: 26.1,
        RoadName: 'Connaught Dr',
        Description: 'Opp Singapore Cricket Club',
        Latitude: 1.29011,
        Longitude: 103.85324,
      },
    ],
    activeBuses: [
      {
        id: 'SG1088T',
        serviceNo: '960',
        lat: 1.29815,
        lng: 103.85412,
        bearing: 210,
        speedKmH: 29,
        load: 'SDA',
        type: 'BD',
        isWab: true,
        nextBusStopCode: '01012',
        nextBusStopName: 'Hotel Grand Pacific',
        minutesToNextStop: 3,
      },
    ],
  },
  {
    ServiceNo: '147',
    Direction: 1,
    Origin: 'Hougang Central Int',
    OriginCode: '64009',
    Destination: 'Jurong East Temp Int',
    DestinationCode: '28009',
    Category: 'Trunk',
    Operator: 'SBST',
    path: [
      [1.30491, 103.83295],
      [1.30198, 103.83782],
      [1.29892, 103.84571],
      [1.29415, 103.85192],
      [1.28512, 103.84412],
      [1.28392, 103.84305],
      [1.33405, 103.74325],
      [1.33315, 103.74212],
    ],
    stops: [
      {
        BusStopCode: '08057',
        StopSequence: 22,
        Distance: 13.8,
        RoadName: 'Orchard Rd',
        Description: 'Dhoby Ghaut Stn Exit B',
        Latitude: 1.29892,
        Longitude: 103.84571,
      },
      {
        BusStopCode: '03019',
        StopSequence: 23,
        Distance: 14.5,
        RoadName: 'Stamford Rd',
        Description: 'SMU / Capitol Building',
        Latitude: 1.29415,
        Longitude: 103.85192,
      },
      {
        BusStopCode: '05013',
        StopSequence: 25,
        Distance: 16.2,
        RoadName: 'New Bridge Rd',
        Description: 'Chinatown Stn Exit E',
        Latitude: 1.28512,
        Longitude: 103.84412,
      },
      {
        BusStopCode: '05022',
        StopSequence: 26,
        Distance: 16.6,
        RoadName: 'Eu Tong Sen St',
        Description: 'Chinatown Stn Exit C',
        Latitude: 1.28392,
        Longitude: 103.84305,
      },
      {
        BusStopCode: '28009',
        StopSequence: 42,
        Distance: 27.5,
        RoadName: 'Jurong Gateway Rd',
        Description: 'Jurong East Temp Int / Westgate',
        Latitude: 1.33315,
        Longitude: 103.74212,
      },
    ],
    activeBuses: [
      {
        id: 'SBS3988L',
        serviceNo: '147',
        lat: 1.28751,
        lng: 103.84612,
        bearing: 215,
        speedKmH: 24,
        load: 'LSD',
        type: 'DD',
        isWab: true,
        nextBusStopCode: '05013',
        nextBusStopName: 'Chinatown Stn Exit E',
        minutesToNextStop: 1,
      },
    ],
  },
];

// Helper to calculate distance in meters between two lat/lng coordinates (Haversine formula)
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in metres
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

// Generate realistic simulated arrival timing for a service at a stop
export function getSimulatedArrivals(busStopCode: string, serviceNo: string, baseTimeOffsetSec: number = 0): BusServiceArrival {
  // Find route if available to give real destination
  const route = SINGAPORE_ROUTES.find((r) => r.ServiceNo === serviceNo);
  const destination = route ? route.Destination : 'Terminating Stop';
  const destCode = route ? route.DestinationCode : '00000';
  const operator: 'SBST' | 'SMRT' | 'TTS' | 'GAS' = route?.Operator || (['SBST', 'SMRT', 'TTS', 'GAS'][Math.abs(hashString(serviceNo)) % 4] as any);

  // Deterministic seed based on stop code + service number + current minute block
  const seed = Math.abs(hashString(`${busStopCode}-${serviceNo}`));
  const currentMinute = Math.floor(Date.now() / 60000);
  const cycle = (seed + currentMinute) % 15; // 0 to 14 min window

  const now = new Date(Date.now() + baseTimeOffsetSec * 1000);

  // Next bus 1: 0 - 7 minutes away
  const min1 = Math.max(0, (cycle % 7));
  const sec1 = ((seed * 17) % 60);
  const totalSec1 = min1 * 60 + sec1;
  const arrival1Time = new Date(now.getTime() + totalSec1 * 1000);

  // Next bus 2: 7 - 16 minutes away
  const min2 = min1 + 6 + ((seed * 3) % 6);
  const sec2 = ((seed * 23) % 60);
  const totalSec2 = min2 * 60 + sec2;
  const arrival2Time = new Date(now.getTime() + totalSec2 * 1000);

  // Next bus 3: 16 - 28 minutes away
  const min3 = min2 + 8 + ((seed * 7) % 7);
  const totalSec3 = min3 * 60;
  const arrival3Time = new Date(now.getTime() + totalSec3 * 1000);

  const loads: ('SEA' | 'SDA' | 'LSD')[] = ['SEA', 'SDA', 'LSD'];
  const decks: ('SD' | 'DD' | 'BD')[] = ['SD', 'DD', 'BD'];

  const nextBus: BusArrivalTiming = {
    EstimatedArrival: arrival1Time.toISOString(),
    Latitude: 1.295 + ((seed % 100) / 10000),
    Longitude: 103.85 + ((seed % 100) / 10000),
    VisitNumber: '1',
    Load: loads[seed % 3],
    Feature: 'WAB',
    Type: decks[seed % (serviceNo === '960' ? 3 : 2)],
    minutesAway: min1,
    secondsAway: totalSec1,
  };

  const nextBus2: BusArrivalTiming = {
    EstimatedArrival: arrival2Time.toISOString(),
    Latitude: 1.298 + ((seed % 70) / 10000),
    Longitude: 103.855 + ((seed % 70) / 10000),
    VisitNumber: '1',
    Load: loads[(seed + 1) % 3],
    Feature: 'WAB',
    Type: decks[(seed + 1) % 2],
    minutesAway: min2,
    secondsAway: totalSec2,
  };

  const nextBus3: BusArrivalTiming = {
    EstimatedArrival: arrival3Time.toISOString(),
    Latitude: 1.31 + ((seed % 50) / 10000),
    Longitude: 103.86 + ((seed % 50) / 10000),
    VisitNumber: '1',
    Load: loads[(seed + 2) % 3],
    Feature: 'WAB',
    Type: 'DD',
    minutesAway: min3,
    secondsAway: totalSec3,
  };

  return {
    ServiceNo: serviceNo,
    Operator: operator,
    NextBus: nextBus,
    NextBus2: nextBus2,
    NextBus3: nextBus3,
    OriginCode: route?.OriginCode || '01012',
    DestinationCode: destCode,
    destinationName: destination,
  };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
