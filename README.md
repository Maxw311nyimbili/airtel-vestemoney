# Airtel Money Zambia - Wealth & Trading Simulator

A premium, interactive web application simulating local wealth management and stock trading, styled directly after the **My Airtel** fintech brand identity.

---

## 📱 Features

### 1. Unified Airtel Brand Aesthetics
- **Color Scheme**: Uses the standard Airtel Red (`#E30613`), White, and Slate Grey palette. Green and dark blocks have been completely eliminated.
- **Identical Hero Cards**: All dashboard cards (Dashboard balance, Portfolio Net Worth, Market Index, and Dividends Forecast) feature unified dimensions, drop shadows, gradients, and custom background blur rings.

### 2. Airtel App OTP Login & Guards
- **Secure Routes**: All trading dashboards are guarded. Unauthenticated direct visits automatically redirect back to the login screen.
- **Autofocus OTP jumping**: Standard Airtel login with country code selection and 4 discrete digit boxes that auto-shift focus forward on type and back-shift on delete.
- **OTP Resend Timer**: A 30-second ticking resend logic that cleanly transforms back into a clickable link.

### 3. Interactive Trading Charts
- A custom SVG Area Chart showing historical stock trend lines.
- **Crosshair Scrubbing**: Moving the cursor over the chart activates a tracking node, a vertical crosshair guide, and updates the price headers dynamically.
- **Timeframe Selector**: Interactive buttons (1D, 1W, 1M, 1Y) to switch dataset trends.

### 4. Dedicated Order Book Page
- Full-page order depth analysis containing bid and ask stacks with back-shaded size bar overlays.
- A live **Depth Wall Chart** plotting cumulative bid and ask wall paths.
- Active trade execution feed showing timing, size, and trade type indicators.

### 5. Lusaka Securities Exchange (LuSE) Mock Assets
- Substituted mock stock objects with 23 real listed securities on the Lusaka Stock Exchange (e.g. `ZMBF` - Zambeef, `ZNCO` - Zanaco, `CEC` - Copperbelt Energy Corporation).

---

## 🛠️ Technology Stack
- **Framework**: React (v18)
- **Bundler/Dev Server**: Vite (v5)
- **Routing**: React Router DOM (v6 HashRouter)
- **Styling**: Vanilla CSS (no third-party dependencies)
- **Icons**: Custom React inline SVGs

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### Installation
Clone the repository and install dependencies:
```bash
npm install
```

### Running Locally
To launch the Vite development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production
To build static production files inside the `dist/` directory:
```bash
npm run build
```
