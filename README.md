# Global Connect - Professional Networking Platform

Global Connect is a MERN stack professional networking application inspired by LinkedIn. It features JWT authentication, user profiles, connection management, interactive feeds, real-time Socket.IO chat, job posting & applications, and clean modular code structure.

---

## 🛠 Tech Stack

- **Frontend**: React 18, Redux Toolkit, Tailwind CSS, Vite, Lucide Icons
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), Socket.IO
- **Authentication**: JWT, bcryptjs
- **Deployment**: Render, Vercel, Docker / Docker Compose

---

## 🚀 Local Development Setup

1. **Clone & Open Project**:
   ```bash
   code global-connect
   ```

2. **Install All Dependencies**:
   ```bash
   npm run install:all
   ```

3. **Configure Environment Variables**:
   Create `backend/.env`:
   ```env
   PORT=5001
   MONGO_URI=mongodb://127.0.0.1:27017/global_connect
   JWT_SECRET=your_jwt_secret_here
   CLIENT_URL=http://localhost:5173
   ```

4. **Start Development Servers**:
   ```bash
   npm run dev
   ```
   - **Frontend**: http://localhost:5173
   - **Backend**: http://localhost:5001

---

## ☁️ Deployment Guide

### Step 1: Create a Free MongoDB Cloud Database (MongoDB Atlas)

1. Sign up for a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free **M0 Cluster**.
3. Under **Database Access**, create a database user and password.
4. Under **Network Access**, add `0.0.0.0/0` to allow connection from your cloud service.
5. Click **Connect** -> **Drivers** and copy your connection string:
   `mongodb+srv://<username>:<password>@cluster.mongodb.net/global_connect?retryWrites=true&w=majority`

---

### Step 2: Deploy Option A - Single Web Service on Render (Recommended)

1. Push your repository to GitHub.
2. Sign in to [Render](https://render.com).
3. Click **New +** -> **Web Service**.
4. Connect your GitHub repository.
5. Configure settings:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start`
6. Add Environment Variables in Render Dashboard:
   - `NODE_ENV` = `production`
   - `MONGO_URI` = *Your MongoDB Atlas Connection String*
   - `JWT_SECRET` = *Any random secure string*
7. Click **Create Web Service**. Express will serve both your API and your built React frontend from the single URL!

---

### Step 3: Deploy Option B - Vercel (Frontend) + Render (Backend)

1. **Deploy Backend to Render**:
   - Build Command: `npm install --prefix backend`
   - Start Command: `npm run start --prefix backend`
   - Set `CLIENT_URL` to your Vercel frontend URL.

2. **Deploy Frontend to Vercel**:
   - Connect frontend directory to Vercel.
   - Set Environment Variables:
     - `VITE_API_URL` = `https://your-backend.onrender.com/api`
     - `VITE_SOCKET_URL` = `https://your-backend.onrender.com`

---

### Step 4: Deploy Option C - Containerized with Docker

To run locally or on a VPS using Docker:

```bash
docker-compose up --build
```
Access the application at `http://localhost:5001`.

---

## 📋 API Endpoint Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Authenticate user & get token |
| `GET` | `/api/users/me` | Fetch current user profile |
| `PUT` | `/api/users/me` | Update user profile |
| `GET` | `/api/users/search?q=` | Search users by name/headline/skills |
| `POST` | `/api/connections/request/:id` | Send connection request |
| `POST` | `/api/connections/accept/:id` | Accept connection request |
| `GET` | `/api/posts/feed` | Get feed posts |
| `POST` | `/api/posts` | Create new post |
| `POST` | `/api/posts/:id/like` | Toggle post like |
| `GET` | `/api/jobs` | Search & list jobs |
| `POST` | `/api/jobs` | Post job listing |
| `POST` | `/api/jobs/:id/apply` | Apply for job |
| `GET` | `/api/messages/:userId` | Get chat history |
| `POST` | `/api/messages` | Send real-time chat message |
