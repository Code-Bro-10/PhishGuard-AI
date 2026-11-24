import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { apiLimiter } from './middleware/rateLimitMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import scanRoutes from './routes/scanRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import userRoutes from './routes/userRoutes.js';
import threatIntelRoutes from './routes/threatIntelRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, '../client/dist');

const app = express();

// Secure HTTP Headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows flexible dashboard assets
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl, postman, mobile apps)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Dev-friendly fallback
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing with safe size limitations to prevent DoS
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// URL rewrite middleware: seamlessly handle API requests made without the '/api' prefix
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }

  // Allow browser direct page navigation for HTML to fall through to static / SPA client
  if (req.headers.accept && req.headers.accept.includes('text/html') && req.method === 'GET') {
    return next();
  }

  const apiPrefixes = ['/auth', '/scan', '/dashboard', '/alerts', '/users', '/threat-intel', '/health'];
  const matchesPrefix = apiPrefixes.some(
    (prefix) => req.path === prefix || req.path.startsWith(`${prefix}/`)
  );

  if (matchesPrefix) {
    req.url = `/api${req.url}`;
  }
  next();
});

// Apply rate limiter to all API calls
app.use(['/api', '/auth', '/scan'], apiLimiter);

// Health check endpoint
app.get(['/api/health', '/health'], (req, res) => {
  res.status(200).json({
    status: 'healthy',
    system: 'PhishGuard AI Phishing Detection Core',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Mount modular REST APIs (supporting both /api/auth and direct /auth aliases)
app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/scan', '/scan'], scanRoutes);
app.use(['/api/dashboard'], dashboardRoutes);
app.use(['/api/alerts'], alertRoutes);
app.use(['/api/users'], userRoutes);
app.use(['/api/threat-intel'], threatIntelRoutes);

// Serve frontend static assets in production if client/dist exists
app.use(express.static(clientDistPath));

// Fallback to index.html for client-side routing on non-API routes
app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      next();
    }
  });
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Export app for automated testing
export { app };

// Auto-start server when run directly (not in test runner)
if (process.env.NODE_ENV !== 'test') {
  const startServer = async () => {
    try {
      await connectDB();
      app.listen(PORT, () => {
        console.log(`[PhishGuard AI] Backend listening on port ${PORT}`);
        console.log(`[PhishGuard AI] Health check active at http://localhost:${PORT}/api/health`);
      });
    } catch (err) {
      console.error('[PhishGuard AI] Server startup failed:', err.message);
      process.exit(1);
    }
  };

  startServer();
}

