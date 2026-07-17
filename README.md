# AshaTriage AI 🩺
> **Smart Clinical Decision Helper & Voice Assistant for Rural Social Health Activists (ASHA)**

An offline-first, multilingual, and AI-enabled clinical triage assistant designed to empower community health workers (ASHA workers) in remote Indian villages. Developed specifically for rapid, accessible, and life-saving patient evaluation.

---

## 🚀 Live Demo & Repository
* **GitHub Repository:** [https://github.com/RambihariPatel/asha-triage-ai](https://github.com/RambihariPatel/asha-triage-ai)
* **Live Deployment:** *[Add your deployment link here once deployed]*

---

## 📌 The Problem & Solution
Rural healthcare workers (ASHA) in India operate in areas with highly unstable internet connectivity, language barriers, and limited immediate access to medical officers. 

**AshaTriage AI** solves this by providing:
1. **Offline-First Architecture:** Local triage engine runs instantly on the client device without sending requests to the cloud.
2. **Generative AI Diagnostics (Gemini API):** Performs clinical reasoning and detailed reports when online.
3. **Regional Voice Enablement:** Hands-free voice triage (Speech-to-Text) and voice guidance (Text-to-Speech) in local languages.
4. **Instant Multi-lingual Support:** Dynamic i18n switcher covering English, Hindi (हिंदी), and Telugu (తెలుగు) across all views.

---

## 🌟 Key Features

### 1. 🛡️ Clinical Triage Engine (Offline-First)
* **Manchester Triage System (MTS) Inspired:** Automatically categorizes patients into standard color-coded severity levels (**RED** for emergency, **ORANGE** for urgent, **YELLOW** for moderate, **GREEN** for non-urgent).
* **Deterministic Rule Engine:** Automatically triggers clinical fallback heuristics offline to identify hypertensive crises, pediatric shock, hyperpyrexia, and other red-flag symptoms.

### 2. 🌐 Multi-lingual i18n System
* Complete localization of all UI panels, placeholders, vitals inputs, buttons, and alert states.
* Global toggle (🌐 Globe button in Navbar) supporting dynamic language switching.

### 3. 🎙️ Voice Assistant & Triage
* **Voice Triage:** ASHA workers can tap the microphone to describe patient symptoms aloud; integrated Web Speech API converts their speech to text instantly.
* **Voice Reader:** Reads clinical reports, warning signs, and first-aid instructions aloud in the selected regional language, assisting workers who prefer auditory guidance.

### 4. 📚 Emergency Protocols Library
* A quick reference catalog of first-aid instructions for 8 common village emergencies (Snake Bites, Severe Burns, Drowning, Poisoning, Cardiac Arrest, High Pediatric Fever, Severe Dehydration, and Seizures).
* Expandable accordion cards with severity indicators and built-in voice guidance.

### 5. 🆘 Floating SOS Panel
* A persistent, high-visibility emergency overlay displaying direct-dial buttons for local emergency numbers (108 Ambulance, 112 Police, 104 Health Helpline, etc.) and quick navigation links.

### 6. 📊 Demographics & Custom Analytics
* Pure HTML/CSS animated charts presenting patient distribution, severity statistics, age brackets, and gender breakdown directly from offline `localStorage` without external rendering package bloat.

### 7. 🔄 Offline Logs Sync
* Interactive logging tracker showing which files are pending sync.
* Direct notification handling informing users when sync completes or if simulated offline mode is currently active.

---

## 🛠️ Tech Stack
* **Framework:** React.js (Vite)
* **Routing:** React Router DOM (v6)
* **Icons:** Lucide React
* **Styling:** Custom CSS3 with dynamic variables, responsive grid configurations, and glassmorphism styling
* **State & Authentication:** LocalStorage persistence, js-cookie auth session management
* **Speech Integration:** Web Speech API (SpeechRecognition & SpeechSynthesis)

---

## 📁 Project Structure
```text
src/
├── assets/                  # Core static visual assets
├── components/
│   ├── Footer.jsx           # Clean application footer
│   ├── Navbar.jsx           # Mobile-responsive navbar with hamburger drawer
│   ├── ProtectedRoute.jsx   # Cookie-based guard for clinical views
│   └── SOSButton.jsx        # Floating emergency dial overlay
├── contexts/
│   └── LanguageContext.jsx  # App context for dynamic localization
├── pages/
│   ├── Analytics.jsx        # Demographics and severity charting
│   ├── Dashboard.jsx        # Patient logs, filter options, and sync status
│   ├── EmergencyProtocols.jsx # Offline first-aid library with voice read
│   ├── ExportReport.jsx     # Clinical print layout generator
│   ├── Login.jsx            # Secure sign-in with API + local admin fallback
│   ├── NotFound.jsx         # Custom 404 fallback page
│   ├── PatientDetail.jsx    # Clinical diagnostics, AI summaries, and voice reader
│   ├── Settings.jsx         # Gemini API configuration and Offline switch
│   └── TriageSession.jsx    # Voice symptoms recorder & vital inputs form
├── utils/
│   ├── geminiApi.js         # Google Gemini API integration
│   └── triageEngine.js      # Manchester-triage based rule engine
├── App.jsx                  # Route definitions and provider config
└── main.jsx                 # Client entrypoint
```

---

## 🔒 Authentication Flow
1. User enters credentials.
2. The system checks the Amazon AWS API endpoint for validation.
3. If internet is down or credentials fallback matches, it uses the local session manager (`jwt_token` cookie).
4. Protected routes verify token cookies before granting entry to medical databases.

### 🔑 Demo Credentials
* **Email:** `admin@example.com`
* **Password:** `admin123`

---

## ⚙️ Installation & Local Setup

### 1. Clone & Navigate
```bash
git clone https://github.com/RambihariPatel/asha-triage-ai.git
cd asha-triage-ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 🌟 Hackathon Evaluators Note
* **Offline Fallback Testing:** Go to **Settings**, toggle **Simulate Offline Mode** on, and try running a triage session. The system will bypass the Gemini API calls and compute diagnosis instantly using the local rule engine.
* **Voice Testing:** Tap the microphone icon in the **Start New Triage** symptom input and speak. Use the **Listen Report** button in any patient file to hear the diagnostic summary translated into your selected language.

---

## 📄 License
Developed for Hackathon submission. Intended for educational and evaluation purposes.
