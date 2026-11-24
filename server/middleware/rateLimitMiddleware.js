import rateLimit from 'express-rate-limit';

// Standard rate limiter for all API routes
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: {
    success: false,
    message: 'Too many requests from this IP address. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiter for authentication routes (login / register)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes to protect against brute-force attacks.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for scan endpoints to avoid denial-of-service
export const scanLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: {
    success: false,
    message: 'Scan frequency limit exceeded. Please wait a few minutes before submitting additional scans.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
