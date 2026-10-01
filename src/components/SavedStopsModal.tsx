import React, { useState } from 'react';
import { BUS_STOPS_DATABASE } from '../data/transitData';

interface SavedStopItem {
  code: string;
  name: string;
  label?: string;
  addedAt: string;
}

interface SavedStopsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedStops: SavedStopItem[];
  onSelectStop: (code: string) => void;
  onRemoveStop: (code: string) => void;
  onAddCurrentStop: () => void;
  currentStopCode: string;
}

export const SavedStopsModal: React.FC<SavedStopsModalProps> = ({
  isOpen,
  onClose,
  savedStops,
  onSelectStop,
  onRemoveStop,
  onAddCurrentStop,
  currentStopCode,
}) => {
  if (!isOpen) return null;

  const isCurrentSaved = savedStops.some((s) => s.code === currentStopCode);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#ede5f2] space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-[24px] text-amber-500"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <h3 className="font-headline font-bold text-[20px] text-[#400050]">
              Saved Bus Stops ({savedStops.length})
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

        {/* Current Stop Bookmark Action */}
        <div className="p-3.5 rounded-xl bg-[#f8f1fe] flex items-center justify-between border border-[#ede5f2]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#5c186c] text-[20px]">signpost</span>
            <div>
              <p className="font-headline text-[13px] font-bold text-[#1d1a23]">
                Current Stop: {currentStopCode}
              </p>
              <p className="text-[11px] text-[#4e434e]">
                {BUS_STOPS_DATABASE[currentStopCode]?.stopName || 'Transit Stop'}
              </p>
            </div>
          </div>
          <button
            onClick={onAddCurrentStop}
            disabled={isCurrentSaved}
            className={`px-3 py-1.5 rounded-lg font-headline text-[12px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
              isCurrentSaved
                ? 'bg-[#e7e0ed] text-[#80737f] cursor-not-allowed'
                : 'bg-[#5c186c] hover:bg-[#400050] text-white shadow-xs'
            }`}
            type="button"
          >
            <span
              className="material-symbols-outlined text-[16px]"
              style={isCurrentSaved ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {isCurrentSaved ? 'check' : 'add'}
            </span>
            <span>{isCurrentSaved ? 'Saved' : 'Save Current Stop'}</span>
          </button>
        </div>

        {/* Saved List */}
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {savedStops.length === 0 ? (
            <div className="text-center py-8 text-[#80737f] text-[13px]">
              No saved stops yet. Click the star icon next to any bus stop to bookmark it!
            </div>
          ) : (
            savedStops.map((stop) => {
              const stopDetails = BUS_STOPS_DATABASE[stop.code];
              return (
                <div
                  key={stop.code}
                  className="p-3 rounded-xl bg-[#F7F6F9] hover:bg-[#f3ebf8] border border-transparent hover:border-[#ede5f2] flex items-center justify-between transition-colors"
                >
                  <button
                    onClick={() => {
                      onSelectStop(stop.code);
                      onClose();
                    }}
                    className="flex items-center gap-3 text-left flex-1 cursor-pointer"
                    type="button"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#400050] text-white flex flex-col items-center justify-center font-headline font-bold text-[12px] shrink-0">
                      <span>{stop.code}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-headline font-bold text-[14px] text-[#1d1a23]">
                          {stop.name}
                        </span>
                        {stop.label && (
                          <span className="px-2 py-0.5 rounded-full bg-[#ffdbce] text-[#7f2b00] text-[10px] font-headline font-bold">
                            {stop.label}
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] text-[#4e434e]">
                        {stopDetails?.roadName || 'Singapore Bus Stop'} •{' '}
                        {stopDetails?.services.length || 3} routes active
                      </p>
                    </div>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onRemoveStop(stop.code)}
                      className="p-2 text-[#80737f] hover:text-[#ba1a1a] hover:bg-white rounded-lg transition-colors cursor-pointer"
                      title="Remove from favorites"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="pt-2 border-t border-[#ede5f2] flex justify-end">
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
