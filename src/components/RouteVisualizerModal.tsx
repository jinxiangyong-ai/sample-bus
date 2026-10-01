import React from 'react';
import { BusServiceArrival } from '../data/transitData';

interface RouteVisualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: BusServiceArrival | null;
  currentStopName: string;
}

export const RouteVisualizerModal: React.FC<RouteVisualizerModalProps> = ({
  isOpen,
  onClose,
  service,
  currentStopName,
}) => {
  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-[#ede5f2] space-y-5 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#ede5f2]">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-[#400050] text-white flex items-center justify-center font-headline font-extrabold text-[28px] shadow-sm">
              {service.serviceNumber}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline font-bold text-[20px] text-[#1d1a23]">
                  Towards {service.destination}
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-[#f3ebf8] text-[#4e434e] text-[11px] font-headline font-bold">
                  {service.category}
                </span>
              </div>
              <p className="text-[13px] text-[#4e434e]">{service.viaInfo}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#80737f] hover:text-[#1d1a23] hover:bg-[#f3ebf8] transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Live Status Bar */}
        <div className="p-3 bg-[#f8f1fe] rounded-xl flex items-center justify-between text-[12px] text-[#4e434e]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#15803D] animate-ping"></span>
            <span className="font-headline font-bold text-[#400050]">Live Telematics Active</span>
          </div>
          <div>
            Viewing relative to:{' '}
            <strong className="text-[#a73a00] font-headline">{currentStopName}</strong>
          </div>
        </div>

        {/* Route Stoppages Timeline */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-0 relative">
          <div className="absolute left-[27px] top-4 bottom-4 w-1 bg-[#ded7e4] -z-0"></div>

          {service.routeStops.map((stop, idx) => {
            const isHere = stop.isCurrent;
            const hasBus = stop.hasBus;

            return (
              <div
                key={stop.stopCode + idx}
                className={`relative z-10 flex items-start gap-4 py-3 px-2 rounded-xl transition-colors ${
                  isHere ? 'bg-[#ffdbce]/40 border border-[#fd651e]/30' : 'hover:bg-[#F7F6F9]'
                }`}
              >
                {/* Node icon */}
                <div className="shrink-0 pt-0.5">
                  {isHere ? (
                    <div className="w-8 h-8 rounded-full bg-[#a73a00] text-white flex items-center justify-center shadow-md animate-bounce ring-4 ring-orange-200">
                      <span className="material-symbols-outlined text-[18px]">directions_bus</span>
                    </div>
                  ) : hasBus ? (
                    <div
                      className="w-8 h-8 rounded-full bg-[#400050] text-white flex items-center justify-center shadow-xs ring-4 ring-purple-100"
                      title={stop.busPlate ? `Plate: ${stop.busPlate}` : undefined}
                    >
                      <span className="material-symbols-outlined text-[16px]">directions_bus</span>
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-[#80737f] flex items-center justify-center shadow-2xs">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#80737f]"></span>
                    </div>
                  )}
                </div>

                {/* Stop description */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-headline font-bold text-[14px] text-[#1d1a23]">
                      {stop.stopName}
                    </span>
                    <span className="text-[11px] font-headline font-semibold text-[#80737f] bg-[#ede5f2] px-1.5 py-0.2 rounded">
                      {stop.stopCode}
                    </span>
                    {isHere && (
                      <span className="px-2 py-0.5 rounded-full bg-[#a73a00] text-white font-headline text-[10px] font-bold">
                        YOU ARE HERE
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-[#4e434e] mt-0.5">{stop.road}</p>

                  {/* MRT Interchanges */}
                  {stop.mrtInterchange && stop.mrtInterchange.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="text-[11px] text-[#4e434e] font-semibold">Transfer:</span>
                      {stop.mrtInterchange.map((mrt) => (
                        <span
                          key={mrt}
                          className="px-1.5 py-0.2 rounded font-headline text-[10px] font-bold bg-[#400050] text-white"
                        >
                          {mrt}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right side bus ETA / Plate badge */}
                <div className="text-right shrink-0">
                  {isHere ? (
                    <span className="font-headline text-[12px] text-[#a73a00] font-extrabold bg-[#ffdbce] px-2 py-1 rounded-md shadow-2xs">
                      ARRIVING NOW
                    </span>
                  ) : hasBus && stop.busEta ? (
                    <div className="flex flex-col items-end">
                      <span className="font-headline text-[12px] text-[#400050] font-bold bg-[#f3ebf8] px-2 py-0.5 rounded">
                        {stop.busEta}
                      </span>
                      {stop.busPlate && (
                        <span className="text-[10px] text-[#80737f] font-mono mt-0.5">
                          {stop.busPlate}
                        </span>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#ede5f2] flex items-center justify-between">
          <span className="text-[12px] text-[#4e434e]">
            Official SBS Transit Data Feed • Updated in Real-Time
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#5c186c] text-white font-headline text-[13px] font-bold hover:bg-[#400050] transition-colors cursor-pointer"
            type="button"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
