import { URL } from 'url';
import { URL_SCORING_WEIGHTS, getRiskLevel } from '../config/scoringWeights.js';

// Recognized URL Shorteners
const SHORTENER_DOMAINS = new Set([
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'is.gd', 'buff.ly',
  'ow.ly', 'rebrand.ly', 'cutt.ly', 'shorturl.at', 'tiny.cc', 'bl.ink',
  'soo.gd', 's.id', 'trib.al', 'qr.ae', 'rb.gy', 'v.gd', 'clck.ru'
]);

// High-Risk / Frequently Abused Phishing TLDs
const HIGH_RISK_TLDS = new Set([
  'tk', 'ml', 'ga', 'cf', 'gq', 'top', 'xyz', 'work', 'click',
  'buzz', 'fit', 'surf', 'rest', 'icu', 'cam', 'quest', 'monster',
  'country', 'stream', 'download', 'racing', 'loan', 'win', 'party'
]);

// High-Value Targeted Brands (used to detect brand impersonation in subdomains/paths)
const TARGET_BRANDS = [
  'paypal', 'microsoft', 'google', 'apple', 'amazon', 'netflix',
  'facebook', 'instagram', 'whatsapp', 'chase', 'wellsfargo', 'bankofamerica',
  'citibank', 'dropbox', 'linkedin', 'twitter', 'adobe', 'dhl', 'fedex',
  'usps', 'binance', 'coinbase', 'metamask', 'outlook', 'office365', 'yahoo'
];

// Phishing Keyword Patterns
const SUSPICIOUS_KEYWORDS = [
  'login', 'log-in', 'signin', 'sign-in', 'verify', 'verification', 'verification-required',
  'secure', 'security', 'update', 'update-info', 'banking', 'bank', 'password', 'passcode',
  'account', 'account-alert', 'wallet', 'confirm', 'confirmation', 'credential',
  'authenticate', 'authentication', 'recover', 'recovery', 'billing', 'invoice',
  'support', 'helpdesk', 'validation', 'validate', 'unlock', 'unusual-activity'
];

// Dangerous Payload Extensions
const DANGEROUS_EXTENSIONS = [
  '.exe', '.scr', '.bat', '.vbs', '.iso', '.zip', '.apk', '.dmg',
  '.sh', '.cmd', '.pif', '.hta', '.jar', '.msi', '.ps1', '.wsf'
];

/**
 * Normalizes input URL string safely without making any outbound requests.
 */
export function normalizeUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  let cleaned = rawUrl.trim();
  // If no scheme present, prepend https:// for analysis while noting original
  if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = 'https://' + cleaned;
  }
  return cleaned;
}

/**
 * Checks if a hostname is an IPv4 or IPv6 address.
 */
function isIpAddress(hostname) {
  // IPv4 regex (standard dotted quad)
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  // IPv6 format (brackets or hex colons)
  const ipv6Regex = /^\[?[a-fA-F0-9:]+\]?$/;
  // Hex or octal IP format (e.g. 0x7f000001 or 017700000001)
  const hexIpRegex = /^0x[0-9a-fA-F]+$/;

  if (ipv4Regex.test(hostname)) return true;
  if (hostname.includes(':') && ipv6Regex.test(hostname)) return true;
  if (hexIpRegex.test(hostname)) return true;
  return false;
}

/**
 * Extracts root domain and registered domain from hostname.
 * e.g., "login.paypal.com.evil.xyz" -> root domain "evil.xyz"
 */
function extractDomainParts(hostname) {
  const parts = hostname.toLowerCase().split('.');
  if (parts.length <= 2) {
    return {
      subdomains: [],
      domain: parts.join('.'),
      tld: parts[parts.length - 1] || '',
    };
  }

  // Handle common 2-level ccTLDs like .co.uk, .com.au, .co.in
  const secondLevelCCTLDs = ['co.uk', 'com.au', 'co.in', 'com.br', 'gov.uk', 'org.uk', 'edu.au'];
  const lastTwo = parts.slice(-2).join('.');
  let rootDomain;
  let subdomains;

  if (secondLevelCCTLDs.includes(lastTwo) && parts.length > 2) {
    rootDomain = parts.slice(-3).join('.');
    subdomains = parts.slice(0, -3);
  } else {
    rootDomain = parts.slice(-2).join('.');
    subdomains = parts.slice(0, -2);
  }

  return {
    subdomains,
    domain: rootDomain,
    tld: parts[parts.length - 1] || '',
  };
}

