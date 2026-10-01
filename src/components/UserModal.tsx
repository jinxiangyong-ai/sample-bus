import React, { useState } from 'react';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose }) => {
  const [ezlinkCard, setEzlinkCard] = useState('CAN: 1000 8920 4811');
  const [balance, setBalance] = useState<number>(24.8);
  const [autoTopUp, setAutoTopUp] = useState<boolean>(true);
  const [topUpDone, setTopUpDone] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleTopUp = () => {
    setBalance((prev) => prev + 20);
    setTopUpDone(true);
    setTimeout(() => setTopUpDone(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#ede5f2] space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px] text-[#400050]">person</span>
            <h3 className="font-headline font-bold text-[20px] text-[#400050]">
              Commuter Profile
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#80737f] hover:text-[#1d1a23] hover:bg-[#f3ebf8] transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Digital EZ-Link / SimplyGo Card */}
        <div className="rounded-2xl p-5 bg-gradient-to-br from-[#400050] to-[#5c186c] text-white shadow-md space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-widest text-[#ffdbce] font-headline font-bold">
              SimplyGo • SBS Transit
            </span>
            <span className="material-symbols-outlined text-[24px] text-white/80">contactless</span>
          </div>

          <div>
            <span className="text-[11px] text-[#ffdbce] uppercase">Stored Value Balance</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-[14px] font-bold">S$</span>
              <span className="font-headline font-extrabold text-[32px] tracking-tight">
                {balance.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/20 text-[#ede5f2]">
            <span className="font-mono">{ezlinkCard}</span>
            <span className="bg-[#15803D] text-white px-2 py-0.5 rounded font-headline font-bold">
              ACTIVE
            </span>
          </div>
        </div>

        {/* Card Actions */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={handleTopUp}
            className="flex-1 py-2.5 rounded-xl bg-[#5c186c] hover:bg-[#400050] text-white font-headline text-[13px] font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add_card</span>
            <span>Quick Top-up +$20</span>
          </button>
        </div>

        {topUpDone && (
          <div className="p-2.5 rounded-lg bg-[#f0fdf4] text-[#15803D] text-[12px] font-headline font-semibold text-center border border-[#bbf7d0]">
            S$20.00 topped up successfully via PayNow / GIRO.
          </div>
        )}

        {/* Commuter Preferences */}
        <div className="space-y-3 pt-2 border-t border-[#ede5f2]">
          <h4 className="font-headline font-bold text-[13px] text-[#1d1a23]">
            Accessibility &amp; Notification Settings
          </h4>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#F7F6F9]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#400050]">accessible</span>
              <span className="text-[13px] text-[#1d1a23] font-medium">
                Prioritize Wheelchair Accessible Buses (WAB)
              </span>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="accent-[#5c186c] w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#F7F6F9]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#400050]">notifications</span>
              <span className="text-[13px] text-[#1d1a23] font-medium">
                Service Disruption Push Alerts
              </span>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="accent-[#5c186c] w-4 h-4 cursor-pointer"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#e7e0ed] text-[#1d1a23] font-headline text-[13px] font-bold hover:bg-[#ded7e4] transition-colors cursor-pointer"
            type="button"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
