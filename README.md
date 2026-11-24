# PhishGuard AI – Intelligent Phishing Detection System

**PhishGuard AI** is a full-stack cybersecurity web application designed to help users identify potentially malicious URLs and deceptive phishing emails. The platform analyzes submitted targets through a 15-layer explainable heuristic rule engine, calculates transparent risk scores (0–100), details detected threats, and provides defensive mitigation guidance.

Developed for educational and institutional cybersecurity demonstrations, PhishGuard AI operates strictly as a defensive security solution with zero SSRF vulnerabilities, zero arbitrary outbound HTTP fetches, and zero client credential harvesting.

---

## 1. Problem Statement & Objectives

### The Problem
Phishing and social engineering remain the #1 initial access vector in modern cyberattacks (accounting for over 80% of reported security incidents). Attackers leverage deceptive domain registrations, character-level homoglyph/punycode spoofing, deep subdomain chains, and psychological urgency in email communications to bypass basic email spam filters and deceive end users.

### Project Objectives
- **Defensive Inspection:** Provide automated, explainable heuristic analysis of suspicious URLs and email content.
- **Explainable Threat Scoring:** Calculate a normalized risk score from 0 to 100 categorized across four severity levels:
  - **0–29: Low Risk** (Safe / Minimal indicators)
  - **30–59: Medium Risk** (Suspicious / Caution advised)
  - **60–79: High Risk** (Likely phishing / Malicious indicators)
  - **80–100: Critical Risk** (Confirmed threat pattern / Active deception)
- **Zero-SSRF Defensive Sandbox:** Analyze structure, syntax, and payload indicators completely statically without making network calls to submitted target URLs.
- **Enterprise SOC Experience:** Deliver a Security Operations Center (SOC) dashboard featuring telemetry charts, scan history, threat intelligence correlation, alert centers, and downloadable audit reports.

---

## 2. Technology Stack

### Frontend
- **React 18+** & **Vite**: High-performance frontend SPA.
- **Tailwind CSS**: Custom dark cybersecurity SOC styling (`#080D18` background, `#00D4FF` cyber-cyan accents).
- **React Router v6**: Client-side routing with authentication guards.
- **Lucide React**: Security & system iconography.
- **Recharts**: Telemetry charts (weekly trend area charts, risk distribution pie charts, threat category bar graphs).
- **Framer Motion**: Animated risk gauges, toast notifications, and modal dialogues.

### Backend
- **Node.js** & **Express.js**: Modular REST API architecture.
- **Mongoose** & **MongoDB**: Document database with user data isolation. Embedded real MongoDB engine (`mongodb-memory-server`) fallback guarantees zero-setup execution while supporting external MongoDB Community Servers.
- **Security Middleware**:
  - `helmet`: Secure HTTP headers.
  - `express-rate-limit`: Brute-force protection on auth & scan endpoints.
  - `bcryptjs`: Password hashing with 10 salt rounds.
  - `jsonwebtoken` (JWT): Stateless authentication tokens.
  - Robust input validation and sanitized database queries.

### Testing & Quality Assurance
- **Vitest** & **Supertest**: Backend unit and integration tests (35/35 passing).
- **Playwright**: End-to-end browser automation testing user workflows.

---

## 3. System Architecture & Detection Engines

```
[ User Browser / Analyst ]
            │
    (Vite / React 18)
    ├── Dashboard UI & Recharts Telemetry
    ├── URL Scanner & 1-Click Test Fixtures
    ├── Email Social Engineering Analyzer
    └── Audit History & Report Generator
            │
    (REST API / JWT Auth)
            ▼
   [ Express.js Backend Core ]
    ├── Security Middlewares (Helmet, CORS, Rate Limiters)
    ├── Auth Controller (bcrypt + JWT)
    ├── URL Detection Engine (15 Heuristic Rules)
    ├── Email Analyzer Engine (Coercion & Credential Scanners)
    └── Threat Intelligence Service (Safe Browsing v4 Provider)
            │
     (Mongoose ODM)
            ▼
    [ MongoDB Database ]
    ├── Users Collection
    ├── Scans Collection (Isolated per User)
    └── SecurityAlerts Collection
```

### The 15 Heuristic URL Checks
1. **RFC 3986 Syntax Validation:** Detects malformed URLs, parser differentials, and invalid schemes.
2. **TLS / HTTPS Transport Check:** Validates transport encryption while maintaining the vital distinction that HTTPS alone does not guarantee a benign site.
3. **Raw IP Address Hostname:** Flags raw IPv4, IPv6, hex, or octal IP hosts bypassing domain reputation lists.
4. **Subdomain Chain Stacking:** Detects deeply nested subdomains (≥3 or ≥4 labels) designed to push real domains off mobile viewports.
5. **Suspicious URL Length:** Flags unusually extended URLs (>75 and >100 characters) used for token obfuscation.
6. **Public Shortener Detection:** Identifies services like `bit.ly`, `tinyurl.com`, `t.co`, and `is.gd` concealing destinations.
7. **Userinfo "@" Character Lures:** Catches RFC userinfo trickery (e.g. `https://google.com@evil-site.com`).
8. **Hyphen Typosquatting Analysis:** Evaluates multi-hyphen synthetic domains mimicking corporate brands.
9. **Punycode & IDN Homoglyphs:** Catches Cyrillic and Greek Unicode spoofing (`xn--`) indistinguishable to the human eye.
10. **Credential Keyword Stacking:** Flags sensitive words (`login`, `verify`, `secure`, `update`, `banking`, `password`) in suspect hosts.
11. **Suspicious URL Hex Encoding:** Identifies heavy percent-encoding (`%20`, `%2E`) and double-encoding (`%25`) evasion techniques.
12. **Non-Standard Network Ports:** Flags connections to arbitrary high ports (`8888`, `4444`, `1337`) commonly hosting phishing kits.
13. **High-Risk TLD & Brand Hijacking:** Flags abused free TLDs (`.tk`, `.xyz`, `.top`) and brand names placed inside subdomains.
14. **Dangerous Payload Extensions:** Flags direct links to executables and archives (`.exe`, `.scr`, `.bat`, `.iso`, `.vbs`, `.apk`).
15. **Threat Intelligence Correlation:** Cross-checks with threat fixture databases and optional Google Safe Browsing reputation.

