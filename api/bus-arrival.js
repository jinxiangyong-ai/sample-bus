/**
 * LTA DataMall v3 Bus Arrival API Proxy & Formatter
 * Endpoint: https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=83139[&ServiceNo=15]
 * Supports both JSON and XML responses from LTA DataMall.
 */

// Helper: Calculate ETA in minutes from ISO timestamp
function formatEtaMinutes(estimatedArrivalIso) {
  if (!estimatedArrivalIso) return null;
  const target = new Date(estimatedArrivalIso).getTime();
  if (isNaN(target)) return null;

  const diffMs = target - Date.now();
  const diffMins = Math.round(diffMs / 60000);

  if (diffMins <= 0) return 'Arr';
  return diffMins;
}

// Helper: Map LTA load code to user-friendly occupancy token
function mapOccupancyLoad(load) {
  switch (load) {
    case 'SEA':
      return 'seats'; // Seats Available
    case 'SDA':
      return 'standing'; // Standing Available
    case 'LSD':
      return 'limited'; // Limited Standing
    default:
      return 'seats';
  }
}

// Helper: XML Parser in case LTA returns OData XML format
function parseLtaXmlResponse(xmlText) {
  const services = [];

  // Match each <d:element> or <element> block within Services
  const elementRegex = /<d:element>([\s\S]*?)<\/d:element>/gi;
  let elementMatch;

  while ((elementMatch = elementRegex.exec(xmlText)) !== null) {
    const block = elementMatch[1];

    const getTag = (tag, str) => {
      const regex = new RegExp(`<(?:d:)?${tag}[^>]*>([^<]*)<\\/(?:d:)?${tag}>`, 'i');
      const m = regex.exec(str);
      return m ? m[1].trim() : '';
    };

    const getNestedBlock = (parentTag, str) => {
      const regex = new RegExp(`<(?:d:)?${parentTag}[^>]*>([\\s\\S]*?)<\\/(?:d:)?${parentTag}>`, 'i');
      const m = regex.exec(str);
      return m ? m[1] : '';
    };

    const parseBusSlot = (busXml) => {
      if (!busXml) return null;
      const estimatedArrival = getTag('EstimatedArrival', busXml);
      if (!estimatedArrival) return null;

      return {
        OriginCode: getTag('OriginCode', busXml),
        DestinationCode: getTag('DestinationCode', busXml),
        EstimatedArrival: estimatedArrival,
        etaMinutes: formatEtaMinutes(estimatedArrival),
        Latitude: getTag('Latitude', busXml),
        Longitude: getTag('Longitude', busXml),
        VisitNumber: getTag('VisitNumber', busXml),
        Load: getTag('Load', busXml),
        occupancy: mapOccupancyLoad(getTag('Load', busXml)),
        Feature: getTag('Feature', busXml),
        wheelchair: getTag('Feature', busXml) === 'WAB',
        Type: getTag('Type', busXml) || 'SD',
        Monitored: getTag('Monitored', busXml) === '1',
      };
    };

    const serviceNo = getTag('ServiceNo', block);
    const operator = getTag('Operator', block);

    const nextBus = parseBusSlot(getNestedBlock('NextBus', block));
    const nextBus2 = parseBusSlot(getNestedBlock('NextBus2', block));
    const nextBus3 = parseBusSlot(getNestedBlock('NextBus3', block));

    if (serviceNo) {
      services.push({
        ServiceNo: serviceNo,
        Operator: operator,
        NextBus: nextBus,
        NextBus2: nextBus2,
        NextBus3: nextBus3,
      });
    }
  }

  return services;
}

// Fallback generator for realistic data when LTA_ACCOUNT_KEY is not yet populated
function generateFallbackArrivals(busStopCode, serviceNoFilter) {
  const knownServices = ['10', '70', '100', '107', '130', '196'];
  const servicesToInclude = serviceNoFilter
    ? [serviceNoFilter]
    : knownServices;

  return servicesToInclude.map((svc, idx) => {
    const mins1 = idx === 0 ? 'Arr' : (idx * 2 + 1);
    const mins2 = (idx * 3 + 6);
    const mins3 = (idx * 4 + 14);

    const occupancies = ['seats', 'standing', 'limited'];
    const occ1 = occupancies[idx % occupancies.length];
    const occ2 = occupancies[(idx + 1) % occupancies.length];
    const occ3 = occupancies[(idx + 2) % occupancies.length];

    const types = ['DD', 'SD'];

    return {
      ServiceNo: svc,
      Operator: 'SBST',
      NextBus: {
        EstimatedArrival: new Date(Date.now() + (mins1 === 'Arr' ? 20000 : mins1 * 60000)).toISOString(),
        etaMinutes: mins1,
        Load: occ1 === 'seats' ? 'SEA' : occ1 === 'standing' ? 'SDA' : 'LSD',
        occupancy: occ1,
        Feature: 'WAB',
        wheelchair: true,
        Type: types[idx % 2],
        Monitored: true,
      },
      NextBus2: {
        EstimatedArrival: new Date(Date.now() + mins2 * 60000).toISOString(),
        etaMinutes: mins2,
        Load: occ2 === 'seats' ? 'SEA' : occ2 === 'standing' ? 'SDA' : 'LSD',
        occupancy: occ2,
        Feature: 'WAB',
        wheelchair: true,
        Type: types[(idx + 1) % 2],
        Monitored: true,
      },
      NextBus3: {
        EstimatedArrival: new Date(Date.now() + mins3 * 60000).toISOString(),
        etaMinutes: mins3,
        Load: occ3 === 'seats' ? 'SEA' : occ3 === 'standing' ? 'SDA' : 'LSD',
        occupancy: occ3,
        Feature: 'WAB',
        wheelchair: true,
        Type: 'SD',
        Monitored: true,
      },
    };
  });
}

