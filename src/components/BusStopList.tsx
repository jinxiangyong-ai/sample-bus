import React from 'react';
import { BusStop } from '../types/bus';
import { MapPin, Navigation, Bus, ChevronRight } from 'lucide-react';

interface BusStopListProps {
  stops: BusStop[];
  selectedStopCode: string | null;
  onSelectStop: (stopCode: string) => void;
  searchQuery: string;
}

export const BusStopList: React.FC<BusStopListProps> = ({
  stops,
  selectedStopCode,
  onSelectStop,
  searchQuery,
}) => {
  if (stops.length === 0) {
    return (
      <div className="py-12 px-4 text-center">
        <Bus className="w-10 h-10 mx-auto text-slate-600 mb-2 stroke-1" />
        <div className="text-sm font-medium text-slate-300">No Bus Stops Found</div>
        <div className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
          Try searching with a 5-digit LTA stop code (e.g. 01012), road name (e.g. Orchard), or bus service (e.g. 190).
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-800/80">
      {stops.map((stop) => {
        const isSelected = stop.BusStopCode === selectedStopCode;

        return (
          <button
            key={stop.BusStopCode}
            onClick={() => onSelectStop(stop.BusStopCode)}
            className={`w-full text-left p-3.5 transition-colors flex items-start justify-between gap-3 ${
              isSelected
                ? 'bg-emerald-950/30 border-l-2 border-emerald-400'
                : 'hover:bg-slate-900/60'
            }`}
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-emerald-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                  {stop.BusStopCode}
                </span>
                <span className="text-xs text-slate-400 font-medium truncate">{stop.RoadName}</span>
                {stop.distance !== undefined && (
                  <span className="ml-auto text-[11px] font-mono text-slate-400 flex items-center gap-1 shrink-0">
                    <Navigation className="w-3 h-3 text-slate-500" />
                    {stop.distance < 1000 ? `${stop.distance}m` : `${(stop.distance / 1000).toFixed(1)}km`}
                  </span>
                )}
              </div>

              <div className="text-sm font-semibold text-slate-100 mt-1.5 truncate">
                {stop.Description}
              </div>

              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                {stop.services.map((svc) => (
                  <span
                    key={svc}
                    className="font-mono text-[11px] font-semibold px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700/60"
                  >
                    {svc}
                  </span>
                ))}
              </div>
            </div>

            <ChevronRight
              className={`w-4 h-4 mt-2 shrink-0 transition-transform ${
                isSelected ? 'text-emerald-400 translate-x-0.5' : 'text-slate-600'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};
