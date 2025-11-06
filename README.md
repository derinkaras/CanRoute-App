# ♻️ CanRouteApp

**CanRoute** is a full-stack field-operations platform that streamlines how cities service public garbage bins.  
It enables workers to see their daily routes, mark cans as serviced, receive QR-code alerts from residents, and keeps supervisors in sync — all in real time.

---

## 🚀 Overview

Municipal garbage collection often suffers from inefficient routes, missed pickups, and poor communication between teams and citizens.  
**CanRouteApp** fixes this with a simple, connected system:

- 🗺️ **Smart Routes:** Each worker sees their daily route on an interactive map.
- ✅ **Service Logging:** Mark cans as serviced, skipped, or flagged with photos.
- 📱 **Resident QR Alerts:** Citizens can scan a can’s QR code to report overflow or damage.
- 👷‍♂️ **Supervisor Dashboard:** Monitor real-time progress, alerts, and route completion.
- 🌐 **Offline Mode:** All data syncs automatically when network reconnects.

---

## 🏗️ Architecture

| Layer | Technology | Description |
|-------|-------------|-------------|
| **Frontend (Mobile)** | React Native (Expo) + Tailwind CSS (NativeWind) | Cross-platform mobile app for workers and supervisors. |
| **Backend API** | Express.js | Handles routes, authentication (JWT), CRUD for cans, routes, logs, and alerts. |
| **Database** | MongoDB (Mongoose ODM) | Stores user, can, route, and log data efficiently. |
| **Authentication** | JWT (JSON Web Tokens) | Secure token-based login for workers and admins. |
| **Hosting** | Render (API) + Expo (App) | API runs on Render; app deployed via Expo or EAS build. |
| **QR Codes** | UUID-based generator | Each can has a unique QR code linked to its record. |

---

## 🧩 Core Features

### 👷 Worker App
- View assigned daily route.
- Scan can QR codes to open records instantly.
- Mark cans as **Serviced**, **Skipped**, or **Needs Attention**.
- Upload photos and notes.
- Track daily completion percentage.

### 🧑‍💼 Supervisor Dashboard
- Create and assign routes dynamically.
- View live progress by worker or region.
- Filter by skipped cans, overdue alerts, or flagged bins.
- Receive notifications on route changes or critical alerts.

### 👥 Resident Interface
- Scan a public garbage can’s QR code (no login needed).
- Report issues such as overflow, vandalism, or odours.
- Optionally attach a photo and submit anonymously.

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/CanRouteApp.git
cd CanRouteApp
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the project root with:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/canroute
JWT_SECRET=your_jwt_secret_key
```
*(Add any other config variables you use, e.g. Firebase, S3, or Render keys)*

### 4. Run the Server
```bash
npm run dev
```
Server will start at: [http://localhost:5000](http://localhost:5000)

### 5. Run the Expo App
```bash
cd mobile
npx expo start
```
Scan the QR code with Expo Go to launch the app on your device.

---

## 📡 API Endpoints (Based on Uploaded Routes)

### 🔐 **Auth Routes (`auth.routes.js`)**
| Method | Endpoint | Description |
|---------|-----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Authenticate user and return JWT |
| `GET` | `/api/auth/users` | Get all users (Admin only) |

### 🗑️ **Can Routes (`can.routes.js`)**
| Method | Endpoint | Description |
|---------|-----------|-------------|
| `GET` | `/api/cans` | Get all cans |
| `GET` | `/api/cans/:id` | Get specific can |
| `POST` | `/api/cans` | Add a new can |
| `PATCH` | `/api/cans/:id` | Update can info |
| `DELETE` | `/api/cans/:id` | Delete can |

### 🚨 **Can Notifications (`canNotification.routes.js`)**
| Method | Endpoint | Description |
|---------|-----------|-------------|
| `GET` | `/api/notifications` | Fetch all can notifications |
| `POST` | `/api/notifications` | Create new notification |
| `PATCH` | `/api/notifications/:id` | Update notification status |
| `DELETE` | `/api/notifications/:id` | Remove notification |

### 💰 **Payroll Routes (`payroll.routes.js`)**
| Method | Endpoint | Description |
|---------|-----------|-------------|
| `GET` | `/api/payroll` | Get payroll logs |
| `POST` | `/api/payroll` | Create new payroll entry |
| `PATCH` | `/api/payroll/:id` | Update payroll entry |
| `DELETE` | `/api/payroll/:id` | Delete payroll entry |

### 🧾 **Service Log Routes (`serviceLog.routes.js`)**
| Method | Endpoint | Description |
|---------|-----------|-------------|
| `GET` | `/api/service-logs` | Fetch all service logs |
| `POST` | `/api/service-logs` | Create a new service log |
| `PATCH` | `/api/service-logs/:id` | Update existing log |
| `DELETE` | `/api/service-logs/:id` | Delete service log |

### 🔄 **Transfer Routes (`transfer.routes.js`)**
| Method | Endpoint | Description |
|---------|-----------|-------------|
| `GET` | `/api/transfers` | Fetch all transfers |
| `POST` | `/api/transfers` | Create new transfer |
| `PATCH` | `/api/transfers/:id` | Update transfer |
| `DELETE` | `/api/transfers/:id` | Delete transfer |

---

## 🧠 Mongoose Models (Overview)

- **User Model:** Worker/supervisor data, auth credentials, assigned routes.
- **Can Model:** Represents each physical garbage bin with geo-location and status.
- **ServiceLog Model:** History of can servicing actions (serviced, skipped, noted).
- **CanNotification Model:** Alerts or QR-based notifications from residents.
- **Transfer Model:** Records of can or route reassignment between workers.
- **Payroll Model:** Stores worker payroll info and payment records.

---

## 📺 Demo Video

🎥 **[Watch the demo here](https://your-demo-video-link.com)**  
*(Replace with your actual link once uploaded — YouTube or Loom recommended)*

---

## 🧱 Folder Structure

```
CanRouteApp/
├── mobile/                 # Expo React Native app
│   ├── components/         # Reusable UI components
│   ├── screens/            # Screens for routes, cans, alerts
│   ├── navigation/         # React Navigation setup
│   ├── tailwind.config.js  # Tailwind (NativeWind) config
│   └── App.js
│
├── server/                 # Express backend
│   ├── models/             # Mongoose models (can, user, etc.)
│   ├── routes/             # Express route handlers
│   ├── controllers/        # Business logic
│   ├── middleware/         # JWT auth, error handling
│   ├── server.js
│   └── .env
│
├── README.md
└── package.json
```

---

## 🧾 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 💬 Contact

Created with 💚 by **[Your Name]**  
📧 Email: your.email@example.com  
🌐 GitHub: [@yourusername](https://github.com/yourusername)  
🔗 LinkedIn: [linkedin.com/in/yourname](https://linkedin.com/in/yourname)

---

### ⭐ If you like this project, consider giving it a star on GitHub!