export default async function handler(req, res) {
  // Extract query params
  const { BusStopCode, busStopCode, ServiceNo, serviceNo } = req.query || {};
  const stopCode = BusStopCode || busStopCode;
  const svcFilter = ServiceNo || serviceNo;

  if (!stopCode) {
    return res.status(400).json({
      error: 'Missing required parameter: BusStopCode',
      usage: '/api/bus-arrival?BusStopCode=83139[&ServiceNo=15]',
      example: '/api/bus-arrival?BusStopCode=03011',
    });
  }

  const accountKey = process.env.LTA_ACCOUNT_KEY;

  // Set standard API headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, s-maxage=15, max-age=15'); // 15-20 sec cache per LTA spec

  // If no account key configured, inform the user and serve fallback
  if (!accountKey || accountKey.trim() === '') {
    const fallbackServices = generateFallbackArrivals(stopCode, svcFilter);
    return res.status(200).json({
      BusStopCode: stopCode,
      source: 'fallback_mock_data',
      warning:
        'LTA_ACCOUNT_KEY environment variable is not configured. Returning simulated Singapore bus arrival data. Please add LTA_ACCOUNT_KEY in your Vercel project environment variables.',
      timestamp: new Date().toISOString(),
      Services: fallbackServices,
    });
  }

  // Construct official LTA endpoint URL
  let ltaUrl = `https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${encodeURIComponent(stopCode)}`;
  if (svcFilter) {
    ltaUrl += `&ServiceNo=${encodeURIComponent(svcFilter)}`;
  }

  try {
    const response = await fetch(ltaUrl, {
      method: 'GET',
      headers: {
        'AccountKey': accountKey,
        'accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `LTA DataMall responded with HTTP ${response.status}`,
        details: errorText,
        BusStopCode: stopCode,
        Services: generateFallbackArrivals(stopCode, svcFilter),
        note: 'Fallback data served due to upstream LTA response error.',
      });
    }

    const rawBody = await response.text();
    let services = [];

    // Check if response is XML or JSON
    const trimmed = rawBody.trim();
    if (trimmed.startsWith('<')) {
      // Parse OData XML
      services = parseLtaXmlResponse(trimmed);
    } else {
      // Parse JSON
      const json = JSON.parse(trimmed);
      const rawServices = json.Services || [];

      services = rawServices.map((svc) => {
        const parseJsonSlot = (slot) => {
          if (!slot || !slot.EstimatedArrival) return null;
          return {
            OriginCode: slot.OriginCode,
            DestinationCode: slot.DestinationCode,
            EstimatedArrival: slot.EstimatedArrival,
            etaMinutes: formatEtaMinutes(slot.EstimatedArrival),
            Latitude: slot.Latitude,
            Longitude: slot.Longitude,
            VisitNumber: slot.VisitNumber,
            Load: slot.Load,
            occupancy: mapOccupancyLoad(slot.Load),
            Feature: slot.Feature,
            wheelchair: slot.Feature === 'WAB',
            Type: slot.Type || 'SD',
            Monitored: slot.Monitored === 1 || slot.Monitored === true,
          };
        };

        return {
          ServiceNo: svc.ServiceNo,
          Operator: svc.Operator,
          NextBus: parseJsonSlot(svc.NextBus),
          NextBus2: parseJsonSlot(svc.NextBus2),
          NextBus3: parseJsonSlot(svc.NextBus3),
        };
      });
    }

    return res.status(200).json({
      BusStopCode: stopCode,
      source: 'LTA_DataMall_v3',
      endpoint: ltaUrl,
      timestamp: new Date().toISOString(),
      Services: services,
    });
  } catch (err) {
    console.error('Error fetching LTA Bus Arrival:', err);
    return res.status(500).json({
      error: 'Failed to contact LTA DataMall service',
      message: err.message,
      BusStopCode: stopCode,
      Services: generateFallbackArrivals(stopCode, svcFilter),
      note: 'Fallback data served due to fetch error.',
    });
  }
}
