/**
 * Serverless Bus Arrival Endpoint
 * Pulls live real-time bus arrivals from LTA DataMall v3 API
 *
 * Path: /api/busarrival
 * Query Params:
 *  - BusStopCode: string (e.g. "83139", "01012")
 *  - ServiceNo: optional string (e.g. "190", "15")
 *
 * Target Endpoint:
 *  GET https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=...
 *  Header: AccountKey: <LTA_ACCOUNT_KEY>
 *  Header: accept: application/json
 */

export default async function handler(req: any, res?: any) {
  // Handle CORS preflight OPTIONS
  if (req.method === 'OPTIONS') {
    if (res && typeof res.status === 'function') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, AccountKey, accept');
      return res.status(204).end();
    }
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, AccountKey, accept',
      },
    });
  }

  // Extract query parameters (supports Node/Express req.query or Web URLSearchParams)
  let busStopCode = '';
  let serviceNo = '';

  if (req.query) {
    busStopCode = (req.query.BusStopCode || req.query.busStopCode || req.query.busstopcode || '').toString().trim();
    serviceNo = (req.query.ServiceNo || req.query.serviceNo || req.query.serviceno || '').toString().trim();
  } else if (req.url) {
    try {
      const url = new URL(req.url, 'http://localhost');
      busStopCode = (url.searchParams.get('BusStopCode') || url.searchParams.get('busStopCode') || url.searchParams.get('busstopcode') || '').trim();
      serviceNo = (url.searchParams.get('ServiceNo') || url.searchParams.get('serviceNo') || url.searchParams.get('serviceno') || '').trim();
    } catch {
      // fallback
    }
  }

  if (!busStopCode) {
    return sendJson(res, 400, {
      error: 'INVALID_REQUEST',
      message: 'Missing required query parameter: BusStopCode (e.g. /api/busarrival?BusStopCode=83139)',
    });
  }

  // Retrieve AccountKey without hardcoding (reads env vars or client-forwarded header)
  const headers = req.headers || {};
  const accountKey =
    process.env.LTA_ACCOUNT_KEY ||
    process.env.LTA_API_KEY ||
    (typeof headers.get === 'function' ? headers.get('accountkey') || headers.get('AccountKey') : null) ||
    headers['accountkey'] ||
    headers['AccountKey'] ||
    '';

  if (!accountKey) {
    return sendJson(res, 503, {
      error: 'LTA_ACCOUNT_KEY_MISSING',
      message:
        'LTA AccountKey has not been configured yet. Set the LTA_ACCOUNT_KEY environment variable in your deployment or pass an AccountKey header.',
      BusStopCode: busStopCode,
      targetEndpoint: `https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${busStopCode}`,
    });
  }

  // Build LTA DataMall v3 URL
  const ltaUrl = new URL('https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival');
  ltaUrl.searchParams.set('BusStopCode', busStopCode);
  if (serviceNo) {
    ltaUrl.searchParams.set('ServiceNo', serviceNo);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);

    const ltaResponse = await fetch(ltaUrl.toString(), {
      method: 'GET',
      headers: {
        AccountKey: accountKey,
        accept: 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!ltaResponse.ok) {
      const errText = await ltaResponse.text();
      return sendJson(res, ltaResponse.status, {
        error: 'LTA_API_ERROR',
        status: ltaResponse.status,
        message: `LTA DataMall returned status ${ltaResponse.status}`,
        details: errText,
      });
    }

    const data = await ltaResponse.json();
    return sendJson(res, 200, data);
  } catch (err: any) {
    const isTimeout = err.name === 'AbortError';
    return sendJson(res, 504, {
      error: isTimeout ? 'GATEWAY_TIMEOUT' : 'FETCH_ERROR',
      message: isTimeout
        ? 'Request to LTA DataMall timed out (limit: 9s).'
        : (err.message || 'Failed to fetch from LTA DataMall'),
    });
  }
}

/**
 * Universal JSON response helper compatible with Node.js/Express and Web/Edge runtimes
 */
function sendJson(res: any, status: number, body: any) {
  // Express / Node.js Serverless runtime
  if (res && typeof res.status === 'function') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, AccountKey, accept');
    res.setHeader('Content-Type', 'application/json');
    return res.status(status).json(body);
  }

  // Web Request / Edge Response runtime
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, AccountKey, accept',
    },
  });
}
