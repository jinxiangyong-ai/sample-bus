import React, { useState } from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [reportCategory, setReportCategory] = useState('Lost Item');
  const [reportText, setReportText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReportSubmitted(true);
    setTimeout(() => {
      setReportSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#ede5f2] space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px] text-[#400050]">support_agent</span>
            <h3 className="font-headline font-bold text-[20px] text-[#400050]">
              Customer Transit Assistance
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

        {/* Hotlines */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-[#f8f1fe] border border-[#ede5f2]">
            <span className="text-[11px] font-headline font-bold text-[#4e434e] uppercase tracking-wider block">
              SBS Transit Hotline
            </span>
            <span className="font-headline font-extrabold text-[18px] text-[#400050] block mt-1">
              1800-287-2727
            </span>
            <span className="text-[11px] text-[#4e434e]">Daily 07:30 to 20:00</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#ffdbce]/40 border border-[#fd651e]/30">
            <span className="text-[11px] font-headline font-bold text-[#a73a00] uppercase tracking-wider block">
              ScamShield Verification
            </span>
            <span className="font-headline font-extrabold text-[18px] text-[#a73a00] block mt-1">
              1799
            </span>
            <span className="text-[11px] text-[#4e434e]">24/7 National Anti-Scam</span>
          </div>
        </div>

        {/* Report / Assistance Request Form */}
        <div className="space-y-3 pt-2">
          <h4 className="font-headline font-bold text-[14px] text-[#1d1a23]">
            Submit Commuter Feedback or Lost &amp; Found
          </h4>

          {reportSubmitted ? (
            <div className="p-4 rounded-xl bg-[#f0fdf4] text-[#15803D] font-headline font-semibold text-center border border-[#bbf7d0] space-y-1">
              <span className="material-symbols-outlined text-[28px]">check_circle</span>
              <p>Thank you! Your case has been logged with SBS Transit Operations.</p>
              <p className="text-[11px] text-[#4e434e]">Reference ID: SBS-{Math.floor(100000 + Math.random() * 900000)}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-headline font-bold text-[#4e434e] uppercase">
                  Category
                </label>
                <select
                  value={reportCategory}
                  onChange={(e) => setReportCategory(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-[#F7F6F9] rounded-xl border border-[#ede5f2] text-[13px] font-medium text-[#1d1a23] focus:outline-none focus:border-[#400050]"
                >
                  <option>Lost Item on Bus / Train</option>
                  <option>Wheelchair Ramp Assistance Request</option>
                  <option>Bus Arrival Timing Feedback</option>
                  <option>Platform / Station Facility Enquiry</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-headline font-bold text-[#4e434e] uppercase">
                  Details &amp; Location
                </label>
                <textarea
                  required
                  rows={3}
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder="Describe your enquiry, service number, or lost item details..."
                  className="w-full mt-1 px-3 py-2 bg-[#F7F6F9] rounded-xl border border-[#ede5f2] text-[13px] text-[#1d1a23] placeholder:text-[#80737f] focus:outline-none focus:border-[#400050]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-[#e7e0ed] text-[#1d1a23] font-headline text-[13px] font-bold hover:bg-[#ded7e4] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#5c186c] text-white font-headline text-[13px] font-bold hover:bg-[#400050] transition-colors cursor-pointer shadow-xs"
                >
                  Submit Inquiry
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
