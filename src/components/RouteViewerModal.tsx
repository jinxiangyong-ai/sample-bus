import React from 'react';
import { BusRoute } from '../types/bus';
import { X, Bus, MapPin, Gauge, Navigation } from 'lucide-react';

interface RouteViewerModalProps {
  route: BusRoute | null;
  onClose: () => void;
  onSelectStop: (stopCode: string) => void;
  currentStopCode: string | null;
}

export const RouteViewerModal: React.FC<RouteViewerModalProps> = ({
  route,
  onClose,
  onSelectStop,
  currentStopCode,
}) => {
  if (!route) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[88vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 font-mono font-extrabold text-2xl tracking-tight shadow-sm">
              {route.ServiceNo}
            </div>
            <div>
              <div className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>{route.Origin}</span>
                <span className="text-slate-500">→</span>
                <span>{route.Destination}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                <span>{route.Operator}</span>
                <span aria-hidden="true">·</span>
                <span>{route.Category} Service</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-400 font-mono">{route.activeBuses.length} Active Bus{route.activeBuses.length > 1 ? 'es' : ''} Tracked</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Close Route Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Active Bus Fleet Overview */}
        {route.activeBuses.length > 0 && (
          <div className="p-3.5 bg-slate-950/60 border-b border-slate-800">
            <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <Bus className="w-3.5 h-3.5 text-emerald-400" />
              <span>Real-Time Fleet Telemetry ({route.activeBuses.length} En Route)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {route.activeBuses.map((bus) => (
                <div
                  key={bus.id}
                  className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-emerald-400">{bus.id}</span>
                    <span className="text-[11px] font-mono text-slate-400">
                      ({bus.type === 'DD' ? 'Double Deck' : bus.type === 'BD' ? 'Bendy' : 'Single'})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="flex items-center gap-1 text-slate-300">
                      <Gauge className="w-3 h-3 text-slate-500" />
                      {bus.speedKmH} km/h
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        bus.load === 'SEA'
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                          : bus.load === 'SDA'
                          ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {bus.load}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vertical Linear Route Timeline */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Route Progression & Stop Sequence
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
            {route.stops.map((stop, idx) => {
              const isCurrent = stop.BusStopCode === currentStopCode;
              const activeBusHere = route.activeBuses.find(
                (b) => b.nextBusStopCode === stop.BusStopCode
              );

              return (
                <div key={stop.BusStopCode} className="relative group">
                  {/* Node Icon on Timeline */}
                  <div
                    className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-emerald-500 border-white ring-4 ring-emerald-500/20'
                        : activeBusHere
                        ? 'bg-amber-500 border-white'
                        : 'bg-slate-900 border-slate-700 group-hover:border-emerald-400'
                    }`}
                  >
                    <span className="text-[9px] font-mono font-bold text-white">
                      {idx + 1}
                    </span>
                  </div>

                  {/* Stop Details Card */}
                  <div className="flex items-start justify-between gap-3">
                    <button
                      onClick={() => {
                        onSelectStop(stop.BusStopCode);
                        onClose();
                      }}
                      className="text-left flex-1 hover:text-emerald-400 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-300">
                          {stop.BusStopCode}
                        </span>
                        <span className="text-xs text-slate-400">{stop.RoadName}</span>
                      </div>
                      <div className="text-sm font-semibold text-slate-100 mt-0.5">
                        {stop.Description}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                        {stop.Distance.toFixed(1)} km from origin
                      </div>
                    </button>

                    {/* Active Bus Approaching Tag */}
                    {activeBusHere && (
                      <div className="flex items-center gap-1 px-2 py-1 rounded bg-amber-950/60 border border-amber-500/40 text-amber-300 text-[11px] font-mono shrink-0 shadow-sm animate-pulse">
                        <Bus className="w-3 h-3" />
                        <span>Bus {activeBusHere.id} approaching (~{activeBusHere.minutesToNextStop}m)</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-950/80 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>Tap any stop to view live arrival timings</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
