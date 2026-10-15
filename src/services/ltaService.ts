import {
  BusStop,
  BusServiceArrival,
  BusRoute,
  BookmarkItem,
  LTAConfig,
  ActiveBusVehicle,
} from '../types/bus';
import {
  SINGAPORE_BUS_STOPS,
  SINGAPORE_ROUTES,
  calculateDistanceMeters,
  getSimulatedArrivals,
} from '../data/singaporeBuses';

const CONFIG_STORAGE_KEY = 'sg_bus_live_config_v1';
const BOOKMARKS_STORAGE_KEY = 'sg_bus_live_bookmarks_v1';

export const DEFAULT_CONFIG: LTAConfig = {
  mode: 'simulator',
  backendUrl: '/api/busarrival',
  ltaApiKey: '',
  autoRefreshIntervalSec: 20,
};

export class LTAService {
  private static instance: LTAService;
  private config: LTAConfig;
  private bookmarks: BookmarkItem[] = [];

  private constructor() {
    this.config = this.loadConfig();
    this.bookmarks = this.loadBookmarks();
  }

  public static getInstance(): LTAService {
    if (!LTAService.instance) {
      LTAService.instance = new LTAService();
    }
    return LTAService.instance;
  }

  public getConfig(): LTAConfig {
    return { ...this.config };
  }

