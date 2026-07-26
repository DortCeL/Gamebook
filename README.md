# 🎮 Gamebook — The Ultimate Social Hub for Gamers

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

**Gamebook** is a modern, full-stack social platform crafted specifically for gamers. Whether you want to showcase your highlight clips, share stunning game photography, publish detailed game reviews, discover common gaming libraries, or find squadmates for your next session—Gamebook brings your entire gaming life into one unified space.

---

## 💡 The Problem & Solution

### The Problem
Gamers today are scattered across fragmented platforms:
* Captures and screenshots end up buried in hardware drives or lost on general-purpose social networks.
* Finding reliable squadmates who share similar gaming libraries, skill levels, and active hours is tedious.
* Game reviews on major storefronts often lack social context, personal community engagement, and direct chat integration.

### The Solution: Gamebook
Gamebook bridges these gaps by providing an all-in-one social sanctuary designed exclusively for gamers:
* **Dedicated Media Showcase:** Share and showcase high-resolution screenshots, clips, and gaming moments.
* **Mutual Games Matching:** Instantly discover which titles you and your friends (or potential teammates) both own, making squad assembly effortless.
* **In-Depth Reviews & Discussions:** Publish reviews, rate titles, start discussions, and comment on friend activities.
* **Real-time Connectivity:** Make friends, chat directly, and coordinate gaming sessions seamlessly.

---

## ✨ Key Features

* **📸 Screenshot & Media Feed:** Share in-game moments, filter by title, and interact with posts via likes and comments.
* **⭐ Game Reviews & Ratings:** Write custom reviews for games, explore community ratings, and give feedback on others' experiences.
* **🤝 Mutual Games & Friend Discovery:** Automated matching engine that compares library overlap between profiles to help you find co-op partners.
* **💬 Real-Time Messaging:** Connect with friends via direct chat to coordinate lobbies and banter.
* **👤 Gamer Profiles:** Showcase your overall collection, favorite titles, active games, and media showcase in one central hub.

---

## 🛠 Tech Stack

### **Frontend** (Root Directory)
* **Framework:** [React Router](https://reactrouter.com/) (Single-Page Application / Server-Side Navigation)
* **Language:** TypeScript
* **State & Styling:** Modern Component Architecture & Responsive CSS Framework

### **Backend** (`/server` Directory)
* **Runtime:** Node.js
* **Framework:** Express.js
* **Language:** TypeScript
* **Database:** MongoDB (with Mongoose ODM)
* **Authentication:** JWT (JSON Web Tokens) & Secure Password Hashing

---

## 📁 Repository Structure

```text
Gamebook/
├── public/                 # Static assets
├── src/                    # Frontend React Router application
│   ├── components/         # Reusable UI components
│   ├── pages/              # Route views & pages
│   ├── routes/             # React Router navigation setup
│   ├── services/           # API interaction modules
│   └── types/              # Shared TypeScript definitions
├── server/                 # Express Node.js TypeScript Backend
│   ├── src/
│   │   ├── controllers/    # Request handlers & logic
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # Express API endpoints
│   │   ├── middleware/     # Auth & validation middleware
│   │   └── config/         # Database and server config
│   ├── package.json
│   └── tsconfig.json
├── package.json            # Root configuration
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your local environment:
* [Node.js](https://nodejs.org/) (v18.x or higher)
* [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
* [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas Connection URI)

---

### Installation & Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/your-username/gamebook.git
cd gamebook
```

#### 2. Backend Setup (`/server`)
```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Create environment configuration file
cp .env.example .env
```

Configure your server `.env` file:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/gamebook
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173
```

Start the backend server in development mode:
```bash
npm run dev
```

#### 3. Frontend Setup (Root Directory)
Open a new terminal tab, navigate back to the root folder, and install dependencies:
```bash
# Return to root directory
cd ..

# Install frontend dependencies
npm install

# Create environment configuration file
cp .env.example .env
```

Configure your root `.env` file:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
```

---

## 🔌 API Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user account |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT |
| `GET` | `/api/posts` | Fetch community feed posts & screenshots |
| `POST` | `/api/posts` | Create a new post or upload media |
| `GET` | `/api/games/reviews` | Retrieve game reviews |
| `GET` | `/api/users/:id/mutual-games` | Compare gaming libraries with another user |
| `GET` | `/api/chats` | Get active user chat conversations |

---

## 🤝 Contributing

Contributions make the open-source community an incredible place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
