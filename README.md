# ♻️ CanRouteApp

React Native (Expo) app for CanRoute — a field-operations platform that streamlines how cities service public garbage bins. Workers can see their daily routes, scan can QR codes, log service, and receive alerts. Supervisors can track progress in real time.

---

## 🎥 Product Demo
Click the picture to open up the video

[![CanRouteApp Demo](https://i.imgur.com/3C4h6UO.png)](https://www.youtube.com/watch?v=7eBLi3tnBYw)

---

## Repositories

- Mobile App (this repo): https://github.com/derinkaras/CanRoute-App/tree/main
- Backend API: https://github.com/derinkaras/CanRoute-API

---

## Features

- Today's Route — ordered stops + map
- QR Scan — open a can instantly by scanning its code
- Service Logging — serviced / skipped / needs attention, photos + notes
- Offline-first — queues actions and syncs when online
- Alerts — push notifications for urgent bins (if configured)

---

## Tech Stack

- React Native via Expo
- Tailwind CSS with NativeWind
- React Navigation
- Axios for API calls
- Expo Barcode Scanner (or react-native-qrcode-scanner) for QR
- Expo Image Picker for photos

---

## Environment

Create a .env (or use app.config.js / expo-env as you prefer):

```
# Used by the mobile app to call the backend API
API_URL=https://your-render-service-name.onrender.com
```

Note: In development, if using a local API, ensure your device can reach your machine (use your LAN IP, not localhost).

---

## Getting Started

```
# Install deps
npm install

# Start the app
npx expo start

# iOS
i

# Android
a

# Web (optional)
w
```

Scan the QR with Expo Go to run on your device.

---

## Folder Structure

```
CanRoute-App/
├── app/ or src/
│   ├── components/           # Reusable UI
│   ├── screens/              # Home, Route, CanDetail, Alerts, Profile
│   ├── navigation/           # React Navigation stacks
│   ├── hooks/                # API hooks, auth, etc.
│   ├── lib/api.ts            # Axios instance (uses API_URL)
│   └── styles/               # Tailwind config helpers
├── assets/                   # Images, icons
├── tailwind.config.js
├── app.json / app.config.js
└── package.json
```

Example Axios client (lib/api.ts)

```ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:5000',
  timeout: 15000,
});

export default api;
```

---

## Core Screens

- Home: progress ring, next stop, start/end shift
- Route: list + map view, stop details
- Can Detail: scan QR, service/skip, attach photos/notes
- Alerts: resident/worker alerts, acknowledge + action
- Profile: sign-out, app version

---

## Auth

- Uses JWT from the API
- Store token securely (e.g., expo-secure-store)
- Add Authorization: Bearer <token> header to API requests

---

## Building

- Development: npx expo start
- Production (EAS): set API_URL to your Render domain and run EAS build
- App Icons/Splash: configure in app.json / app.config.js

---

## Testing (optional)

- UI: React Native Testing Library
- E2E: Detox (optional)

---

## License

MIT — see repository license.

---

## Credits

Created by Derin Karas
- API: https://github.com/derinkaras/CanRoute-API