  public setConfig(newConfig: Partial<LTAConfig>): void {
    this.config = { ...this.config, ...newConfig };
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(this.config));
  }

  private loadConfig(): LTAConfig {
    try {
      const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Failed to parse config from localStorage', e);
    }
    return DEFAULT_CONFIG;
  }

  public getBookmarks(): BookmarkItem[] {
    return [...this.bookmarks];
  }

  public toggleBookmark(busStopCode: string, serviceNo?: string, customLabel?: string): boolean {
    const existingIndex = this.bookmarks.findIndex(
      (b) => b.busStopCode === busStopCode && b.serviceNo === serviceNo
    );

    if (existingIndex >= 0) {
      this.bookmarks.splice(existingIndex, 1);
      this.saveBookmarks();
      return false; // removed
    } else {
      this.bookmarks.push({
        id: `${busStopCode}_${serviceNo || 'all'}_${Date.now()}`,
        busStopCode,
        serviceNo,
        customLabel,
        addedAt: Date.now(),
      });
      this.saveBookmarks();
      return true; // added
    }
  }

  public isBookmarked(busStopCode: string, serviceNo?: string): boolean {
    return this.bookmarks.some(
      (b) => b.busStopCode === busStopCode && (!serviceNo || b.serviceNo === serviceNo)
    );
  }

  private loadBookmarks(): BookmarkItem[] {
    try {
      const stored = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse bookmarks', e);
    }
    // Default helpful starter bookmarks for commuters
    return [
      {
        id: 'bm-1',
        busStopCode: '01012',
        serviceNo: '190',
        customLabel: 'Morning Commute',
        addedAt: Date.now() - 3600000,
      },
      {
        id: 'bm-2',
        busStopCode: '08057',
        customLabel: 'Dhoby Ghaut Interchange',
        addedAt: Date.now() - 7200000,
      },
    ];
  }

  private saveBookmarks(): void {
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(this.bookmarks));
  }

  // Get all bus stops, optionally sorted by distance from lat/lng
  public getBusStops(userLat?: number, userLng?: number): BusStop[] {
    if (userLat !== undefined && userLng !== undefined) {
      return SINGAPORE_BUS_STOPS.map((stop) => ({
        ...stop,
        distance: calculateDistanceMeters(userLat, userLng, stop.Latitude, stop.Longitude),
      })).sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
    }
    return SINGAPORE_BUS_STOPS;
  }

  public getBusStop(busStopCode: string): BusStop | undefined {
    return SINGAPORE_BUS_STOPS.find((s) => s.BusStopCode === busStopCode);
  }

  public searchBusStops(query: string, userLat?: number, userLng?: number): BusStop[] {
    const q = query.trim().toLowerCase();
    if (!q) return this.getBusStops(userLat, userLng);

    const matches = SINGAPORE_BUS_STOPS.filter(
      (stop) =>
        stop.BusStopCode.toLowerCase().includes(q) ||
        stop.RoadName.toLowerCase().includes(q) ||
        stop.Description.toLowerCase().includes(q) ||
        stop.services.some((svc) => svc.toLowerCase() === q || svc.toLowerCase().startsWith(q))
    );

    if (userLat !== undefined && userLng !== undefined) {
      return matches
        .map((stop) => ({
          ...stop,
          distance: calculateDistanceMeters(userLat, userLng, stop.Latitude, stop.Longitude),
        }))
        .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
    }

    return matches;
  }

  // Fetch real-time arrivals for a bus stop
  public async getBusArrivals(
    busStopCode: string,
    serviceNo?: string
  ): Promise<{
    busStopCode: string;
    services: BusServiceArrival[];
    source: 'simulator' | 'backend';
    fetchedAt: string;
  }> {
    const stop = this.getBusStop(busStopCode);
    const servicesToQuery = serviceNo
      ? [serviceNo]
      : stop
      ? stop.services
      : ['7', '12', '65', '190'];

    // If configured to use backend and backend URL is provided:
    if (this.config.mode === 'backend' && this.config.backendUrl) {
      try {
        const queryParams = new URLSearchParams({ BusStopCode: busStopCode });
        if (serviceNo) queryParams.append('ServiceNo', serviceNo);

        const url = `${this.config.backendUrl}?${queryParams.toString()}`;
        const headers: Record<string, string> = {
          Accept: 'application/json',
        };
        if (this.config.ltaApiKey) {
          headers['AccountKey'] = this.config.ltaApiKey;
        }

        const res = await fetch(url, { headers });
        if (!res.ok) {
          throw new Error(`Backend responded with status ${res.status}`);
        }

        const rawData = await res.json();
        // Support standard LTA DataMall v3 format: { BusStopCode: "...", Services: [...] }
        if (rawData && Array.isArray(rawData.Services)) {
          const formattedServices: BusServiceArrival[] = rawData.Services.map((s: any) => {
            const nextBus = this.normalizeLTABus(s.NextBus);
            const nextBus2 = this.normalizeLTABus(s.NextBus2);
            const nextBus3 = this.normalizeLTABus(s.NextBus3);
            return {
              ServiceNo: s.ServiceNo,
              Operator: s.Operator || 'SBST',
              NextBus: nextBus,
              NextBus2: nextBus2,
              NextBus3: nextBus3,
              OriginCode: s.OriginCode || '',
              DestinationCode: s.DestinationCode || '',
              destinationName: `Dest ${s.DestinationCode || ''}`,
            };
          });

          return {
            busStopCode,
            services: formattedServices,
            source: 'backend',
            fetchedAt: new Date().toLocaleTimeString('en-SG', { hour12: false }),
          };
        }
      } catch (err) {
        console.warn('Backend call failed, smoothly falling back to local simulation engine:', err);
      }
    }

    // High-fidelity local simulation mode
    const services: BusServiceArrival[] = servicesToQuery.map((svc) =>
      getSimulatedArrivals(busStopCode, svc)
    );

    // Sort services naturally (numerical order, then letters e.g. 7, 10, 12, 65, 106, 147, 190)
    services.sort((a, b) => {
      const numA = parseInt(a.ServiceNo, 10);
      const numB = parseInt(b.ServiceNo, 10);
      if (isNaN(numA) && isNaN(numB)) return a.ServiceNo.localeCompare(b.ServiceNo);
      if (isNaN(numA)) return 1;
      if (isNaN(numB)) return -1;
      return numA - numB;
    });

    return {
      busStopCode,
      services,
      source: 'simulator',
      fetchedAt: new Date().toLocaleTimeString('en-SG', { hour12: false }),
    };
  }

  private normalizeLTABus(busData: any): any {
    if (!busData || !busData.EstimatedArrival) return null;
    const arrivalDate = new Date(busData.EstimatedArrival);
    const now = new Date();
    const diffMs = arrivalDate.getTime() - now.getTime();
    const totalSec = Math.max(0, Math.round(diffMs / 1000));
    const mins = Math.max(0, Math.round(totalSec / 60));

    return {
      EstimatedArrival: busData.EstimatedArrival,
      Latitude: parseFloat(busData.Latitude) || 0,
      Longitude: parseFloat(busData.Longitude) || 0,
      VisitNumber: busData.VisitNumber || '1',
      Load: busData.Load || 'SEA',
      Feature: busData.Feature || '',
      Type: busData.Type || 'SD',
      minutesAway: mins,
      secondsAway: totalSec,
    };
  }

  public getAllRoutes(): BusRoute[] {
    return SINGAPORE_ROUTES;
  }

  public getRoute(serviceNo: string): BusRoute | undefined {
    return SINGAPORE_ROUTES.find((r) => r.ServiceNo === serviceNo);
  }

  // Get all active moving buses in Singapore for the map
  public getActiveBuses(): ActiveBusVehicle[] {
    const buses: ActiveBusVehicle[] = [];
    for (const route of SINGAPORE_ROUTES) {
      if (route.activeBuses) {
        buses.push(...route.activeBuses);
      }
    }
    return buses;
  }
}

export const ltaService = LTAService.getInstance();
