/**
 * Configurable scoring weights and thresholds for the URL & Email Phishing Detection Engine.
 * All weights can be adjusted here without modifying detection logic.
 */

export const URL_SCORING_WEIGHTS = {
  // Check 1: Malformed / Invalid URL structure
  INVALID_FORMAT: 90,

  // Check 2: No HTTPS / Insecure HTTP
  NO_HTTPS: 18,

  // Check 3: Raw IP address used as hostname (IPv4 / IPv6)
  IP_ADDRESS_HOST: 35,

  // Check 4: Excessive subdomains
  EXCESSIVE_SUBDOMAINS_MODERATE: 15, // 3 subdomains
  EXCESSIVE_SUBDOMAINS_HIGH: 28,     // 4+ subdomains

  // Check 5: Suspicious URL length
  LENGTH_LONG: 12,       // > 75 characters
  LENGTH_VERY_LONG: 22,  // > 100 characters

  // Check 6: Known URL shorteners
  URL_SHORTENER: 22,

  // Check 7: '@' symbol in URL (HTTP basic authentication phishing trick)
  AT_SYMBOL: 40,

  // Check 8: Excessive hyphens in domain
  HYPHENS_MODERATE: 12, // 2-3 hyphens
  HYPHENS_EXCESSIVE: 22, // 4+ hyphens

  // Check 9: Punycode / Homograph IDN (xn--)
  PUNYCODE_HOMOGRAPH: 32,

  // Check 10: Suspicious security/credential keywords in path or subdomain
  SUSPICIOUS_KEYWORD_SINGLE: 15,
  SUSPICIOUS_KEYWORD_MULTIPLE: 30,

  // Check 11: Suspicious URL encoding / hex obfuscation
  SUSPICIOUS_ENCODING: 20,

  // Check 12: Unusual non-standard ports
  UNUSUAL_PORT: 25,

  // Check 13: High-risk TLDs and brand impersonation in subdomain/domain
  HIGH_RISK_TLD: 20,
  BRAND_IMPERSONATION: 35,

  // Check 14: Executable or dangerous file extensions in path
  DANGEROUS_FILE_EXTENSION: 40,

  // Check 15: Known threat intelligence indicator match
  KNOWN_THREAT_INDICATOR: 50,
};

export const EMAIL_SCORING_WEIGHTS = {
  URGENT_DEADLINE: 22,
  CREDENTIAL_REQUEST: 38,
  OTP_OR_2FA_REQUEST: 35,
  ACCOUNT_SUSPENSION_THREAT: 28,
  FINANCIAL_URGENCY_OR_WIRE: 30,
  FAKE_PRIZE_OR_REWARD: 32,
  EXECUTIVE_OR_SUPPORT_IMPERSONATION: 25,
  SUSPICIOUS_ATTACHMENT_MENTION: 28,
  SUSPICIOUS_LINKS_CONTAINED: 25,
  GENERIC_GREETING_WITH_PRESSURE: 15,
};

export const RISK_THRESHOLDS = {
  LOW: { min: 0, max: 29, label: 'Low Risk', level: 'low', color: '#22C55E' },
  MEDIUM: { min: 30, max: 59, label: 'Medium Risk', level: 'medium', color: '#F59E0B' },
  HIGH: { min: 60, max: 79, label: 'High Risk', level: 'high', color: '#EF4444' },
  CRITICAL: { min: 80, max: 100, label: 'Critical Risk', level: 'critical', color: '#DC2626' },
};

/**
 * Determine risk level and label based on total score.
 * Score is capped at 100 max, 0 min.
 */
export function getRiskLevel(score) {
  const normalizedScore = Math.min(100, Math.max(0, Math.round(score)));
  if (normalizedScore >= 80) return { ...RISK_THRESHOLDS.CRITICAL, score: normalizedScore };
  if (normalizedScore >= 60) return { ...RISK_THRESHOLDS.HIGH, score: normalizedScore };
  if (normalizedScore >= 30) return { ...RISK_THRESHOLDS.MEDIUM, score: normalizedScore };
  return { ...RISK_THRESHOLDS.LOW, score: normalizedScore };
}

