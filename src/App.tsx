import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ServiceCard } from './components/ServiceCard';
import { NearbyRadar } from './components/NearbyRadar';
import { SavedStopsModal } from './components/SavedStopsModal';
import { RouteVisualizerModal } from './components/RouteVisualizerModal';
import { HelpModal } from './components/HelpModal';
import { UserModal } from './components/UserModal';
import { BusRoutesView } from './views/BusRoutesView';
import { TrainServicesView } from './views/TrainServicesView';
import { DisruptionsView } from './views/DisruptionsView';
import {
  BUS_STOPS_DATABASE,
  BusStop,
  BusServiceArrival,
} from './data/transitData';

interface SavedStopItem {
  code: string;
  name: string;
  label?: string;
  addedAt: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'arrival' | 'routes' | 'trains' | 'alerts'>('arrival');
  const [fontScale, setFontScale] = useState<number>(1);
  const [currentStopCode, setCurrentStopCode] = useState<string>('03011');
  const [searchInput, setSearchInput] = useState<string>('03011 - Fullerton Sq (Fullerton Rd)');
  const [showSearchDropdown, setShowSearchDropdown] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(12);
  const [allExpanded, setAllExpanded] = useState<boolean>(false);
  const [gpsLocating, setGpsLocating] = useState<boolean>(false);

  // Modals state
  const [savedModalOpen, setSavedModalOpen] = useState<boolean>(false);
  const [helpModalOpen, setHelpModalOpen] = useState<boolean>(false);
  const [userModalOpen, setUserModalOpen] = useState<boolean>(false);
  const [selectedServiceForModal, setSelectedServiceForModal] = useState<BusServiceArrival | null>(null);

  // Saved stops list
  const [savedStops, setSavedStops] = useState<SavedStopItem[]>([
    { code: '03011', name: 'Fullerton Sq', label: 'Office / CBD', addedAt: '2025-05-10' },
    { code: '28009', name: 'Jurong East Int', label: 'Home Hub', addedAt: '2025-05-12' },
    { code: '14141', name: 'Harbourfront Stn / VivoCity', label: 'Shopping', addedAt: '2025-06-01' },
  ]);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  const currentStop: BusStop =
    BUS_STOPS_DATABASE[currentStopCode] || BUS_STOPS_DATABASE['03011'];