---

## 4. API Endpoints

### Authentication
- `POST /api/auth/register` - Create analyst account (Name, Email, Password).
- `POST /api/auth/login` - Authenticate with credentials and receive JWT.
- `GET /api/auth/me` - Retrieve authenticated user profile (Protected).
- `POST /api/auth/logout` - Clear user session.

### Scanning & Analysis
- `POST /api/scan/url` - Execute 15 heuristic checks on target URL (Protected).
- `POST /api/scan/email` - Inspect email text for social engineering patterns (Protected).
- `GET /api/scan/history` - Retrieve paginated, searchable scan history (Isolated per user).
- `GET /api/scan/:id` - Fetch comprehensive scan report by ID.
- `DELETE /api/scan/:id` - Permanently delete scan record and cascade-delete alerts.

### Dashboard & Analytics
- `GET /api/dashboard/stats` - Total scans, safe vs. suspicious count, avg risk score from DB.
- `GET /api/dashboard/activity` - 7-day scanning volume and recent scan records.
- `GET /api/dashboard/threat-distribution` - Risk level breakdown and top threat categories.

### Alerts & Settings
- `GET /api/alerts` - List security alerts for high/critical threats.
- `PATCH /api/alerts/:id/read` - Mark single alert as read.
- `POST /api/alerts/mark-all-read` - Mark all alerts as read.
- `PATCH /api/users/profile` - Update analyst display name.
- `PATCH /api/users/change-password` - Update account password.
- `DELETE /api/users/account` - Permanently delete account and all scan data.
- `GET /api/threat-intel/status` - Threat provider operational status.
- `POST /api/threat-intel/lookup` - Query external reputation index.

---

## 5. Getting Started & Installation

### Prerequisites
- **Node.js** v18+ or v20+ (Node v24.11 installed and verified).
- **npm** v9+.
- **MongoDB** (Optional: local MongoDB Community Server on port 27017 or remote URI. If not running, PhishGuard AI automatically provisions an embedded real MongoDB instance using `mongodb-memory-server` with zero manual configuration).

### Step 1: Install Dependencies
From the project root:
```bash
# Install root, backend, and frontend packages
npm install
npm --prefix server install
npm --prefix client install
```

### Step 2: Environment Configuration
Create or inspect `.env` in the `server/` directory (a pre-configured `.env` is already created):
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=
JWT_SECRET=super_secret_phishguard_jwt_key_cybersecurity_2026_change_in_production
JWT_EXPIRES_IN=7d
GOOGLE_SAFE_BROWSING_KEY=
```
*Note: If `MONGODB_URI` is left blank, PhishGuard AI automatically provisions an embedded real MongoDB instance.*

### Step 3: Run the Application
You can run both client and server concurrently using a single command:
```bash
npm start
```
Or run each service independently in separate terminals:
```bash
# Terminal 1: Start Backend API (Port 5000)
npm run server

# Terminal 2: Start Frontend (Port 5173)
npm run client
```

Navigate to:
- **Frontend App:** [http://localhost:5173](http://localhost:5173)
- **Backend Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

### Demo Credentials
For rapid demonstration, click the **"One-Click Demo Login"** button on the Login page, or use:
- **Email:** `analyst@phishguard.ai`
- **Password:** `CyberGuard2026!`

---

## 6. Running Tests

### Backend Unit & Integration Tests (Vitest)
Executes all 35 tests covering detection engines, authentication, user data isolation, and database models:
```bash
npm --prefix server test
```

### End-to-End Browser Tests (Playwright)
Executes end-to-end browser automation verifying registration, login, URL scanning, email analysis, history filters, and logout:
```bash
npm run test:e2e
```

---

## 7. Security Design & Defensive Guarantees

1. **Zero SSRF:** The application never executes outbound HTTP/HTTPS requests to user-submitted URLs. It evaluates URLs purely as structured strings.
2. **User Data Isolation:** Scan records, alerts, and profiles are scoped strictly to the authenticated `userId`. User A cannot view, query, or delete User B's scans.
3. **No Plaintext Passwords:** Passwords are hashed with `bcryptjs` using a cost factor of 10. Password hashes are excluded from database queries by default (`select: false`).
4. **Brute-Force Rate Limiting:** Auth endpoints are throttled to 30 requests per 15 minutes, while scan endpoints are throttled to 60 scans per 15 minutes.
5. **Real Database Aggregation:** All dashboard KPI statistics, charts, and velocity graphs compute metrics directly from MongoDB collections.

---

## 8. Limitations & Future Enhancements

- **Email Header Verification:** Current email analysis is based on body text heuristics. Full SPF, DKIM, and DMARC verification requires raw RFC 5322 MIME email file uploads (`.eml` / `.msg`), planned for v2.0.
- **Live DNS Whois Age:** Domain registration age via RDAP/WHOIS is planned as an optional add-on module.
- **Multi-Factor Authentication (MFA):** TOTP-based 2FA for analyst accounts via authenticator apps (e.g. Google Authenticator) in the next release.

