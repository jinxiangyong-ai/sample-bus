import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#f8f1fe] mt-12 py-12 shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-t border-[#ede5f2]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand overview */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <img
              alt="SBS Transit Logo"
              className="h-6 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1VnoJORL1R_gQTRZ7qmrQ41oNC8To-gIRQmqEB11xZ4i-x3uF3fA2pPuHUTq8bjb9LaMJkBExC4H93-6x9-zKTOWIiy7EYYU9UHVofvW-pkfGUiqihZQ0kbHsE-52Hs0emKB4j4be-2KX7GHS170tSp7WhR5cLs9nrv5Ln3xe7xKU4uaBf48dHszV5pz7c26tAvaJRpe0hv8buBn9GVCgWXvYyePPyUNVbUEYtCSP3I2eGwukxoZdD8gY0"
            />
            <span className="font-headline font-bold text-[18px] text-[#400050]">SBS Transit</span>
          </div>
          <p className="text-[13px] text-[#4e434e] leading-relaxed">
            Singapore&apos;s premier public transport operator committed to safe, reliable, and inclusive bus and rail connectivity across the island.
          </p>
        </div>

        {/* Commuter Services */}
        <div>
          <h4 className="font-headline font-bold text-[12px] text-[#400050] uppercase tracking-wider mb-3">
            Commuter Services
          </h4>
          <ul className="space-y-2 text-[13px] text-[#4e434e]">
            <li className="flex items-center gap-2 hover:text-[#400050] transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-[16px]">directions_bus</span>
              Live NextBus Estimates
            </li>
            <li className="flex items-center gap-2 hover:text-[#400050] transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-[16px]">subway</span>
              North East Line (NEL) &amp; DTL
            </li>
            <li className="flex items-center gap-2 hover:text-[#400050] transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-[16px]">accessible</span>
              Wheelchair Accessible Buses
            </li>
            <li className="flex items-center gap-2 hover:text-[#400050] transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-[16px]">map</span>
              Transit Network System Map
            </li>
          </ul>
        </div>

        {/* Travel Assistance */}
        <div>
          <h4 className="font-headline font-bold text-[12px] text-[#400050] uppercase tracking-wider mb-3">
            Travel Assistance
          </h4>
          <ul className="space-y-2 text-[13px] text-[#4e434e]">
            <li className="hover:text-[#400050] transition-colors cursor-pointer">Lost &amp; Found Property</li>
            <li className="hover:text-[#400050] transition-colors cursor-pointer">Fare Calculator &amp; Concessions</li>
            <li className="hover:text-[#400050] transition-colors cursor-pointer">Passenger Service Centre</li>
            <li className="hover:text-[#400050] transition-colors cursor-pointer">First &amp; Last Train Timings</li>
          </ul>
        </div>

        {/* Direct Support */}
        <div>
          <h4 className="font-headline font-bold text-[12px] text-[#400050] uppercase tracking-wider mb-3">
            Direct Support
          </h4>
          <div className="space-y-1.5 text-[13px] text-[#4e434e]">
            <p className="font-headline text-[13px] text-[#1d1a23] font-bold">
              Hotline: 1800-287-2727
            </p>
            <p className="text-[12px]">Daily operating hours: 07:30 to 20:00</p>
            <p className="mt-2 text-[12px] leading-relaxed text-[#4e434e]">
              For rail emergency alarms, contact station staff or tap intercom panels on platforms.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-8 pt-4 border-t border-[#ede5f2] flex flex-col md:flex-row items-center justify-between text-[#4e434e] text-[12px] gap-2">
        <div>© 2025 SBS Transit Ltd. All rights reserved. A member of ComfortDelGro.</div>
        <div className="flex items-center gap-6">
          <span className="hover:text-[#1d1a23] transition-colors cursor-pointer">Privacy Statement</span>
          <span className="hover:text-[#1d1a23] transition-colors cursor-pointer">Terms of Transit</span>
          <span className="hover:text-[#1d1a23] transition-colors cursor-pointer">Accessibility Standards</span>
        </div>
      </div>
    </footer>
  );
};
