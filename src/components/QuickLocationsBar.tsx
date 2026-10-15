import React from 'react';
import { SINGAPORE_HUBS } from '../data/singaporeBuses';
import { Compass, Locate } from 'lucide-react';

interface QuickLocationsBarProps {
  onSelectHub: (hub: typeof SINGAPORE_HUBS[0]) => void;
  onUseCurrentGPS: () => void;
  isLocating: boolean;
  selectedStopCode: string | null;
}

export const QuickLocationsBar: React.FC<QuickLocationsBarProps> = ({
  onSelectHub,
  onUseCurrentGPS,
  isLocating,
  selectedStopCode,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto py-2.5 px-3 sm:px-4 no-scrollbar border-b border-slate-800/80 bg-slate-900/40">
      <button
        onClick={onUseCurrentGPS}
        disabled={isLocating}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs font-semibold shrink-0 hover:bg-emerald-900/30 transition-colors"
        title="Use My Current GPS Location in Singapore"
      >
        <Locate className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
        <span>{isLocating ? 'Locating...' : 'Near Me'}</span>
      </button>

      <span className="text-slate-700 text-xs shrink-0">|</span>

      {SINGAPORE_HUBS.map((hub) => {
        const isActive = hub.stopCode === selectedStopCode;
        return (
          <button
            key={hub.name}
            onClick={() => onSelectHub(hub)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
              isActive
                ? 'bg-slate-800 text-emerald-300 font-semibold border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {hub.name}
          </button>
        );
      })}
    </div>
  );
};
