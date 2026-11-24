# PROJECT SYNOPSIS

---

## **PROJECT TITLE: PhishGuard AI – Intelligent Phishing Detection System**

- **Domain:** Cybersecurity & Information Security / Web Application Security
- **Project Category:** Defensive Security Web Platform / Mini-Project
- **Academic Session:** 2026–2027

---

## 1. WHAT IS REQUIRED IN A PROJECT SYNOPSIS?

A **Project Synopsis** is a concise, formal academic document submitted to faculty supervisors and evaluation committees prior to or alongside project evaluation. It outlines the foundational blueprint of the technical work. Standard university and institutional guidelines require the following key sections:

1. **Title & Domain:** The official name and category of the project.
2. **Abstract / About the Project:** High-level summary of the system and the real-world problem it solves.
3. **Problem Statement:** Clear articulation of the vulnerability, threat landscape, or deficiency addressed.
4. **Objectives:** Explicit, measurable goals the software aims to achieve.
5. **Scope of the Project:** Boundaries of the system—what it encompasses and where its constraints lie.
6. **Languages & Technologies Used:** Comprehensive technical stack across frontend, backend, database, and security layers.
7. **System Architecture & Methodology:** Technical workflow diagram, heuristic logic, and detection pipeline.
8. **Hardware & Software Requirements:** Development, testing, and deployment specifications.
9. **Testing & Quality Assurance:** Validation methodology and empirical test results.
10. **Future Scope:** Roadmap for subsequent iterations or production enterprise readiness.
11. **Acknowledgement:** Formal recognition of academic mentors, department faculty, and contributors.
12. **References:** Industry benchmarks, RFC standards, and academic citations.

---

## 2. ABOUT THE PROJECT (PROJECT OVERVIEW)

**PhishGuard AI** is an intelligent, defensive cybersecurity web application engineered to protect digital users and security analysts from deceptive online attacks. Phishing remains the single most prevalent attack vector globally, accounting for more than 80% of reported initial access breaches according to cybersecurity threat reports. Modern threat actors weaponize look-alike domains, character-level homoglyph spoofing (Punycode), multi-layer subdomain chaining, and urgent social engineering lures to harvest user credentials and bypass conventional spam filters.

PhishGuard AI delivers an automated, explainable security inspection system featuring two core engines:
1. **URL Phishing Detection Engine:** A 15-rule static heuristic inspection engine evaluating RFC syntax, transport security, raw IP hosts, subdomain hierarchy, homograph obfuscation, credential keyword placement, and high-risk TLDs.
2. **Email Phishing & Social Engineering Analyzer:** A content-inspection parser that evaluates email message text for artificial urgency, credential harvesting demands, OTP/2FA theft, executive impersonation, and fraudulent financial lures.

The platform provides a **Security Operations Center (SOC)** dashboard experience displaying live telemetry charts, risk scores (0–100), detailed indicator breakdowns, security recommendations, searchable audit logs, and downloadable audit reports. Critically, PhishGuard AI operates in a **zero-SSRF (Server-Side Request Forgery) sandbox**—it analyzes targets statically without dispatching network calls to untrusted hosts, protecting the host system from payload execution.

---

## 3. PROBLEM STATEMENT & MOTIVATION

### The Problem
Traditional anti-phishing defenses often rely on either:
- **Reactive Blacklists:** Blocklists (such as DNSBLs) lag behind adversaries, as modern phishing campaigns utilize transient domains active for less than 4 to 24 hours.
- **Black-Box AI Models:** Deep learning models frequently output raw probability scores without actionable explanations, leaving non-technical users and junior analysts unable to understand *why* a domain is dangerous.
- **Risky Inspection Mechanisms:** Many online scanners fetch or render submitted links dynamically, introducing Server-Side Request Forgery (SSRF) vulnerabilities and drive-by malware exposure.

### Motivation
There is an urgent requirement for an explainable, safe, and transparent defensive platform that decomposes suspicious links and emails into discrete, understandable threat indicators with zero client-side execution risk.

---

## 4. OBJECTIVES OF THE PROJECT

The primary objectives of PhishGuard AI are:

1. **Defensive Structural Analysis:** Implement 15 distinct heuristic rules to statically evaluate URI components without visiting untrusted web servers.
2. **Explainable Threat Scoring:** Calculate a normalized risk score (0 to 100) mapped to four standardized risk classifications:
   - **Low Risk (0–29):** Benign characteristics; standard web hygiene.
   - **Medium Risk (30–59):** Suspicious indicators; caution and verification advised.
   - **High Risk (60–79):** High-confidence phishing patterns detected.
   - **Critical Risk (80–100):** Weaponized domain or active deception pattern.
3. **Social Engineering Detection:** Parse unstructured email bodies for psychological coercion, credential requests, OTP theft attempts, and embedded malicious links.
4. **Interactive SOC Dashboard:** Deliver a professional Security Operations Center interface featuring real database telemetry, weekly trend charts, risk distributions, and alerts.
5. **Data Isolation & Security:** Enforce strict Multi-Tenant Data Isolation ensuring each security analyst can only access, view, and purge their own scan history.
6. **Actionable Mitigation Guidance:** Pair every detected anomaly with defensive remediation steps (e.g., verifying address bars, reporting to IT, enabling MFA).
7. **Empirical Quality Assurance:** Validate the application with rigorous unit, integration, and Playwright end-to-end browser automation tests.

