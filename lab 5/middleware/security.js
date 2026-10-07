const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

/**
 * Apply all OWASP security middleware
 */
const applySecurityMiddleware = (app) => {
  // 1. Helmet: Sets various HTTP security headers
  //    - X-Content-Type-Options: nosniff
  //    - X-Frame-Options: DENY
  //    - Strict-Transport-Security (HSTS)
  //    - X-XSS-Protection
  //    - Content-Security-Policy
  app.use(helmet());

  // 2. CORS: Strict Cross-Origin Resource Sharing policy
  const corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining'],
    maxAge: 86400, // 24 hours
  };
  app.use(cors(corsOptions));

  // 3. NoSQL Injection Sanitization
  //    Removes $ and . from req.body, req.query, req.params
  app.use(mongoSanitize({
    replaceWith: '_',
    onSanitize: ({ req, key }) => {
      console.warn(`[SECURITY] Sanitized ${key} in request from ${req.ip}`);
    },
  }));

  // 4. XSS Protection - sanitize user input
  //    Using a custom middleware since xss-clean is deprecated
  app.use((req, res, next) => {
    const sanitize = (obj) => {
      if (typeof obj === 'string') {
        return obj
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;')
          .replace(/\//g, '&#x2F;');
      }
      if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
          obj[key] = sanitize(obj[key]);
        }
      }
      return obj;
    };

    if (req.body) req.body = sanitize(req.body);
    if (req.query) req.query = sanitize(req.query);
    if (req.params) req.params = sanitize(req.params);
    next();
  });

  // 5. HPP: Prevent HTTP Parameter Pollution
  app.use(hpp());
};

module.exports = { applySecurityMiddleware };
