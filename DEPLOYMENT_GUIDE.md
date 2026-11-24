# PhishGuard AI – Cloud Hosting & Deployment Guide

This guide provides step-by-step instructions to host and deploy **PhishGuard AI** to the cloud.

GitHub Repository: [`https://github.com/Code-Bro-10/PhishGuard-AI.git`](https://github.com/Code-Bro-10/PhishGuard-AI.git)

---

## Deployment Architecture Options

| Strategy | Recommended For | Free Hosting Providers |
|---|---|---|
| **Option 1: All-in-One Full-Stack (Easiest)** | Single domain, zero CORS configuration | **Render** (Web Service) or **Railway** |
| **Option 2: Decoupled Frontend + Backend** | High frontend performance + dedicated API | **Vercel** (Frontend) + **Render** (Backend) |

---

## OPTION 1: 1-Click All-in-One Deployment on Render (Recommended)

In this approach, Render builds the React frontend, runs the Express backend, and serves both the dashboard and API on a single URL (e.g. `https://phishguard-ai.onrender.com`).

### Step 1: Set up a Free Cloud Database on MongoDB Atlas
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
2. Create a free **M0 Shared Cluster** (AWS / closest region).
3. Under **Security > Database Access**, add a database user with username and password (e.g., `phishadmin` / strong password).
4. Under **Security > Network Access**, click **Add IP Address** and choose **Allow Access from Anywhere (`0.0.0.0/0`)**.
5. Go to **Database > Connect > Drivers (Node.js)** and copy your connection string:
   ```text
   mongodb+srv://phishadmin:<password>@cluster0.xxxxx.mongodb.net/phishguard?retryWrites=true&w=majority
   ```

### Step 2: Deploy on Render
1. Log in to [render.com](https://render.com) using your GitHub account.
2. Click **New + > Web Service**.
3. Select **Build and deploy from a Git repository** and connect your repo: `Code-Bro-10/PhishGuard-AI`.
4. Configure the service settings:
   - **Name:** `phishguard-ai`
   - **Region:** Any (e.g. Oregon, Frankfurt, Singapore)
   - **Branch:** `main`
   - **Root Directory:** *(leave blank / default root)*
   - **Runtime:** `Node`
   - **Build Command:** `npm run postinstall && npm run build`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`
5. Under **Environment Variables**, click **Add Environment Variable**:
   | Key | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `PORT` | `10000` |
   | `JWT_SECRET` | *(Any long random 32+ character string)* |
   | `JWT_EXPIRES_IN` | `7d` |
   | `MONGODB_URI` | *(Your MongoDB Atlas connection URI from Step 1)* |
   | `GOOGLE_SAFE_BROWSING_KEY` | *(Optional - leave blank if not using)* |
6. Click **Deploy Web Service**.
7. Once build finishes, Render will provide your live URL: `https://phishguard-ai.onrender.com`.

---

## OPTION 2: Decoupled Deployment (Vercel Frontend + Render Backend)

### Part A: Deploy Backend on Render
1. Create a **New Web Service** on [render.com](https://render.com).
2. Connect `Code-Bro-10/PhishGuard-AI`.
3. Set:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Environment Variables:
   - `NODE_ENV=production`
   - `MONGODB_URI=your_mongodb_atlas_uri`
   - `JWT_SECRET=your_secret_key`
   - `CLIENT_URL=https://your-frontend.vercel.app`
5. Deploy and copy your backend URL: e.g. `https://phishguard-api.onrender.com`.

### Part B: Deploy Frontend on Vercel
1. Go to [vercel.com](https://vercel.com) and log in with GitHub.
2. Click **Add New > Project** and import `Code-Bro-10/PhishGuard-AI`.
3. Configure project settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Click Edit and select `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Under **Environment Variables**, add:
   - `VITE_API_BASE_URL` = `https://phishguard-api.onrender.com/api`
5. Click **Deploy**.
6. Vercel will provide your live frontend URL: `https://phishguard-ai.vercel.app`.

---

## Verifying the Deployment
1. Visit the deployed URL.
2. Test **Analyst Registration** or click **One-Click Demo Login**.
3. Test scanning a sample URL (e.g. `https://paypal.com.account-update.xyz/login`).
4. Test email analysis.
5. Check that scan reports, history, and telemetry charts render properly from MongoDB.
