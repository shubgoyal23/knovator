# Knovator

A full-stack job management and authentication system built using **Next.js (App Router)** on the frontend and **Node.js (Express)** with **Redis and MongoDB** on the backend. This project supports login, registration, job queue handling, and basic theming using Redux.

---

## 🌐 Project Structure

```
knovator/
├── client/     → Next.js frontend (App Router, Tailwind CSS, Redux, Google Login)
└── server/     → Express backend (MongoDB, Redis, Workers)
```

---

## 🧹 Features

### 🔐 Authentication

* Register/Login using email
* Google OAuth login
* JWT-based secure sessions

### 📝 Job Management

* Job creation and listing
* Queue-based job processing using workers

### ⚙️ Tech Stack

* **Frontend**: Next.js 15 (App Router), Tailwind CSS, Redux Toolkit
* **Backend**: Node.js (Express), MongoDB, Redis, BullMQ
* **Queue Processing**: Dedicated enqueue/dequeue workers
* **Authentication**: JWT + Google OAuth

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/shubgoyal23-knovator.git
cd shubgoyal23-knovator
```

---

## 🖥️ Setup Frontend (Client)

### Prerequisites:

* Node.js (or Bun)
* Bun (if using Bun to install dependencies)

```bash
cd client
bun install    # or npm install
```

### Run Client:

```bash
bun dev    # or npm run dev
```

### Environment Variables (`client/.env`)

Create a `.env` file with:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## 🔧 Setup Backend (Server)

### Prerequisites:

* MongoDB
* Redis
* Node.js (or Bun)

```bash
cd server
bun install    # or npm install
```

### Environment Variables (`server/.env`)

Create a `.env` file with:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/knovatorDB
JWT_SECRET=your_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
REDIS_URL=redis://localhost:6379
```

### Run Server:

```bash
bun start    # or npm start
```

---

## ⚙️ Workers (Job Queue)

### Run Enqueue Worker:

```bash
bun run workers/enqueue.worker.js
```

### Run Dequeue Worker:

```bash
bun run workers/dequeue.worker.js
```

---

## 📁 Folder Highlights

### Client:

* `src/app/` – Routing pages (login, logout, register)
* `components/` – Reusable UI components
* `store/` – Redux slices for theme and user
* `lib/` – API and utility helpers

### Server:

* `controllers/` – Job and user logic
* `models/` – Mongoose schemas
* `routers/` – Route definitions
* `middleware/` – JWT auth check
* `workers/` – Background job handlers (enqueue/dequeue)
* `utils/` – Error handling helpers
