/**
 * Serverless Health Check Endpoint
 * Path: /api/health
 */

export default async function handler(req: any, res?: any) {
  const ltaConfigured = Boolean(process.env.LTA_ACCOUNT_KEY || process.env.LTA_API_KEY);

  const payload = {
    status: 'ok',
    service: 'SG Bus Live - LTA DataMall Connector',
    timestamp: new Date().toISOString(),
    ltaKeyConfigured: ltaConfigured,
    endpoints: {
      busArrival: '/api/busarrival?BusStopCode={code}',
      health: '/api/health',
    },
  };

  // Node / Express serverless format (req, res)
  if (res && typeof res.status === 'function') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(payload);
  }

  // Web Request / Edge format (return Response)
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    },
  });
}
