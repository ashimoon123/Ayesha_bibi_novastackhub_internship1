require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const path = require('path');

// Internal modules
const connectDB = require('./config/db');
const configurePassport = require('./config/passport');
const { applySecurityMiddleware } = require('./middleware/security');
const { apiLimiter } = require('./config/rateLimiter');

// Route imports
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employee');
const payrollRoutes = require('./routes/payroll');
const userRoutes = require('./routes/users');

const app = express();

// ─── Connect to MongoDB ───────────────────────────
connectDB();

// ─── Core Middleware ──────────────────────────────
app.use(express.json({ limit: '10kb' })); // Body limit to prevent large payload attacks
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// ─── OWASP Security Middleware ────────────────────
applySecurityMiddleware(app);

// ─── Passport Initialization ──────────────────────
configurePassport();
app.use(passport.initialize());

// ─── Global Rate Limiting ─────────────────────────
app.use('/api/', apiLimiter);

// ─── Serve Static Files ───────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ─── API Routes ───────────────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/employee', employeeRoutes);
app.use('/api/v1/payroll', payrollRoutes);
app.use('/api/v1/users', userRoutes);

// ─── Health Check ─────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Enterprise Security Gateway is running.',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ─── Root Route ───────────────────────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── 404 Handler ──────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found.`,
  });
});

// ─── Global Error Handler ─────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'Internal server error.'
      : err.message,
  });
});

// ─── Start Server ─────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n╔════════════════════════════════════════════════════════════╗`);
  console.log(`║  Enterprise Security Gateway running on port ${PORT}          ║`);
  console.log(`║  Environment: ${(process.env.NODE_ENV || 'development').padEnd(43)}║`);
  console.log(`╚════════════════════════════════════════════════════════════╝\n`);
});

module.exports = app;
