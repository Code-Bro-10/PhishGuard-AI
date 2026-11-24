import { describe, it, expect } from 'vitest';
import { analyzeEmail } from '../services/emailDetector.js';

describe('Email Phishing Analyzer', () => {
  it('should throw an error for empty or invalid email input', () => {
    expect(() => analyzeEmail('')).toThrow();
    expect(() => analyzeEmail(null)).toThrow();
  });

  it('should evaluate a clean benign email as Low Risk', () => {
    const benignText = `
      Hi Team,
      Please find the project status notes attached for our weekly sprint review on Thursday at 2 PM.
      Looking forward to discussing the quarterly milestones.
      Best regards,
      Alex
    `;
    const result = analyzeEmail(benignText);
    expect(result.riskLevel).toBe('low');
    expect(result.riskScore).toBeLessThan(30);
    expect(result.detectedIndicators.some(i => i.id === 'email-clean-heuristics')).toBe(true);
  });

  it('should detect credential requests and artificial urgency', () => {
    const phishingEmail = `
      URGENT: Immediate action required!
      Your account will be suspended within 24 hours due to unauthorized activity.
      Please verify your password immediately by replying with your login details.
    `;
    const result = analyzeEmail(phishingEmail);
    expect(result.riskScore).toBeGreaterThanOrEqual(60);
    expect(result.riskLevel).toMatch(/high|critical/);
    expect(result.detectedIndicators.some(i => i.id === 'email-urgent-language')).toBe(true);
    expect(result.detectedIndicators.some(i => i.id === 'email-credential-request')).toBe(true);
    expect(result.detectedIndicators.some(i => i.id === 'email-account-suspension')).toBe(true);
  });

  it('should detect OTP/2FA theft attempts', () => {
    const otpScam = `
      Dear Customer,
      We noticed an unusual sign-in attempt. Please share the 6-digit code sent to your phone to verify your identity.
    `;
    const result = analyzeEmail(otpScam);
    expect(result.detectedIndicators.some(i => i.id === 'email-otp-request')).toBe(true);
  });

  it('should detect lottery/prize scams and financial urgency', () => {
    const lotteryScam = `
      Congratulations! You have won $1,000,000 in our international lottery!
      Claim your cash prize now. Urgent wire transfer pending your confirmation.
    `;
    const result = analyzeEmail(lotteryScam);
    expect(result.detectedIndicators.some(i => i.id === 'email-fake-prize')).toBe(true);
    expect(result.detectedIndicators.some(i => i.id === 'email-financial-urgency')).toBe(true);
  });

  it('should analyze suspicious links embedded inside email content', () => {
    const emailWithBadLink = `
      Your Netflix subscription has expired.
      Renew immediately: http://192.168.1.100/login-verify-account
    `;
    const result = analyzeEmail(emailWithBadLink);
    expect(result.analysisDetails.extractedLinks.length).toBeGreaterThan(0);
    expect(result.detectedIndicators.some(i => i.id === 'email-suspicious-links')).toBe(true);
  });
});

