# PROJECT SPECIFICATION: Gamers' Social Media (MERN + WebSocket Chat)

## 🎯 Project Goal

Build a Facebook-style social media website for gamers. It must have infinite scrolling posts, comments/replies, friend requests, user profiles, and a **real-time chat feature** using WebSockets (Socket.io).
**Important**: Write code like a final-year undergrad (simple, beginner-friendly, readable, well-commented). Do not over-engineer. The UI should look nice but not pixel-perfect.

---

## 🗄️ DATABASE MODELS (Mongoose)

### 1. User

```js
{
  name: String,
  gamertag: String,          // unique
  email: String,             // unique, for login
  password: String,          // hashed with bcrypt
  avatar: String,            // optional URL
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: Date
}
2. Post
js
{
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  visibility: { type: String, enum: ['public', 'friends'], default: 'public' },
  createdAt: Date,
  updatedAt: Date
}
3. Comment (Supports 1-level replies)
js
{
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null }, // null = main comment
  createdAt: Date,
  updatedAt: Date
}
4. FriendRequest
js
{
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'accepted'], default: 'pending' },
  createdAt: Date
}
5. Message (NEW for Chat)
js
{
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  createdAt: Date
}
🔗 BACKEND API ROUTES (Express)
Auth
POST /api/auth/register – body: { name, gamertag, email, password }

POST /api/auth/login – returns { token, user }

Users
GET /api/users/:id – public profile (name, gamertag, avatar, friends list)

PUT /api/users/:id – update profile (auth required)

Posts (Paginated, 10 per page)
GET /api/posts?page=1 – Feed: Public + Friends-only (if logged in and friends with author). Populate author.

POST /api/posts – auth required. body: { text, visibility }

PUT /api/posts/:id – auth + ownership

DELETE /api/posts/:id – auth + ownership. Cascade: delete all comments where post = postId.

Comments
GET /api/posts/:postId/comments – get all comments + replies. Populate author.

POST /api/comments – auth required. body: { postId, text, parentId? (optional) }

PUT /api/comments/:id – auth + ownership

DELETE /api/comments/:id – auth + ownership.

If parent=null: delete all replies where parent = commentId first, then delete itself.

If parent exists: delete only itself.

Friend Requests
POST /api/friend-requests – auth. body: { userId }

GET /api/friend-requests/incoming – auth. List where to = currentUser.

GET /api/friend-requests/outgoing – auth. List where from = currentUser.

PUT /api/friend-requests/:id/accept – auth (only recipient). When accepted, push each other to friends arrays and delete the request.

Chat / Messages (NEW)
GET /api/messages/:friendId – auth. Fetch all messages between logged-in user and this friend. Sort by createdAt ascending.

(Sending messages is done via WebSocket, see below)

🕸️ WEBSOCKET / SOCKET.IO (Real-time Chat)
Backend Setup
Attach Socket.io to the HTTP server.

Authentication: Pass the JWT token via the connection handshake (e.g., query: { token }). Verify it on connection.

Rooms: When a user connects, they join a private room named after their userId (e.g., user_123).

Private Chat Rooms: For chatting between two friends, both users will emit/listen to a room created by sorting the two IDs alphabetically (e.g., room_123_456).

When User A wants to chat with User B, both join room_<smallId>_<bigId>.

Socket Events
join_chat: Client emits { friendId }. Server calculates the room name and adds the socket to that room.

send_message: Client emits { receiverId, text }. Server saves the message to the Message collection, then emits receive_message to the room (so both sender and receiver get it).

disconnect: Handle cleanup if needed.

🎨 FRONTEND (React)
Pages / Routes
/ – Public Feed (Infinite Scroll)

/login – Login page

/signup – Signup page

/profile/:userId – User Profile

/chat/:friendId – (NEW) Dedicated chat page for messaging a friend.

Core Components
Navbar: Logo, Home, My Profile, Logout (if auth) | Login/Signup (if guest).

Feed (Infinite Scroll):

Use react-infinite-scroll-component.

Show posts. If not logged in, public only. If logged in, public + friends-only from friends.

Post Component: Shows text, author, timestamp, visibility badge.

Edit/Delete (if author).

Comment section with a list of comments and replies.

If logged out, clicking comment/post redirects to login.

Profile Page:

Left/Center: User info, avatar, list of user's posts.

Right Sidebar: List of friends (clickable to their profiles).

Request Status (if viewing someone else):

Check incoming/outgoing requests to show: "Accept Request", "Awaiting confirmation", "Add Friend", or "Friends".

Chat Button: If you are friends, show a "Message" button that navigates to /chat/:friendId.

Chat Page (NEW):

A simple split layout (or full page).

Top: Friend's name and avatar.

Middle: Scrollable message history (fetched via REST on load, then updated via Socket).

Bottom: Input box and Send button.

Real-time: Listen for receive_message event to append new messages.

Authentication & Redirect Logic
Use React Context (AuthContext) to store user and token.

Redirect Middleware: When a guest tries to comment, post, or add a friend, redirect to /login?redirect=/current-path. After login, push them back to redirect param.

Private routes: Wrap /chat/:friendId in a ProtectedRoute (redirect to login if not auth).

UI Styling
Use Bootstrap 5 (react-bootstrap) or Tailwind CSS for simplicity.

Keep a dark/gaming theme if possible (dark backgrounds, neon accents) but plain Bootstrap is totally fine too.

🔄 CASCADE DELETE (Simple Implementation)
Put this logic directly inside the DELETE route handlers (no complex MongoDB middleware):

Delete Post:

await Comment.deleteMany({ post: postId })
await Post.findByIdAndDelete(postId)
Delete Top-Level Comment:

await Comment.deleteMany({ parent: commentId })
await Comment.findByIdAndDelete(commentId)
Delete Reply:

Just await Comment.findByIdAndDelete(commentId)
📁 PROJECT FOLDER STRUCTURE (For Cursor to generate)
text
server/
  ├── models/
  │   ├── User.js
  │   ├── Post.js
  │   ├── Comment.js
  │   ├── FriendRequest.js
  │   └── Message.js           (NEW)
  ├── routes/
  │   ├── auth.js
  │   ├── users.js
  │   ├── posts.js
  │   ├── comments.js
  │   ├── friendRequests.js
  │   └── messages.js          (NEW - REST for history)
  ├── middleware/
  │   ├── auth.js              (verify JWT)
  │   └── errorHandler.js
  ├── socket.js                (NEW - Socket.io configuration)
  ├── config/
  │   └── db.js
  └── server.js                (Initialize Express + HTTP + Socket.io)

client/
  ├── public/
  ├── src/
  │   ├── components/
  │   │   ├── Navbar.jsx
  │   │   ├── Feed.jsx
  │   │   ├── Post.jsx
  │   │   ├── CommentItem.jsx
  │   │   ├── Profile.jsx
  │   │   ├── FriendSidebar.jsx
  │   │   ├── Login.jsx
  │   │   ├── Signup.jsx
  │   │   └── Chat.jsx         (NEW - chat UI)
  │   ├── context/
  │   │   └── AuthContext.jsx
  │   ├── api/
  │   │   ├── axios.js         (baseURL, interceptors for token)
  │   │   └── socket.js        (NEW - socket instance & connection logic)
  │   ├── App.jsx
  │   ├── index.jsx
  │   └── styles/
✅ INSTRUCTIONS FOR CURSOR AI
Generate the complete code for this MERN project.

Use Express for the backend, Mongoose for ODM, and Socket.io for WebSockets.

Use React with functional components and hooks, React Router for routing, and Axios for API calls.

Use environment variables (.env) for MONGO_URI, JWT_SECRET, and PORT.

Security: Hash passwords with bcrypt, verify JWT tokens.

Chat Logic: Save messages to MongoDB via Socket.io send_message. Fetch existing chat history via REST GET /api/messages/:friendId.

Ensure the infinite scroll works correctly with pagination.

Implement the friend request flow exactly as described (Only Accept, no Reject/Delete).

Keep the UI clean using Bootstrap (or plain CSS if simpler).

Write clear, detailed comments so a final-year student can understand every line of code.

Ensure all cascade delete logic is explicitly written inside the controllers/routes.
```
