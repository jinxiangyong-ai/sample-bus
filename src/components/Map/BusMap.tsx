import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { BusStop, ActiveBusVehicle, BusRoute } from '../../types/bus';
import { Navigation, Layers, Compass } from 'lucide-react';

interface BusMapProps {
  stops: BusStop[];
  selectedStopCode: string | null;
  onSelectStop: (stopCode: string) => void;
  activeBuses: ActiveBusVehicle[];
  activeRoute: BusRoute | null;
  userCoords: { lat: number; lng: number } | null;
  onSelectBus?: (bus: ActiveBusVehicle) => void;
}

export const BusMap: React.FC<BusMapProps> = ({
  stops,
  selectedStopCode,
  onSelectStop,
  activeBuses,
  activeRoute,
  userCoords,
  onSelectBus,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const stopsLayerRef = useRef<L.LayerGroup | null>(null);
  const busesLayerRef = useRef<L.LayerGroup | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Default center on Singapore Downtown / City Hall
    const initialLat = userCoords?.lat || 1.29685;
    const initialLng = userCoords?.lng || 103.85312;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
    });

    // High quality Voyager / Transit tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    // Layer groups for dynamic elements
    stopsLayerRef.current = L.layerGroup().addTo(map);
    busesLayerRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update User Location Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !userCoords) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userCoords.lat, userCoords.lng]);
    } else {
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `
          <div class="relative flex items-center justify-center w-8 h-8">
            <span class="absolute w-8 h-8 rounded-full bg-emerald-500/25 animate-ping"></span>
            <span class="relative w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-md"></span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      userMarkerRef.current = L.marker([userCoords.lat, userCoords.lng], { icon: userIcon }).addTo(map);
    }
  }, [userCoords]);

  // Update Bus Stops Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = stopsLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    stops.forEach((stop) => {
      const isSelected = stop.BusStopCode === selectedStopCode;

      const stopIcon = L.divIcon({
        className: 'custom-bus-stop-marker',
        html: `
          <div class="cursor-pointer transition-transform duration-200 hover:scale-110 flex items-center justify-center ${
            isSelected ? 'scale-125 z-30' : 'z-10'
          }">
            <div class="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold shadow-md border ${
              isSelected
                ? 'bg-emerald-600 text-white border-emerald-300 ring-2 ring-emerald-400'
                : 'bg-slate-900 text-slate-100 border-slate-700 hover:border-emerald-400'
            }">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.7 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/></svg>
              <span class="font-mono text-[11px] tracking-tight">${stop.BusStopCode}</span>
            </div>
          </div>
        `,
        iconSize: [68, 28],
        iconAnchor: [34, 14],
      });

      const marker = L.marker([stop.Latitude, stop.Longitude], { icon: stopIcon });
      marker.on('click', () => {
        onSelectStop(stop.BusStopCode);
      });

      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 13px; color: #0f172a; line-height: 1.4;">
          <div style="font-weight: 700; color: #059669; font-size: 14px;">${stop.BusStopCode} · ${stop.Description}</div>
          <div style="color: #64748b; font-size: 12px; margin-top: 2px;">${stop.RoadName}</div>
          <div style="margin-top: 8px; font-size: 11px; font-weight: 600; color: #334155;">Services: ${stop.services.join(', ')}</div>
        </div>
      `);

      layer.addLayer(marker);
    });
  }, [stops, selectedStopCode, onSelectStop]);

  // Update Active Moving Bus Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = busesLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    activeBuses.forEach((bus) => {
      const loadColor =
        bus.load === 'SEA'
          ? 'bg-emerald-500 text-white'
          : bus.load === 'SDA'
          ? 'bg-amber-500 text-slate-950'
          : 'bg-rose-500 text-white';

      const busIcon = L.divIcon({
        className: 'custom-bus-vehicle-marker',
        html: `
          <div class="cursor-pointer transition-transform duration-300 hover:scale-115 group">
            <div class="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900 border-2 border-emerald-400 text-white shadow-xl">
              <span class="w-2 h-2 rounded-full ${bus.load === 'SEA' ? 'bg-emerald-400' : bus.load === 'SDA' ? 'bg-amber-400' : 'bg-rose-400'}"></span>
              <span class="font-bold font-mono text-xs text-emerald-400">${bus.serviceNo}</span>
              <span class="text-[10px] font-mono text-slate-300">· ${bus.type}</span>
            </div>
          </div>
        `,
        iconSize: [72, 28],
        iconAnchor: [36, 14],
      });

      const marker = L.marker([bus.lat, bus.lng], { icon: busIcon });
      marker.on('click', () => {
        if (onSelectBus) onSelectBus(bus);
      });

      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; color: #0f172a;">
          <div style="font-weight: 700; font-size: 14px; color: #047857;">Bus Service ${bus.serviceNo} (${bus.id})</div>
          <div style="margin-top: 4px; color: #475569;">
            Type: <strong>${bus.type === 'DD' ? 'Double Deck' : bus.type === 'BD' ? 'Bendy' : 'Single Deck'}</strong><br/>
            Speed: <strong>${bus.speedKmH} km/h</strong><br/>
            Crowd: <strong>${bus.load === 'SEA' ? 'Seats Available' : bus.load === 'SDA' ? 'Standing Available' : 'Limited Standing'}</strong><br/>
            Next Stop: <strong>${bus.nextBusStopName}</strong> (~${bus.minutesToNextStop}m)
          </div>
        </div>
      `);

      layer.addLayer(marker);
    });
  }, [activeBuses, onSelectBus]);

  // Update Route Polyline
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (routePolylineRef.current) {
      map.removeLayer(routePolylineRef.current);
      routePolylineRef.current = null;
    }

    if (activeRoute && activeRoute.path && activeRoute.path.length > 0) {
      const polyline = L.polyline(activeRoute.path, {
        color: '#10b981', // SG Bus Lush Green
        weight: 5,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      routePolylineRef.current = polyline;

      // Fit bounds nicely with padding
      map.fitBounds(polyline.getBounds(), { padding: [50, 50], maxZoom: 16 });
    }
  }, [activeRoute]);

  // Center on Selected Stop
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedStopCode) return;

    const targetStop = stops.find((s) => s.BusStopCode === selectedStopCode);
    if (targetStop) {
      map.panTo([targetStop.Latitude, targetStop.Longitude], { animate: true, duration: 0.8 });
    }
  }, [selectedStopCode, stops]);

  const handleRecenter = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    if (userCoords) {
      map.setView([userCoords.lat, userCoords.lng], 16, { animate: true });
    } else if (selectedStopCode) {
      const targetStop = stops.find((s) => s.BusStopCode === selectedStopCode);
      if (targetStop) map.setView([targetStop.Latitude, targetStop.Longitude], 16, { animate: true });
    } else {
      map.setView([1.29685, 103.85312], 14, { animate: true });
    }
  };

  return (
    <div className="relative w-full h-full min-h-[360px] bg-slate-900 overflow-hidden select-none">
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Map Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={handleRecenter}
          className="p-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-100 rounded-lg shadow-lg border border-slate-700/80 backdrop-blur-md transition-colors"
          title="Recenter Map"
          aria-label="Recenter Map"
        >
          <Navigation className="w-4 h-4 text-emerald-400" />
        </button>
        <button
          onClick={() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.zoomIn();
            }
          }}
          className="p-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-100 rounded-lg shadow-lg border border-slate-700/80 backdrop-blur-md transition-colors font-mono font-bold text-sm flex items-center justify-center"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.zoomOut();
            }
          }}
          className="p-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-100 rounded-lg shadow-lg border border-slate-700/80 backdrop-blur-md transition-colors font-mono font-bold text-sm flex items-center justify-center"
          title="Zoom Out"
        >
          -
        </button>
      </div>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-20 hidden sm:flex items-center gap-4 px-3 py-2 bg-slate-900/90 backdrop-blur-md rounded-lg border border-slate-800 text-xs text-slate-300 shadow-lg">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>Seats (SEA)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>Standing (SDA)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
          <span>Full (LSD)</span>
        </div>
        <div className="flex items-center gap-1.5 border-l border-slate-700 pl-3">
          <span className="font-mono text-emerald-400 font-semibold">DD</span>
          <span>Double Deck</span>
        </div>
      </div>
    </div>
  );
};
