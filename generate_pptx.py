import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    # 16:9 widescreen layout
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Color Palette
    C_BG = RGBColor(8, 13, 24)         # #080D18 (Deep Dark Navy)
    C_CARD = RGBColor(19, 31, 50)      # #131F32 (SOC Card Background)
    C_CARD_BORDER = RGBColor(30, 41, 59) # #1E293B
    C_CYAN = RGBColor(0, 212, 255)     # #00D4FF (Primary Cyber Accent)
    C_PURPLE = RGBColor(124, 58, 237)  # #7C3AED (Secondary Accent)
    C_TEXT = RGBColor(248, 250, 252)   # #F8FAFC (White/Bright)
    C_MUTED = RGBColor(148, 163, 184)  # #94A3B8 (Secondary Slate)
    C_GREEN = RGBColor(34, 197, 94)    # #22C55E (Success)
    C_RED = RGBColor(239, 68, 68)      # #EF4444 (Danger)
    C_GOLD = RGBColor(245, 158, 11)    # #F59E0B (Warning)

    def set_slide_bg(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = C_BG
        bg.line.fill.background()
        return bg

    def add_header(slide, title_text, category_text="PHISHGUARD AI • CYBERSECURITY DEFENSIVE SUITE"):
        # Category / Eyebrow text
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.4))
        tf_cat = cat_box.text_frame
        tf_cat.word_wrap = True
        p_cat = tf_cat.paragraphs[0]
        p_cat.text = category_text.upper()
        p_cat.font.size = Pt(10)
        p_cat.font.bold = True
        p_cat.font.color.rgb = C_CYAN
        p_cat.font.name = "Consolas"

        # Main Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.7), Inches(0.7))
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        p_title = tf_title.paragraphs[0]
        p_title.text = title_text
        p_title.font.size = Pt(24)
        p_title.font.bold = True
        p_title.font.color.rgb = C_TEXT
        p_title.font.name = "Calibri"

        # Accent Line
        line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.45), Inches(11.733), Inches(0.02))
        line.fill.solid()
        line.fill.fore_color.rgb = C_CARD_BORDER
        line.line.fill.background()

    def add_card(slide, left, top, width, height, title, body_bullets, accent_color=C_CYAN, title_size=15, body_size=12):
        # Card Background box
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD
        card.line.color.rgb = C_CARD_BORDER
        card.line.width = Pt(1)

        # Card Title
        tb = slide.shapes.add_textbox(left + Inches(0.2), top + Inches(0.15), width - Inches(0.4), Inches(0.45))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(title_size)
        p.font.bold = True
        p.font.color.rgb = accent_color
        p.font.name = "Calibri"

        # Card Bullets
        body_box = slide.shapes.add_textbox(left + Inches(0.2), top + Inches(0.6), width - Inches(0.4), height - Inches(0.75))
        btf = body_box.text_frame
        btf.word_wrap = True
        for i, bullet in enumerate(body_bullets):
            p_b = btf.add_paragraph() if i > 0 else btf.paragraphs[0]
            p_b.text = bullet
            p_b.font.size = Pt(body_size)
            p_b.font.color.rgb = C_MUTED
            p_b.font.name = "Calibri"
            p_b.level = 0
            p_b.space_after = Pt(6)

    # ==========================================
    # SLIDE 1: Title Slide
    # ==========================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s1)

    # Title Card container
    t_card = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.5), Inches(1.2), Inches(10.333), Inches(5.0))
    t_card.fill.solid()
    t_card.fill.fore_color.rgb = C_CARD
    t_card.line.color.rgb = C_CYAN
    t_card.line.width = Pt(1.5)

    tb1 = s1.shapes.add_textbox(Inches(2.0), Inches(1.6), Inches(9.333), Inches(4.2))
    tf1 = tb1.text_frame
    tf1.word_wrap = True

    p0 = tf1.paragraphs[0]
    p0.text = "DEFENSIVE CYBERSECURITY MINI-PROJECT"
    p0.font.size = Pt(13)
    p0.font.bold = True
    p0.font.color.rgb = C_CYAN
    p0.font.name = "Consolas"
    p0.space_after = Pt(14)

    p1 = tf1.add_paragraph()
    p1.text = "PhishGuard AI"
    p1.font.size = Pt(38)
    p1.font.bold = True
    p1.font.color.rgb = C_TEXT
    p1.font.name = "Calibri"

    p2 = tf1.add_paragraph()
    p2.text = "Intelligent Phishing Detection & Threat Intelligence System"
    p2.font.size = Pt(20)
    p2.font.bold = True
    p2.font.color.rgb = C_CYAN
    p2.font.name = "Calibri"
    p2.space_after = Pt(20)

    p3 = tf1.add_paragraph()
    p3.text = "• 15-Check Explainable Heuristic URL Engine  |  Zero-SSRF Defensive Architecture\n• Email Social Engineering Analyzer  |  Real-Time SOC Operations Dashboard\n• Full-Stack Implementation: React 18, Node.js, Express, MongoDB  |  43/43 Passing Tests"
    p3.font.size = Pt(13)
    p3.font.color.rgb = C_MUTED
    p3.font.name = "Calibri"
    p3.space_after = Pt(24)

    p4 = tf1.add_paragraph()
    p4.text = "Presented by: Student / Security Analyst   |   Academic Session: 2026–2027"
    p4.font.size = Pt(12)
    p4.font.color.rgb = C_TEXT
    p4.font.name = "Calibri"

    s1.notes_slide.notes_text_frame.text = (
        "Welcome everyone. Today, I am presenting PhishGuard AI – an Intelligent Phishing Detection System. "
        "This project is a defensive cybersecurity platform that combines a 15-check explainable heuristic URL engine "
        "and an email social engineering analyzer with a complete modern SOC dashboard."
    )

    # ==========================================
    # SLIDE 2: Background & The Phishing Threat
    # ==========================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s2)
    add_header(s2, "Introduction: The Modern Phishing Landscape")

    add_card(s2, Inches(0.8), Inches(1.7), Inches(5.6), Inches(4.8),
             "1. The Threat Climate", [
                 "• Phishing accounts for over 80% of all initial access security breaches worldwide.",
                 "• Adversaries target both enterprise employees and end users via deceptive links and emails.",
                 "• Average cost of data breaches resulting from compromised credentials exceeds $4.5 Million.",
                 "• Attacks exploit human trust, artificial urgency, and brand familiarity rather than software zero-days."
             ], C_CYAN, 16, 13)

    add_card(s2, Inches(6.8), Inches(1.7), Inches(5.7), Inches(4.8),
             "2. Sophisticated Adversary Techniques", [
                 "• Punycode & IDN Homoglyphs: Substituting Latin letters with Cyrillic characters (e.g. xn--).",
                 "• Deep Subdomain Chaining: Stacking domains (paypal.com.verify.attacker.xyz) to deceive mobile viewports.",
                 "• Transient Infrastructure: Disposable phishing domains active for fewer than 4-12 hours.",
                 "• Social Engineering Coercion: Fabricating urgent deadlines and executive impersonation to bypass critical thinking."
             ], C_PURPLE, 16, 13)

    s2.notes_slide.notes_text_frame.text = (
        "Phishing remains the primary vector for data breaches. Modern attackers have moved beyond obvious misspelled emails; "
        "they deploy subtle visual spoofing like Punycode homoglyphs and ephemeral infrastructure designed to evade static blacklists."
    )

    # ==========================================
    # SLIDE 3: Problem Statement & Existing Gaps
    # ==========================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s3)
    add_header(s3, "Problem Statement & Limitations of Existing Tools")

    add_card(s3, Inches(0.8), Inches(1.7), Inches(3.7), Inches(4.8),
             "Static Blacklists Lag Behind", [
                 "• Reputation blocklists (DNSBL) require hours or days to identify and flag new malicious domains.",
                 "• Attackers spin up ephemeral domains that expire before blocklists ever update.",
                 "• Zero-day phishing campaigns easily slip through traditional defenses."
             ], C_RED, 15, 12)

    add_card(s3, Inches(4.8), Inches(1.7), Inches(3.7), Inches(4.8),
             "Black-Box AI Models Lack Context", [
                 "• Many modern ML scanners output a solitary percentage without explainable reasoning.",
                 "• Users and junior analysts cannot identify which specific indicators triggered the alarm.",
                 "• Lack of transparency hinders security training and incident investigation."
             ], C_GOLD, 15, 12)

    add_card(s3, Inches(8.8), Inches(1.7), Inches(3.7), Inches(4.8),
             "Dangerous Dynamic Crawlers", [
                 "• Many web scanners visit and render submitted links on backend servers.",
                 "• Introduces Server-Side Request Forgery (SSRF) and drive-by malware execution risks.",
                 "• PhishGuard AI eliminates this vulnerability through 100% static heuristic analysis."
             ], C_CYAN, 15, 12)

    s3.notes_slide.notes_text_frame.text = (
        "Our problem statement identifies three major industry flaws: blocklist lag, black-box AI opacity, "
        "and dangerous dynamic crawlers that open host servers to SSRF. PhishGuard AI directly addresses all three."
    )

    # ==========================================
    # SLIDE 4: Project Objectives
    # ==========================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s4)
    add_header(s4, "Project Objectives & Key Goals")

    add_card(s4, Inches(0.8), Inches(1.7), Inches(5.6), Inches(2.3),
             "1. Static Explainable Heuristic Engine", [
                 "• Implement 15 distinct structural heuristic rules.",
                 "• Transparent 0–100 risk scoring with granular per-rule impact points.",
                 "• Zero SSRF: Complete static analysis with zero arbitrary external fetching."
             ], C_CYAN, 15, 12)

    add_card(s4, Inches(6.8), Inches(1.7), Inches(5.7), Inches(2.3),
             "2. Email Social Engineering Parser", [
                 "• Analyze plain-text email bodies for psychological pressure & urgency.",
                 "• Flag credential solicitations, OTP/2FA theft, and fake reward lures.",
                 "• Extract and evaluate embedded hyperlinks within email bodies."
             ], C_PURPLE, 15, 12)

    add_card(s4, Inches(0.8), Inches(4.2), Inches(5.6), Inches(2.3),
             "3. Interactive Enterprise SOC Dashboard", [
                 "• 100% database-driven telemetry: zero hardcoded statistics.",
                 "• 7-day scanning volume area chart and risk distribution donut chart.",
                 "• Real-time high-risk security alerts dispatched upon threat detection."
             ], C_GREEN, 15, 12)

    add_card(s4, Inches(6.8), Inches(4.2), Inches(5.7), Inches(2.3),
             "4. Security Engineering & Data Isolation", [
                 "• Multi-Tenant User Data Isolation across scans, history, and alerts.",
                 "• Password hashing using bcrypt (10 rounds) and stateless JWT auth.",
                 "• Downloadable audit documentation: JSON export and printable reports."
             ], C_GOLD, 15, 12)

    s4.notes_slide.notes_text_frame.text = (
        "Our primary objective was to build a full-stack, end-to-end working platform that calculates transparent scores, "
        "provides clear remediation advice, and maintains strict user data isolation and defensive security."
    )

    # ==========================================
    # SLIDE 5: System Architecture & Workflow Pipeline
    # ==========================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s5)
    add_header(s5, "System Architecture & 4-Stage Detection Pipeline")

    add_card(s5, Inches(0.8), Inches(1.7), Inches(2.7), Inches(4.8),
             "Stage 1: Normalization", [
                 "• Sanitizes raw URI / text input.",
                 "• Normalizes protocol schemes.",
                 "• Validates RFC 3986 format.",
                 "• Zero outbound network requests dispatched."
             ], C_CYAN, 14, 11)

    add_card(s5, Inches(3.8), Inches(1.7), Inches(2.7), Inches(4.8),
             "Stage 2: Decomposition", [
                 "• Extracts URI authority, subdomains, TLD, ports, and paths.",
                 "• Evaluates against 15 URL rules or 10 email patterns.",
                 "• Checks Punycode (xn--), brand impersonation, and extensions."
             ], C_PURPLE, 14, 11)

    add_card(s5, Inches(6.8), Inches(1.7), Inches(2.7), Inches(4.8),
             "Stage 3: Risk Scoring", [
                 "• Aggregates weighted score impacts from scoringWeights.js.",
                 "• Normalizes final score (0-100).",
                 "• Classifies severity tier: Low, Medium, High, or Critical.",
                 "• Triggers SecurityAlert if risk >= High."
             ], C_GOLD, 14, 11)

    add_card(s5, Inches(9.8), Inches(1.7), Inches(2.7), Inches(4.8),
             "Stage 4: Advisory & Audit", [
                 "• Generates explainable indicator rationales.",
                 "• Pairs findings with defensive mitigation recommendations.",
                 "• Persists record to MongoDB.",
                 "• Enables JSON / Printable export."
             ], C_GREEN, 14, 11)

    s5.notes_slide.notes_text_frame.text = (
        "Here we see the 4-stage processing pipeline: Input Normalization, Heuristic Decomposition, "
        "Weighted Risk Scoring, and Defensive Advisory. Each stage is fully modular and explainable."
    )

    # ==========================================
    # SLIDE 6: Technology Stack
    # ==========================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s6)
    add_header(s6, "Full-Stack Technology Stack")

    add_card(s6, Inches(0.8), Inches(1.7), Inches(5.6), Inches(2.3),
             "Frontend Architecture", [
                 "• React 18+ & Vite 6: Fast component-driven Single Page Application (SPA).",
                 "• Tailwind CSS 3.4: Bespoke SOC Dark Theme (#080D18, #00D4FF, #7C3AED).",
                 "• Recharts 2.15: Dynamic responsive area, donut, and bar charts.",
                 "• Framer Motion 11 & Lucide React: Smooth radial risk gauge & vector icons."
             ], C_CYAN, 15, 11)

    add_card(s6, Inches(6.8), Inches(1.7), Inches(5.7), Inches(2.3),
             "Backend & API Architecture", [
                 "• Node.js v24 & Express.js 4.21: RESTful API architecture.",
                 "• Modular Controllers & Services: Clear separation of concerns.",
                 "• Configurable Scoring Model: Isolated weights in scoringWeights.js.",
                 "• Centralized Error Handling: Sanitized responses without stack leaks."
             ], C_PURPLE, 15, 11)

    add_card(s6, Inches(0.8), Inches(4.2), Inches(5.6), Inches(2.3),
             "Database & Persistence", [
                 "• MongoDB & Mongoose 8.9: Scalable NoSQL document repository.",
                 "• Compound BSON Indexes: Optimized for user history & analytics queries.",
                 "• Auto-Provisioned MongoMemoryServer: Zero-setup real MongoDB fallback.",
                 "• Support for external MongoDB Community Server on port 27017."
             ], C_GREEN, 15, 11)

    add_card(s6, Inches(6.8), Inches(4.2), Inches(5.7), Inches(2.3),
             "Security & Automated QA", [
                 "• Security Headers & Throttling: Helmet 8 + Express Rate Limit 7.",
                 "• Cryptographic Auth: bcryptjs (10 salt rounds) + signed JWT tokens.",
                 "• Backend Tests: Vitest 2.1 + Supertest (35/35 passing tests).",
                 "• End-to-End Browser Testing: Playwright 1.49 Chromium (8/8 passing tests)."
             ], C_GOLD, 15, 11)

    s6.notes_slide.notes_text_frame.text = (
        "We utilized modern industry standards: React 18 with Vite for the client, Express.js for the API layer, "
        "Mongoose with real MongoDB for data modeling, and Vitest alongside Playwright for comprehensive test automation."
    )

    # ==========================================
    # SLIDE 7: URL Phishing Detection Engine
    # ==========================================
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s7)
    add_header(s7, "URL Detection Engine: 15 Heuristic Checks")

    add_card(s7, Inches(0.8), Inches(1.7), Inches(3.7), Inches(4.8),
             "Structural & Identity Checks", [
                 "1. RFC 3986 Syntax Validation: Malformed URI strings & parser differentials.",
                 "2. TLS/HTTPS Transport: Plaintext HTTP flagged; disclaims HTTPS != Safe.",
                 "3. Raw IP Hostnames: Flags numeric IPv4/IPv6/hex hosts bypassing DNS.",
                 "4. Subdomain Chain Stacking: Flags >=3 or >=4 nested subdomain layers.",
                 "5. Suspicious URL Length: Evaluates extended URLs (>75 and >100 chars)."
             ], C_CYAN, 14, 11)

    add_card(s7, Inches(4.8), Inches(1.7), Inches(3.7), Inches(4.8),
             "Obfuscation & Spoofing", [
                 "6. Public URL Shorteners: Flags bit.ly, tinyurl, t.co masking destinations.",
                 "7. Deceptive '@' Symbol: Flags userinfo trickery (google.com@attacker.com).",
                 "8. Hyphen Squatting: Evaluates multi-hyphen synthetic brand domains.",
                 "9. Punycode & IDN Homoglyphs: Detects Cyrillic character spoofing (xn--).",
                 "10. Credential Keywords: Detects login, verify, update, banking, password."
             ], C_PURPLE, 14, 11)

    add_card(s7, Inches(8.8), Inches(1.7), Inches(3.7), Inches(4.8),
             "Payloads & Threat Reputation", [
                 "11. Hex & Double Encoding: Flags %20, %2E and %25 evasion techniques.",
                 "12. Non-Standard Network Ports: Flags 8888, 4444, 1337 hosting kits.",
                 "13. High-Risk TLD & Brand Hijacking: Abused TLDs (.tk, .xyz) & sub-brands.",
                 "14. Dangerous Extensions: Direct links to .exe, .scr, .bat, .iso, .apk.",
                 "15. Threat Intelligence Correlation: Known threat fixture catalog matches."
             ], C_RED, 14, 11)

    s7.notes_slide.notes_text_frame.text = (
        "This slide outlines all 15 heuristic checks categorized into structural checks, obfuscation/spoofing, "
        "and payload delivery indicators. Every single check has a configurable weight and provides an explainable description."
    )

    # ==========================================
    # SLIDE 8: Email Phishing Analyzer
    # ==========================================
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s8)
    add_header(s8, "Email Phishing & Social Engineering Analyzer")

    add_card(s8, Inches(0.8), Inches(1.7), Inches(5.6), Inches(2.3),
             "1. Psychological Urgency & Threats", [
                 "• Detects artificial deadlines ('within 24 hours', 'immediate action required').",
                 "• Identifies account termination and legal action intimidation patterns.",
                 "• Purpose: Attackers manufacture panic to bypass critical reasoning."
             ], C_RED, 15, 11)

    add_card(s8, Inches(6.8), Inches(1.7), Inches(5.7), Inches(2.3),
             "2. Credential & 2FA/OTP Solicitation", [
                 "• Flags direct solicitations for passwords, master keys, or account credentials.",
                 "• Detects OTP/2FA verification code interception attempts.",
                 "• Remediation: Disclaims that legitimate institutions never request passwords via email."
             ], C_GOLD, 15, 11)

    add_card(s8, Inches(0.8), Inches(4.2), Inches(5.6), Inches(2.3),
             "3. Advance-Fee & Impersonation Scams", [
                 "• Detects lottery winnings, unclaimed wire transfers, and fake crypto refunds.",
                 "• Flags executive impersonation ('From the CEO', 'IT Helpdesk Administrator').",
                 "• Identifies pressure to open weaponized file attachments (invoice.exe, statement.zip)."
             ], C_PURPLE, 15, 11)

    add_card(s8, Inches(6.8), Inches(4.2), Inches(5.7), Inches(2.3),
             "4. Embedded Link Inspection", [
                 "• Automatically extracts embedded hyperlinks from email body text.",
                 "• Runs extracted URLs through the 15-point URL Detection Engine.",
                 "• Escalates overall email threat score if embedded links are malicious."
             ], C_CYAN, 15, 11)

    s8.notes_slide.notes_text_frame.text = (
        "The email analyzer decomposes pasted messages into natural language threat patterns: "
        "urgency, credential demands, OTP interception, financial lures, and embedded hyperlink evaluation."
    )

    # ==========================================
    # SLIDE 9: Scoring Model & Classification
    # ==========================================
    s9 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s9)
    add_header(s9, "Weighted Scoring Model & Risk Tiers")

    add_card(s9, Inches(0.8), Inches(1.7), Inches(2.7), Inches(4.8),
             "Low Risk (0–29)", [
                 "• Color: #22C55E (Green)",
                 "• Status: Benign / Safe",
                 "• Standard RFC syntax, valid HTTPS protocol, normal subdomain depth, no credential keywords.",
                 "• Recommendation: Standard web hygiene; verify address bar domain."
             ], C_GREEN, 14, 11)

    add_card(s9, Inches(3.8), Inches(1.7), Inches(2.7), Inches(4.8),
             "Medium Risk (30–59)", [
                 "• Color: #F59E0B (Amber)",
                 "• Status: Suspicious",
                 "• Triggered by single credential keywords, extended length, or link shorteners.",
                 "• Recommendation: Caution advised; inspect destination before logging in."
             ], C_GOLD, 14, 11)

    add_card(s9, Inches(6.8), Inches(1.7), Inches(2.7), Inches(4.8),
             "High Risk (60–79)", [
                 "• Color: #EF4444 (Red)",
                 "• Status: Dangerous Phish",
                 "• Triggered by multiple keywords, raw IP host, or high-risk TLDs.",
                 "• Auto-triggers real-time SecurityAlert notification record."
             ], C_RED, 14, 11)

    add_card(s9, Inches(9.8), Inches(1.7), Inches(2.7), Inches(4.8),
             "Critical Risk (80–100)", [
                 "• Color: #DC2626 (Crimson)",
                 "• Status: Active Threat",
                 "• Triggered by brand impersonation in subdomains, @ symbol, or Punycode homoglyphs.",
                 "• Strong recommendation: Block domain immediately; do not open."
             ], C_RED, 14, 11)

    s9.notes_slide.notes_text_frame.text = (
        "Risk scores range from 0 to 100 across four distinct severity tiers. Any scan resulting in a High or Critical "
        "risk score automatically generates a persistent SecurityAlert record in the database."
    )

    # ==========================================
    # SLIDE 10: SOC Operations Dashboard
    # ==========================================
    s10 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s10)
    add_header(s10, "Security Operations Center (SOC) Dashboard")

    add_card(s10, Inches(0.8), Inches(1.7), Inches(5.6), Inches(2.3),
             "Real-Time Database KPI Metrics", [
                 "• Total Scans, Safe Targets, Suspicious Targets, High/Critical Risks.",
                 "• Average Risk Score calculated directly from MongoDB collections.",
                 "• No hardcoded statistics: updates dynamically with every scan."
             ], C_CYAN, 15, 11)

    add_card(s10, Inches(6.8), Inches(1.7), Inches(5.7), Inches(2.3),
             "7-Day Scanning Volume Area Chart", [
                 "• Visualizes weekly throughput segmented by target type (URLs vs. Emails).",
                 "• Tracks threat trends across the organization over time.",
                 "• Built with Recharts ResponsiveContainer & custom tooltips."
             ], C_PURPLE, 15, 11)

    add_card(s10, Inches(0.8), Inches(4.2), Inches(5.6), Inches(2.3),
             "Threat Distribution & Top Categories", [
                 "• Donut chart categorizing scans by risk tier (Low, Med, High, Critical).",
                 "• Bar chart displaying most frequently triggered threat categories.",
                 "• Provides situational awareness on active adversary lures."
             ], C_GOLD, 15, 11)

    add_card(s10, Inches(6.8), Inches(4.2), Inches(5.7), Inches(2.3),
             "Audit History, Search & Reporting", [
                 "• Searchable and filterable scan audit table with pagination.",
                 "• Export options: Downloadable JSON files and printable audit reports.",
                 "• Multi-tenant isolation: Users only view their own scan records."
             ], C_GREEN, 15, 11)

    s10.notes_slide.notes_text_frame.text = (
        "The SOC Dashboard delivers a real-world Security Operations Center feel. All KPI cards, charts, "
        "and alert feeds reflect real database documents aggregated through Mongoose pipelines."
    )

    # ==========================================
    # SLIDE 11: Security & Defensive Architecture
    # ==========================================
    s11 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s11)
    add_header(s11, "Defensive Guarantees & Security Engineering")

    add_card(s11, Inches(0.8), Inches(1.7), Inches(3.7), Inches(4.8),
             "Zero-SSRF Sandbox", [
                 "• The backend never dispatches HTTP/HTTPS requests to submitted target URLs.",
                 "• Zero arbitrary socket connections or DNS resolution requests.",
                 "• Completely immune to Server-Side Request Forgery and malicious payload execution."
             ], C_CYAN, 15, 12)

    add_card(s11, Inches(4.8), Inches(1.7), Inches(3.7), Inches(4.8),
             "Multi-Tenant Isolation", [
                 "• Strict user data isolation enforced at the database query level.",
                 "• User A cannot view, query, or delete User B's scans or security alerts.",
                 "• Account deletion executes an atomic cascade purge of all associated records."
             ], C_GREEN, 15, 12)

    add_card(s11, Inches(8.8), Inches(1.7), Inches(3.7), Inches(4.8),
             "Defensive Hardening", [
                 "• Helmet HTTP response headers mitigating XSS and clickjacking.",
                 "• Rate limiting: Throttles auth endpoints (anti-brute-force) and scan APIs.",
                 "• bcryptjs password hashing (10 salt rounds); password hashes excluded by default.",
                 "• Signed stateless JSON Web Tokens (JWT) for session management."
             ], C_GOLD, 15, 12)

    s11.notes_slide.notes_text_frame.text = (
        "Security is woven into every layer. We enforce zero-SSRF safety, strict multi-tenant data isolation, "
        "rate limiting to mitigate credential stuffing, and cryptographic password hashing with bcrypt."
    )

    # ==========================================
    # SLIDE 12: Testing & Empirical Validation
    # ==========================================
    s12 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s12)
    add_header(s12, "Empirical Validation: 43/43 Automated Tests Passed")

    add_card(s12, Inches(0.8), Inches(1.7), Inches(5.6), Inches(4.8),
             "Backend Vitest Test Suite (35 Tests Passed)", [
                 "• URL Heuristic Suite (11 Tests): Verified RFC syntax, raw IP hosts, Punycode homoglyphs, brand spoofing, and dangerous file extensions.",
                 "• Email Analyzer Suite (6 Tests): Verified urgency threats, password requests, OTP theft, lottery scams, and embedded link extraction.",
                 "• Authentication Suite (8 Tests): Verified user registration, JWT generation, duplicate email rejection, short password checks, and health API.",
                 "• Scan & History API Suite (5 Tests): Verified scan persistence, cascade alerts, pagination, and multi-user data isolation.",
                 "• Dashboard Analytics Suite (5 Tests): Verified database aggregation pipelines, weekly trends, and user profile updates."
             ], C_CYAN, 15, 11)

    add_card(s12, Inches(6.8), Inches(1.7), Inches(5.7), Inches(4.8),
             "Playwright End-to-End Suite (8 Tests Passed)", [
                 "• Test 1: Landing page loads with branding, features, and quick tester.",
                 "• Test 2: Analyst registration and automated dashboard routing.",
                 "• Test 3: URL scanning flow, risk gauge rendering, and report display.",
                 "• Test 4: Email analyzer flow with 1-click template loading.",
                 "• Test 5: Scan audit history table, search query, and filter tabs.",
                 "• Test 6: Threat intelligence status display and live query tool.",
                 "• Test 7: Analyst profile update and secure session logout.",
                 "• Test 8: Responsive layout verification on mobile viewports (375x667)."
             ], C_GREEN, 15, 11)

    s12.notes_slide.notes_text_frame.text = (
        "We followed rigorous QA engineering. 35 backend tests and 8 full Playwright browser tests executed with a 100% pass rate. "
        "The system has been verified end-to-end on real database records."
    )

    # ==========================================
    # SLIDE 13: Future Scope & Roadmap
    # ==========================================
    s13 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s13)
    add_header(s13, "Future Scope & Production Roadmap")

    add_card(s13, Inches(0.8), Inches(1.7), Inches(5.6), Inches(2.3),
             "1. RFC 5322 MIME Email Header Parsing", [
                 "• Enable direct file upload for .eml and .msg email files.",
                 "• Cryptographically verify SPF, DKIM-Signature, and DMARC alignment headers.",
                 "• Cross-reference sender IP addresses against public spam blacklists."
             ], C_CYAN, 15, 11)

    add_card(s13, Inches(6.8), Inches(1.7), Inches(5.7), Inches(2.3),
             "2. Proxy-Isolated RDAP Domain Age", [
                 "• Incorporate proxy-isolated RDAP/WHOIS lookups.",
                 "• Automatically flag newly registered domains (NRDs) created within the last 7 to 14 days.",
                 "• Statistical correlation: Over 60% of phishing kits run on brand-new domains."
             ], C_PURPLE, 15, 11)

    add_card(s13, Inches(0.8), Inches(4.2), Inches(5.6), Inches(2.3),
             "3. Multi-Factor Authentication (MFA)", [
                 "• Integrate Time-Based One-Time Password (TOTP) algorithms (Google Authenticator, Authy).",
                 "• Enforce MFA for administrative and senior security analyst accounts.",
                 "• Provide cryptographically generated emergency recovery codes."
             ], C_GOLD, 15, 11)

    add_card(s13, Inches(6.8), Inches(4.2), Inches(5.7), Inches(2.3),
             "4. Browser Companion Extension", [
                 "• Build a lightweight Chrome/Firefox browser extension.",
                 "• Intercept user navigation and query PhishGuard AI API in real-time.",
                 "• Warn users with full-screen splash alerts before visiting deceptive portals."
             ], C_GREEN, 15, 11)

    s13.notes_slide.notes_text_frame.text = (
        "Our future roadmap includes RFC 5322 email file upload support for cryptographic DKIM/SPF checking, "
        "RDAP domain age detection, TOTP multi-factor authentication, and a browser companion extension."
    )

    # ==========================================
    # SLIDE 14: Conclusion & Acknowledgement
    # ==========================================
    s14 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s14)
    add_header(s14, "Conclusion & Acknowledgement")

    add_card(s14, Inches(0.8), Inches(1.7), Inches(5.6), Inches(4.8),
             "Project Summary", [
                 "• Successfully engineered a fully functional, defensive cybersecurity web platform.",
                 "• 15-check explainable heuristic engine delivers transparent threat scores (0–100).",
                 "• Email analyzer flags psychological urgency, credential requests, and OTP theft.",
                 "• 100% database-driven SOC dashboard with real telemetry and user data isolation.",
                 "• Validated through 43 automated tests (35 Vitest + 8 Playwright E2E browser tests).",
                 "• Zero SSRF vulnerabilities, zero arbitrary outbound HTTP fetches, zero malware risk."
             ], C_CYAN, 16, 12)

    add_card(s14, Inches(6.8), Inches(1.7), Inches(5.7), Inches(4.8),
             "Acknowledgement & Questions", [
                 "• Sincere gratitude to our project guide, faculty mentors, and the Department of Computer Science & Engineering for their academic guidance and support.",
                 "• Thanks to the open-source cybersecurity community for maintaining foundational libraries and threat research benchmarks.",
                 "\nThank you for your time and attention!",
                 "\nFloor is now open for Questions & Discussion."
             ], C_GREEN, 16, 13)

    s14.notes_slide.notes_text_frame.text = (
        "In conclusion, PhishGuard AI demonstrates a complete, safe, and explainable approach to phishing detection. "
        "Thank you to our faculty mentors and department for their support. I am now open to any questions."
    )

    output_path = os.path.join(os.getcwd(), "PhishGuard_AI_Presentation.pptx")
    prs.save(output_path)
    print(f"Presentation saved successfully to: {output_path}")

if __name__ == "__main__":
    create_deck()