/**
 * Analyzes a URL across 15 comprehensive security heuristic checks.
 * Completely safe and offline (no network calls, no SSRF, no code execution).
 */
export function analyzeUrl(rawUrl, options = {}) {
  const detectedIndicators = [];
  const recommendations = [];
  let score = 0;
  const analysisDetails = {
    checksPerformed: 15,
    checkedAt: new Date().toISOString(),
  };

  const normalized = normalizeUrl(rawUrl);

  // Check 1: URL format validation
  let parsedUrl;
  try {
    parsedUrl = new URL(normalized);
    if (!parsedUrl.hostname || parsedUrl.hostname.length < 3) {
      throw new Error('Missing or malformed hostname');
    }
  } catch (err) {
    const impact = URL_SCORING_WEIGHTS.INVALID_FORMAT;
    score += impact;
    detectedIndicators.push({
      id: 'invalid-format',
      category: 'Syntax & Structure',
      severity: 'critical',
      title: 'Malformed or Invalid URL Format',
      description: 'The submitted string does not conform to standard RFC 3986 URI format specifications.',
      explanation: 'Malformed URLs frequently attempt to exploit URI parser differentials or obfuscate target payloads.',
      scoreImpact: impact,
    });
    recommendations.push('Do not attempt to load or interact with malformed URLs in any application or browser.');
    const risk = getRiskLevel(score);
    return {
      originalUrl: rawUrl,
      normalizedUrl: normalized,
      riskScore: risk.score,
      riskLevel: risk.level,
      riskLabel: risk.label,
      detectedIndicators,
      recommendations,
      analysisDetails,
      scannedAt: new Date(),
    };
  }

  const hostname = parsedUrl.hostname.toLowerCase();
  const pathname = parsedUrl.pathname.toLowerCase();
  const search = parsedUrl.search.toLowerCase();
  const fullPath = pathname + search;
  const originalLower = rawUrl.toLowerCase();

  analysisDetails.protocol = parsedUrl.protocol;
  analysisDetails.hostname = hostname;
  analysisDetails.pathname = pathname;
  analysisDetails.port = parsedUrl.port || (parsedUrl.protocol === 'https:' ? '443' : '80');

  // Check 2: HTTPS availability & transport security
  if (parsedUrl.protocol === 'http:') {
    const impact = URL_SCORING_WEIGHTS.NO_HTTPS;
    score += impact;
    detectedIndicators.push({
      id: 'insecure-http',
      category: 'Transport Security',
      severity: 'medium',
      title: 'Unencrypted HTTP Protocol',
      description: 'The URL uses unencrypted plain-text HTTP rather than TLS/HTTPS.',
      explanation: 'Unencrypted connections expose credentials and data to man-in-the-middle (MitM) eavesdropping. Note: HTTPS alone does not guarantee a site is safe, but lack of HTTPS on sensitive portals is a major security risk.',
      scoreImpact: impact,
    });
    recommendations.push('Never enter passwords, tokens, or personal information on websites without active HTTPS encryption.');
  } else {
    analysisDetails.httpsEnabled = true;
    // Provide realistic disclaimer that HTTPS does NOT mean safe
    analysisDetails.securityNote = 'HTTPS encrypts data in transit but modern phishing websites frequently use free SSL certificates (e.g., Let\'s Encrypt) to look legitimate.';
  }

  // Check 3: IP address used instead of domain
  if (isIpAddress(hostname)) {
    const impact = URL_SCORING_WEIGHTS.IP_ADDRESS_HOST;
    score += impact;
    detectedIndicators.push({
      id: 'ip-address-host',
      category: 'Host Identity',
      severity: 'high',
      title: 'Direct IP Address Hostname',
      description: `The URL uses a raw numeric/hex IP address (${hostname}) instead of a registered domain name.`,
      explanation: 'Legitimate web services almost always use registered domain names. Attackers use raw IP addresses to bypass domain-based reputation blocklists and avoid DNS registration records.',
      scoreImpact: impact,
    });
    recommendations.push('Exercise extreme caution. Legitimate services do not ask users to authenticate or interact via raw IP addresses.');
  }

  // Domain structure decomposition
  const { subdomains, domain: rootDomain, tld } = extractDomainParts(hostname);
  analysisDetails.rootDomain = rootDomain;
  analysisDetails.subdomains = subdomains;
  analysisDetails.tld = tld;

  // Check 4: Excessive subdomains
  const subdomainCount = subdomains.length;
  if (subdomainCount >= 4) {
    const impact = URL_SCORING_WEIGHTS.EXCESSIVE_SUBDOMAINS_HIGH;
    score += impact;
    detectedIndicators.push({
      id: 'excessive-subdomains-high',
      category: 'Domain Structure',
      severity: 'high',
      title: `Excessive Subdomain Stacking (${subdomainCount} subdomains)`,
      description: `Detected deeply nested subdomain hierarchy: "${subdomains.join('.')}".`,
      explanation: 'Adversaries chain numerous subdomains together to push the actual registered domain out of view on mobile screens or mimic trusted domains (e.g. login.paypal.com.user-verification.attacker.com).',
      scoreImpact: impact,
    });
  } else if (subdomainCount === 3) {
    const impact = URL_SCORING_WEIGHTS.EXCESSIVE_SUBDOMAINS_MODERATE;
    score += impact;
    detectedIndicators.push({
      id: 'excessive-subdomains-moderate',
      category: 'Domain Structure',
      severity: 'medium',
      title: 'Unusually Deep Subdomain Nesting',
      description: `URL contains ${subdomainCount} subdomains preceding the root domain.`,
      explanation: 'Deep subdomain structures are commonly leveraged in phishing campaigns to emulate legitimate service portals.',
      scoreImpact: impact,
    });
  }

  // Check 5: Suspicious URL length
  const urlLength = rawUrl.length;
  analysisDetails.length = urlLength;
  if (urlLength > 100) {
    const impact = URL_SCORING_WEIGHTS.LENGTH_VERY_LONG;
    score += impact;
    detectedIndicators.push({
      id: 'suspicious-length-extreme',
      category: 'URL Characteristics',
      severity: 'medium',
      title: `Excessive URL Length (${urlLength} characters)`,
      description: 'The URL is unusually long, containing over 100 characters.',
      explanation: 'Attackers create long, convoluted URLs to hide malicious domain identifiers or embed suspicious tracking parameters.',
      scoreImpact: impact,
    });
  } else if (urlLength > 75) {
    const impact = URL_SCORING_WEIGHTS.LENGTH_LONG;
    score += impact;
    detectedIndicators.push({
      id: 'suspicious-length-long',
      category: 'URL Characteristics',
      severity: 'low',
      title: `Elevated URL Length (${urlLength} characters)`,
      description: 'The URL length exceeds 75 characters.',
      explanation: 'Extended URLs can be used to obfuscate destinations or payload vectors.',
      scoreImpact: impact,
    });
  }

  // Check 6: Use of URL shorteners
  if (SHORTENER_DOMAINS.has(hostname) || SHORTENER_DOMAINS.has(rootDomain)) {
    const impact = URL_SCORING_WEIGHTS.URL_SHORTENER;
    score += impact;
    detectedIndicators.push({
      id: 'url-shortener',
      category: 'Obfuscation',
      severity: 'medium',
      title: `Known URL Shortening Service (${rootDomain || hostname})`,
      description: 'The link utilizes a public URL shortening service that masks the real destination.',
      explanation: 'While URL shorteners have legitimate uses, phishers frequently weaponize them in SMS and emails to bypass security filters and hide dangerous destination domains.',
      scoreImpact: impact,
    });
    recommendations.push('Do not click shortened links without first inspecting the expanded destination URL.');
  }

  // Check 7: Presence of '@' symbol
  if (rawUrl.includes('@')) {
    const impact = URL_SCORING_WEIGHTS.AT_SYMBOL;
    score += impact;
    detectedIndicators.push({
      id: 'at-symbol-present',
      category: 'Deceptive Techniques',
      severity: 'critical',
      title: 'Deceptive Userinfo "@" Character Present',
      description: 'The URL includes an "@" symbol in the authority component.',
      explanation: 'RFC standards specify that anything before the "@" symbol is interpreted as HTTP Basic Authentication userinfo and discarded by the browser when connecting. Attackers prepend trusted domain names (e.g., https://google.com@malicious-host.com) to deceive users.',
      scoreImpact: impact,
    });
    recommendations.push('CRITICAL: This link is attempting to visually mislead you about which domain it connects to. Do not visit.');
  }

  // Check 8: Suspicious use of hyphens in domain
  const hyphenMatches = (hostname.match(/-/g) || []).length;
  if (hyphenMatches >= 4) {
    const impact = URL_SCORING_WEIGHTS.HYPHENS_EXCESSIVE;
    score += impact;
    detectedIndicators.push({
      id: 'hyphens-excessive',
      category: 'Domain Structure',
      severity: 'high',
      title: `Excessive Hyphens in Hostname (${hyphenMatches} hyphens)`,
      description: `Hostname contains ${hyphenMatches} hyphens, indicating typosquatting or combo-squatting.`,
      explanation: 'Hyphen-heavy domains (e.g. secure-account-update-login-service.com) are widely deployed in phishing to simulate authentic corporate portals.',
      scoreImpact: impact,
    });
  } else if (hyphenMatches >= 2) {
    const impact = URL_SCORING_WEIGHTS.HYPHENS_MODERATE;
    score += impact;
    detectedIndicators.push({
      id: 'hyphens-moderate',
      category: 'Domain Structure',
      severity: 'low',
      title: 'Multiple Hyphens in Hostname',
      description: `Hostname contains ${hyphenMatches} hyphens.`,
      explanation: 'Multiple hyphens are commonly observed in deceptive domain registrations.',
      scoreImpact: impact,
    });
  }

  // Check 9: Punycode & Internationalized Domain (IDN) homograph attack
  if (hostname.includes('xn--') || /[\u0080-\uffff]/.test(hostname)) {
    const impact = URL_SCORING_WEIGHTS.PUNYCODE_HOMOGRAPH;
    score += impact;
    detectedIndicators.push({
      id: 'punycode-homograph',
      category: 'Spoofing & Homoglyphs',
      severity: 'critical',
      title: 'Punycode / IDN Homograph Obfuscation Detected',
      description: `The hostname uses Punycode ("xn--") or Unicode characters: ${hostname}.`,
      explanation: 'IDN homograph attacks replace Latin characters with identical-looking Cyrillic, Greek, or Unicode glyphs (e.g., Cyrillic "а" instead of Latin "a") to construct indistinguishable spoofed brand domains.',
      scoreImpact: impact,
    });
    recommendations.push('Do not proceed. The domain is likely a visual clone designed to harvest credentials.');
  }

  // Check 10: Suspicious security & credential keywords
  const matchedKeywords = SUSPICIOUS_KEYWORDS.filter(kw => {
    // Check in subdomains, path, query, and hostname
    const regex = new RegExp(`(^|[-_./?=&])${kw}([-_./?=&]|$)`, 'i');
    return regex.test(hostname) || regex.test(fullPath);
  });

  if (matchedKeywords.length >= 2) {
    const impact = URL_SCORING_WEIGHTS.SUSPICIOUS_KEYWORD_MULTIPLE;
    score += impact;
    detectedIndicators.push({
      id: 'suspicious-keywords-multiple',
      category: 'Keyword Heuristics',
      severity: 'high',
      title: `Multiple Authentication/Security Keywords (${matchedKeywords.slice(0, 4).join(', ')})`,
      description: `The URL contains multiple high-risk credential keywords: ${matchedKeywords.join(', ')}.`,
      explanation: 'Phishing URLs frequently stack keywords such as "login", "verify", "secure", and "account" to instill false trust or emulate credential portals.',
      scoreImpact: impact,
    });
  } else if (matchedKeywords.length === 1) {
    const impact = URL_SCORING_WEIGHTS.SUSPICIOUS_KEYWORD_SINGLE;
    score += impact;
    detectedIndicators.push({
      id: 'suspicious-keywords-single',
      category: 'Keyword Heuristics',
      severity: 'medium',
      title: `Sensitive Action Keyword ("${matchedKeywords[0]}")`,
      description: `URL contains the keyword "${matchedKeywords[0]}".`,
      explanation: 'Authentication and verification keywords are prominent indicators when combined with unknown or suspicious hosting domains.',
      scoreImpact: impact,
    });
  }

  // Check 11: Suspicious URL encoding
  const percentCount = (rawUrl.match(/%/g) || []).length;
  const doubleEncoded = /%25[0-9a-fA-F]{2}/.test(rawUrl);
  if (doubleEncoded || percentCount >= 4) {
    const impact = URL_SCORING_WEIGHTS.SUSPICIOUS_ENCODING;
    score += impact;
    detectedIndicators.push({
      id: 'suspicious-encoding',
      category: 'Obfuscation',
      severity: 'medium',
      title: 'Suspicious URL Hex Encoding / Obfuscation',
      description: doubleEncoded
        ? 'URL contains double-percent encoding (%25xx), a signature evasion technique.'
        : `URL contains heavy hex/percent encoding (${percentCount} occurrences).`,
      explanation: 'Attackers utilize percent-encoding and double-encoding to bypass simple signature-based firewalls and conceal strings from human inspection.',
      scoreImpact: impact,
    });
  }

  // Check 12: Unusual non-standard ports
  const port = parsedUrl.port;
  if (port && port !== '80' && port !== '443' && port !== '8080' && port !== '8443') {
    const impact = URL_SCORING_WEIGHTS.UNUSUAL_PORT;
    score += impact;
    detectedIndicators.push({
      id: 'unusual-port',
      category: 'Network Protocol',
      severity: 'high',
      title: `Non-Standard Network Port Specified (Port ${port})`,
      description: `The URL explicitly connects to TCP port ${port} instead of standard web ports (80/443).`,
      explanation: 'Non-standard ports are frequently used for command-and-control (C2) servers, administrative backdoors, or evasive phishing kits hosted on compromised residential infrastructure.',
      scoreImpact: impact,
    });
    recommendations.push('Legitimate corporate authentication gateways do not run on arbitrary high-numbered ports.');
  }

  // Check 13: Domain structure analysis - High-risk TLDs and Brand Impersonation
  if (HIGH_RISK_TLDS.has(tld)) {
    const impact = URL_SCORING_WEIGHTS.HIGH_RISK_TLD;
    score += impact;
    detectedIndicators.push({
      id: 'high-risk-tld',
      category: 'Domain Reputation',
      severity: 'medium',
      title: `High-Risk Top-Level Domain (.${tld})`,
      description: `The domain uses a TLD (.${tld}) statistically correlated with high volumes of spam and phishing.`,
      explanation: 'Certain free or low-cost TLDs (such as .tk, .top, .xyz, .cf, .work) are disproportionately abused by cybercriminals due to lenient registration requirements.',
      scoreImpact: impact,
    });
  }

  // Brand Impersonation (brand appears in subdomain or path when rootDomain is NOT the official brand domain)
  const impersonatedBrand = TARGET_BRANDS.find(brand => {
    const hasBrandInSubdomain = subdomains.some(sub => sub.includes(brand));
    const hasBrandInPath = fullPath.includes(brand);
    const rootMatchesBrand = rootDomain.startsWith(brand + '.') || rootDomain === `${brand}.com` || rootDomain === `${brand}.net`;
    return (hasBrandInSubdomain || hasBrandInPath) && !rootMatchesBrand;
  });

  if (impersonatedBrand) {
    const impact = URL_SCORING_WEIGHTS.BRAND_IMPERSONATION;
    score += impact;
    detectedIndicators.push({
      id: 'brand-impersonation',
      category: 'Brand Protection',
      severity: 'critical',
      title: `Brand Impersonation Detected (${impersonatedBrand.toUpperCase()})`,
      description: `The URL references well-known brand "${impersonatedBrand}", but the actual registered domain is "${rootDomain}".`,
      explanation: `Attackers place brand names inside subdomains (e.g., "${impersonatedBrand}.security-login.${rootDomain}") so unwary users believe they are interacting with the official company.`,
      scoreImpact: impact,
    });
    recommendations.push(`Always verify the address bar domain. This site is hosted on "${rootDomain}", NOT on official ${impersonatedBrand} infrastructure.`);
  }

  // Check 14: Suspicious file extensions in URL paths
  const matchedExt = DANGEROUS_EXTENSIONS.find(ext => pathname.endsWith(ext) || pathname.includes(`${ext}/`));
  if (matchedExt) {
    const impact = URL_SCORING_WEIGHTS.DANGEROUS_FILE_EXTENSION;
    score += impact;
    detectedIndicators.push({
      id: 'dangerous-file-extension',
      category: 'Payload Delivery',
      severity: 'critical',
      title: `Suspicious Executable/Archive Extension ("${matchedExt}")`,
      description: `The URL directly references a potentially dangerous executable or archive file (${matchedExt}).`,
      explanation: 'Phishing links often attempt drive-by downloads or payload drops disguised as invoices, receipts, or security software updates.',
      scoreImpact: impact,
    });
    recommendations.push('DO NOT download, open, or execute files directly from untrusted or unverified links.');
  }

  // Check 15: Known phishing feed / mock threat intelligence indicator
  // Safe test fixtures or flagged domains
  const KNOWN_PHISH_SAMPLES = [
    'testsafebrowsing.appspot.com',
    'phishing-test.org',
    'evil-login.example.com',
    'malware-test.com',
    'account-security-alert.xyz'
  ];

  if (KNOWN_PHISH_SAMPLES.some(sample => hostname === sample || hostname.endsWith(`.${sample}`))) {
    const impact = URL_SCORING_WEIGHTS.KNOWN_THREAT_INDICATOR;
    score += impact;
    detectedIndicators.push({
      id: 'known-threat-match',
      category: 'Threat Intelligence',
      severity: 'critical',
      title: 'Known Malicious Threat Signature Match',
      description: `The domain matches a known threat indicator or cybersecurity test fixture pattern (${hostname}).`,
      explanation: 'This domain or pattern has been cataloged in threat databases as an active threat simulation or documented malicious infrastructure.',
      scoreImpact: impact,
    });
    recommendations.push('Immediate block recommended. Domain is listed in threat intelligence repositories.');
  }

  // If no indicators were detected, provide positive clean indicator
  if (detectedIndicators.length === 0) {
    detectedIndicators.push({
      id: 'clean-heuristic-evaluation',
      category: 'Heuristic Baseline',
      severity: 'info',
      title: 'No Anomalous Characteristics Detected',
      description: 'Standard domain syntax, valid HTTPS protocol, normal subdomain depth, and absence of deceptive keywords.',
      explanation: 'The URL passed all 15 static heuristic checks. Note: Heuristics evaluate structure and indicators; always remain vigilant when entering personal credentials.',
      scoreImpact: 0,
    });
    recommendations.push('The URL exhibits standard legitimate structural characteristics.');
    recommendations.push('Always confirm the domain name in the address bar matches the intended service.');
  } else {
    // General defense recommendations
    if (!recommendations.some(r => r.includes('MFA') || r.includes('Two-factor'))) {
      recommendations.push('Enable Multi-Factor Authentication (MFA) across your accounts to mitigate password exposure.');
    }
    if (!recommendations.some(r => r.includes('Verify with the sender'))) {
      recommendations.push('If this link was received via email or message, verify the authenticity through an independent channel.');
    }
  }

  const risk = getRiskLevel(score);

  return {
    originalUrl: rawUrl,
    normalizedUrl: normalized,
    riskScore: risk.score,
    riskLevel: risk.level,
    riskLabel: risk.label,
    detectedIndicators,
    recommendations,
    analysisDetails,
    scannedAt: new Date(),
  };
}

