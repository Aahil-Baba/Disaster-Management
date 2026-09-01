# DER-01 React Frontend

Citizen + Admin frontend for the Disaster & Emergency Response (DER-01) project.

## Requirements

- Node.js 18+ (Node 20+ recommended)
- npm

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

Open the URL shown by Vite, normally http://localhost:5173.

The project starts in mock mode by default, so you can explore the UI without a backend.

## Connect Manas's backend

Edit `.env`:

```env
VITE_USE_MOCK=false
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Then restart Vite.

The frontend currently expects these API shapes (endpoint names can be changed in `src/services/api.js`):

- POST `/auth/register`
- POST `/auth/login`
- GET `/reports`
- GET `/reports/my`
- GET `/reports/:id`
- GET `/reports/stats`
- PATCH `/reports/:id/status`
- POST `/reports/submit`

Socket events:
- `new_disaster_report`
- `report_status_updated`

If Manas uses different endpoint names or payload fields, only `src/services/api.js` and the socket event handlers need to be adjusted.

## Important browser permissions

The citizen report flow needs:
- camera permission
- location permission

Camera capture uses `navigator.mediaDevices.getUserMedia()`.
Location uses `navigator.geolocation`.

Camera access works on `localhost` during development. In production, HTTPS is required by modern browsers.

## Map

The map uses Leaflet + OpenStreetMap tiles. No API key is required for the default demo map.

For a production deployment, review OpenStreetMap tile usage limits and use a suitable tile provider if required.

## Mock mode

Mock mode gives:
- demo users/admin
- sample active incidents
- simulated submission
- simulated status changes
- localStorage persistence

Demo admin:
- email: admin@der01.local
- password: admin123

Demo user:
- email: citizen@der01.local
- password: citizen123
