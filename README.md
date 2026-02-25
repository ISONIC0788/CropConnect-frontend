
# CropConnect - Frontend

**CropConnect** is a "Phygital" (Physical + Digital) ecosystem designed to connect smallholder farmers in Sub-Saharan Africa directly with wholesale buyers. This repository contains the **Frontend Web Dashboard** built for Buyers, Agents, and Administrators.

## 🚀 Tech Stack

* **Framework:** [React](https://react.dev/) (via [Vite](https://vitejs.dev/))
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
* **Routing:** [React Router DOM](https://reactrouter.com/)
* **Maps/Geospatial:** [Leaflet](https://leafletjs.com/) & [React Leaflet](https://react-leaflet.js.org/)
* **HTTP Client:** [Axios](https://axios-http.com/)

---

## 📂 Project Structure

We follow a **Feature-Slice Architecture** to ensure scalability and maintainability.

```text
src/
├── app/                     # Global App Configuration (Redux Store)
├── assets/                  # Static assets (Images, Fonts)
├── components/              # Shared UI Components
│   ├── ui/                  # Atomic components (Buttons, Inputs)
│   ├── layout/              # Layout wrappers (Sidebar, Navbar)
│   └── maps/                # Reusable Map Logic
├── config/                  # Environment variables & Constants
├── features/                # BUSINESS LOGIC (Core Features)
│   ├── auth/                # Authentication (Login, JWT)
│   ├── admin/               # Admin Dashboard (User Mgmt)
│   ├── agent/               # Agent Portal (Verification)
│   └── buyer/               # Buyer Dashboard (Marketplace, Cart)
├── hooks/                   # Custom React Hooks
├── lib/                     # Library configurations (Axios, Utils)
├── pages/                   # Route Entry Points
├── router/                  # React Router Definitions
├── services/                # API Service Layer
└── types/                   # TypeScript Interfaces (Matches ERD)

```

---

## 🛠️ Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

* [Node.js](https://nodejs.org/) (v18 or higher)
* [npm](https://www.npmjs.com/) (usually comes with Node.js)

### Installation

1. **Clone the repository**
```bash
git clone [https://github.com/your-username/crop-connect-frontend.git](https://github.com/your-username/crop-connect-frontend.git)
cd crop-connect-frontend

```


2. **Install Dependencies**
```bash
npm install

```


3. **Environment Setup**
Create a `.env` file in the root directory:
```bash
cp .env.example .env

```


Update the variables in `.env`:
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_MAP_TILE_LAYER=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png

```


4. **Run the Development Server**
```bash
npm run dev

```


The app should now be running at `http://localhost:5173`.

---

## 📦 Key Dependencies

These are the main libraries you will use during development.

| Package | Purpose |
| --- | --- |
| `@reduxjs/toolkit` | Global state management (Auth, Cart, Filters). |
| `react-redux` | Connects React components to the Redux store. |
| `react-router-dom` | Handles navigation between pages. |
| `axios` | Handles API requests to the Java Spring Boot backend. |
| `leaflet` | Core mapping library for the Geo-Spatial Search. |
| `react-leaflet` | React components for Leaflet maps. |
| `lucide-react` | Beautiful, lightweight icons. |
| `clsx` & `tailwind-merge` | Utilities for conditional Tailwind classes. |
| `zod` | (Optional) Schema validation for forms. |

---

## 📜 Scripts

* `npm run dev`: Starts the development server with Hot Module Replacement (HMR).
* `npm run build`: Builds the app for production to the `dist` folder.
* `npm run preview`: Locally previews the production build.
* `npm run lint`: Runs ESLint to check for code quality issues.

---

## 🔐 Role-Based Access Control (RBAC)

This frontend implements strict RBAC. Routes are protected based on the user's role:

* **Buyer (`/buyer/*`)**: Can access the Marketplace, Orders, and Wallet.
* **Agent (`/agent/*`)**: Can access Verification Forms and Dispute Tools.
* **Admin (`/admin/*`)**: Can access System Logs, User Management, and Analytics.
* **Farmer**: Primarily uses USSD/SMS, but may have a limited view (future scope).

---

## 🤝 Contributing

1. Create a new branch for your feature (`git checkout -b feature/AmazingFeature`).
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
3. Push to the branch (`git push origin feature/AmazingFeature`).
4. Open a Pull Request.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

```

```