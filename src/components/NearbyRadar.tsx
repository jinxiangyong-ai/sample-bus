import React, { useState } from 'react';
import { CONNECTING_TRAIN_LINES } from '../data/transitData';

interface NearbyRadarProps {
  currentStopCode: string;
  onSelectStop: (code: string) => void;
}

export const NearbyRadar: React.FC<NearbyRadarProps> = ({
  currentStopCode,
  onSelectStop,
}) => {
  const [selectedPin, setSelectedPin] = useState<string | null>(null);

  const nearbyStops = [
    {
      code: '03021',
      name: 'Prudential Twr',
      road: 'Cecil St',
      services: 'Svc 57, 131, 167',
      distance: '180m',
      top: '38%',
      left: '32%',
    },
    {
      code: '03059',
      name: 'One Raffles Quay',
      road: 'Raffles Quay',
      services: 'Svc 10, 70, 196',
      distance: '250m',
      top: '64%',
      left: '48%',
    },
    {
      code: '03019',
      name: 'OUE Bayfront',
      road: 'Collyer Quay',
      services: 'Svc 10, 100, 196',
      distance: '290m',
      top: '46%',
      left: '68%',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Live Transit Map Pin Card */}
      <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4 border border-[#f3ebf8]">
        <div className="flex items-center justify-between">
          <h3 className="font-headline font-bold text-[18px] text-[#400050]">
            Nearby Transit Radar
          </h3>
          <span className="text-[12px] text-[#15803D] font-headline font-bold flex items-center gap-1.5 bg-[#f0fdf4] px-2.5 py-0.5 rounded-full border border-[#bbf7d0]">
            <span className="w-2 h-2 rounded-full bg-[#15803D] animate-pulse"></span>
            GPS Active
          </span>
        </div>

        {/* Visual Map Canvas */}
        <div
          className="w-full h-56 bg-cover bg-center rounded-xl relative overflow-hidden shadow-inner flex flex-col justify-between p-3 border border-[#ede5f2]"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCyO0CFpCiBprE8Eiu6kcXMXkxLjtaOQNFGoQQJlRl_CXDdANvYK13jy8_wIgoFyUK07viLX9KIuBRSzMUSl8qx5X_WsawiAs_eTnQ2O7TpLDr02W6Z_OPObiYosUfgsi1p6Dw2ZEMtHv5VBHyulXzKsd7bcKin8AEf04NlZIwG7_hGOmtRaYnadE1dLulZaWLTSkCcHHCDoJ1440EOPyV1x2RObuhwqhWedEoyd9QNEV7pAfNMEMb7')`,
          }}
        >
          {/* Active Stop Label Chip */}
          <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg text-[13px] font-headline font-bold text-[#400050] self-start shadow-xs flex items-center gap-1.5 border border-[#ede5f2]">
            <span className="material-symbols-outlined text-[16px] text-[#a73a00]">pin_drop</span>
            <span>
              {currentStopCode === '03011'
                ? 'Fullerton Sq (03011)'
                : currentStopCode === '03021'
                ? 'Prudential Twr (03021)'
                : currentStopCode === '03059'
                ? 'One Raffles Quay (03059)'
                : currentStopCode === '03019'
                ? 'OUE Bayfront (03019)'
                : `Active Stop (${currentStopCode})`}
            </span>
          </div>

          {/* Interactive Floating Stop Pins */}
          {nearbyStops.map((stop) => (
            <button
              key={stop.code}
              onClick={() => {
                setSelectedPin(stop.code);
                onSelectStop(stop.code);
              }}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{ top: stop.top, left: stop.left }}
              title={`${stop.name} (${stop.code}) - ${stop.distance}`}
              type="button"
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-md transition-transform group-hover:scale-125 ${
                  currentStopCode === stop.code ? 'bg-[#a73a00] ring-4 ring-orange-300' : 'bg-[#400050]'
                }`}
              >
                <span className="material-symbols-outlined text-[12px]">directions_bus</span>
              </div>
            </button>
          ))}

          {/* Pulsing Commuter Location Ping */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
            <span className="w-12 h-12 rounded-full bg-[#a73a00]/30 animate-ping absolute"></span>
            <span className="w-6 h-6 rounded-full bg-[#a73a00] flex items-center justify-center text-white shadow-md text-[10px]">
              <span className="material-symbols-outlined text-[14px]">directions_walk</span>
            </span>
          </div>

          {/* En-route Bus Counter */}
          <div className="bg-[#400050]/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-[11px] font-headline font-bold text-white self-end shadow-xs flex items-center gap-2 border border-white/20">
            <span className="w-2 h-2 rounded-full bg-[#15803D] animate-pulse"></span>
            <span>4 buses en route</span>
          </div>
        </div>

        {/* Alternative Nearby Stops Switcher */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-[11px] font-headline font-bold text-[#4e434e] uppercase tracking-wider">
            <span>Alternative Nearby Stops</span>
            <span>Distance</span>
          </div>

          {nearbyStops.map((stop) => {
            const isActive = currentStopCode === stop.code;
            return (
              <button
                key={stop.code}
                onClick={() => onSelectStop(stop.code)}
                className={`w-full p-3 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#f3ebf8] border-2 border-[#5c186c] shadow-xs'
                    : 'bg-[#F7F6F9] hover:bg-[#ede5f2] border border-transparent'
                }`}
                type="button"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-headline font-bold text-[11px] ${
                      isActive ? 'bg-[#5c186c] text-white' : 'bg-[#e7e0ed] text-[#400050]'
                    }`}
                  >
                    {stop.code}
                  </div>
                  <div>
                    <h4 className="font-headline font-bold text-[13px] text-[#1d1a23] leading-tight">
                      {stop.name}
                    </h4>
                    <p className="text-[11px] text-[#4e434e]">
                      {stop.road} • {stop.services}
                    </p>
                  </div>
                </div>
                <span className="font-headline text-[12px] text-[#a73a00] font-bold">
                  {stop.distance}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Connecting Train Lines Card */}
      <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4 border border-[#f3ebf8]">
        <div className="flex items-center justify-between">
          <h3 className="font-headline font-bold text-[18px] text-[#400050]">
            Connecting Train Lines
          </h3>
          <span className="material-symbols-outlined text-[#400050] text-[20px]">train</span>
        </div>

        <div className="space-y-2.5">
          {CONNECTING_TRAIN_LINES.map((train) => (
            <div
              key={train.code}
              className="p-3 rounded-xl bg-[#F7F6F9] flex items-center justify-between border border-transparent hover:border-[#ede5f2] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1 shrink-0">
                  {train.code === 'EW14 / NS26' ? (
                    <>
                      <span className="px-2 py-0.5 rounded font-headline text-[10px] font-bold bg-[#009640] text-white">
                        EW14
                      </span>
                      <span className="px-2 py-0.5 rounded font-headline text-[10px] font-bold bg-[#D42E12] text-white">
                        NS26
                      </span>
                    </>
                  ) : (
                    <span
                      className="px-2 py-0.5 rounded font-headline text-[10px] font-bold text-white"
                      style={{ backgroundColor: train.bgColor }}
                    >
                      {train.code}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-headline font-bold text-[13px] text-[#1d1a23]">
                    {train.name}
                  </h4>
                  <p className="text-[11px] text-[#4e434e]">{train.lineName}</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#15803D]/10 text-[#15803D] font-headline text-[10px] font-bold uppercase tracking-wider">
                {train.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Official SBS Transit Commuter Safety Widget */}
      <div className="bg-[#400050] text-white rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#ffdbce] text-[20px]">verified_user</span>
          <h4 className="font-headline text-[12px] uppercase tracking-wider text-[#ffdbce] font-bold">
            Anti-Scam Verification
          </h4>
        </div>
        <p className="text-[13px] text-[#f8f1fe] leading-relaxed">
          Commuters are advised that official SBS Transit services never request bank logins or fee top-ups via unofficial SMS links. Verify legitimate notifications via the ScamShield hotline at{' '}
          <strong className="text-white underline">1799</strong>.
        </p>
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-headline">
          <span className="text-[#e7e0ed]">SBS Transit Operations Centre</span>
          <span className="text-[#ffdbce] font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">check_circle</span>
            LTA Certified
          </span>
        </div>
      </div>
    </div>
  );
};
