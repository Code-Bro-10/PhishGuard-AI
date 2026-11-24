# PhishGuard AI – Academic Project Presentation Deck
### Slide-by-Slide Content, Speaker Notes & Viva Defense Guide

> **Generated PowerPoint File:** [`PhishGuard_AI_Presentation.pptx`](file:///c:/Users/Mansi/Desktop/PhishGuard-AI/PhishGuard_AI_Presentation.pptx)  
> **Format:** 16:9 Widescreen | Dark SOC Cyber Theme (`#080D18` / `#00D4FF`)  
> **Total Slides:** 14 Slides with Embedded Speaker Notes  

---

## SLIDE 1: Title Slide (Cover)
- **Header:** DEFENSIVE CYBERSECURITY MINI-PROJECT
- **Main Title:** PhishGuard AI
- **Subtitle:** Intelligent Phishing Detection & Threat Intelligence System
- **Key Highlights:**
  - 15-Check Explainable Heuristic URL Engine | Zero-SSRF Defensive Architecture
  - Email Social Engineering Analyzer | Real-Time SOC Operations Dashboard
  - Full-Stack Implementation: React 18, Node.js, Express, MongoDB | 43/43 Passing Tests
- **Presenter / Session:** Student / Security Analyst | Academic Session 2026–2027
- **Speaker Notes:**
  > *"Welcome everyone. Today, I am presenting PhishGuard AI – an Intelligent Phishing Detection System. This project is a defensive cybersecurity platform that combines a 15-check explainable heuristic URL engine and an email social engineering analyzer with a complete modern SOC dashboard."*

---

## SLIDE 2: Introduction: The Modern Phishing Landscape
- **Card 1: The Threat Climate**
  - Phishing accounts for over 80% of all initial access security breaches worldwide.
  - Adversaries target both enterprise employees and end users via deceptive links and emails.
  - Average cost of data breaches resulting from compromised credentials exceeds $4.5 Million.
  - Attacks exploit human trust, artificial urgency, and brand familiarity rather than software zero-days.
- **Card 2: Sophisticated Adversary Techniques**
  - Punycode & IDN Homoglyphs: Substituting Latin letters with Cyrillic characters (e.g. `xn--`).
  - Deep Subdomain Chaining: Stacking domains (`paypal.com.verify.attacker.xyz`) to deceive mobile viewports.
  - Transient Infrastructure: Disposable phishing domains active for fewer than 4–12 hours.
  - Social Engineering Coercion: Fabricating urgent deadlines and executive impersonation to bypass critical thinking.
- **Speaker Notes:**
  > *"Phishing remains the primary vector for data breaches. Modern attackers have moved beyond obvious misspelled emails; they deploy subtle visual spoofing like Punycode homoglyphs and ephemeral infrastructure designed to evade static blacklists."*

---

## SLIDE 3: Problem Statement & Limitations of Existing Tools
- **Card 1: Static Blacklists Lag Behind**
  - Reputation blocklists (DNSBL) require hours or days to identify and flag new malicious domains.
  - Attackers spin up ephemeral domains that expire before blocklists ever update.
  - Zero-day phishing campaigns easily slip through traditional defenses.
- **Card 2: Black-Box AI Models Lack Context**
  - Many modern ML scanners output a solitary percentage without explainable reasoning.
  - Users and junior analysts cannot identify which specific indicators triggered the alarm.
  - Lack of transparency hinders security training and incident investigation.
- **Card 3: Dangerous Dynamic Crawlers**
  - Many web scanners visit and render submitted links on backend servers.
  - Introduces Server-Side Request Forgery (SSRF) and drive-by malware execution risks.
  - PhishGuard AI eliminates this vulnerability through 100% static heuristic analysis.
- **Speaker Notes:**
  > *"Our problem statement identifies three major industry flaws: blocklist lag, black-box AI opacity, and dangerous dynamic crawlers that open host servers to SSRF. PhishGuard AI directly addresses all three."*

---

## SLIDE 4: Project Objectives & Key Goals
- **Objective 1: Static Explainable Heuristic Engine**
  - Implement 15 distinct structural heuristic rules.
  - Transparent 0–100 risk scoring with granular per-rule impact points.
  - Zero SSRF: Complete static analysis with zero arbitrary external fetching.
- **Objective 2: Email Social Engineering Parser**
  - Analyze plain-text email bodies for psychological pressure & urgency.
  - Flag credential solicitations, OTP/2FA theft, and fake reward lures.
  - Extract and evaluate embedded hyperlinks within email bodies.
- **Objective 3: Interactive Enterprise SOC Dashboard**
  - 100% database-driven telemetry: zero hardcoded statistics.
  - 7-day scanning volume area chart and risk distribution donut chart.
  - Real-time high-risk security alerts dispatched upon threat detection.
- **Objective 4: Security Engineering & Data Isolation**
  - Multi-Tenant User Data Isolation across scans, history, and alerts.
  - Password hashing using bcrypt (10 rounds) and stateless JWT auth.
  - Downloadable audit documentation: JSON export and printable reports.
- **Speaker Notes:**
  > *"Our primary objective was to build a full-stack, end-to-end working platform that calculates transparent scores, provides clear remediation advice, and maintains strict user data isolation and defensive security."*

---

## SLIDE 5: System Architecture & 4-Stage Detection Pipeline
- **Stage 1: Input Normalization**
  - Sanitizes raw URI / text input without making outbound network requests.
  - Normalizes protocol schemes and validates RFC 3986 format.
- **Stage 2: Heuristic Decomposition**
  - Extracts URI authority, subdomains, TLD, ports, and paths.
  - Evaluates against 15 URL rules or 10 email patterns.
  - Checks Punycode (`xn--`), brand impersonation, and dangerous extensions.
- **Stage 3: Weighted Risk Scoring**
  - Aggregates weighted score impacts from `scoringWeights.js`.
  - Normalizes final score (0–100) and maps to Low, Medium, High, or Critical.
  - Automatically triggers a `SecurityAlert` if risk is High or Critical.
- **Stage 4: Advisory & Audit Logging**
  - Generates explainable indicator rationales.
  - Pairs findings with defensive mitigation recommendations.
  - Persists record to MongoDB with multi-tenant user isolation.
- **Speaker Notes:**
  > *"Here we see the 4-stage processing pipeline: Input Normalization, Heuristic Decomposition, Weighted Risk Scoring, and Defensive Advisory. Each stage is fully modular and explainable."*

---

## SLIDE 6: Full-Stack Technology Stack
- **Frontend Architecture:**
  - React 18+ & Vite 6: Fast component-driven Single Page Application.
  - Tailwind CSS 3.4: Bespoke SOC Dark Theme (`#080D18`, `#00D4FF`, `#7C3AED`).
  - Recharts 2.15: Dynamic responsive area, donut, and bar charts.
  - Framer Motion 11 & Lucide React: Smooth radial risk gauge & vector icons.
- **Backend & API Architecture:**
  - Node.js v24 & Express.js 4.21: RESTful API architecture.
  - Modular Controllers & Services: Clear separation of concerns.
  - Configurable Scoring Model: Isolated weights in `scoringWeights.js`.
  - Centralized Error Handling: Sanitized responses without stack leaks.
- **Database & Persistence:**
  - MongoDB & Mongoose 8.9: Scalable NoSQL document repository.
  - Compound BSON Indexes: Optimized for user history & analytics queries.
  - Auto-Provisioned MongoMemoryServer: Zero-setup real MongoDB fallback.
  - Support for external MongoDB Community Server on port 27017.
- **Security & Automated QA:**
  - Security Headers & Throttling: Helmet 8 + Express Rate Limit 7.
  - Cryptographic Auth: bcryptjs (10 salt rounds) + signed JWT tokens.
  - Backend Tests: Vitest 2.1 + Supertest (35/35 passing tests).
  - End-to-End Browser Testing: Playwright 1.49 Chromium (8/8 passing tests).
- **Speaker Notes:**
  > *"We utilized modern industry standards: React 18 with Vite for the client, Express.js for the API layer, Mongoose with real MongoDB for data modeling, and Vitest alongside Playwright for comprehensive test automation."*

---

## SLIDE 7: URL Phishing Detection Engine: 15 Heuristic Checks
- **Category A: Structural & Identity Checks**
  1. RFC 3986 Syntax Validation: Malformed URI strings & parser differentials.
  2. TLS/HTTPS Transport: Plaintext HTTP flagged; disclaims HTTPS != Safe.
  3. Raw IP Hostnames: Flags numeric IPv4/IPv6/hex hosts bypassing DNS.
  4. Subdomain Chain Stacking: Flags >=3 or >=4 nested subdomain layers.
  5. Suspicious URL Length: Evaluates extended URLs (>75 and >100 chars).
- **Category B: Obfuscation & Spoofing**
  6. Public URL Shorteners: Flags bit.ly, tinyurl, t.co masking destinations.
  7. Deceptive `@` Symbol: Flags userinfo trickery (`google.com@attacker.com`).
  8. Hyphen Squatting: Evaluates multi-hyphen synthetic brand domains.
  9. Punycode & IDN Homoglyphs: Detects Cyrillic character spoofing (`xn--`).
  10. Credential Keywords: Detects login, verify, update, banking, password.
- **Category C: Payloads & Threat Reputation**
  11. Hex & Double Encoding: Flags `%20`, `%2E` and `%25` evasion techniques.
  12. Non-Standard Network Ports: Flags 8888, 4444, 1337 hosting kits.
  13. High-Risk TLD & Brand Hijacking: Abused TLDs (`.tk`, `.xyz`) & sub-brands.
  14. Dangerous Extensions: Direct links to `.exe`, `.scr`, `.bat`, `.iso`, `.apk`.
  15. Threat Intelligence Correlation: Known threat fixture catalog matches.
- **Speaker Notes:**
  > *"This slide outlines all 15 heuristic checks categorized into structural checks, obfuscation/spoofing, and payload delivery indicators. Every single check has a configurable weight and provides an explainable description."*

---

## SLIDE 8: Email Phishing & Social Engineering Analyzer
- **1. Psychological Urgency & Threats:**
  - Detects artificial deadlines ('within 24 hours', 'immediate action required').
  - Identifies account termination and legal action intimidation patterns.
  - Purpose: Attackers manufacture panic to bypass critical reasoning.
- **2. Credential & 2FA/OTP Solicitation:**
  - Flags direct solicitations for passwords, master keys, or account credentials.
  - Detects OTP/2FA verification code interception attempts.
  - Remediation: Disclaims that legitimate institutions never request passwords via email.
- **3. Advance-Fee & Impersonation Scams:**
  - Detects lottery winnings, unclaimed wire transfers, and fake crypto refunds.
  - Flags executive impersonation ('From the CEO', 'IT Helpdesk Administrator').
  - Identifies pressure to open weaponized file attachments (`invoice.exe`, `statement.zip`).
- **4. Embedded Link Inspection:**
  - Automatically extracts embedded hyperlinks from email body text.
  - Runs extracted URLs through the 15-point URL Detection Engine.
  - Escalates overall email threat score if embedded links are malicious.
- **Speaker Notes:**
  > *"The email analyzer decomposes pasted messages into natural language threat patterns: urgency, credential demands, OTP interception, financial lures, and embedded hyperlink evaluation."*

---

## SLIDE 9: Weighted Scoring Model & Risk Tiers
- **Low Risk (0–29) | #22C55E (Green):**
  - Benign / Safe baseline.
  - Standard RFC syntax, valid HTTPS protocol, normal subdomain depth, no credential keywords.
  - Recommendation: Standard web hygiene; verify address bar domain.
- **Medium Risk (30–59) | #F59E0B (Amber):**
  - Suspicious / Elevated caution.
  - Triggered by single credential keywords, extended length, or link shorteners.
  - Recommendation: Caution advised; inspect destination before logging in.
- **High Risk (60–79) | #EF4444 (Red):**
  - Dangerous Phish.
  - Triggered by multiple keywords, raw IP host, or high-risk TLDs.
  - Auto-triggers real-time `SecurityAlert` notification record.
- **Critical Risk (80–100) | #DC2626 (Crimson):**
  - Active Threat / Confirmed Malicious.
  - Triggered by brand impersonation in subdomains, `@` symbol, or Punycode homoglyphs.
  - Recommendation: Block domain immediately; do not open.
- **Speaker Notes:**
  > *"Risk scores range from 0 to 100 across four distinct severity tiers. Any scan resulting in a High or Critical risk score automatically generates a persistent SecurityAlert record in the database."*

---

## SLIDE 10: Security Operations Center (SOC) Dashboard
- **Real-Time Database KPI Metrics:**
  - Total Scans, Safe Targets, Suspicious Targets, High/Critical Risks.
  - Average Risk Score calculated directly from MongoDB collections.
  - Zero hardcoded statistics: updates dynamically with every scan.
- **7-Day Scanning Volume Area Chart:**
  - Visualizes weekly throughput segmented by target type (URLs vs. Emails).
  - Tracks threat trends across the organization over time.
  - Built with Recharts ResponsiveContainer & custom tooltips.
- **Threat Distribution & Top Categories:**
  - Donut chart categorizing scans by risk tier (Low, Med, High, Critical).
  - Bar chart displaying most frequently triggered threat categories.
  - Provides situational awareness on active adversary lures.
- **Audit History, Search & Reporting:**
  - Searchable and filterable scan audit table with pagination.
  - Export options: Downloadable JSON files and printable audit reports.
  - Multi-tenant isolation: Users only view their own scan records.
- **Speaker Notes:**
  > *"The SOC Dashboard delivers a real-world Security Operations Center feel. All KPI cards, charts, and alert feeds reflect real database documents aggregated through Mongoose pipelines."*

---

## SLIDE 11: Defensive Guarantees & Security Engineering
- **Zero-SSRF Sandbox:**
  - The backend never dispatches HTTP/HTTPS requests to submitted target URLs.
  - Zero arbitrary socket connections or DNS resolution requests.
  - Completely immune to Server-Side Request Forgery and malicious payload execution.
- **Multi-Tenant Isolation:**
  - Strict user data isolation enforced at the database query level.
  - User A cannot view, query, or delete User B's scans or security alerts.
  - Account deletion executes an atomic cascade purge of all associated records.
- **Defensive Hardening:**
  - Helmet HTTP response headers mitigating XSS and clickjacking.
  - Rate limiting: Throttles auth endpoints (anti-brute-force) and scan APIs.
  - bcryptjs password hashing (10 salt rounds); password hashes excluded by default.
  - Signed stateless JSON Web Tokens (JWT) for session management.
- **Speaker Notes:**
  > *"Security is woven into every layer. We enforce zero-SSRF safety, strict multi-tenant data isolation, rate limiting to mitigate credential stuffing, and cryptographic password hashing with bcrypt."*

---

## SLIDE 12: Empirical Validation: 43/43 Automated Tests Passed
- **Backend Vitest Test Suite (35 Tests Passed):**
  - URL Heuristic Suite (11 Tests): Verified RFC syntax, raw IP hosts, Punycode homoglyphs, brand spoofing, and dangerous file extensions.
  - Email Analyzer Suite (6 Tests): Verified urgency threats, password requests, OTP theft, lottery scams, and embedded link extraction.
  - Authentication Suite (8 Tests): Verified user registration, JWT generation, duplicate email rejection, short password checks, and health API.
  - Scan & History API Suite (5 Tests): Verified scan persistence, cascade alerts, pagination, and multi-user data isolation.
  - Dashboard Analytics Suite (5 Tests): Verified database aggregation pipelines, weekly trends, and user profile updates.
- **Playwright End-to-End Suite (8 Tests Passed):**
  - Test 1: Landing page loads with branding, features, and quick tester.
  - Test 2: Analyst registration and automated dashboard routing.
  - Test 3: URL scanning flow, risk gauge rendering, and report display.
  - Test 4: Email analyzer flow with 1-click template loading.
  - Test 5: Scan audit history table, search query, and filter tabs.
  - Test 6: Threat intelligence status display and live query tool.
  - Test 7: Analyst profile update and secure session logout.
  - Test 8: Responsive layout verification on mobile viewports (375x667).
- **Speaker Notes:**
  > *"We followed rigorous QA engineering. 35 backend tests and 8 full Playwright browser tests executed with a 100% pass rate. The system has been verified end-to-end on real database records."*

---

## SLIDE 13: Future Scope & Production Roadmap
- **1. RFC 5322 MIME Email Header Parsing:**
  - Enable direct file upload for `.eml` and `.msg` email files.
  - Cryptographically verify SPF, DKIM-Signature, and DMARC alignment headers.
  - Cross-reference sender IP addresses against public spam blacklists.
- **2. Proxy-Isolated RDAP Domain Age:**
  - Incorporate proxy-isolated RDAP/WHOIS lookups.
  - Automatically flag newly registered domains (NRDs) created within the last 7 to 14 days.
  - Statistical correlation: Over 60% of phishing kits run on brand-new domains.
- **3. Multi-Factor Authentication (MFA):**
  - Integrate Time-Based One-Time Password (TOTP) algorithms (Google Authenticator, Authy).
  - Enforce MFA for administrative and senior security analyst accounts.
- **4. Browser Companion Extension:**
  - Build a lightweight Chrome/Firefox browser extension.
  - Intercept user navigation and query PhishGuard AI API in real-time.
- **Speaker Notes:**
  > *"Our future roadmap includes RFC 5322 email file upload support for cryptographic DKIM/SPF checking, RDAP domain age detection, TOTP multi-factor authentication, and a browser companion extension."*

---

## SLIDE 14: Conclusion & Acknowledgement
- **Project Summary:**
  - Successfully engineered a fully functional, defensive cybersecurity web platform.
  - 15-check explainable heuristic engine delivers transparent threat scores (0–100).
  - Email analyzer flags psychological urgency, credential requests, and OTP theft.
  - 100% database-driven SOC dashboard with real telemetry and user data isolation.
  - Validated through 43 automated tests (35 Vitest + 8 Playwright E2E browser tests).
  - Zero SSRF vulnerabilities, zero arbitrary outbound HTTP fetches, zero malware risk.
- **Acknowledgement & Questions:**
  - Sincere gratitude to our project guide, faculty mentors, and the Department of Computer Science & Engineering for their academic guidance and support.
  - Thanks to the open-source cybersecurity community for maintaining foundational libraries and threat research benchmarks.
  - *Thank you for your time and attention! Floor is now open for Questions & Discussion.*
- **Speaker Notes:**
  > *"In conclusion, PhishGuard AI demonstrates a complete, safe, and explainable approach to phishing detection. Thank you to our faculty mentors and department for their support. I am now open to any questions."*

---

## VIVA & DEFENSE QUESTIONS (Quick Reference)

| Question | Recommended Answer |
|---|---|
| **Q1: Why did you choose heuristic analysis over machine learning?** | *"Heuristic analysis is transparent, explainable, and instantaneous. In high-stakes security, analysts must understand exactly which indicators (e.g. Punycode, raw IP, brand in subdomain) triggered a risk score. ML can be added as a complementary layer, but heuristics eliminate the 'black-box' dilemma."* |
| **Q2: How do you prevent SSRF (Server-Side Request Forgery)?** | *"We enforce a strict Zero-SSRF architecture. The server never makes outbound HTTP/HTTPS requests to the submitted URL. All 15 checks parse the string statically using RFC 3986 URI parsing specifications and regular expressions."* |
| **Q3: Does HTTPS mean a website is legitimate?** | *"No. Attackers routinely obtain free TLS certificates (e.g., Let's Encrypt). HTTPS only guarantees encrypted transport in transit; it says nothing about the legitimacy of the host. Our system explicitly flags this common misconception."* |
| **Q4: How is user data isolated?** | *"Every scan and alert is tagged with the user's ObjectId. Database queries enforce `{ userId: req.user._id }`. Even if an attacker guesses another user's scan ID, Mongoose returns 404 unauthorized."* |
| **Q5: What happens if MongoDB Community Server is not installed?** | *"We built an automatic fallback to `mongodb-memory-server` in `server/config/db.js`. It downloads and runs a real MongoDB binary in-memory with full BSON query support, guaranteeing zero-setup execution while supporting standard port 27017 when available."* |
