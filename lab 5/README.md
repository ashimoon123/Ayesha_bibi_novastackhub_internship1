# Enterprise Multi-Tenant Security Gateway

[![Node.js Version](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express-4.21.0-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%208.7-47A248?logo=mongodb&logoColor=white)](https://mongoosejs.com/)
[![OAuth 2.0](https://img.shields.io/badge/OAuth%202.0-Google%20%7C%20GitHub-4285F4?logo=google&logoColor=white)](https://passportjs.org/)
[![Security](https://img.shields.io/badge/OWASP-Top%2010%20Hardened-critical?logo=owasp&logoColor=white)](https://owasp.org/)
[![Deployment](https://img.shields.io/badge/Deployment-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **CSC337 Web Programming & Security — Lab Assignment 05**  
> A production-grade, enterprise-scale security gateway architected with hybrid identity federation, dual-token lifecycle management, cryptographic Refresh Token Rotation (RTR), granular Role-Based Access Control (RBAC), and comprehensive OWASP Top 10 defenses.

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Features](#features)
4. [Tech Stack](#tech-stack)
5. [Project Structure](#project-structure)
6. [Getting Started](#getting-started)
7. [Environment Variables](#environment-variables)
8. [API Endpoints](#api-endpoints)
9. [Test Credentials](#test-credentials)
10. [Security Features](#security-features)
11. [RBAC Access Matrix](#rbac-access-matrix)
12. [Deployment](#deployment)
13. [Postman Testing Guide](#postman-testing-guide)
14. [Live Demo](#live-demo)
15. [Author](#author)
16. [License](#license)

---

## Overview

Modern cloud platforms demand unified, defense-in-depth authentication and authorization controls to safeguard multi-tenant data against credential theft, privilege escalation, session hijacking, and brute-force intrusion.

The **Enterprise Multi-Tenant Security Gateway** is an enterprise-hardened backend service built on Node.js and Express. It serves as a secure proxy and gatekeeper between client applications and downstream microservices. The gateway unifies standard credential authentication (salted Bcrypt) with OAuth 2.0 social federation (Google & GitHub), isolates tokens via a dual-token architecture (short-lived JWT access tokens and secure httpOnly refresh tokens), enforces automatic refresh token family rotation with reuse detection, and guarantees strict separation of roles (`SuperAdmin`, `Manager`, `Employee`).

All incoming traffic is processed through an automated OWASP defense pipeline that mitigates NoSQL injection, cross-site scripting (XSS), parameter pollution, request flooding, and header vulnerabilities.

---

## Architecture

The gateway is built on a modular middleware pipeline where every HTTP transaction is authenticated, sanitized, rate-checked, and authorized before touching business logic:

```
┌────────────────┐
│     Client     │ (Web App / Mobile App / Postman)
└───────┬────────┘
        │ HTTP Request (Bearer JWT / httpOnly Cookie / Body)
        ▼
┌────────────────┐
│ Express Server │ (Body Parser 10kb limit, Cookie Parser, Static Files)
└───────┬────────┘
        │
        ▼
┌────────────────────────────────────────────────────────┐
│               OWASP Security Middleware                │
│  • Helmet (Secure HTTP Headers)                        │
│  • CORS (Strict Origin Whitelisting)                   │
│  • Express Rate Limit (API & Auth Limiters)            │
│  • Mongo Sanitize (NoSQL Injection Defense)            │
│  • Custom XSS Sanitizer (Entity Escaping)              │
│  • HPP (HTTP Parameter Pollution Prevention)           │
└───────┬────────────────────────────────────────────────┘
        │
        ▼
┌────────────────────────────────────────────────────────┐
│             Authentication Middleware                  │
│  • Verify JWT Signature & Expiration (15m window)      │
│  • Extract Claims: id, email, role                     │
│  • Check User Lockout & Active Status in DB            │
└───────┬────────────────────────────────────────────────┘
        │
        ▼
┌────────────────────────────────────────────────────────┐
│            RBAC Middleware (checkRole)                 │
│  • Match User Role against Route Permissions           │
│  • Reject Unauthorized Calls with 403 Forbidden        │
└───────┬────────────────────────────────────────────────┘
        │
        ▼
┌────────────────────────────────────────────────────────┐
│            Domain Controllers / Handlers               │
│  • authController       • employeeController           │
│  • payrollController    • userController               │
└───────┬────────────────────────────────────────────────┘
        │
        ▼
┌────────────────────────────────────────────────────────┐
│                    MongoDB Atlas                       │
│  • Users Collection (Salted Passwords, Lock Timers)    │
│  • RefreshTokens Collection (Family IDs, TTL Indices)  │
└────────────────────────────────────────────────────────┘
```

---

## Features

- **Hybrid Authentication**:
  - Local credentials with Bcrypt password hashing (12 work factor salt rounds).
  - Social single sign-on (SSO) with Google OAuth 2.0 and GitHub OAuth 2.0 via Passport.js.
- **Dual-Token Lifecycle**:
  - Ephemeral JWT Access Tokens (15-minute lifespan) transmitted via `Authorization: Bearer <token>` headers.
  - Persistent Refresh Tokens (7-day lifespan) stored inside secure, hardened `httpOnly`, `SameSite=Strict`, `path=/api/v1/auth` cookies.
- **Refresh Token Rotation (RTR) & Reuse Detection**:
  - Cryptographically isolated token families tracked using `uuidv4`.
  - Automatic detection of revoked token reuse. When an expired or replay token is presented, the system revokes the entire token family immediately, mitigating token hijacking attacks.
- **Brute-Force Protection & Account Lockout**:
  - Progressive counter tracks consecutive failed attempts per account.
  - Exceeding **5 failed attempts** locks the target account automatically for **15 minutes**.
  - Lockout resets upon successful authentication or timeout expiry.
- **Role-Based Access Control (RBAC)**:
  - Three distinct tenant roles: `SuperAdmin`, `Manager`, and `Employee`.
  - Reusable role-guard middleware (`checkRole(['...'])`) preventing horizontal and vertical privilege escalation.
- **Multi-Tier Rate Limiting**:
  - General API Limiter: 100 requests per 15-minute window per IP.
  - Strict Auth Limiter: 5 requests per 15-minute window per IP for registration and login routes.
- **OWASP Top 10 Hardening**:
  - **Helmet**: Injects HTTP security headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Strict-Transport-Security`, `Content-Security-Policy`).
  - **CORS**: Enforces origin whitelisting against `CLIENT_URL` with credential support.
  - **express-mongo-sanitize**: Strips malicious MongoDB operator characters (`$` and `.`) from request bodies, queries, and params.
  - **Custom XSS Protection**: Recursively escapes HTML entities (`&`, `<`, `>`, `"`, `'`, `/`) across all incoming request payloads.
  - **HPP**: Protects against HTTP Parameter Pollution attacks.
  - **Payload Size Control**: Constrains request JSON and URL-encoded bodies to `10kb` to thwart denial-of-service payload attacks.
- **Database Optimization**:
  - Mongoose ODM with TTL (Time-To-Live) index on refresh tokens for automatic database pruning.
  - Automated seeding script with pre-configured accounts across all three security roles.
- **Cloud-Ready Serverless Deployment**:
  - Configured with `vercel.json` for deployment on Vercel Serverless Functions.

---

## Tech Stack

| Technology / Library | Version | Category | Purpose |
|----------------------|---------|----------|---------|
| **Node.js** | `>= 18.0.0` | Runtime | Server runtime environment |
| **Express** | `^4.21.0` | Framework | Web application and routing framework |
| **Mongoose** | `^8.7.0` | ODM | MongoDB object modeling and schema validation |
| **bcryptjs** | `^2.4.3` | Cryptography | Password hashing with configurable salt work factor (12) |
| **jsonwebtoken** | `^9.0.2` | Authentication | Cryptographic JWT signing and verification |
| **passport** | `^0.7.0` | Authentication | Authentication middleware framework |
| **passport-google-oauth20** | `^2.0.0` | OAuth 2.0 | Google federated authentication strategy |
| **passport-github2** | `^0.1.12` | OAuth 2.0 | GitHub federated authentication strategy |
| **helmet** | `^7.1.0` | Security | Hardened HTTP response security headers |
| **cors** | `^2.8.5` | Security | Cross-Origin Resource Sharing control |
| **express-rate-limit** | `^7.4.0` | Security | IP-based request throttling and brute-force mitigation |
| **express-mongo-sanitize** | `^2.2.0` | Security | NoSQL injection prevention |
| **hpp** | `^0.2.3` | Security | HTTP Parameter Pollution prevention |
| **cookie-parser** | `^1.4.6` | Utility | HTTP cookie parsing for `httpOnly` refresh tokens |
| **uuid** | `^10.0.0` | Cryptography | Universally unique identifiers for token family grouping |
| **dotenv** | `^16.4.5` | Utility | Environment variable configuration loader |
| **nodemon** | `^3.1.4` | Dev Tool | Development server hot-reloading |

---

## Project Structure

```
lab 5/
├── server.js
├── config/
│   ├── db.js
│   ├── passport.js
│   └── rateLimiter.js
├── controllers/
│   ├── authController.js
│   ├── employeeController.js
│   ├── payrollController.js
│   └── userController.js
├── middleware/
│   ├── auth.js
│   ├── rbac.js
│   └── security.js
├── models/
│   ├── User.js
│   └── RefreshToken.js
├── routes/
│   ├── auth.js
│   ├── employee.js
│   ├── payroll.js
│   └── users.js
├── utils/
│   ├── tokenUtils.js
│   └── seedUsers.js
├── public/
│   └── index.html
├── .env.example
├── .gitignore
├── vercel.json
└── package.json
```

---

## Getting Started

### Prerequisites

Ensure the following tools are installed and operational on your machine:
- **Node.js**: v18.0.0 or later ([Download Node.js](https://nodejs.org/))
- **npm**: v9.0.0 or later (bundled with Node.js)
- **MongoDB**: A running local MongoDB instance or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster connection URI.
- **Git**: For version control.

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/ashimoon123/Ayesha_bibi_novastackhub_internship1.git
cd "Ayesha_bibi_novastackhub_internship1/lab 5"
```

---

### Step 2: Install Dependencies

```bash
npm install
```

---

### Step 3: Configure Environment Variables

Create a local `.env` configuration file by copying `.env.example`:

```bash
cp .env.example .env
```

Open `.env` in your text editor and supply your MongoDB URI and secure JWT secrets (at least 32 characters long).

---

### Step 4: Seed the Database

Populate MongoDB with default accounts for `SuperAdmin`, `Manager`, and `Employee`:

```bash
npm run seed
```

Expected output:
```text
Connected to MongoDB for seeding...
Cleared existing users.
Created SuperAdmin: superadmin@enterprise.com
Created Manager: manager@enterprise.com
Created Employee: employee@enterprise.com

Seeding complete! Test credentials:
──────────────────────────────────────
SuperAdmin   | superadmin@enterprise.com      | SuperAdmin@123
Manager      | manager@enterprise.com         | Manager@123
Employee     | employee@enterprise.com        | Employee@123
──────────────────────────────────────

Disconnected from MongoDB.
```

---

### Step 5: Run the Server

**Development Mode (with auto-restart via nodemon):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

The gateway will boot on port `5000` (or the port specified in `.env`):
```text
╔════════════════════════════════════════════════════════════╗
║  Enterprise Security Gateway running on port 5000          ║
║  Environment: development                                  ║
╚════════════════════════════════════════════════════════════╝
```

---

### Step 6: Verify Server Health

Send a `GET` request to verify the server status:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Enterprise Security Gateway is running.",
  "timestamp": "2026-10-07T04:15:00.000Z",
  "environment": "development"
}
```

---

## Environment Variables

The table below documents all configuration variables supported by the gateway:

| Variable | Required | Default Value | Description |
|----------|:--------:|---------------|-------------|
| `PORT` | No | `5000` | Port on which the Express server listens. |
| `NODE_ENV` | Yes | `development` | Runtime mode (`development` or `production`). Influences cookie `Secure` attribute and error verbosity. |
| `MONGO_URI` | Yes | *None* | MongoDB connection string (Atlas SRV or `mongodb://localhost:27017/enterprise-security`). |
| `JWT_ACCESS_SECRET` | Yes | *None* | High-entropy secret used for signing and verifying ephemeral access tokens (min 32 characters). |
| `JWT_REFRESH_SECRET` | Yes | *None* | High-entropy secret used for signing long-lived refresh tokens (min 32 characters). |
| `JWT_ACCESS_EXPIRY` | No | `15m` | Lifetime of the access token (e.g., `15m`, `30m`). |
| `JWT_REFRESH_EXPIRY` | No | `7d` | Lifetime of the refresh token (e.g., `7d`, `14d`). |
| `GOOGLE_CLIENT_ID` | Optional | *None* | OAuth 2.0 Client ID obtained from Google Cloud Console. |
| `GOOGLE_CLIENT_SECRET` | Optional | *None* | OAuth 2.0 Client Secret obtained from Google Cloud Console. |
| `GOOGLE_CALLBACK_URL` | Optional | `http://localhost:5000/api/v1/auth/google/callback` | Authorized redirect URI for Google OAuth. |
| `GITHUB_CLIENT_ID` | Optional | *None* | OAuth 2.0 Client ID obtained from GitHub Developer Settings. |
| `GITHUB_CLIENT_SECRET` | Optional | *None* | OAuth 2.0 Client Secret obtained from GitHub Developer Settings. |
| `GITHUB_CALLBACK_URL` | Optional | `http://localhost:5000/api/v1/auth/github/callback` | Authorized redirect URI for GitHub OAuth. |
| `CLIENT_URL` | Yes | `http://localhost:3000` | Allowed client origin for Cross-Origin Resource Sharing (CORS). |

---

## API Endpoints

All application routes are prefixed with `/api/v1/` (except the public `/api/health` probe).

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| **POST** | `/api/v1/auth/register` | Public | Register a new user with standard credentials (`name`, `email`, `password`) |
| **POST** | `/api/v1/auth/login` | Public | Authenticate user, issue access token in body & refresh token in cookie |
| **POST** | `/api/v1/auth/refresh` | Public (cookie) | Perform token rotation: validates refresh cookie, rotates family, returns new access token |
| **POST** | `/api/v1/auth/logout` | Public | Revoke active token family from database and clear `refreshToken` cookie |
| **GET** | `/api/v1/auth/google` | Public | Initiate Google OAuth 2.0 federation flow |
| **GET** | `/api/v1/auth/google/callback` | Public | Process Google OAuth callback, issue tokens, redirect or return credentials |
| **GET** | `/api/v1/auth/github` | Public | Initiate GitHub OAuth 2.0 federation flow |
| **GET** | `/api/v1/auth/github/callback` | Public | Process GitHub OAuth callback, issue tokens, redirect or return credentials |
| **GET** | `/api/v1/employee/profile` | All Roles | Retrieve authenticated profile (`SuperAdmin`, `Manager`, `Employee`) |
| **PUT** | `/api/v1/employee/profile` | All Roles | Update profile information (`name`, `avatar`) |
| **POST** | `/api/v1/payroll/approve` | Manager, SuperAdmin | Approve monthly tenant payroll disbursements |
| **GET** | `/api/v1/payroll/status` | All Roles | Check payroll processing status and approval audit log |
| **GET** | `/api/v1/users` | SuperAdmin | Enumerate all registered tenant users |
| **PATCH** | `/api/v1/users/:id/role` | SuperAdmin | Elevate or downgrade tenant user role |
| **DELETE** | `/api/v1/users/:id` | SuperAdmin | Permanently remove a user account |
| **GET** | `/api/health` | Public | Server uptime, environment, and readiness check |

---

## Test Credentials

> [!IMPORTANT]
> The database seeder script (`npm run seed`) populates three pre-configured accounts representing each permission tier. Use these credentials to test access control and verify RBAC enforcement.

| Role | Email | Password | Allowed Scopes & Privileges |
|------|-------|----------|-----------------------------|
| **SuperAdmin** | `superadmin@enterprise.com` | `SuperAdmin@123` | Full administrative control: manage users, alter roles, delete accounts, approve payroll, view profile. |
| **Manager** | `manager@enterprise.com` | `Manager@123` | Management operations: approve payroll, inspect payroll status, manage own profile. |
| **Employee** | `employee@enterprise.com` | `Employee@123` | Base tenant user: view own profile, update own profile, view payroll status. Restricted from approvals and administration. |

---

## Security Features

The gateway implements a multi-layered defense architecture adhering to OWASP Application Security Verification Standards (ASVS).

### 1. Password Hashing (Bcrypt with Salt Rounds: 12)
- **Work Factor**: Passwords are mathematically salted and hashed using `bcryptjs` with a cost factor of **12**, requiring thousands of iterations per key derivation to prevent rainbow-table and GPU-accelerated cracking attacks.
- **Mongoose Pre-Save Hook**: Hashing occurs automatically on password modification before persisting to MongoDB.
- **Credential Leak Prevention**: The `password` field in the `User` schema is configured with `select: false` so that standard Mongoose queries (`find`, `findById`) never return password hashes by default.
- **Timing Attack Mitigation**: Credential comparison utilizes `bcrypt.compare` to resist timing analysis attacks.

### 2. Dual-Token Architecture
- **Ephemeral Access Token (15 Minutes)**:
  - Cryptographically signed with `JWT_ACCESS_SECRET`.
  - Transmitted by client applications via the `Authorization: Bearer <token>` HTTP header.
  - Carries a minimal identity payload (`id`, `email`, `role`).
  - Short expiry mitigates exposure if a token is intercepted in transit.
- **Persistent Refresh Token (7 Days)**:
  - Stored inside an `httpOnly`, `SameSite=Strict`, `path=/api/v1/auth` cookie.
  - In production (`NODE_ENV=production`), the `Secure` flag is enforced, restricting transmission strictly to HTTPS connections.
  - Not accessible to client-side JavaScript (`document.cookie`), completely neutralising token exfiltration via Cross-Site Scripting (XSS).

### 3. Refresh Token Rotation (RTR) & Reuse Detection
- **Token Family Grouping**: Every login session creates a new token family identified by a `uuidv4`. When a refresh token is exchanged, a new token is minted within the *same* family.
- **Single-Use Enforcement**: Once a refresh token is used to generate a new pair, it is marked as `isRevoked: true` and linked to its successor via `replacedBy`.
- **Automatic Reuse Breach Detection**: If an attacker intercepts and attempts to use a previously invalidated refresh token:
  1. The server detects that a revoked token was presented.
  2. The server instantly revokes **all tokens belonging to that entire family** in MongoDB.
  3. The legitimate user and the attacker are immediately logged out, halting further unauthorized session renewal.

### 4. Account Lockout Mechanism
- **Failure Tracking**: The `User` model increments `failedLoginAttempts` upon each invalid password submission.
- **Trigger Threshold**: After **5 consecutive failed attempts**, the gateway sets `lockUntil = Date.now() + 15 minutes`.
- **Automatic Defense**: Any subsequent authentication attempt during the 15-minute lockout window is immediately rejected with HTTP `423 Locked`, preventing brute-force dictionary attacks.
- **Self-Healing**: Once 15 minutes elapse, the lock expires automatically. A successful login immediately resets `failedLoginAttempts` to `0` and clears `lockUntil`.

### 5. Multi-Tiered Rate Limiting
- **General API Limiter**:
  - Threshold: **100 requests per 15 minutes** per IP address.
  - Target: All endpoints mounted under `/api/*`.
- **Authentication Limiter**:
  - Threshold: **5 requests per 15 minutes** per IP address.
  - Target: Sensitive authentication endpoints (`/api/v1/auth/register`, `/api/v1/auth/login`).
  - Response: HTTP `429 Too Many Requests` with informative retry guidance.

### 6. OWASP Security Headers (Helmet)
Express is hardened with `helmet()` to enforce secure headers:
- `X-Content-Type-Options: nosniff` — Prevents MIME-type sniffing.
- `X-Frame-Options: DENY` — Defends against clickjacking by blocking iframe embeds.
- `Strict-Transport-Security (HSTS)` — Enforces encrypted HTTPS traffic over an extended window.
- `X-XSS-Protection` — Enables legacy browser XSS filters.
- `Content-Security-Policy (CSP)` — Limits script and resource origins.

### 7. CORS Policy
- Configured with strict origin validation checking against `process.env.CLIENT_URL`.
- Enforces `credentials: true` for secure cookie transmission.
- Restricts HTTP methods to `GET`, `POST`, `PUT`, `PATCH`, and `DELETE`.
- Exposes `X-RateLimit-Limit` and `X-RateLimit-Remaining` headers to client applications.

### 8. NoSQL Injection Prevention (`express-mongo-sanitize`)
- Intercepts all incoming requests (`req.body`, `req.query`, `req.params`).
- Replaces MongoDB operator characters (such as `$` and `.`) with an underscore (`_`) before payloads reach Mongoose queries.
- Logs security warnings when sanitization modifies potentially malicious inputs.

### 9. Cross-Site Scripting (XSS) Protection
- Implements custom recursive sanitization across all request vectors.
- Encodes dangerous HTML entities into safe escape sequences:
  - `&` → `&amp;`
  - `<` → `&lt;`
  - `>` → `&gt;`
  - `"` → `&quot;`
  - `'` → `&#x27;`
  - `/` → `&#x2F;`
- Neutralizes stored and reflected XSS attempts before payloads are processed.

### 10. HTTP Parameter Pollution (HPP) Prevention
- Injected using `hpp()`.
- Defends against parameter duplication attacks where an attacker provides multiple values for a single query parameter to bypass security logic.

---

## RBAC Access Matrix

The system implements Role-Based Access Control to enforce zero-trust authorization boundaries:

| Resource / Endpoint | HTTP Method | Required Role(s) | Employee | Manager | SuperAdmin |
|----------------------|:-----------:|:----------------:|:--------:|:-------:|:----------:|
| `/api/v1/employee/profile` | `GET` | All Roles | ✅ | ✅ | ✅ |
| `/api/v1/employee/profile` | `PUT` | All Roles | ✅ | ✅ | ✅ |
| `/api/v1/payroll/status` | `GET` | All Roles | ✅ | ✅ | ✅ |
| `/api/v1/payroll/approve` | `POST` | `Manager`, `SuperAdmin` | ❌ *(403)* | ✅ | ✅ |
| `/api/v1/users` | `GET` | `SuperAdmin` | ❌ *(403)* | ❌ *(403)* | ✅ |
| `/api/v1/users/:id/role` | `PATCH` | `SuperAdmin` | ❌ *(403)* | ❌ *(403)* | ✅ |
| `/api/v1/users/:id` | `DELETE` | `SuperAdmin` | ❌ *(403)* | ❌ *(403)* | ✅ |

---

## Deployment

The gateway is pre-configured for zero-configuration deployment to [Vercel](https://vercel.com/) via `@vercel/node`.

### `vercel.json` Configuration

The repository includes a root `vercel.json` specification:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

### Deploying via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Authenticate with Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from Project Root**:
   ```bash
   vercel
   ```

4. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

### Setting Environment Variables on Vercel

In the Vercel Project Dashboard under **Settings → Environment Variables**, configure all required keys:
- `NODE_ENV` = `production`
- `MONGO_URI` = `mongodb+srv://<user>:<password>@cluster.mongodb.net/...`
- `JWT_ACCESS_SECRET` = `<your-32-char-random-secret>`
- `JWT_REFRESH_SECRET` = `<your-32-char-random-secret>`
- `CLIENT_URL` = `https://your-frontend-domain.vercel.app`
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` (if social login enabled)
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` (if social login enabled)

> [!TIP]
> When deploying across different domains (e.g., frontend on `frontend.vercel.app` and API on `api.vercel.app`), ensure your CORS `CLIENT_URL` matches the frontend address, and configure cookies with `SameSite=None` and `Secure=true` for cross-site cookie transmission.

---

## Postman Testing Guide

Follow this step-by-step workflow to validate all security mechanisms in Postman:

### 1. Health Probe
- **Method**: `GET`
- **URL**: `http://localhost:5000/api/health`
- **Expected Status**: `200 OK`
- **Verify**: Response displays `success: true` and active timestamp.

---

### 2. Authenticate & Obtain Tokens
- **Method**: `POST`
- **URL**: `http://localhost:5000/api/v1/auth/login`
- **Headers**: `Content-Type: application/json`
- **Body (raw JSON)**:
  ```json
  {
    "email": "employee@enterprise.com",
    "password": "Employee@123"
  }
  ```
- **Expected Status**: `200 OK`
- **Verify**:
  - Response body contains `accessToken` (valid for 15 minutes).
  - In the Postman **Cookies** tab, verify `refreshToken` has been set with `HttpOnly` and `SameSite=Strict`.
  - Save the `accessToken` into a Postman environment variable (e.g., `{{access_token}}`).

---

### 3. Access Protected Route (Valid Token)
- **Method**: `GET`
- **URL**: `http://localhost:5000/api/v1/employee/profile`
- **Headers**:
  - `Authorization`: `Bearer {{access_token}}`
- **Expected Status**: `200 OK`
- **Verify**: User profile object is returned.

---

### 4. Verify RBAC Guard Enforcement
Test permission boundaries using different credentials:

#### Scenario A: Employee attempts to approve payroll
- Login as `employee@enterprise.com`.
- Send `POST` to `http://localhost:5000/api/v1/payroll/approve` with Employee Bearer token.
- **Expected Status**: `403 Forbidden` (`Access denied. Required roles: SuperAdmin, Manager`).

#### Scenario B: Manager approves payroll
- Login as `manager@enterprise.com`.
- Send `POST` to `http://localhost:5000/api/v1/payroll/approve` with Manager Bearer token.
- **Expected Status**: `200 OK` (`Payroll approved successfully`).

#### Scenario C: Manager attempts to list all users
- Send `GET` to `http://localhost:5000/api/v1/users` with Manager Bearer token.
- **Expected Status**: `403 Forbidden` (`Access denied. Required roles: SuperAdmin`).

#### Scenario D: SuperAdmin lists all users
- Login as `superadmin@enterprise.com`.
- Send `GET` to `http://localhost:5000/api/v1/users` with SuperAdmin Bearer token.
- **Expected Status**: `200 OK` (Returns full user roster).

---

### 5. Refresh Token Rotation (RTR)
- **Method**: `POST`
- **URL**: `http://localhost:5000/api/v1/auth/refresh`
- **Headers**: No manual header needed (Postman sends the `refreshToken` cookie automatically).
- **Expected Status**: `200 OK`
- **Verify**:
  - A new `accessToken` is returned.
  - The `refreshToken` cookie is updated in the cookie store with a new cryptographic token value under the same family.

---

### 6. Test Brute-Force Account Lockout
1. Pick a test account (e.g., `employee@enterprise.com`).
2. Send `POST http://localhost:5000/api/v1/auth/login` with an **incorrect password** (`WrongPassword!`).
3. Repeat 5 times in succession.
4. On the 5th failed attempt, the server triggers lockout.
5. On the 6th attempt:
   - **Expected Status**: `423 Locked`
   - **Response Message**: `Account is locked due to too many failed login attempts. Please try again after 15 minutes.`

---

### 7. Test Strict Auth Rate Limiting
- Send more than 5 login/registration requests from the same IP within a 15-minute window.
- **Expected Status**: `429 Too Many Requests`
- **Response Message**: `Too many authentication attempts. Account may be temporarily locked. Try again after 15 minutes.`

---

### 8. Session Revocation & Logout
- **Method**: `POST`
- **URL**: `http://localhost:5000/api/v1/auth/logout`
- **Expected Status**: `200 OK`
- **Verify**:
  - Database marks the active token family as `isRevoked: true`.
  - The `refreshToken` cookie is cleared from the client.
  - Attempting to call `/api/v1/auth/refresh` immediately yields `401 Unauthorized`.

---

## Live Demo

- **Deployed Gateway URL**: [https://enterprise-security-gateway.vercel.app](https://enterprise-security-gateway.vercel.app)
- **Health Check Probe**: [https://enterprise-security-gateway.vercel.app/api/health](https://enterprise-security-gateway.vercel.app/api/health)

*(Replace the URL above with your specific production deployment endpoint).*

---

## Author

- **Name**: Ayesha Bibi
- **Course**: CSC337 Web Programming & Security — Lab Assignment 05
- **Internship**: NovaStackHub Cybersecurity & Full-Stack Internship

---

## License

This project is licensed under the [MIT License](LICENSE) — see the LICENSE file for details.
