import { EMAIL_SCORING_WEIGHTS, getRiskLevel } from '../config/scoringWeights.js';
import { analyzeUrl } from './urlDetector.js';

// Regex patterns for heuristic email detection
const PATTERNS = {
  URGENT_LANGUAGE: [
    /immediate(?:ly)?\s+action\s+required/i,
    /within\s+(?:24|12|48)\s+hours/i,
    /urgent\s+response/i,
    /final\s+notice/i,
    /act\s+now\s+or/i,
    /failure\s+to\s+respond/i,
    /account\s+will\s+be\s+(?:terminated|suspended|closed|deleted)/i,
    /time\s+sensitive/i,
    /respond\s+immediately/i,
  ],
  CREDENTIAL_REQUEST: [
    /(?:send|reply|provide|enter|submit|update)\s+(?:your\s+)?(?:password|passcode|secret\s+key|credentials|master\s+key|login\s+details)/i,
    /verify\s+your\s+password/i,
    /confirm\s+your\s+identity\s+by\s+(?:entering|sending)\s+your/i,
    /fill\s+out\s+(?:this\s+)?form\s+with\s+your\s+(?:login|password)/i,
  ],
  OTP_OR_2FA: [
    /(?:share|send|provide|reply\s+with|enter)\s+(?:the\s+)?(?:otp|one-time\s+passcode|2fa\s+code|verification\s+code|6-digit\s+code)/i,
    /forward\s+(?:the\s+)?security\s+code/i,
    /do\s+not\s+share\s+this\s+code\s+with\s+anyone\s+except\s+us/i,
  ],
  SUSPENSION_THREAT: [
    /account\s+(?:has\s+been|is|will\s+be)\s+(?:locked|restricted|suspended|flagged|disabled|terminated|closed)/i,
    /suspension\s+of\s+your\s+account/i,
    /unauthorized\s+activity/i,
    /security\s+breach/i,
    /unusual\s+sign-in/i,
    /legal\s+action/i,
    /violation\s+of\s+(?:service|terms)/i,
  ],
  FINANCIAL_URGENCY: [
    /urgent\s+(?:wire\s+transfer|payment|invoice|remittance)/i,
    /overdue\s+balance\s+of/i,
    /tax\s+refund\s+(?:ready|pending|available)/i,
    /crypto(?:currency)?\s+wallet\s+compromised/i,
    /payment\s+(?:failed|declined|incomplete)/i,
    /unpaid\s+invoice\s+attached/i,
  ],
  FAKE_PRIZE: [
    /congratulations!?,?\s+(?:you\s+have\s+won|you're\s+a\s+winner)/i,
    /lottery\s+winner/i,
    /claim\s+your\s+(?:gift\s+card|reward|\$|prize|cash|bonus)/i,
    /selected\s+to\s+receive/i,
    /100%\s+free\s+offer/i,
    /guaranteed\s+(?:winner|payout)/i,
  ],
  IMPERSONATION: [
    /from\s+the\s+office\s+of\s+the\s+(?:ceo|cfo|executive|director)/i,
    /confidential\s+project\s+from\s+management/i,
    /(?:microsoft|google|apple|paypal|amazon|bank)\s+(?:security|support|billing)\s+team/i,
    /it\s+helpdesk\s+administrator/i,
    /dear\s+(?:customer|valued\s+client|user|member|account\s+holder),/i,
  ],
  ATTACHMENTS: [
    /(?:open|download|view|execute|check)\s+(?:the\s+)?(?:attached|attachment)\s+(?:file|invoice|document|receipt|form)/i,
    /\.(?:exe|scr|zip|iso|vbs|bat|rar|7z|tar\.gz)\s+file\s+attached/i,
    /see\s+the\s+attached\s+invoice/i,
  ],
};

// URL extraction regex
const URL_REGEX = /https?:\/\/[^\s<>"'{}|\\^`[\]]+/gi;

/**
 * Analyzes email body text for social engineering, credential harvesting, and suspicious patterns.
 */
export function analyzeEmail(emailText) {
  if (!emailText || typeof emailText !== 'string' || emailText.trim().length === 0) {
    throw new Error('Email text is required for analysis');
  }

  const cleanText = emailText.trim();
  const detectedIndicators = [];
  const recommendations = [];
  let score = 0;

  const analysisDetails = {
    wordCount: cleanText.split(/\s+/).length,
    charCount: cleanText.length,
    analyzedAt: new Date().toISOString(),
    extractedLinks: [],
  };

  // 1. Check for Urgent or threatening language
  const urgentMatches = PATTERNS.URGENT_LANGUAGE.filter(regex => regex.test(cleanText));
  if (urgentMatches.length > 0) {
    const impact = EMAIL_SCORING_WEIGHTS.URGENT_DEADLINE;
    score += impact;
    detectedIndicators.push({
      id: 'email-urgent-language',
      category: 'Psychological Coercion',
      severity: 'high',
      title: 'Artificial Urgency and Threatening Deadlines',
      description: 'The email creates psychological panic using short deadlines (e.g. "within 24 hours", "immediate action required").',
      explanation: 'Scammers invent synthetic deadlines to prevent victims from thinking critically or consulting colleagues before taking risky actions.',
      scoreImpact: impact,
    });
    recommendations.push('Slow down. Legitimate organizations provide reasonable timeframes and do not threaten immediate arbitrary cutoffs.');
  }

  // 2. Check for Password / Credential requests
  const credMatches = PATTERNS.CREDENTIAL_REQUEST.filter(regex => regex.test(cleanText));
  if (credMatches.length > 0) {
    const impact = EMAIL_SCORING_WEIGHTS.CREDENTIAL_REQUEST;
    score += impact;
    detectedIndicators.push({
      id: 'email-credential-request',
      category: 'Credential Harvesting',
      severity: 'critical',
      title: 'Direct Request for Passwords or Login Credentials',
      description: 'The email explicitly solicits passwords, master keys, or account credentials.',
      explanation: 'Legitimate service providers will NEVER ask you to disclose or email your password under any circumstance.',
      scoreImpact: impact,
    });
    recommendations.push('CRITICAL: Never send your password or credentials via email or form. No legitimate IT department or bank will ask for it.');
  }

  // 3. Check for OTP / 2FA requests
  const otpMatches = PATTERNS.OTP_OR_2FA.filter(regex => regex.test(cleanText));
  if (otpMatches.length > 0) {
    const impact = EMAIL_SCORING_WEIGHTS.OTP_OR_2FA_REQUEST;
    score += impact;
    detectedIndicators.push({
      id: 'email-otp-request',
      category: 'MFA Bypass Attempt',
      severity: 'critical',
      title: 'Request for One-Time Passcode (OTP) or 2FA Code',
      description: 'The email instructs the recipient to submit or reply with a two-factor verification code.',
      explanation: 'Attackers trigger password resets or transaction alerts on your account and trick you into relaying the 6-digit OTP to bypass Multi-Factor Authentication.',
      scoreImpact: impact,
    });
    recommendations.push('Do NOT share OTP codes with anyone. OTPs are confidential single-use tokens for your eyes only.');
  }

  // 4. Check for Account Suspension threats
  const suspMatches = PATTERNS.SUSPENSION_THREAT.filter(regex => regex.test(cleanText));
  if (suspMatches.length > 0) {
    const impact = EMAIL_SCORING_WEIGHTS.ACCOUNT_SUSPENSION_THREAT;
    score += impact;
    detectedIndicators.push({
      id: 'email-account-suspension',
      category: 'Social Engineering',
      severity: 'high',
      title: 'Account Termination or Security Suspension Threat',
      description: 'The email claims your account has been locked, restricted, or flagged for unauthorized activity.',
      explanation: 'Fear-based phishing manipulates users into clicking recovery links or inputting credentials under the false fear of losing access.',
      scoreImpact: impact,
    });
    recommendations.push('Do not use links in the message. Open your browser independently, navigate to the official website directly, and check your account status.');
  }

  // 5. Check for Financial Urgency / Wire Transfer
  const finMatches = PATTERNS.FINANCIAL_URGENCY.filter(regex => regex.test(cleanText));
  if (finMatches.length > 0) {
    const impact = EMAIL_SCORING_WEIGHTS.FINANCIAL_URGENCY_OR_WIRE;
    score += impact;
    detectedIndicators.push({
      id: 'email-financial-urgency',
      category: 'Financial Fraud',
      severity: 'high',
      title: 'Unsolicited Financial Urgency or Invoice Dispute',
      description: 'The message refers to urgent wire transfers, overdue invoices, or compromised crypto accounts.',
      explanation: 'Business Email Compromise (BEC) and fake invoice scams use financial urgency to bypass corporate purchase approvals and divert funds.',
      scoreImpact: impact,
    });
    recommendations.push('Verify invoices and wire instructions by calling the vendor or finance team using a known, verified phone number.');
  }

  // 6. Check for Fake Prize or Lottery
  const prizeMatches = PATTERNS.FAKE_PRIZE.filter(regex => regex.test(cleanText));
  if (prizeMatches.length > 0) {
    const impact = EMAIL_SCORING_WEIGHTS.FAKE_PRIZE_OR_REWARD;
    score += impact;
    detectedIndicators.push({
      id: 'email-fake-prize',
      category: 'Advance Fee Fraud',
      severity: 'medium',
      title: 'Unrealistic Prize, Reward, or Lottery Winner Lure',
      description: 'The email claims you have won prizes, gift cards, or cash rewards without entering a competition.',
      explanation: 'Greed-based lures entice victims to pay "processing fees" or provide banking info to receive a non-existent windfall.',
      scoreImpact: impact,
    });
    recommendations.push('If an offer sounds too good to be true, it is almost certainly a scam.');
  }

  // 7. Check for Impersonation & Generic Greetings
  const impMatches = PATTERNS.IMPERSONATION.filter(regex => regex.test(cleanText));
  if (impMatches.length > 0) {
    const impact = EMAIL_SCORING_WEIGHTS.EXECUTIVE_OR_SUPPORT_IMPERSONATION;
    score += impact;
    detectedIndicators.push({
      id: 'email-impersonation',
      category: 'Identity Spoofing',
      severity: 'medium',
      title: 'Executive or Generic Organization Impersonation',
      description: 'Contains generic greetings ("Dear Customer") or claims to represent corporate executives/support teams.',
      explanation: 'Spear-phishers impersonate senior leadership to intimidate subordinates into executing unauthorized requests.',
      scoreImpact: impact,
    });
    recommendations.push('Confirm requests with the purported sender via a separate verified channel (e.g., Slack, phone call).');
  }

  // 8. Check for Suspicious Attachment References
  const attachMatches = PATTERNS.ATTACHMENTS.filter(regex => regex.test(cleanText));
  if (attachMatches.length > 0) {
    const impact = EMAIL_SCORING_WEIGHTS.SUSPICIOUS_ATTACHMENT_MENTION;
    score += impact;
    detectedIndicators.push({
      id: 'email-attachment-reference',
      category: 'Malware Delivery',
      severity: 'high',
      title: 'Pressure to Open Attached Files or Archives',
      description: 'The email prompts the recipient to download or execute an attachment.',
      explanation: 'Malicious attachments (such as weaponized Office macros, zip archives, or disguised script files) remain a primary malware infection vector.',
      scoreImpact: impact,
    });
    recommendations.push('Do not download or open email attachments unless you verified the sender and expected the specific file.');
  }

  // 9. Extract and analyze embedded URLs
  const rawUrls = cleanText.match(URL_REGEX) || [];
  const uniqueUrls = [...new Set(rawUrls)];
  analysisDetails.extractedLinks = uniqueUrls;

  if (uniqueUrls.length > 0) {
    let highRiskUrlFound = false;
    for (const urlStr of uniqueUrls.slice(0, 5)) {
      const urlAnalysis = analyzeUrl(urlStr);
      if (urlAnalysis.riskScore >= 60) {
        highRiskUrlFound = true;
      }
    }

    if (highRiskUrlFound) {
      const impact = EMAIL_SCORING_WEIGHTS.SUSPICIOUS_LINKS_CONTAINED;
      score += impact;
      detectedIndicators.push({
        id: 'email-suspicious-links',
        category: 'Malicious Links',
        severity: 'critical',
        title: `Suspicious Embedded URLs Detected (${uniqueUrls.length} links found)`,
        description: 'One or more links inside the email body exhibit deceptive or high-risk characteristics.',
        explanation: 'Phishing emails rely on hyperlinks pointing to fraudulent landing pages crafted to harvest credentials.',
        scoreImpact: impact,
      });
      recommendations.push('Do NOT click the links inside this email. Inspect the destinations independently.');
    } else {
      detectedIndicators.push({
        id: 'email-links-present',
        category: 'Links',
        severity: 'low',
        title: `Embedded Hyperlinks Detected (${uniqueUrls.length} links found)`,
        description: 'The email contains embedded URLs. Heuristic checks show no extreme structural anomalies.',
        explanation: 'Always verify hyperlink destinations by hovering or inspecting before clicking.',
        scoreImpact: 5,
      });
      score += 5;
    }
  }

  // If no indicators were detected
  if (detectedIndicators.length === 0) {
    detectedIndicators.push({
      id: 'email-clean-heuristics',
      category: 'Baseline Heuristics',
      severity: 'info',
      title: 'No Classic Phishing Patterns Detected',
      description: 'The text does not match common social engineering phrases, urgent threats, or credential solicitation patterns.',
      explanation: 'Heuristic evaluation indicates normal conversational or business communication.',
      scoreImpact: 0,
    });
    recommendations.push('The email content does not display overt phishing characteristics.');
    recommendations.push('Note: Sender identity cannot be fully verified from raw pasted text alone. Verify the sender email address in your mail client headers.');
  }

  const risk = getRiskLevel(score);

  return {
    emailSnippet: cleanText.length > 200 ? cleanText.substring(0, 200) + '...' : cleanText,
    riskScore: risk.score,
    riskLevel: risk.level,
    riskLabel: risk.label,
    detectedIndicators,
    recommendations,
    analysisDetails,
    disclaimer: 'Heuristic Analysis Notice: Content analyzed statically for social engineering and phishing patterns. Real sender authenticity (SPF, DKIM, DMARC) requires inspecting full email headers.',
    scannedAt: new Date(),
  };
}
