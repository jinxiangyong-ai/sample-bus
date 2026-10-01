import React, { useState } from 'react';
import { TRANSIT_ALERTS } from '../data/transitData';

export const DisruptionsView: React.FC = () => {
  const [filter, setFilter] = useState('ALL');

  const filtered = TRANSIT_ALERTS.filter(
    (a) => filter === 'ALL' || a.category === filter
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-[#ffdbce] text-[#7f2b00] font-headline text-[11px] font-bold uppercase tracking-wide">
            Commuter Advisories
          </span>
          <span className="text-[12px] text-[#4e434e] font-medium">LTA &amp; SBS Transit Joint Operations</span>
        </div>
        <h1 className="font-headline font-bold text-[26px] sm:text-[30px] text-[#400050] mt-1 tracking-tight">
          Service Disruptions, Diversions &amp; Alerts
        </h1>
        <p className="text-[13px] text-[#4e434e]">
          Official announcements regarding road closures, track engineering maintenance, and temporary route adjustments.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['ALL', 'Road Closure', 'Train Service', 'Bus Bridging', 'Advisory'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3.5 py-2 rounded-xl text-[12px] font-headline font-bold transition-all cursor-pointer whitespace-nowrap ${
              filter === cat
                ? 'bg-[#5c186c] text-white shadow-xs'
                : 'bg-white text-[#4e434e] border border-[#ede5f2] hover:bg-[#f3ebf8]'
            }`}
          >
            {cat === 'ALL' ? 'All Alerts' : cat}
          </button>
        ))}
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {filtered.map((alert) => (
          <div
            key={alert.id}
            className="bg-white rounded-2xl p-5 shadow-sm border border-[#ede5f2] hover:shadow-md transition-shadow space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-white ${
                    alert.severity === 'warning' ? 'bg-[#a73a00]' : 'bg-[#400050]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {alert.severity === 'warning' ? 'warning' : 'info'}
                  </span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#f3ebf8] text-[#400050] text-[11px] font-headline font-bold">
                  {alert.category}
                </span>
                <span className="text-[12px] text-[#80737f]">{alert.date}</span>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-[#4e434e] font-semibold">Affected:</span>
                {alert.affectedServices.map((svc) => (
                  <span
                    key={svc}
                    className="px-2 py-0.5 rounded-md bg-[#ede5f2] font-headline text-[11px] font-bold text-[#400050]"
                  >
                    {svc}
                  </span>
                ))}
              </div>
            </div>

            <h3 className="font-headline font-bold text-[16px] sm:text-[18px] text-[#1d1a23]">
              {alert.title}
            </h3>

            <p className="text-[13px] text-[#4e434e] leading-relaxed">{alert.details}</p>

            <div className="pt-2 border-t border-[#ede5f2] flex items-center justify-between text-[11px] text-[#80737f]">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#15803D]">verified</span>
                Verified by SBS Transit Traffic Control
              </span>
              <span className="hover:text-[#400050] underline cursor-pointer">
                Alternative Travel Guide →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
