import React, { useState } from 'react';
import { LTAConfig } from '../types/bus';
import { X, Server, CheckCircle2, AlertCircle, RefreshCw, Terminal, ExternalLink } from 'lucide-react';

interface BackendConnectorModalProps {
  config: LTAConfig;
  onSaveConfig: (newConfig: Partial<LTAConfig>) => void;
  onClose: () => void;
}

export const BackendConnectorModal: React.FC<BackendConnectorModalProps> = ({
  config,
  onSaveConfig,
  onClose,
}) => {
  const [mode, setMode] = useState<'simulator' | 'backend'>(config.mode);
  const [backendUrl, setBackendUrl] = useState(config.backendUrl);
  const [ltaApiKey, setLtaApiKey] = useState(config.ltaApiKey);
  const [refreshSec, setRefreshSec] = useState(config.autoRefreshIntervalSec);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleTestConnection = async () => {
    if (!backendUrl) {
      setTestResult({ success: false, message: 'Please enter a valid backend endpoint URL.' });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const url = `${backendUrl}?BusStopCode=01012`;
      const headers: Record<string, string> = { Accept: 'application/json' };
      if (ltaApiKey) headers['AccountKey'] = ltaApiKey;

      const startTime = performance.now();
      const res = await fetch(url, { headers });
      const duration = Math.round(performance.now() - startTime);

      if (res.ok) {
        const data = await res.json();
        setTestResult({
          success: true,
          message: `Connected successfully! Response received in ${duration}ms with ${
            Array.isArray(data?.Services) ? data.Services.length : 0
          } services.`,
        });
      } else {
        setTestResult({
          success: false,
          message: `Backend returned HTTP ${res.status}: ${res.statusText}`,
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: `Connection failed: ${err.message || 'Network error or CORS restriction'}. Make sure your backend server is running and allows CORS.`,
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    onSaveConfig({
      mode,
      backendUrl,
      ltaApiKey,
      autoRefreshIntervalSec: refreshSec,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Backend & LTA API Integration</h2>
              <p className="text-xs text-slate-400">Configure your connection to real-time LTA DataMall</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Mode Switcher */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Data Source Mode
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setMode('simulator')}
                className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                  mode === 'simulator'
                    ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                SG Transit Simulator
              </button>
              <button
                type="button"
                onClick={() => setMode('backend')}
                className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                  mode === 'backend'
                    ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Custom Backend API
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              {mode === 'simulator'
                ? 'High-fidelity Singapore bus arrival engine with moving active buses and authentic LTA stop network.'
                : 'Pulls live arrival data from your server or proxy using standard LTA DataMall v3 JSON schemas.'}
            </p>
          </div>

          {/* Backend Configuration Inputs (active when backend mode chosen) */}
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Backend API Endpoint URL
              </label>
              <input
                type="text"
                value={backendUrl}
                onChange={(e) => setBackendUrl(e.target.value)}
                placeholder="/api/lta/arrival or http://localhost:5000/api/bus-arrival"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 font-mono text-xs focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Will receive queries like: <code className="text-emerald-400 font-mono">?BusStopCode=01012&ServiceNo=190</code>
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                LTA DataMall API Key (Optional Header: <code className="text-emerald-400 font-mono">AccountKey</code>)
              </label>
              <input
                type="password"
                value={ltaApiKey}
                onChange={(e) => setLtaApiKey(e.target.value)}
                placeholder="Optional if forwarded by your backend"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 font-mono text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Auto-Refresh Interval (Seconds)
              </label>
              <select
                value={refreshSec}
                onChange={(e) => setRefreshSec(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono focus:outline-none focus:border-emerald-500"
              >
                <option value={10}>10 seconds (Ultra Live)</option>
                <option value={20}>20 seconds (Recommended)</option>
                <option value={30}>30 seconds</option>
                <option value={60}>60 seconds (Data Saver)</option>
              </select>
            </div>

            {/* Test Connection Button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testing}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors border border-slate-700 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                <span>{testing ? 'Testing Endpoint...' : 'Test Backend Connection'}</span>
              </button>

              {testResult && (
                <div
                  className={`mt-2.5 p-3 rounded-xl text-xs flex items-start gap-2.5 ${
                    testResult.success
                      ? 'bg-emerald-950/50 border border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-950/50 border border-rose-500/40 text-rose-300'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  )}
                  <span>{testResult.message}</span>
                </div>
              )}
            </div>

            {/* Backend Integration Cheat Sheet */}
            <div className="mt-4 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>Backend Express.js Proxy Recipe</span>
              </div>
              <pre className="text-[11px] font-mono text-slate-400 overflow-x-auto p-2 bg-slate-900 rounded-lg border border-slate-800/80 leading-relaxed">
{`app.get('/api/lta/arrival', async (req, res) => {
  const { BusStopCode, ServiceNo } = req.query;
  const url = \`https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=\${BusStopCode}\`;
  const response = await fetch(url, {
    headers: { 'AccountKey': process.env.LTA_API_KEY }
  });
  const data = await response.json();
  res.json(data);
});`}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-sm"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
