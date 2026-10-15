import React from 'react';
import { BusServiceArrival, BusArrivalTiming, BusLoad } from '../types/bus';
import { Bookmark, Accessibility, MapPin, Eye, Users } from 'lucide-react';

interface BusArrivalCardProps {
  service: BusServiceArrival;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onTrackService: (serviceNo: string) => void;
  onOpenRouteModal: (serviceNo: string) => void;
}

export const BusArrivalCard: React.FC<BusArrivalCardProps> = ({
  service,
  isBookmarked,
  onToggleBookmark,
  onTrackService,
  onOpenRouteModal,
}) => {
  const renderBusSlot = (timing: BusArrivalTiming | null, label: string) => {
    if (!timing) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-2 rounded-lg bg-slate-900/40 border border-slate-800/80 text-slate-500">
          <span className="text-[11px] font-medium text-slate-500">{label}</span>
          <span className="text-sm font-mono mt-1 text-slate-600">—</span>
          <span className="text-[10px] text-slate-600 mt-1">No info</span>
        </div>
      );
    }

    const isArr = timing.minutesAway <= 0;
    const timeText = isArr ? 'Arr' : `${timing.minutesAway}m`;

    const loadBorderColor =
      timing.Load === 'SEA'
        ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400'
        : timing.Load === 'SDA'
        ? 'border-amber-500/40 bg-amber-950/20 text-amber-300'
        : 'border-rose-500/40 bg-rose-950/20 text-rose-400';

    const loadIndicatorColor =
      timing.Load === 'SEA'
        ? 'bg-emerald-500'
        : timing.Load === 'SDA'
        ? 'bg-amber-500'
        : 'bg-rose-500';

    const loadLabel =
      timing.Load === 'SEA'
        ? 'Seats'
        : timing.Load === 'SDA'
        ? 'Standing'
        : 'Crowded';

    return (
      <div className={`flex-1 flex flex-col p-2.5 rounded-lg border transition-colors ${loadBorderColor}`}>
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="font-medium text-slate-400">{label}</span>
          {timing.Feature === 'WAB' && (
            <span title="Wheelchair Accessible Bus">
              <Accessibility className="w-3.5 h-3.5 text-slate-300" />
            </span>
          )}
        </div>

        <div className="flex items-baseline gap-1 my-1">
          <span
            className={`font-mono font-bold tracking-tight ${
              isArr ? 'text-lg text-emerald-400 font-extrabold' : 'text-xl'
            }`}
          >
            {timeText}
          </span>
          {!isArr && (
            <span className="text-[10px] text-slate-400 font-mono">
              ({timing.secondsAway % 60}s)
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-[11px] mt-auto pt-1 border-t border-slate-700/40">
          <span className="font-mono font-semibold text-slate-300">
            {timing.Type === 'DD' ? 'Double' : timing.Type === 'BD' ? 'Bendy' : 'Single'}
          </span>
          <div className="flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${loadIndicatorColor}`}></span>
            <span className="text-[10px] text-slate-300">{loadLabel}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all shadow-sm">
      {/* Header Row: Service Badge, Destination, Operator, Bookmark */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="px-3 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 font-mono font-extrabold text-xl tracking-tight shrink-0 shadow-sm">
            {service.ServiceNo}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-200 truncate flex items-center gap-1.5">
              <span>to {service.destinationName}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
              <span className="font-medium text-slate-400">{service.Operator}</span>
              <span aria-hidden="true">·</span>
              <span>LTA Monitored</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onOpenRouteModal(service.ServiceNo)}
            className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-md transition-colors"
            title="View Full Bus Route Sequence"
            aria-label="View Route"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={onToggleBookmark}
            className={`p-1.5 rounded-md transition-colors ${
              isBookmarked
                ? 'text-amber-400 bg-amber-950/30'
                : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800'
            }`}
            title={isBookmarked ? 'Remove Bookmark' : 'Add to Bookmarks'}
            aria-label="Toggle Bookmark"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* 3 Arrival Tickers (Next, 2nd, 3rd) */}
      <div className="grid grid-cols-3 gap-2">
        {renderBusSlot(service.NextBus, 'Next')}
        {renderBusSlot(service.NextBus2, '2nd')}
        {renderBusSlot(service.NextBus3, '3rd')}
      </div>

      {/* Footer Track & Locate Action */}
      <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs">
        <button
          onClick={() => onTrackService(service.ServiceNo)}
          className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Show Bus Location on Map</span>
        </button>

        <span className="text-[11px] text-slate-500 font-mono">
          Seq {service.NextBus?.VisitNumber || '1'}
        </span>
      </div>
    </div>
  );
};
