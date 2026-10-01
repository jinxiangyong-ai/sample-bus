import React, { useState } from 'react';

export const TrainServicesView: React.FC = () => {
  const [selectedLine, setSelectedLine] = useState<'NEL' | 'DTL' | 'LRT'>('NEL');

  const nelStations = [
    { code: 'NE1', name: 'HarbourFront', interchange: ['CC29'] },
    { code: 'NE3', name: 'Outram Park', interchange: ['EW16', 'TE17'] },
    { code: 'NE4', name: 'Chinatown', interchange: ['DT19'] },
    { code: 'NE5', name: 'Clarke Quay', interchange: [] },
    { code: 'NE6', name: 'Dhoby Ghaut', interchange: ['NS24', 'CC1'] },
    { code: 'NE7', name: 'Little India', interchange: ['DT12'] },
    { code: 'NE8', name: 'Farrer Park', interchange: [] },
    { code: 'NE9', name: 'Boon Keng', interchange: [] },
    { code: 'NE10', name: 'Potong Pasir', interchange: [] },
    { code: 'NE11', name: 'Woodleigh', interchange: [] },
    { code: 'NE12', name: 'Serangoon', interchange: ['CC13'] },
    { code: 'NE13', name: 'Kovan', interchange: [] },
    { code: 'NE14', name: 'Hougang', interchange: ['CR8 (Future)'] },
    { code: 'NE15', name: 'Buangkok', interchange: [] },
    { code: 'NE16', name: 'Sengkang', interchange: ['STC'] },
    { code: 'NE17', name: 'Punggol', interchange: ['PTC', 'CP4'] },
    { code: 'NE18', name: 'Punggol Coast', interchange: [] },
  ];

  const dtlStations = [
    { code: 'DT1', name: 'Bukit Panjang', interchange: ['BP6'] },
    { code: 'DT2', name: 'Cashew', interchange: [] },
    { code: 'DT3', name: 'Hillview', interchange: [] },
    { code: 'DT5', name: 'Beauty World', interchange: [] },
    { code: 'DT6', name: 'King Albert Park', interchange: ['CR15 (Future)'] },
    { code: 'DT7', name: 'Sixth Avenue', interchange: [] },
    { code: 'DT8', name: 'Tan Kah Kee', interchange: [] },
    { code: 'DT9', name: 'Botanic Gardens', interchange: ['CC19'] },
    { code: 'DT10', name: 'Stevens', interchange: ['TE11'] },
    { code: 'DT11', name: 'Newton', interchange: ['NS21'] },
    { code: 'DT12', name: 'Little India', interchange: ['NE7'] },
    { code: 'DT14', name: 'Bugis', interchange: ['EW12'] },
    { code: 'DT16', name: 'Bayfront', interchange: ['CC0'] },
    { code: 'DT17', name: 'Downtown', interchange: [] },
    { code: 'DT18', name: 'Telok Ayer', interchange: [] },
    { code: 'DT19', name: 'Chinatown', interchange: ['NE4'] },
    { code: 'DT26', name: 'MacPherson', interchange: ['CC10'] },
    { code: 'DT32', name: 'Tampines', interchange: ['EW2'] },
    { code: 'DT35', name: 'Expo', interchange: ['CG1', 'TE31 (Future)'] },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-[#fdd6ff] text-[#340041] font-headline text-[11px] font-bold uppercase tracking-wide">
            Rapid Transit System
          </span>
          <span className="text-[12px] text-[#4e434e] font-medium">SBS Transit Rail Network</span>
        </div>
        <h1 className="font-headline font-bold text-[26px] sm:text-[30px] text-[#400050] mt-1 tracking-tight">
          Train &amp; MRT Services
        </h1>
        <p className="text-[13px] text-[#4e434e]">
          Live operations, line maps, platform frequencies, and first &amp; last train timings for NEL, DTL, and LRT systems.
        </p>
      </div>

      {/* Line Switcher */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedLine('NEL')}
          className={`px-4 py-3 rounded-2xl flex items-center gap-3 transition-all cursor-pointer ${
            selectedLine === 'NEL'
              ? 'bg-[#702082] text-white shadow-md'
              : 'bg-white text-[#1d1a23] border border-[#ede5f2] hover:bg-[#f3ebf8]'
          }`}
        >
          <span className="px-2 py-0.5 rounded bg-white/20 text-white font-headline text-[11px] font-bold">
            NEL
          </span>
          <div className="text-left">
            <span className="font-headline font-bold text-[14px] block leading-tight">
              North East Line
            </span>
            <span className="text-[11px] opacity-80 block">HarbourFront ⇄ Punggol Coast</span>
          </div>
          <span className="ml-2 w-2 h-2 rounded-full bg-[#15803D] animate-pulse"></span>
        </button>

        <button
          onClick={() => setSelectedLine('DTL')}
          className={`px-4 py-3 rounded-2xl flex items-center gap-3 transition-all cursor-pointer ${
            selectedLine === 'DTL'
              ? 'bg-[#0055B8] text-white shadow-md'
              : 'bg-white text-[#1d1a23] border border-[#ede5f2] hover:bg-[#f3ebf8]'
          }`}
        >
          <span className="px-2 py-0.5 rounded bg-white/20 text-white font-headline text-[11px] font-bold">
            DTL
          </span>
          <div className="text-left">
            <span className="font-headline font-bold text-[14px] block leading-tight">
              Downtown Line
            </span>
            <span className="text-[11px] opacity-80 block">Bukit Panjang ⇄ Expo</span>
          </div>
          <span className="ml-2 w-2 h-2 rounded-full bg-[#15803D] animate-pulse"></span>
        </button>

        <button
          onClick={() => setSelectedLine('LRT')}
          className={`px-4 py-3 rounded-2xl flex items-center gap-3 transition-all cursor-pointer ${
            selectedLine === 'LRT'
              ? 'bg-[#400050] text-white shadow-md'
              : 'bg-white text-[#1d1a23] border border-[#ede5f2] hover:bg-[#f3ebf8]'
          }`}
        >
          <span className="px-2 py-0.5 rounded bg-white/20 text-white font-headline text-[11px] font-bold">
            LRT
          </span>
          <div className="text-left">
            <span className="font-headline font-bold text-[14px] block leading-tight">
              Sengkang &amp; Punggol LRT
            </span>
            <span className="text-[11px] opacity-80 block">East &amp; West Loops</span>
          </div>
          <span className="ml-2 w-2 h-2 rounded-full bg-[#15803D] animate-pulse"></span>
        </button>
      </div>

      {/* Line Details Overview Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#ede5f2] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#ede5f2]">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center font-headline font-bold text-white text-[18px]"
              style={{
                backgroundColor:
                  selectedLine === 'NEL' ? '#702082' : selectedLine === 'DTL' ? '#0055B8' : '#400050',
              }}
            >
              {selectedLine}
            </div>
            <div>
              <h2 className="font-headline font-bold text-[20px] text-[#1d1a23]">
                {selectedLine === 'NEL'
                  ? 'North East Line (NEL)'
                  : selectedLine === 'DTL'
                  ? 'Downtown Line (DTL)'
                  : 'Sengkang & Punggol Light Rail Transit'}
              </h2>
              <p className="text-[12px] text-[#4e434e]">
                {selectedLine === 'NEL'
                  ? '22.1 km driverless underground heavy rail line connecting Northeast Singapore to HarbourFront.'
                  : selectedLine === 'DTL'
                  ? '42 km continuous underground line connecting Northwest corridor via CBD to Tampines & Changi Expo.'
                  : 'Automated rubber-tired people mover connecting residents to Sengkang & Punggol MRT interchanges.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#f0fdf4] text-[#15803D] font-headline text-[12px] font-bold border border-[#bbf7d0] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#15803D] animate-ping"></span>
              All Services Normal
            </span>
          </div>
        </div>

        {/* Operating Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 bg-[#F7F6F9] rounded-xl">
            <span className="text-[11px] text-[#80737f] uppercase font-headline font-bold block">
              Peak Headway
            </span>
            <span className="font-headline font-bold text-[18px] text-[#1d1a23]">
              {selectedLine === 'NEL' ? '2.5 mins' : selectedLine === 'DTL' ? '3.0 mins' : '3.5 mins'}
            </span>
          </div>
          <div className="p-3 bg-[#F7F6F9] rounded-xl">
            <span className="text-[11px] text-[#80737f] uppercase font-headline font-bold block">
              Off-Peak Headway
            </span>
            <span className="font-headline font-bold text-[18px] text-[#1d1a23]">
              {selectedLine === 'NEL' ? '4.5 mins' : selectedLine === 'DTL' ? '5.0 mins' : '5.5 mins'}
            </span>
          </div>
          <div className="p-3 bg-[#F7F6F9] rounded-xl">
            <span className="text-[11px] text-[#80737f] uppercase font-headline font-bold block">
              First Train
            </span>
            <span className="font-headline font-bold text-[18px] text-[#1d1a23]">
              {selectedLine === 'NEL' ? '05:35' : selectedLine === 'DTL' ? '05:40' : '05:30'}
            </span>
          </div>
          <div className="p-3 bg-[#F7F6F9] rounded-xl">
            <span className="text-[11px] text-[#80737f] uppercase font-headline font-bold block">
              Last Train
            </span>
            <span className="font-headline font-bold text-[18px] text-[#1d1a23]">
              {selectedLine === 'NEL' ? '23:55' : selectedLine === 'DTL' ? '23:50' : '00:15'}
            </span>
          </div>
        </div>

        {/* Stations Line Strip */}
        <div className="pt-3">
          <h3 className="font-headline font-bold text-[14px] text-[#1d1a23] mb-3">
            Key Stations &amp; Interchange Connections
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-80 overflow-y-auto pr-1">
            {(selectedLine === 'NEL' ? nelStations : dtlStations).map((stn) => (
              <div
                key={stn.code}
                className="p-2.5 rounded-xl bg-[#F7F6F9] border border-[#ede5f2] flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="px-2 py-0.5 rounded font-headline text-[11px] font-bold text-white"
                    style={{
                      backgroundColor: selectedLine === 'NEL' ? '#702082' : '#0055B8',
                    }}
                  >
                    {stn.code}
                  </span>
                  <span className="font-headline font-bold text-[13px] text-[#1d1a23]">
                    {stn.name}
                  </span>
                </div>

                {stn.interchange.length > 0 && (
                  <div className="flex items-center gap-1">
                    {stn.interchange.map((ic) => (
                      <span
                        key={ic}
                        className="px-1.5 py-0.2 rounded font-headline text-[9px] font-bold bg-[#400050] text-white"
                      >
                        {ic}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
