import React, { useState } from 'react';
import { BusServiceArrival, BusArrivalSlot } from '../data/transitData';

interface ServiceCardProps {
  service: BusServiceArrival;
  currentStopName: string;
  isExpandedGlobal?: boolean;
  onOpenFullRoute?: (service: BusServiceArrival) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  currentStopName,
  isExpandedGlobal,
  onOpenFullRoute,
}) => {
  const [localExpanded, setLocalExpanded] = useState<boolean>(false);
  const isExpanded = isExpandedGlobal !== undefined ? isExpandedGlobal : localExpanded;

  const renderOccupancyBadge = (occupancy: BusArrivalSlot['occupancy']) => {
    switch (occupancy) {
      case 'seats':
        return (
          <span className="flex items-center gap-1 text-[11px] text-[#15803D] bg-white px-2 py-0.5 rounded-md shadow-2xs font-headline font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]"></span> Seats Avail
          </span>
        );
      case 'standing':
        return (
          <span className="flex items-center gap-1 text-[11px] text-[#D97706] bg-white px-2 py-0.5 rounded-md shadow-2xs font-headline font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]"></span> Standing
          </span>
        );
      case 'limited':
        return (
          <span className="flex items-center gap-1 text-[11px] text-[#DC2626] bg-white px-2 py-0.5 rounded-md shadow-2xs font-headline font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]"></span> Limited Standing
          </span>
        );
    }
  };

  const renderSlot = (slot: BusArrivalSlot, label: string) => {
    const isNow = slot.etaMinutes === 'Arr' || slot.etaMinutes === 0;

    return (
      <div className="p-3 rounded-xl bg-[#f8f1fe] flex flex-col justify-between space-y-2 border border-transparent hover:border-[#e7e0ed] transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wider text-[#4e434e] font-headline font-semibold">
            {label}
          </span>
          {renderOccupancyBadge(slot.occupancy)}
        </div>

        <div className="flex items-baseline justify-between">
          {isNow ? (
            <div className="flex items-center gap-1 text-[#a73a00]">
              <span className="font-headline font-extrabold text-[28px] sm:text-[32px] leading-none animate-pulse">
                Arr
              </span>
              <span className="text-[11px] uppercase font-headline font-extrabold text-[#a73a00] bg-[#ffdbce] px-1.5 py-0.5 rounded">
                Now
              </span>
            </div>
          ) : (
            <div className="flex items-baseline gap-1 text-[#1d1a23]">
              <span className="font-headline font-bold text-[28px] sm:text-[32px] leading-none">
                {slot.etaMinutes}
              </span>
              <span className="text-[12px] text-[#4e434e] font-medium font-headline">
                {slot.etaMinutes === 1 ? 'min' : 'mins'}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1 text-[#4e434e] text-[13px]">
            {slot.busType === 'DD' && (
              <span
                className="material-symbols-outlined text-[16px] text-[#400050]"
                title="Double Decker Bus"
              >
                directions_bus
              </span>
            )}
            <span className="text-[10px] font-headline font-semibold bg-[#e7e0ed] px-1.5 py-0.5 rounded">
              {slot.busType}
            </span>
            {slot.wheelchair && (
              <span
                className="material-symbols-outlined text-[16px] text-[#400050]"
                title="Wheelchair Accessible"
              >
                accessible
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Express Sector':
        return 'bg-[#ede5f2] text-[#4e434e]';
      case 'High Demand':
        return 'bg-[#ffdbce] text-[#7f2b00]';
      default:
        return 'bg-[#f3ebf8] text-[#4e434e]';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow border border-[#f3ebf8]">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4">
        <div className="flex items-center gap-3.5">
          <div className="px-4 py-2 rounded-xl bg-[#400050] text-white font-headline font-extrabold text-[28px] sm:text-[32px] tracking-tight shadow-xs min-w-[64px] text-center">
            {service.serviceNumber}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-headline text-[17px] sm:text-[18px] text-[#1d1a23] font-bold">
                {service.destination}
              </span>
              <span
                className={`px-2 py-0.5 rounded-md font-headline text-[10px] font-bold ${getCategoryBadgeClass(
                  service.category
                )}`}
              >
                {service.category}
              </span>
            </div>
            <p className="text-[12px] sm:text-[13px] text-[#4e434e] mt-0.5">{service.viaInfo}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => setLocalExpanded(!isExpanded)}
            className="px-3 py-1.5 rounded-lg bg-[#f8f1fe] text-[#400050] font-headline font-bold text-[12px] hover:bg-[#f3ebf8] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">alt_route</span>
            <span>{isExpanded ? 'Hide Route Details' : 'Live Route Visualizer'}</span>
          </button>
        </div>
      </div>

      {/* Triple Arrival Slots */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        {renderSlot(service.nextBus, 'Next Bus')}
        {renderSlot(service.secondBus, '2nd Bus')}
        {renderSlot(service.thirdBus, '3rd Bus')}
      </div>

      {/* Collapsible Micro Route Tracker */}
      {isExpanded && (
        <div className="mt-4 pt-4 bg-[#F7F6F9] p-4 rounded-xl border border-[#ede5f2] animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-1">
            <span className="font-headline text-[12px] font-bold text-[#400050] uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#15803D] animate-ping"></span>
              Bus {service.serviceNumber} Live Vehicle Positions
            </span>
            <span className="text-[12px] text-[#4e434e]">
              Current Stop: <strong>{currentStopName}</strong>
            </span>
          </div>

          {/* Stepper Line */}
          <div className="relative flex items-center justify-between py-4 px-2 overflow-x-auto min-w-[500px]">
            {/* Route connecting line */}
            <div className="absolute left-6 right-6 h-1 bg-[#ded7e4] top-1/2 -translate-y-1/2 -z-0"></div>

            {service.routeStops.map((stop, idx) => {
              const isHere = stop.isCurrent;
              const hasBus = stop.hasBus;

              return (
                <div
                  key={stop.stopCode + idx}
                  className="relative z-10 flex flex-col items-center text-center w-28 shrink-0"
                >
                  {isHere ? (
                    <div className="w-8 h-8 rounded-full bg-[#a73a00] flex items-center justify-center text-white shadow-md animate-bounce">
                      <span className="material-symbols-outlined text-[18px]">directions_bus</span>
                    </div>
                  ) : hasBus ? (
                    <div
                      className="w-7 h-7 rounded-full bg-[#400050] flex items-center justify-center text-white shadow-xs"
                      title={stop.busPlate ? `Plate: ${stop.busPlate}` : undefined}
                    >
                      <span className="material-symbols-outlined text-[14px]">directions_bus</span>
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-white border-2 border-[#80737f] flex items-center justify-center text-[#80737f] shadow-2xs">
                      <span className="w-2 h-2 rounded-full bg-[#80737f]"></span>
                    </div>
                  )}

                  <span
                    className={`font-headline text-[10px] mt-1.5 truncate max-w-[100px] ${
                      isHere
                        ? 'text-[#a73a00] font-bold text-[11px]'
                        : hasBus
                        ? 'text-[#400050] font-bold'
                        : 'text-[#4e434e] font-semibold'
                    }`}
                  >
                    {stop.stopName}
                  </span>

                  {isHere && (
                    <span className="text-[9px] bg-[#ffdbce] text-[#370e00] px-1.5 rounded font-headline font-bold uppercase mt-0.5">
                      ARRIVING
                    </span>
                  )}

                  {hasBus && !isHere && stop.busEta && (
                    <span className="text-[9px] text-[#4e434e] bg-white px-1.5 rounded shadow-2xs mt-0.5">
                      {stop.busEta}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-2 pt-2 border-t border-[#ede5f2] flex items-center justify-between text-[11px] text-[#4e434e]">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-[#15803D]">verified</span>
              <span>GPS telematics accurate to ±15 seconds via LTA Datamall</span>
            </div>
            {onOpenFullRoute && (
              <button
                onClick={() => onOpenFullRoute(service)}
                className="text-[#400050] font-headline font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Full Stop Details &amp; Timetable</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
