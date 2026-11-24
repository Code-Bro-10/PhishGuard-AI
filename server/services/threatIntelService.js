/**
 * Threat Intelligence Integration Service.
 * Supports Google Safe Browsing API v4 when an API key is provided.
 * Gracefully reports provider status when no key is configured.
 * Never executes outbound requests to arbitrary user URLs; only queries the reputation API endpoint.
 */

export class ThreatIntelService {
  constructor() {
    this.googleApiKey = process.env.GOOGLE_SAFE_BROWSING_KEY?.trim() || null;
  }

  /**
   * Returns current operational status of threat intelligence providers.
   */
  getStatus() {
    return {
      googleSafeBrowsing: {
        configured: Boolean(this.googleApiKey),
        provider: 'Google Safe Browsing v4 (Lookup API)',
        status: this.googleApiKey ? 'Active & Ready' : 'Standby (No API key provided - heuristic engine active)',
      },
      heuristicEngine: {
        configured: true,
        provider: 'PhishGuard Deep Heuristic Rule Engine',
        status: 'Active (15 Static Heuristic Checks)',
      },
      supportedThreatTypes: [
        'MALWARE',
        'SOCIAL_ENGINEERING (Phishing)',
        'UNWANTED_SOFTWARE',
        'POTENTIALLY_HARMFUL_APPLICATION',
      ],
    };
  }

  /**
   * Queries external threat reputation API if configured.
   * If not configured, cleanly reports that external lookup was skipped.
   */
  async checkUrl(url) {
    if (!this.googleApiKey) {
      return {
        provider: 'Google Safe Browsing',
        executed: false,
        reason: 'No API key configured in server environment. Local heuristics operated independently.',
        isThreat: false,
        threatTypes: [],
        details: 'Configure GOOGLE_SAFE_BROWSING_KEY in server/.env to enable live Google threat database verification.',
      };
    }

    try {
      const endpoint = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${this.googleApiKey}`;
      const payload = {
        client: {
          clientId: 'phishguard-ai',
          clientVersion: '1.0.0',
        },
        threatInfo: {
          threatTypes: [
            'MALWARE',
            'SOCIAL_ENGINEERING',
            'UNWANTED_SOFTWARE',
            'POTENTIALLY_HARMFUL_APPLICATION',
          ],
          platformTypes: ['ANY_PLATFORM'],
          threatEntryTypes: ['URL'],
          threatEntries: [{ url }],
        },
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        return {
          provider: 'Google Safe Browsing',
          executed: false,
          reason: `API responded with status code ${response.status}`,
          isThreat: false,
          threatTypes: [],
          details: 'Google Safe Browsing service was temporarily unreachable or key was invalid.',
        };
      }

      const data = await response.json();
      const matches = data.matches || [];

      return {
        provider: 'Google Safe Browsing',
        executed: true,
        isThreat: matches.length > 0,
        threatTypes: matches.map(m => m.threatType),
        matches,
        details: matches.length > 0
          ? `Confirmed threat detected in Google Safe Browsing database: ${matches.map(m => m.threatType).join(', ')}`
          : 'Domain is clean in Google Safe Browsing reputation index.',
      };
    } catch (error) {
      console.warn('[ThreatIntel] External API lookup failed:', error.message);
      return {
        provider: 'Google Safe Browsing',
        executed: false,
        reason: error.message,
        isThreat: false,
        threatTypes: [],
        details: 'Gracefully fell back to local heuristic analysis engine.',
      };
    }
  }
}

export const threatIntelService = new ThreatIntelService();

