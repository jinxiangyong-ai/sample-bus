export type BusLoad = 'SEA' | 'SDA' | 'LSD'; // Seats Available | Standing Available | Limited Standing
export type BusDeck = 'SD' | 'DD' | 'BD'; // Single Deck | Double Deck | Bendy
export type BusOperator = 'SBST' | 'SMRT' | 'TTS' | 'GAS';

export interface BusArrivalTiming {
  EstimatedArrival: string; // ISO string or relative min
  Latitude: number;
  Longitude: number;
  VisitNumber: string;
  Load: BusLoad;
  Feature: 'WAB' | '';
  Type: BusDeck;
  minutesAway: number; // dynamically computed
  secondsAway: number;
}

export interface BusServiceArrival {
  ServiceNo: string;
  Operator: BusOperator;
  NextBus: BusArrivalTiming | null;
  NextBus2: BusArrivalTiming | null;
  NextBus3: BusArrivalTiming | null;
  OriginCode: string;
  DestinationCode: string;
  destinationName: string;
}

export interface BusStop {
  BusStopCode: string;
  RoadName: string;
  Description: string;
  Latitude: number;
  Longitude: number;
  services: string[];
  distance?: number; // meters from active location
}

export interface BusRouteStop {
  BusStopCode: string;
  StopSequence: number;
  Distance: number;
  RoadName: string;
  Description: string;
  Latitude: number;
  Longitude: number;
}

export interface ActiveBusVehicle {
  id: string;
  serviceNo: string;
  lat: number;
  lng: number;
  bearing: number;
  speedKmH: number;
  load: BusLoad;
  type: BusDeck;
  isWab: boolean;
  nextBusStopCode: string;
  nextBusStopName: string;
  minutesToNextStop: number;
}

export interface BusRoute {
  ServiceNo: string;
  Direction: 1 | 2;
  Origin: string;
  OriginCode: string;
  Destination: string;
  DestinationCode: string;
  Category: 'Trunk' | 'Feeder' | 'Express' | 'CityDirect';
  Operator: BusOperator;
  path: [number, number][];
  stops: BusRouteStop[];
  activeBuses: ActiveBusVehicle[];
}

export interface BookmarkItem {
  id: string;
  busStopCode: string;
  serviceNo?: string;
  customLabel?: string;
  addedAt: number;
}

export interface LTAConfig {
  mode: 'simulator' | 'backend';
  backendUrl: string;
  ltaApiKey: string;
  autoRefreshIntervalSec: number;
}
