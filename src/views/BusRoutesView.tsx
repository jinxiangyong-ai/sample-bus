import React, { useState } from 'react';
import { ALL_BUS_SERVICES_CATALOG } from '../data/transitData';

interface BusRoutesViewProps {
  onSelectServiceToVisualizer: (svcNumber: string) => void;
}

export const BusRoutesView: React.FC<BusRoutesViewProps> = ({
  onSelectServiceToVisualizer,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const filtered = ALL_BUS_SERVICES_CATALOG.filter((item) => {
    const matchesSearch =
      item.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.dest.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.routeOverview.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterType === 'ALL' || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#fdd6ff] text-[#340041] font-headline text-[11px] font-bold uppercase tracking-wide">
              Network Directory
            </span>
            <span className="text-[12px] text-[#4e434e] font-medium">SBS Transit Fleet Operations</span>
          </div>
          <h1 className="font-headline font-bold text-[26px] sm:text-[30px] text-[#400050] mt-1 tracking-tight">
            Bus Services &amp; Network Routes
          </h1>
          <p className="text-[13px] text-[#4e434e]">
            Browse scheduled frequencies, operating hours, trunk corridors, and route maps across Singapore.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-[#ede5f2] flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex items-center w-full">
          <span className="material-symbols-outlined absolute left-3.5 text-[#80737f] text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search service number (e.g. 10, 70), origin, or destination..."
            className="w-full pl-11 pr-4 py-2.5 bg-[#F7F6F9] rounded-xl text-[14px] text-[#1d1a23] placeholder:text-[#80737f] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#5c186c]/20 border border-transparent focus:border-[#5c186c]"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 p-1 text-[#80737f] hover:text-[#1d1a23] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0 self-start md:self-auto overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['ALL', 'Trunk', 'Express Sector'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3.5 py-2 rounded-xl text-[12px] font-headline font-bold transition-all cursor-pointer whitespace-nowrap ${
                filterType === type
                  ? 'bg-[#5c186c] text-white shadow-xs'
                  : 'bg-[#F7F6F9] text-[#4e434e] hover:bg-[#ede5f2]'
              }`}
            >
              {type === 'ALL' ? 'All Services' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((bus) => (
          <div
            key={bus.service}
            className="bg-white rounded-2xl p-5 shadow-sm border border-[#ede5f2] hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#400050] text-white flex items-center justify-center font-headline font-extrabold text-[22px] shadow-xs">
                    {bus.service}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-headline font-bold text-[16px] text-[#1d1a23]">
                        Service {bus.service}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#f3ebf8] text-[#4e434e] text-[10px] font-headline font-bold">
                        {bus.type}
                      </span>
                    </div>
                    <p className="text-[12px] text-[#4e434e]">
                      {bus.origin} ⇄ {bus.dest}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onSelectServiceToVisualizer(bus.service)}
                  className="px-3 py-1.5 rounded-lg bg-[#f8f1fe] text-[#400050] font-headline text-[11px] font-bold hover:bg-[#f3ebf8] transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <span className="material-symbols-outlined text-[15px]">alt_route</span>
                  <span>View Stops</span>
                </button>
              </div>

              <p className="text-[12px] text-[#4e434e] mt-3 leading-relaxed">
                {bus.routeOverview}
              </p>
            </div>

            {/* Operating Hours and Frequencies */}
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#ede5f2] text-[11px]">
              <div className="p-2 rounded-lg bg-[#F7F6F9]">
                <span className="text-[#80737f] uppercase font-headline font-bold block text-[10px]">
                  First &amp; Last Bus
                </span>
                <span className="font-headline font-bold text-[#1d1a23]">
                  {bus.firstBus} – {bus.lastBus}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-[#F7F6F9]">
                <span className="text-[#80737f] uppercase font-headline font-bold block text-[10px]">
                  Peak / Off-Peak Freq
                </span>
                <span className="font-headline font-bold text-[#1d1a23]">
                  {bus.peakFreq} / {bus.offPeakFreq}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