---

## 5. SCOPE OF THE PROJECT

### In Scope
- **URL Syntax & Heuristic Parsing:** Comprehensive parsing of RFC 3986 components (scheme, userinfo, hostname, port, path, query parameters).
- **Deceptive Technique Detection:** Homoglyph / Punycode (`xn--`), raw IP addresses, userinfo `@` trickery, keyword stacking (`login`, `verify`, `banking`), and high-risk TLDs.
- **Email Content Heuristics:** Natural language heuristic pattern matching for coercive phrasing, fake lottery windfalls, and urgent wire transfers.
- **Full-Stack Application Architecture:** Responsive React 18 frontend paired with an Express.js backend and real MongoDB persistence.
- **Security Engineering:** Helmet headers, Express Rate Limiting (brute-force defense), password hashing via `bcryptjs`, and stateless JWT authentication.
- **Export Capabilities:** Downloadable JSON reports and printable audit documentation.

### Out of Scope (Defensive Boundaries & Limitations)
- **Active Web Crawling / SSRF:** PhishGuard AI intentionally does **not** visit, render, or download files from user-submitted URLs to ensure zero malware or SSRF exposure.
- **MIME Email Header Cryptography:** Email analysis is performed on body text. Full cryptographic validation of SPF, DKIM, and DMARC requires raw RFC 5322 `.eml` file headers (planned for v2.0).
- **Offensive Capabilities:** The application does not generate phishing templates, harvest credentials, or conduct penetration tests.

---

## 6. LANGUAGES, TOOLS & TECHNOLOGIES USED

### A. Programming & Scripting Languages
- **JavaScript (ES6+ / Node.js):** Primary language for both frontend React client and backend Express server.
- **HTML5 & CSS3:** Structural markup and modern layout design.
- **SQL / NoSQL Query Language (Mongoose / MongoDB BSON):** Database queries and aggregation pipelines.

### B. Frontend Architecture
- **React 18+:** Component-driven declarative single-page application (SPA).
- **Vite 6:** Next-generation frontend build tooling and HMR dev server.
- **Tailwind CSS 3.4:** Utility-first CSS framework with dark SOC color palette (`#080D18`, `#00D4FF`, `#7C3AED`).
- **React Router v6:** Client-side routing with protected route guards.
- **Lucide React:** Vector iconography for cybersecurity components.
- **Recharts 2.15:** Responsive data visualizations (AreaChart, PieChart, BarChart).
- **Framer Motion 11:** Fluid micro-interactions, radial risk gauge animations, and toast notifications.

### C. Backend Architecture
- **Node.js (v24.11+):** Asynchronous event-driven JavaScript runtime.
- **Express.js (v4.21):** Modular REST API framework.
- **Mongoose (v8.9):** Object Data Modeling (ODM) library for MongoDB.
- **MongoDB / MongoMemoryServer:** Document database engine with embedded real MongoDB daemon fallback.

### D. Security & Authentication
- **bcryptjs (v2.4):** Adaptive cryptographic salt hashing for passwords (10 salt rounds).
- **jsonwebtoken (v9.0):** Cryptographically signed stateless JWT authorization tokens.
- **Helmet (v8.0):** Secure HTTP response headers.
- **Express Rate Limit (v7.5):** IP-based rate limiting mitigating automated credential stuffing.
- **Validator.js (v13.12):** Input sanitization and format validation.

### E. Testing & Quality Assurance
- **Vitest (v2.1):** High-speed unit and integration test runner for backend services.
- **Supertest (v7.0):** HTTP assertion library for testing RESTful endpoints.
- **Playwright (v1.49):** Cross-browser end-to-end automation testing user flows in headless Chromium.

---

## 7. SYSTEM ARCHITECTURE & METHODOLOGY

```
                  ┌───────────────────────────────────────────────┐
                  │                 USER BROWSER                  │
                  │   (React 18 + Vite + Tailwind CSS Dashboard)  │
                  └───────────────────────┬───────────────────────┘
                                          │ HTTPS / REST (JWT Auth)
                                          ▼
                  ┌───────────────────────────────────────────────┐
                  │          EXPRESS.JS BACKEND GATEWAY           │
                  │   Helmet Headers • Rate Limiters • Validation │
                  └───────┬───────────────────────────────┬───────┘
                          │                               │
            ┌─────────────┴─────────────┐   ┌─────────────┴─────────────┐
            ▼                           ▼   ▼                           ▼
 ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐
 │ URL DETECTION ENGINE │ │ EMAIL ANALYZER CORE  │ │ THREAT INTEL SERVICE │
 │ 15 Heuristic Checks  │ │ Coercion & Lure Rule │ │ Optional Google Safe │
 │ Weighted Score Model │ │ Hyperlink Extractor  │ │ Browsing v4 Lookup   │
 └──────────┬───────────┘ └──────────┬───────────┘ └──────────┬───────────┘
            │                        │                        │
            └────────────────────────┼────────────────────────┘
                                     │
                                     ▼
                  ┌───────────────────────────────────────────────┐
                  │          MONGODB DATABASE REPOSITORY          │
                  │  Users • Scans (User-Isolated) • Alerts       │
                  └───────────────────────────────────────────────┘
```

