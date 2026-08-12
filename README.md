# Gamebook

A social media web app for gamers. Think Facebook, but built around profiles, posts, friend requests, and real-time chat. The kind of place where you’d post about a match, find friends, and message them without jumping to Discord.

This is a full-stack TypeScript project: React Router on the frontend, Express + MongoDB on the backend, and Socket.io for live messaging.

Checkout the [Live Demo](https://www.gamebook-alif.vercel.app)

## What it does

- **Auth:** Register / login with JWT. Passwords hashed with bcrypt.
- **Feed:** Paginated posts with public or friends-only visibility. Logged-out users only see public posts.
- **Comments:** Nested comments (one level of replies). Edit and delete with ownership checks; deleting a parent comment also removes its replies.
- **Friend requests:** Send, view incoming/outgoing, accept. Accepting adds both users to each other’s friends list.
- **Profiles:** View a user’s info, their posts, and their friends. Friend status buttons update based on whether you’re already friends or have a pending request.
- **Real-time chat:** Open a chat with a friend. History loads over REST; new messages go through Socket.io and land in both clients immediately.

## Tech stack

| Layer | Tools |
| --- | --- |
| Frontend | React 19, React Router 8, TypeScript, Tailwind CSS, Axios, Socket.io client |
| Backend | Node.js, Express 5, TypeScript, Mongoose, JWT, bcrypt, Socket.io |
| Database | MongoDB |

## Project structure

```text
Gamebook/
├── app/                    # Frontend (React Router)
│   ├── api/                # Axios client + Socket.io helper
│   ├── components/         # UI (feed, chat, profile, navbar…)
│   ├── context/            # AuthContext
│   ├── routes/             # Pages + guest / public / protected layouts
│   └── utils/
├── server/                 # Backend
│   └── src/
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       ├── middlewares/
│       ├── socket/         # Socket.io setup + chat events
│       ├── config/
│       └── server.ts       # HTTP server + Socket.io attach point
└── README.md
```

## Getting started

### Requirements

- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone

```bash
git clone https://github.com/DortCeL/gamebook.git
cd gamebook
```

### 2. Backend

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=4060
MONGODB_URI=mongodb://127.0.0.1:27017/gamebook
JWT_SECRET=your_secret_here
CLIENT_URL=http://localhost:5173
```

```bash
npm run dev
```

Server runs on `http://localhost:4060` (Express + Socket.io on the same port).

### 3. Frontend

From the repo root:

```bash
npm install
```

Create a root `.env`:

```env
VITE_API_URL=http://localhost:4060
```

```bash
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## API overview

| Method | Endpoint | Notes |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Create account |
| `POST` | `/api/auth/login` | Returns JWT + user |
| `GET` | `/api/users/me` | Current user (auth) |
| `GET` | `/api/users/:id` | Public profile |
| `PUT` | `/api/users/:id` | Update profile (auth) |
| `GET` | `/api/posts` | Feed (paginated; respects visibility) |
| `GET` | `/api/posts/user/:userId` | Posts by user |
| `POST` | `/api/posts` | Create post (auth) |
| `PUT` / `DELETE` | `/api/posts/:id` | Own posts only |
| `GET` | `/api/posts/:postId/comments` | Comments + replies |
| `POST` / `PUT` / `DELETE` | `/api/comments` … | Create / edit / delete |
| `POST` | `/api/friend-requests` | Send request |
| `GET` | `/api/friend-requests/incoming` | Incoming |
| `GET` | `/api/friend-requests/outgoing` | Outgoing |
| `PUT` | `/api/friend-requests/:id/accept` | Accept |
| `GET` | `/api/messages/:friendId` | Chat history with a friend |

Health check: `GET /api/health`

### Socket events (chat)

| Event | Direction | Purpose |
| --- | --- | --- |
| `join_chat` | Client → Server | Join the shared room for you + a friend |
| `send_message` | Client → Server | Persist message, then broadcast |
| `receive_message` | Server → Clients | New message payload for everyone in the room |

JWT is verified on the Socket.io handshake (`auth.token`). Chat rooms are named by sorting both user IDs so either side joins the same room.

## Challenges I ran into (and how I fixed them)

These are the ones that actually slowed me down while building this.

### 1. Cascade deletes don’t exist in MongoDB

MongoDB isn’t relational, so deleting a post doesn’t automatically wipe its comments. I looked at a few options (document middleware, query middleware, a service-layer helper) and went with explicit deletes in the controllers: delete related comments first, then the post. Same idea for top-level comments: wipe replies, then delete the parent. It’s not fancy, but it’s clear and doesn’t depend on calling the “right” Mongoose delete method.

### 2. Express route order bites hard

I registered something like `GET /:id` before `GET /myposts`. Express treated `"myposts"` as an id and the static route never ran. Rule I follow now: **static paths first, dynamic params last**.

### 3. Signup didn’t return a token

Register created the user but didn’t log them in. After signup the UI expected an authenticated session, so the app felt broken. Fix on the client: after a successful register, immediately call login with the same credentials. Simple, and I didn’t have to change the auth contract mid-project.

### 4. React state isn’t updated the line after `setState`

On the profile page I set incoming friend requests, then immediately tried to `.find()` on that state to decide which button to show. State updates are async / batched, so I was reading the *previous* render’s value. Fixed by deriving the status from the response data itself (or from the updated state on the next render), not from the variable I had just called `setState` on.

### 5. Socket.io needs the raw HTTP server

Attaching Socket.io to the Express `app` alone isn’t enough. You need `http.createServer(app)`, then pass that server into Socket.io. Once I understood that, chat connect/auth/rooms lined up with the Express API on one port.

### 6. Deploy build couldn’t find `socket.io`

On Render, TypeScript failed with “Cannot find module 'socket.io'”. The package lived in the wrong place relative to how the host builds the app (root vs `server/`). Installing Socket.io where the server actually builds from fixed the missing types / module resolution.

## Auth & routing notes

- Guest routes (`/login`, `/signup`): redirects away if already logged in.
- Public routes: home feed and profiles work for everyone; some actions redirect to login.
- Protected routes: chat requires a valid token.
- Token is stored client-side and sent on API requests; the same token is passed into the Socket.io handshake for chat.