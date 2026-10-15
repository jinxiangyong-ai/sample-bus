/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  BusStop,
  BusServiceArrival,
  BusRoute,
  BookmarkItem,
  ActiveBusVehicle,
  LTAConfig,
} from './types/bus';
import { ltaService } from './services/ltaService';
import { SINGAPORE_ROUTES, SINGAPORE_HUBS } from './data/singaporeBuses';
import { BusMap } from './components/Map/BusMap';
import { BusArrivalCard } from './components/BusArrivalCard';
import { BusStopList } from './components/BusStopList';
import { RouteViewerModal } from './components/RouteViewerModal';
import { BackendConnectorModal } from './components/BackendConnectorModal';
import { QuickLocationsBar } from './components/QuickLocationsBar';
import {
  Search,
  RefreshCw,
  Bookmark,
  MapPin,
  Clock,
  Compass,
  Bus,
  Layers,
  ArrowRight,
  SlidersHorizontal,
  Wifi,
  WifiOff,
  Star,
  Check,
} from 'lucide-react';

export default function App() {
  // Navigation & View Mode
  const [activeTab, setActiveTab] = useState<'arrivals' | 'stops' | 'bookmarks' | 'routes'>('arrivals');
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'dd' | 'seats' | 'wab'>('all');

  // Selected Entities
  const [selectedStopCode, setSelectedStopCode] = useState<string>('01012'); // Default: Bugis Hotel Grand Pacific
  const [activeRouteService, setActiveRouteService] = useState<string | null>(null);
  const [modalRoute, setModalRoute] = useState<BusRoute | null>(null);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);

  // Geolocation & Coords
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>({
    lat: 1.29685,
    lng: 103.85312,
  });
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Data & Arrivals
  const [arrivals, setArrivals] = useState<BusServiceArrival[]>([]);
  const [isLoadingArrivals, setIsLoadingArrivals] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [dataSource, setDataSource] = useState<'simulator' | 'backend'>('simulator');
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [config, setConfig] = useState<LTAConfig>(ltaService.getConfig());

  // Auto Refresh Countdown
  const [refreshCountdown, setRefreshCountdown] = useState<number>(config.autoRefreshIntervalSec);

  // Moving Bus Fleet Telemetry State
  const [activeBuses, setActiveBuses] = useState<ActiveBusVehicle[]>(ltaService.getActiveBuses());

  // Singapore Clock (SGT)
  const [sgtTime, setSgtTime] = useState<string>('');

  // Clock tick
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setSgtTime(
        now.toLocaleTimeString('en-SG', {
          timeZone: 'Asia/Singapore',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync Bookmarks
  const refreshBookmarks = useCallback(() => {
    setBookmarks(ltaService.getBookmarks());
  }, []);

  useEffect(() => {
    refreshBookmarks();
  }, [refreshBookmarks]);

  // Load Bus Stop arrivals
  const loadArrivals = useCallback(
    async (stopCode: string) => {
      setIsLoadingArrivals(true);
      try {
        const res = await ltaService.getBusArrivals(stopCode);
        setArrivals(res.services);
        setLastUpdated(res.fetchedAt);
        setDataSource(res.source);
        setRefreshCountdown(config.autoRefreshIntervalSec);
      } catch (err) {
        console.error('Failed to load arrivals:', err);
      } finally {
        setIsLoadingArrivals(false);
      }
    },
    [config.autoRefreshIntervalSec]
  );

  useEffect(() => {
    if (selectedStopCode) {
      loadArrivals(selectedStopCode);
    }
  }, [selectedStopCode, loadArrivals]);

  // Auto-refresh timer and live seconds ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshCountdown((prev) => {
        if (prev <= 1) {
          if (selectedStopCode) {
            loadArrivals(selectedStopCode);
          }
          return config.autoRefreshIntervalSec;
        }
        return prev - 1;
      });

      // Also tick down seconds on loaded arrivals
      setArrivals((prevArrivals) =>
        prevArrivals.map((svc) => {
          const updateTiming = (timing: any) => {
            if (!timing) return null;
            const newSeconds = Math.max(0, timing.secondsAway - 1);
            return {
              ...timing,
              secondsAway: newSeconds,
              minutesAway: Math.max(0, Math.floor(newSeconds / 60)),
            };
          };

          return {
            ...svc,
            NextBus: updateTiming(svc.NextBus),
            NextBus2: updateTiming(svc.NextBus2),
            NextBus3: updateTiming(svc.NextBus3),
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedStopCode, config.autoRefreshIntervalSec, loadArrivals]);

  // Live Bus Position Simulation Engine: updates buses along their route paths
  useEffect(() => {
    const moveTimer = setInterval(() => {
      setActiveBuses((currentBuses) => {
        return currentBuses.map((bus) => {
          const route = SINGAPORE_ROUTES.find((r) => r.ServiceNo === bus.serviceNo);
          if (!route || !route.path || route.path.length < 2) return bus;

          // Tiny realistic movement delta
          const latDelta = (Math.random() - 0.45) * 0.00015;
          const lngDelta = (Math.random() - 0.45) * 0.00015;

          return {
            ...bus,
            lat: bus.lat + latDelta,
            lng: bus.lng + lngDelta,
            speedKmH: Math.max(12, Math.min(55, Math.round(bus.speedKmH + (Math.random() * 4 - 2)))),
          };
        });
      });
    }, 2500);

    return () => clearInterval(moveTimer);
  }, []);

  // Filtered Stops based on search query
  const filteredStops = useMemo(() => {
    return ltaService.searchBusStops(searchQuery, userCoords?.lat, userCoords?.lng);
  }, [searchQuery, userCoords]);

  // Current selected stop object
  const currentStop = useMemo(() => {
    return ltaService.getBusStop(selectedStopCode);
  }, [selectedStopCode]);

  // Filtered arrival cards based on user filter chips
  const filteredArrivals = useMemo(() => {
    if (filterType === 'all') return arrivals;
    if (filterType === 'dd') {
      return arrivals.filter((svc) => svc.NextBus?.Type === 'DD' || svc.NextBus2?.Type === 'DD');
    }
    if (filterType === 'seats') {
      return arrivals.filter((svc) => svc.NextBus?.Load === 'SEA' || svc.NextBus2?.Load === 'SEA');
    }
    if (filterType === 'wab') {
      return arrivals.filter((svc) => svc.NextBus?.Feature === 'WAB');
    }
    return arrivals;
  }, [arrivals, filterType]);

  // Active Route for Map
  const activeRoute = useMemo(() => {
    if (!activeRouteService) return null;
    return ltaService.getRoute(activeRouteService) || null;
  }, [activeRouteService]);

  // Handle Hub Selection
  const handleSelectHub = (hub: (typeof SINGAPORE_HUBS)[0]) => {
    setUserCoords({ lat: hub.lat, lng: hub.lng });
    setSelectedStopCode(hub.stopCode);
    setActiveTab('arrivals');
  };

  // Handle GPS location
  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoords(coords);
        // Find closest stop to user's real GPS position
        const stops = ltaService.getBusStops(coords.lat, coords.lng);
        if (stops.length > 0) {
          setSelectedStopCode(stops[0].BusStopCode);
          setActiveTab('arrivals');
        }
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation failed or denied, using Singapore Downtown preset:', err);
        setUserCoords({ lat: 1.29685, lng: 103.85312 });
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Handle Bookmark toggle
  const handleToggleBookmark = (stopCode: string, serviceNo?: string) => {
    ltaService.toggleBookmark(stopCode, serviceNo);
    refreshBookmarks();
  };

  const isStopBookmarked = (stopCode: string, serviceNo?: string) => {
    return ltaService.isBookmarked(stopCode, serviceNo);
  };

  // Track bus service on map
  const handleTrackService = (serviceNo: string) => {
    setActiveRouteService(serviceNo);
    // Switch to map on mobile
    setMobileView('map');
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* 3-ZONE TOP BAR CONTRACT */}
      <header className="flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md shrink-0 z-30">
        {/* Zone 1: Single text wordmark in display face */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
              <Bus className="w-4 h-4" />
            </div>
            <a
              href="/"
              className="text-lg font-extrabold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <span>SG BUS</span>
              <span className="text-emerald-400">LIVE</span>
            </a>
          </div>

          <div className="hidden xl:flex items-center gap-2 text-xs text-slate-400 pl-3 border-l border-slate-800">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-mono tabular-nums text-slate-300">{sgtTime || '00:00:00'} SGT</span>
          </div>
        </div>

        {/* Zone 2: 4 Clean single-line text nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => {
              setActiveTab('arrivals');
              setMobileView('list');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeTab === 'arrivals' ? 'text-emerald-400 font-semibold' : 'text-slate-400'
            }`}
          >
            Arrival Timings
          </button>
          <button
            onClick={() => {
              setActiveTab('stops');
              setMobileView('list');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeTab === 'stops' ? 'text-emerald-400 font-semibold' : 'text-slate-400'
            }`}
          >
            All Bus Stops
          </button>
          <button
            onClick={() => {
              setActiveTab('bookmarks');
              setMobileView('list');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeTab === 'bookmarks' ? 'text-emerald-400 font-semibold' : 'text-slate-400'
            }`}
          >
            Saved Stops ({bookmarks.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('routes');
              setMobileView('list');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeTab === 'routes' ? 'text-emerald-400 font-semibold' : 'text-slate-400'
            }`}
          >
            Bus Routes
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick refresh trigger */}
          <button
            onClick={() => selectedStopCode && loadArrivals(selectedStopCode)}
            disabled={isLoadingArrivals}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors border border-slate-700/80"
            title="Auto-refreshing live arrival timings"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingArrivals ? 'animate-spin text-emerald-400' : ''}`} />
            <span className="tabular-nums">{refreshCountdown}s</span>
          </button>

          <button
            onClick={() => setShowConfigModal(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-950" />
            <span>LTA Backend</span>
          </button>
        </div>
      </header>

      {/* Quick Transit Hubs Bar */}
      <QuickLocationsBar
        onSelectHub={handleSelectHub}
        onUseCurrentGPS={handleUseGPS}
        isLocating={isLocating}
        selectedStopCode={selectedStopCode}
      />

      {/* Mobile Top View Switcher (List vs Map) */}
      <div className="lg:hidden flex items-center p-1 bg-slate-900 border-b border-slate-800">
        <button
          onClick={() => setMobileView('list')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors text-center ${
            mobileView === 'list'
              ? 'bg-slate-800 text-emerald-400 font-semibold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Arrivals & Stops List
        </button>
        <button
          onClick={() => setMobileView('map')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors text-center ${
            mobileView === 'map'
              ? 'bg-slate-800 text-emerald-400 font-semibold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Live Transit Map
        </button>
      </div>

      {/* MAIN TWO-COLUMN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COLUMN: Search, Arrivals, Stops, Bookmarks */}
        <div
          className={`w-full lg:w-[460px] xl:w-[500px] flex flex-col bg-slate-950 border-r border-slate-800 shrink-0 ${
            mobileView === 'map' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Universal Search Input */}
          <div className="p-3 sm:p-4 border-b border-slate-800 bg-slate-900/50">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bus stop (e.g. 01012), road, or bus (e.g. 190)..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300 font-mono"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sub-view Segmented Tabs */}
            <div className="flex items-center gap-1 mt-3 p-1 bg-slate-950 rounded-xl border border-slate-800/80">
              <button
                onClick={() => setActiveTab('arrivals')}
                className={`flex-1 py-1 px-2 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === 'arrivals'
                    ? 'bg-slate-800 text-emerald-300 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Arrivals
              </button>
              <button
                onClick={() => setActiveTab('stops')}
                className={`flex-1 py-1 px-2 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === 'stops'
                    ? 'bg-slate-800 text-emerald-300 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Stops ({filteredStops.length})
              </button>
              <button
                onClick={() => setActiveTab('bookmarks')}
                className={`flex-1 py-1 px-2 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === 'bookmarks'
                    ? 'bg-slate-800 text-emerald-300 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Saved ({bookmarks.length})
              </button>
              <button
                onClick={() => setActiveTab('routes')}
                className={`flex-1 py-1 px-2 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === 'routes'
                    ? 'bg-slate-800 text-emerald-300 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Routes
              </button>
            </div>
          </div>

          {/* VIEW: Arrivals Tab */}
          {activeTab === 'arrivals' && (
            <div className="flex-1 overflow-y-auto">
              {/* Selected Bus Stop Header */}
              {currentStop ? (
                <div className="p-4 border-b border-slate-800 bg-slate-900/30">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md font-mono text-xs font-bold bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
                          {currentStop.BusStopCode}
                        </span>
                        <span className="text-xs text-slate-400 truncate">{currentStop.RoadName}</span>
                      </div>
                      <h1 className="text-base font-bold text-slate-100 mt-1 truncate">
                        {currentStop.Description}
                      </h1>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                        <span>{arrivals.length} Services Operating</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono">Updated {lastUpdated || 'just now'}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-emerald-400">
                          {dataSource === 'backend' ? 'Live API' : 'LTA DataMall Simulator'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleBookmark(currentStop.BusStopCode)}
                      className={`p-2 rounded-lg border transition-colors shrink-0 ${
                        isStopBookmarked(currentStop.BusStopCode)
                          ? 'bg-amber-950/40 border-amber-500/40 text-amber-400'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-amber-300'
                      }`}
                      title="Save this bus stop"
                    >
                      <Bookmark
                        className={`w-4 h-4 ${
                          isStopBookmarked(currentStop.BusStopCode) ? 'fill-amber-400' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-800/60 overflow-x-auto no-scrollbar">
                    <button
                      onClick={() => setFilterType('all')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 ${
                        filterType === 'all'
                          ? 'bg-slate-800 text-emerald-300 font-semibold border border-emerald-500/30'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      All ({arrivals.length})
                    </button>
                    <button
                      onClick={() => setFilterType('seats')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 ${
                        filterType === 'seats'
                          ? 'bg-slate-800 text-emerald-300 font-semibold border border-emerald-500/30'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Seats Available
                    </button>
                    <button
                      onClick={() => setFilterType('dd')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 ${
                        filterType === 'dd'
                          ? 'bg-slate-800 text-emerald-300 font-semibold border border-emerald-500/30'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Double Deck
                    </button>
                    <button
                      onClick={() => setFilterType('wab')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 ${
                        filterType === 'wab'
                          ? 'bg-slate-800 text-emerald-300 font-semibold border border-emerald-500/30'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Wheelchair (WAB)
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500 text-sm">
                  Select a bus stop to view real-time arrivals.
                </div>
              )}

              {/* Arrivals Card Stream */}
              <div className="p-3 sm:p-4 space-y-3">
                {isLoadingArrivals && arrivals.length === 0 ? (
                  <div className="py-16 text-center text-slate-400">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-400 mb-2" />
                    <div className="text-xs">Fetching predictions from LTA...</div>
                  </div>
                ) : filteredArrivals.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 text-xs">
                    No bus services match the active filter criteria.
                  </div>
                ) : (
                  filteredArrivals.map((svc) => (
                    <BusArrivalCard
                      key={svc.ServiceNo}
                      service={svc}
                      isBookmarked={isStopBookmarked(selectedStopCode, svc.ServiceNo)}
                      onToggleBookmark={() => handleToggleBookmark(selectedStopCode, svc.ServiceNo)}
                      onTrackService={handleTrackService}
                      onOpenRouteModal={(svcNo) => {
                        const route = ltaService.getRoute(svcNo);
                        if (route) setModalRoute(route);
                      }}
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {/* VIEW: All Bus Stops Tab */}
          {activeTab === 'stops' && (
            <div className="flex-1 overflow-y-auto">
              <BusStopList
                stops={filteredStops}
                selectedStopCode={selectedStopCode}
                onSelectStop={(code) => {
                  setSelectedStopCode(code);
                  setActiveTab('arrivals');
                }}
                searchQuery={searchQuery}
              />
            </div>
          )}

          {/* VIEW: Saved Bookmarks Tab */}
          {activeTab === 'bookmarks' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Your Saved Commute Stops ({bookmarks.length})
              </div>

              {bookmarks.length === 0 ? (
                <div className="py-16 px-4 text-center">
                  <Bookmark className="w-8 h-8 mx-auto text-slate-600 mb-2 stroke-1" />
                  <div className="text-sm font-medium text-slate-300">No Saved Bus Stops</div>
                  <div className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    Tap the bookmark star on any bus stop or bus service to pin it for quick daily access.
                  </div>
                </div>
              ) : (
                bookmarks.map((bm) => {
                  const stop = ltaService.getBusStop(bm.busStopCode);
                  if (!stop) return null;

                  return (
                    <div
                      key={bm.id}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                    >
                      <button
                        onClick={() => {
                          setSelectedStopCode(stop.BusStopCode);
                          setActiveTab('arrivals');
                        }}
                        className="text-left min-w-0 flex-1"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-emerald-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                            {stop.BusStopCode}
                          </span>
                          {bm.serviceNo && (
                            <span className="font-mono text-xs font-bold text-white px-2 py-0.5 bg-emerald-950 border border-emerald-500/40 rounded">
                              Bus {bm.serviceNo}
                            </span>
                          )}
                          <span className="text-xs text-slate-400 truncate">{stop.RoadName}</span>
                        </div>
                        <div className="text-sm font-semibold text-slate-100 mt-1 truncate">
                          {stop.Description}
                        </div>
                      </button>

                      <button
                        onClick={() => handleToggleBookmark(bm.busStopCode, bm.serviceNo)}
                        className="p-2 text-amber-400 hover:text-slate-400 rounded-lg hover:bg-slate-800 transition-colors"
                        title="Remove bookmark"
                      >
                        <Bookmark className="w-4 h-4 fill-amber-400" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* VIEW: Routes Explorer Tab */}
          {activeTab === 'routes' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Singapore Bus Lines & Active Fleets
              </div>

              {SINGAPORE_ROUTES.map((route) => (
                <div
                  key={route.ServiceNo}
                  className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 font-mono font-extrabold text-xl">
                        {route.ServiceNo}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-200">
                          {route.Origin} → {route.Destination}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span>{route.Operator}</span>
                          <span aria-hidden="true">·</span>
                          <span>{route.stops.length} Stops</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-emerald-400 font-mono">
                            {route.activeBuses.length} Active Bus{route.activeBuses.length > 1 ? 'es' : ''}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setModalRoute(route)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                    >
                      Route Stops
                    </button>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <button
                      onClick={() => handleTrackService(route.ServiceNo)}
                      className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Trace Path on Map</span>
                    </button>
                    <span className="text-slate-500 text-[11px]">Direction {route.Direction}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Interactive Leaflet Singapore Bus Map */}
        <div
          className={`flex-1 relative flex flex-col bg-slate-900 ${
            mobileView === 'list' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Active Route Trace Header Bar */}
          {activeRoute && (
            <div className="absolute top-4 left-4 z-20 flex items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-900/95 backdrop-blur-md border border-slate-800 shadow-xl max-w-[calc(100%-100px)]">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5 truncate">
                  <span className="text-emerald-400 font-mono">Service {activeRoute.ServiceNo}</span>
                  <span className="text-slate-400">·</span>
                  <span className="truncate">{activeRoute.Origin} → {activeRoute.Destination}</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Tracking {activeRoute.activeBuses.length} active buses along route path
                </div>
              </div>
              <button
                onClick={() => setActiveRouteService(null)}
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 text-xs ml-1"
                title="Clear route filter"
              >
                ✕
              </button>
            </div>
          )}

          <BusMap
            stops={filteredStops}
            selectedStopCode={selectedStopCode}
            onSelectStop={(code) => {
              setSelectedStopCode(code);
              setActiveTab('arrivals');
              // On mobile, if user tapped a stop on map, switch view to list to see arrivals
              if (window.innerWidth < 1024) {
                setMobileView('list');
              }
            }}
            activeBuses={activeBuses}
            activeRoute={activeRoute}
            userCoords={userCoords}
            onSelectBus={(bus) => {
              setActiveRouteService(bus.serviceNo);
            }}
          />
        </div>
      </div>

      {/* MODALS */}
      {modalRoute && (
        <RouteViewerModal
          route={modalRoute}
          onClose={() => setModalRoute(null)}
          onSelectStop={(code) => {
            setSelectedStopCode(code);
            setActiveTab('arrivals');
          }}
          currentStopCode={selectedStopCode}
        />
      )}

      {showConfigModal && (
        <BackendConnectorModal
          config={config}
          onSaveConfig={(newConfig) => {
            ltaService.setConfig(newConfig);
            setConfig(ltaService.getConfig());
            if (selectedStopCode) {
              loadArrivals(selectedStopCode);
            }
          }}
          onClose={() => setShowConfigModal(false)}
        />
      )}
    </div>
  );
}