### Detection Methodology:
1. **Target Ingestion & Normalization:** Submitted targets are sanitized and normalized without external calls.
2. **Static Heuristic Decomposition:** Evaluated against 15 URL rules or 10 email social engineering patterns.
3. **Weighted Scoring Algorithm:** Scores are aggregated based on configurable weights and capped at 100.
4. **Classification & Alert Generation:** Mapped to Low, Medium, High, or Critical risk. High and Critical detections automatically dispatch real-time `SecurityAlert` records.
5. **Persistence & Presentation:** Scan metadata is stored in MongoDB and rendered in the frontend with interactive visual breakdowns and remediation advice.

---

## 8. HARDWARE & SOFTWARE REQUIREMENTS

### Software Requirements
- **Operating System:** Windows 10/11, macOS 12+, or Linux (Ubuntu 20.04+).
- **Node.js Environment:** Node.js v18.0.0 or higher (Tested on Node v24.11.1).
- **Package Manager:** npm v9.0.0 or higher.
- **Web Browser:** Google Chrome, Mozilla Firefox, Microsoft Edge, or Safari (modern evergreen browsers).
- **Database:** MongoDB Community Server (v6.0+) or auto-provisioned embedded MongoMemoryServer.

### Hardware Requirements
- **Processor:** Dual-Core CPU @ 2.0 GHz or higher (Intel Core i3/i5/i7 or AMD Ryzen equivalent).
- **RAM:** Minimum 4 GB RAM (8 GB recommended for simultaneous server, client, and Playwright execution).
- **Storage:** Minimum 1 GB available disk space for dependencies, database records, and test browsers.
- **Display Resolution:** Minimum 1280 x 720 (optimized for Full HD 1920 x 1080 and mobile viewports).

---

## 9. TESTING & VALIDATION

The system was subjected to comprehensive automated verification across unit, integration, and browser testing suites:

| Test Suite | Framework | Scope / Coverage | Result |
|---|---|---|---|
| **URL Detection Engine** | Vitest | 15 heuristic checks, IP hosts, homoglyphs, brand spoofing | **11 / 11 Passed** |
| **Email Phishing Analyzer** | Vitest | Coercion, credential solicitations, OTP theft, benign text | **6 / 6 Passed** |
| **Auth & Security APIs** | Vitest + Supertest | Registration, JWT verification, duplicate check, rate limits | **8 / 8 Passed** |
| **Scan History & Isolation** | Vitest + Supertest | Multi-user data isolation, pagination, cascade deletion | **5 / 5 Passed** |
| **Dashboard Aggregations** | Vitest + Supertest | MongoDB aggregation pipelines, stats, 7-day trend | **5 / 5 Passed** |
| **End-to-End User Workflows** | Playwright (Chromium) | Landing, auth, scanning, history filters, mobile viewport | **8 / 8 Passed** |
| **TOTAL VERIFIED TESTS** | | **All Automated Test Suites** | **43 / 43 PASSED (100%)** |

---

## 10. FUTURE SCOPE & ENHANCEMENTS

1. **RFC 5322 MIME Header Parsing:** Direct file upload support for `.eml` and `.msg` email files to analyze SPF, DKIM-Signature, and DMARC compliance headers.
2. **Domain Age Verification (RDAP):** Proxy-isolated domain registration age lookup to detect domains created within the last 7 to 14 days.
3. **Multi-Factor Authentication (MFA):** Implementation of Time-Based One-Time Password (TOTP) algorithms for analyst accounts.
4. **Browser Extension Companion:** Development of a Chrome/Firefox extension communicating with the PhishGuard AI API to warn users before navigating to suspect domains.

---

## 11. ACKNOWLEDGEMENT

I express my deepest gratitude to our project guide, faculty mentors, and the Department of Computer Science & Engineering for their consistent guidance, constructive feedback, and technical mentorship throughout the conception, development, and testing of **PhishGuard AI – Intelligent Phishing Detection System**.

I also extend my sincere appreciation to the open-source cybersecurity and developer communities for maintaining foundational libraries, threat research data, and development frameworks that made the execution of this project possible.

---

## 12. CONCLUSION

**PhishGuard AI** successfully demonstrates a defensive, scalable, and explainable approach to modern phishing detection. By combining static structural URI heuristics with natural language social engineering pattern recognition, the platform provides real-time threat intelligence without introducing SSRF or payload vulnerabilities. The comprehensive full-stack implementation, real database telemetry, and 100% automated test pass rate affirm its suitability as an advanced cybersecurity mini-project demonstration.
