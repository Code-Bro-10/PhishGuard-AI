import { describe, it, expect } from 'vitest';
import { analyzeUrl, normalizeUrl } from '../services/urlDetector.js';

describe('URL Phishing Detection Engine', () => {
  it('should normalize URLs without protocol properly', () => {
    expect(normalizeUrl('example.com')).toBe('https://example.com');
    expect(normalizeUrl('https://secure.org')).toBe('https://secure.org');
  });

  it('should flag malformed URLs with high risk score', () => {
    const result = analyzeUrl('http://');
    expect(result.riskScore).toBeGreaterThanOrEqual(80);
    expect(result.detectedIndicators.some(i => i.id === 'invalid-format')).toBe(true);
  });

  it('should classify clean legitimate URLs as Low Risk', () => {
    const result = analyzeUrl('https://example.com');
    expect(result.riskLevel).toBe('low');
    expect(result.riskScore).toBeLessThan(30);
    expect(result.detectedIndicators.some(i => i.id === 'clean-heuristic-evaluation')).toBe(true);
  });

  it('should detect raw IP address hostname and flag it', () => {
    const result = analyzeUrl('http://192.168.1.100/login');
    expect(result.riskScore).toBeGreaterThanOrEqual(30);
    expect(result.detectedIndicators.some(i => i.id === 'ip-address-host')).toBe(true);
  });

  it('should detect deceptive "@" symbol in URL', () => {
    const result = analyzeUrl('https://google.com@attacker-site.com/verify');
    expect(result.detectedIndicators.some(i => i.id === 'at-symbol-present')).toBe(true);
    expect(result.riskScore).toBeGreaterThanOrEqual(40);
  });

  it('should detect excessive subdomain nesting', () => {
    const result = analyzeUrl('https://login.verify.account.paypal.service.attacker.com/session');
    expect(result.detectedIndicators.some(i => i.id.startsWith('excessive-subdomains'))).toBe(true);
  });

  it('should detect brand impersonation in subdomain', () => {
    const result = analyzeUrl('https://paypal.com.account-update.xyz/login');
    expect(result.detectedIndicators.some(i => i.id === 'brand-impersonation')).toBe(true);
    expect(result.detectedIndicators.some(i => i.id === 'high-risk-tld')).toBe(true);
    expect(result.riskLevel).toMatch(/high|critical/);
  });

  it('should detect dangerous executable file extensions', () => {
    const result = analyzeUrl('https://storage-portal.com/invoice_update.exe');
    expect(result.detectedIndicators.some(i => i.id === 'dangerous-file-extension')).toBe(true);
  });

  it('should detect Punycode / IDN homograph spoofing', () => {
    const result = analyzeUrl('https://xn--pple-43d.com/signin');
    expect(result.detectedIndicators.some(i => i.id === 'punycode-homograph')).toBe(true);
  });

  it('should detect non-standard network ports', () => {
    const result = analyzeUrl('http://malicious-node.org:8888/cmd');
    expect(result.detectedIndicators.some(i => i.id === 'unusual-port')).toBe(true);
  });

  it('should flag known phishing test samples', () => {
    const result = analyzeUrl('https://testsafebrowsing.appspot.com/s/phishing.html');
    expect(result.detectedIndicators.some(i => i.id === 'known-threat-match')).toBe(true);
  });
});

