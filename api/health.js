/**
 * SBS Transit / LTA NextBus API Health Monitor
 * Vercel Serverless Function & Express Route Handler
 */

export default async function handler(req, res) {
  const ltaKeyConfigured = Boolean(process.env.LTA_ACCOUNT_KEY && process.env.LTA_ACCOUNT_KEY.trim().length > 0);

  let ltaConnectionStatus = 'not_tested';
  let ltaTestLatencyMs = null;

  // If LTA_ACCOUNT_KEY is configured, run a quick connectivity check
  if (ltaKeyConfigured) {
    try {
      const startTime = Date.now();
      const testRes = await fetch(
        'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=83139&ServiceNo=15',
        {
          method: 'GET',
          headers: {
            'AccountKey': process.env.LTA_ACCOUNT_KEY,
            'accept': 'application/json',
          },
          signal: AbortSignal.timeout(4000),
        }
      );
      ltaTestLatencyMs = Date.now() - startTime;
      ltaConnectionStatus = testRes.ok ? 'connected' : `http_${testRes.status}`;
    } catch (err) {
      ltaConnectionStatus = `error: ${err.message || 'connection_failed'}`;
    }
  }

  const healthData = {
    status: 'healthy',
    service: 'SBS Transit / LTA NextBus API Gateway',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'production',
    ltaDataMall: {
      endpoint: 'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival',
      accountKeyConfigured: ltaKeyConfigured,
      connectionStatus: ltaConnectionStatus,
      latencyMs: ltaTestLatencyMs,
      note: ltaKeyConfigured
        ? 'LTA_ACCOUNT_KEY is detected in environment variables.'
        : 'LTA_ACCOUNT_KEY is not configured. APIs will serve fallback transit data until added in Vercel environment variables.',
    },
    system: {
      nodeVersion: process.version,
      platform: process.platform,
      memoryUsageMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    },
    endpoints: {
      health: '/api/health',
      busArrival: '/api/bus-arrival?BusStopCode=83139',
      busArrivalSpecificService: '/api/bus-arrival?BusStopCode=83139&ServiceNo=15',
    },
  };

  // Set standard headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  return res.status(200).json(healthData);
}
