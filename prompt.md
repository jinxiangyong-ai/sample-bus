# Conversation Prompts History

This document collates all user prompts used in building and configuring the Singapore LTA Bus Arrival & Tracking application.

---

## Prompt 1: Initial Frontend Application

```text
build a Singapore based bus arrival time application that tracks real time bus locations and provide accurate wait time predictions for all LTA bus stops.

build just the front end for now, i will include the backend connection later
```

### Scope Delivered:
- Interactive transit interface adhering to LTA standards (SEA / SDA / LSD crowd levels, SD / DD / BD deck types, WAB accessibility).
- Interactive Leaflet Singapore transit map with moving active buses, route polylines, and stop markers.
- Multi-hub quick jumpers (City Hall & Bugis, Orchard, CBD/Raffles Place, Dhoby Ghaut, Chinatown, Marina Bay, Jurong East, Tampines, Woodlands) and GPS geolocation.
- Universal search across 5-digit bus stop codes, road names, and bus service numbers.
- Bookmarks management and route sequence progression timeline modal.

---

## Prompt 2: GitHub Repository Setup & Push

```text
git push
https://<GITHUB_PAT_TOKEN>@https://github.com/jinxiangyong-ai/sample-bus.git
```

### Scope Delivered:
- Initialized local git repository.
- Configured git author and created initial commit.
- Sanitized remote credentials and pushed project files to branch `main` at `https://github.com/jinxiangyong-ai/sample-bus.git`.

---

## Prompt 3: Serverless LTA DataMall Endpoints

```text
add a serverless connection that pulls live data from LTA datamall using the following endpoints:

-store this in /api folder(project root level) not the src folder
-include /health.ts and /busarrival.ts within that subfolder
-do not hardcode any key, i will include them later

GET https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=83139
# AccountKey: <LTA_ACCOUNT_KEY>
# accept: application/json
```

### Scope Delivered:
- Created root-level `/api` directory with:
  - `/api/health.ts`: Health check returning service status and key configuration state.
  - `/api/busarrival.ts`: Serverless proxy pulling live arrival data from LTA DataMall v3 (`https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival`).
- Zero hardcoded keys: reads dynamically from `process.env.LTA_ACCOUNT_KEY`, `process.env.LTA_API_KEY`, or the incoming `AccountKey` header.
- Added full-stack Express server (`server.ts`) mounting the `/api` handlers alongside Vite middlewares for local dev and cloud deployment.
- Pushed changes to GitHub `main` branch.

---

## Prompt 4: Collate Prompts

```text
collate all the prompts into prompt.md file
```

### Scope Delivered:
- Generated this `prompt.md` collation file and pushed to GitHub repository.