  // Countdown timer for live sync
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          triggerRefresh();
          return 12;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const triggerRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 450);
  };

  const handleSelectStop = (code: string) => {
    const stop = BUS_STOPS_DATABASE[code];
    if (stop) {
      setCurrentStopCode(code);
      setSearchInput(`${stop.stopCode} - ${stop.stopName} (${stop.roadName})`);
      setShowSearchDropdown(false);
      triggerRefresh();
    }
  };

  const handleGpsLocate = () => {
    setGpsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setGpsLocating(false);
          handleSelectStop('03011');
        },
        () => {
          // Fallback if denied or unavailable in sandbox
          setGpsLocating(false);
          handleSelectStop('03011');
        },
        { timeout: 1500 }
      );
    } else {
      setTimeout(() => {
        setGpsLocating(false);
        handleSelectStop('03011');
      }, 600);
    }
  };

  const handleToggleFavorite = () => {
    const exists = savedStops.some((s) => s.code === currentStopCode);
    if (exists) {
      setSavedStops(savedStops.filter((s) => s.code !== currentStopCode));
    } else {
      setSavedStops([
        ...savedStops,
        {
          code: currentStop.stopCode,
          name: currentStop.stopName,
          addedAt: new Date().toISOString().split('T')[0],
        },
      ]);
    }
  };

  // Close search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchSuggestions = Object.values(BUS_STOPS_DATABASE).filter((s) => {
    const term = searchInput.toLowerCase();
    return (
      s.stopCode.toLowerCase().includes(term) ||
      s.stopName.toLowerCase().includes(term) ||
      s.roadName.toLowerCase().includes(term)
    );
  });

  const isCurrentStopSaved = savedStops.some((s) => s.code === currentStopCode);

  return (
    <div
      className="min-h-screen bg-[#fef7ff] text-[#1d1a23] flex flex-col antialiased selection:bg-[#ffdbce] selection:text-[#a73a00]"
      style={{ fontSize: `${fontScale * 14}px` }}
    >
      {/* Top Main Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        fontScale={fontScale}
        setFontScale={setFontScale}
        onOpenHelp={() => setHelpModalOpen(true)}
        onOpenUser={() => setUserModalOpen(true)}
      />

      <main className="w-full pt-20 bg-[#fef7ff] flex-1">
        {activeTab === 'arrival' && (
          <div className="flex flex-col w-full">
            {/* Commuter Alert / Emergency Dispatch Pill Banner */}
            <section className="w-full bg-[#f8f1fe] px-4 sm:px-6 lg:px-12 py-3 shadow-xs border-b border-[#ede5f2]">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 text-[13px]">
                <div className="flex items-center gap-2 text-[#1d1a23]">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#fd651e] text-white shrink-0">
                    <span className="material-symbols-outlined text-[14px]">
                      notifications_active
                    </span>
                  </span>
                  <span className="font-headline text-[11px] uppercase tracking-wider text-[#a73a00] font-bold shrink-0">
                    Transit Advisory:
                  </span>
                  <span className="text-[#4e434e] truncate">
                    Service 16/16M affected by road closures for Joo Chiat Car-Free Day • Regular frequency on Downtown Line &amp; NEL.
                  </span>
                </div>

                <div className="flex items-center gap-4 font-headline text-[12px] font-semibold shrink-0">
                  <div className="flex items-center gap-1.5 text-[#4e434e]">
                    <span className="w-2 h-2 rounded-full bg-[#15803D] animate-pulse"></span>
                    <span>NextBus Cloud Sync</span>
                  </div>

                  <div className="flex items-center gap-2 bg-[#f3ebf8] px-3 py-1 rounded-full text-[#400050]">
                    <span
                      className={`material-symbols-outlined text-[16px] ${
                        isRefreshing ? 'animate-spin' : ''
                      }`}
                    >
                      autorenew
                    </span>
                    <span>Auto-refreshes in {countdown}s</span>
                    <button
                      onClick={() => {
                        setCountdown(12);
                        triggerRefresh();
                      }}
                      className="ml-1 text-[#a73a00] hover:text-[#fd651e] transition-colors uppercase tracking-wider text-[10px] font-bold cursor-pointer"
                      type="button"
                    >
                      Refresh Now
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Interactive Bus Search Dock */}
            <section className="w-full px-4 sm:px-6 lg:px-12 py-6 bg-[#fef7ff]">
              <div className="max-w-7xl mx-auto">
                <div className="bg-white p-5 sm:p-7 rounded-2xl shadow-sm border border-[#ede5f2] space-y-5">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#fdd6ff] text-[#340041] font-headline text-[11px] font-bold uppercase tracking-wide">
                          Live Dispatch
                        </span>
                        <span className="text-[12px] text-[#4e434e] font-medium">
                          LTA DataMall v2 Stream
                        </span>
                      </div>
                      <h1 className="font-headline font-bold text-[26px] sm:text-[32px] text-[#400050] mt-1 tracking-tight">
                        Real-Time Bus Arrivals
                      </h1>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={handleGpsLocate}
                        disabled={gpsLocating}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#a73a00] hover:bg-[#7f2b00] text-white font-headline text-[13px] font-bold shadow-xs transition-all cursor-pointer"
                        type="button"
                      >
                        <span
                          className={`material-symbols-outlined text-[18px] ${
                            gpsLocating ? 'animate-spin' : ''
                          }`}
                        >
                          {gpsLocating ? 'sync' : 'my_location'}
                        </span>
                        <span>{gpsLocating ? 'Detecting Location...' : 'Use My Location'}</span>
                      </button>

                      <button
                        onClick={() => setSavedModalOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#f3ebf8] hover:bg-[#ede5f2] text-[#400050] font-headline text-[13px] font-bold transition-colors cursor-pointer"
                        type="button"
                      >
                        <span
                          className="material-symbols-outlined text-[18px] text-amber-500"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                        <span>Saved Stops ({savedStops.length})</span>
                      </button>
                    </div>
                  </div>

                  {/* Search Input Bar & Quick Switch Pills */}
                  <div className="space-y-3" ref={searchContainerRef}>
                    <div className="relative flex items-center w-full">
                      <span className="material-symbols-outlined absolute left-4 text-[#80737f] text-[22px]">
                        directions_bus
                      </span>
                      <input
                        className="w-full pl-12 pr-28 py-3.5 bg-[#F7F6F9] text-[#1d1a23] rounded-xl text-[15px] placeholder:text-[#80737f] focus:outline-none focus:bg-white focus:shadow-md focus:ring-2 focus:ring-[#5c186c]/20 border border-transparent focus:border-[#5c186c] transition-all"
                        placeholder="Search 5-digit bus stop code, landmark, or street name (e.g. 28009, Orchard Rd)..."
                        type="text"
                        value={searchInput}
                        onChange={(e) => {
                          setSearchInput(e.target.value);
                          setShowSearchDropdown(true);
                        }}
                        onFocus={() => setShowSearchDropdown(true)}
                      />

                      <div className="absolute right-3 flex items-center gap-1.5">
                        {searchInput && (
                          <button
                            aria-label="Clear Search"
                            onClick={() => {
                              setSearchInput('');
                              setShowSearchDropdown(true);
                            }}
                            className="p-1 rounded-lg text-[#80737f] hover:text-[#1d1a23] hover:bg-[#f3ebf8] transition-colors cursor-pointer"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">close</span>
                          </button>
                        )}
                        <button
                          aria-label="Search"
                          onClick={() => {
                            if (searchSuggestions.length > 0) {
                              handleSelectStop(searchSuggestions[0].stopCode);
                            }
                          }}
                          className="px-3.5 py-1.5 bg-[#400050] text-white rounded-lg font-headline text-[12px] font-bold hover:bg-[#5c186c] transition-colors cursor-pointer"
                          type="button"
                        >
                          Search
                        </button>
                      </div>

                      {/* Autocomplete Dropdown */}
                      {showSearchDropdown && searchSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-[#ede5f2] z-30 max-h-64 overflow-y-auto divide-y divide-[#ede5f2]">
                          {searchSuggestions.map((stop) => (
                            <button
                              key={stop.stopCode}
                              onClick={() => handleSelectStop(stop.stopCode)}
                              className="w-full text-left px-4 py-3 hover:bg-[#f3ebf8] flex items-center justify-between transition-colors cursor-pointer"
                              type="button"
                            >
                              <div className="flex items-center gap-3">
                                <span className="px-2 py-1 rounded bg-[#400050] text-white font-headline text-[11px] font-bold">
                                  {stop.stopCode}
                                </span>
                                <div>
                                  <span className="font-headline font-bold text-[14px] text-[#1d1a23] block">
                                    {stop.stopName}
                                  </span>
                                  <span className="text-[12px] text-[#4e434e]">
                                    {stop.roadName} • Towards {stop.towards}
                                  </span>
                                </div>
                              </div>
                              <span className="text-[12px] text-[#a73a00] font-headline font-bold">
                                {stop.services.length} services
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Suggested / Recent Quick Access Chips */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[12px]">
                      <span className="text-[#4e434e] font-headline font-bold whitespace-nowrap flex items-center gap-1 shrink-0">
                        <span className="material-symbols-outlined text-[16px]">history</span>{' '}
                        Recent:
                      </span>
                      {[
                        { code: '03011', name: '03011 Fullerton Sq' },
                        { code: '28009', name: '28009 Jurong East Int' },
                        { code: '14141', name: '14141 Harbourfront/Vivo' },
                        { code: '45139', name: '45139 Kranji Stn' },
                        { code: '09048', name: '09048 Orchard Lucky Plz' },
                      ].map((item) => {
                        const isSelected = currentStopCode === item.code;
                        return (
                          <button
                            key={item.code}
                            onClick={() => handleSelectStop(item.code)}
                            className={`px-3 py-1 rounded-full font-headline font-semibold whitespace-nowrap transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#5c186c] text-white shadow-xs'
                                : 'bg-[#f3ebf8] text-[#4e434e] hover:bg-[#ede5f2]'
                            }`}
                            type="button"
                          >
                            {item.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Active Stop Identity Header */}
                  <div className="p-4 rounded-xl bg-[#f3ebf8] flex flex-col md:flex-row md:items-center justify-between gap-4 border border-[#ede5f2]">
                    <div className="flex items-start sm:items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-[#400050] text-white flex flex-col items-center justify-center shrink-0 shadow-sm">
                        <span className="material-symbols-outlined text-[20px]">signpost</span>
                        <span className="font-headline text-[9px] uppercase tracking-tighter -mt-1 font-bold">
                          SBS BUS
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-headline font-bold text-[20px] text-[#400050] tracking-tight">
                            {currentStop.stopCode}
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#80737f]"></span>
                          <h2 className="font-headline text-[18px] sm:text-[20px] text-[#1d1a23] font-bold">
                            {currentStop.stopName}
                          </h2>
                          <button
                            aria-label="Bookmark Stop"
                            onClick={handleToggleFavorite}
                            className="text-amber-500 hover:scale-110 transition-transform ml-1 cursor-pointer"
                            type="button"
                            title={isCurrentStopSaved ? 'Remove from saved' : 'Add to saved'}
                          >
                            <span
                              className="material-symbols-outlined text-[22px]"
                              style={{
                                fontVariationSettings: isCurrentStopSaved
                                  ? "'FILL' 1"
                                  : "'FILL' 0",
                              }}
                            >
                              star
                            </span>
                          </button>
                        </div>
                        <p className="text-[12px] sm:text-[13px] text-[#4e434e]">
                          {currentStop.roadName} • Towards {currentStop.towards}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-[13px] shrink-0">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white shadow-2xs text-[#1d1a23] border border-[#ede5f2]">
                        <span className="material-symbols-outlined text-[18px] text-[#a73a00]">
                          near_me
                        </span>
                        <span className="font-medium font-headline">
                          {currentStop.distanceMeters}m away • {currentStop.walkMinutes} min walk
                        </span>
                      </div>
                      <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white shadow-2xs text-[#4e434e] border border-[#ede5f2]">
                        <span className="material-symbols-outlined text-[18px] text-[#0055B8]">
                          subway
                        </span>
                        <span className="font-headline font-bold text-[#400050]">
                          {currentStop.nearestMrt}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Main Commuter Content: Two Column Layout */}
            <section className="w-full px-4 sm:px-6 lg:px-12 py-4">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Live Bus Arrival Service Cards (8 Columns) */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex items-center justify-between pb-1 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-headline font-bold text-[20px] sm:text-[22px] text-[#1d1a23]">
                        Arriving Services
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#fdd6ff] text-[#340041] font-headline text-[11px] font-bold">
                        {currentStop.services.length} Routes Active
                      </span>
                    </div>

                    <div className="flex items-center gap-3 font-headline text-[11px] text-[#4e434e]">
                      <span className="hidden sm:inline-flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#15803D]"></span> Seats
                      </span>
                      <span className="hidden sm:inline-flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]"></span> Standing
                      </span>
                      <span className="hidden sm:inline-flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]"></span> Limited
                      </span>
                      <button
                        onClick={() => setAllExpanded(!allExpanded)}
                        className="text-[#400050] font-bold hover:underline cursor-pointer ml-1"
                        type="button"
                      >
                        {allExpanded ? 'Hide All Stop Details' : 'Show All Stop Details'}
                      </button>
                    </div>
                  </div>

                  {/* Service Cards List */}
                  <div className={`space-y-4 ${isRefreshing ? 'opacity-85' : 'opacity-100'} transition-opacity`}>
                    {currentStop.services.map((svc) => (
                      <ServiceCard
                        key={svc.serviceNumber}
                        service={svc}
                        currentStopName={currentStop.stopName}
                        isExpandedGlobal={allExpanded ? true : undefined}
                        onOpenFullRoute={(s) => setSelectedServiceForModal(s)}
                      />
                    ))}
                  </div>
                </div>

                {/* Right Column: Interactive Transit Radar & Alternatives (4 Columns) */}
                <div className="lg:col-span-4">
                  <NearbyRadar
                    currentStopCode={currentStopCode}
                    onSelectStop={(code) => handleSelectStop(code)}
                  />
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Bus Services & Routes Tab */}
        {activeTab === 'routes' && (
          <BusRoutesView
            onSelectServiceToVisualizer={(svcNumber) => {
              // Find service from current stop or database
              let foundSvc: BusServiceArrival | undefined;
              for (const stop of Object.values(BUS_STOPS_DATABASE)) {
                const match = stop.services.find((s) => s.serviceNumber === svcNumber);
                if (match) {
                  foundSvc = match;
                  break;
                }
              }
              if (foundSvc) {
                setSelectedServiceForModal(foundSvc);
              }
            }}
          />
        )}

        {/* Train & MRT Services Tab */}
        {activeTab === 'trains' && <TrainServicesView />}

        {/* Service Disruptions / Alerts Tab */}
        {activeTab === 'alerts' && <DisruptionsView />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Modals */}
      <SavedStopsModal
        isOpen={savedModalOpen}
        onClose={() => setSavedModalOpen(false)}
        savedStops={savedStops}
        onSelectStop={(code) => handleSelectStop(code)}
        onRemoveStop={(code) =>
          setSavedStops(savedStops.filter((s) => s.code !== code))
        }
        onAddCurrentStop={handleToggleFavorite}
        currentStopCode={currentStopCode}
      />

      <RouteVisualizerModal
        isOpen={!!selectedServiceForModal}
        onClose={() => setSelectedServiceForModal(null)}
        service={selectedServiceForModal}
        currentStopName={currentStop.stopName}
      />

      <HelpModal
        isOpen={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
      />

      <UserModal
        isOpen={userModalOpen}
        onClose={() => setUserModalOpen(false)}
      />
    </div>
  );
}
