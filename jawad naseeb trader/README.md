# Jawad Naseeb - Trading & Crypto Education Platform

> **Data First. Decisions Follow.**
> A full-stack MERN application for Trading, Cryptocurrency Education, and Market Analysis.

---

## Quick Start

### 1. Clone / Open the Project
```
cd "jawad naseeb trader"
```

### 2. Setup Backend (Server)
```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, etc.
npm install
npm run dev
```

### 3. Setup Frontend (Client)
```bash
cd client
npm install
npm run dev
```

Frontend runs at: http://localhost:3000
Backend API runs at: http://localhost:5000

---

## Environment Variables (server/.env)

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `PORT` | Backend port (default: 5000) |
| `NODE_ENV` | development or production |
| `CLIENT_URL` | Frontend URL for CORS |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

---

## Tech Stack

**Frontend:**
- React.js + Vite
- Tailwind CSS v4
- React Router DOM v7
- Axios
- Recharts
- Lucide React Icons
- Framer Motion

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs
- Multer + Cloudinary
- CORS + dotenv

---

## API Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user |
| GET | /api/courses | Get all courses |
| GET | /api/courses/:id | Get single course |
| GET | /api/lessons/:courseId | Get lessons for course |
| GET | /api/news | Get all news |
| GET | /api/news/:slug | Get single news article |
| GET | /api/market | Get live crypto market data |
| POST | /api/contact | Submit contact form |
| POST | /api/newsletter | Subscribe to newsletter |

---

## Pages

| Route | Page |
|---|---|
| `/` | Home (Hero, FAQ, Education, CTA) |
| `/about` | About Jawad Naseeb |
| `/education` | All Courses |
| `/education/:slug` | Course Details + Syllabus |
| `/lesson/:courseId/:lessonId` | Lesson Viewer |
| `/market` | Live Crypto Market + BTC Chart |
| `/calculator` | Bitcoin/Crypto Calculator |
| `/news` | Market News & Updates |
| `/contact` | Contact Form |
| `/login` | Login |
| `/register` | Register |
| `/dashboard` | User Learning Dashboard |
| `/admin` | Admin Control Panel |

---

## Deployment

**Frontend → Vercel / Netlify**
```bash
cd client && npm run build
# Deploy /dist folder
```

**Backend → Render / Railway**
```bash
# Set all environment variables in your hosting dashboard
# Start command: node server.js
```

**Database → MongoDB Atlas**
- Create a free cluster at https://cloud.mongodb.com
- Whitelist your server IP
- Add the connection string to MONGO_URI

---

## Financial Disclaimer

> Jawad Naseeb provides educational and informational content only. Nothing on this website should be considered financial, investment, trading or legal advice. Cryptocurrency and financial markets involve risk. Users should conduct their own research and consult a qualified professional before making financial decisions.

---

*© 2026 Jawad Naseeb. All Rights Reserved.*
