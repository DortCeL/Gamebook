# Messaging Backend Guide

Simple step-by-step guide for **1-on-1 chats only** (no group chats).

---

## 1. Big Picture

```
Client (REST)  ──►  Routes  ──►  Controllers  ──►  Services  ──►  MongoDB
                                                              │
Client (Socket.io) ◄──────────────────────────────────────────┘
                     real-time events (new message, delivered, read)
```

- **REST API** = save/load data (conversations, messages)
- **Socket.io** = push live updates to the two people in a chat
- Every conversation is **exactly 2 users** — you and one other person

---

## 2. Files and What They Do

| File | Job |
|------|-----|
| `server/src/server.ts` | Starts HTTP server + attaches Socket.io |
| `server/src/app.ts` | Registers REST routes under `/api/...` |
| `server/src/socket/socket.ts` | Socket.io setup, auth, online tracking |
| `server/src/models/Conversation.ts` | DB schema: 1-on-1 chat (exactly 2 users) |
| `server/src/models/Message.ts` | DB schema: text messages + delivered/read tracking |
| `server/src/routes/conversation.routes.ts` | REST URLs for conversations + messages |
| `server/src/routes/message.routes.ts` | REST URL to mark one message as read |
| `server/src/controllers/conversation.controller.ts` | HTTP handlers for conversations |
| `server/src/controllers/message.controller.ts` | HTTP handlers for messages |
| `server/src/services/conversation.service.ts` | 1-on-1 conversation logic |
| `server/src/services/message.service.ts` | Message logic + Socket.io events |

---

## 3. Database Models

### Conversation (1-on-1 only)
- `participants` → **always exactly 2 user IDs** (you + one friend)
- Schema validation rejects anything that is not 2 users
- `lastMessage` → reference to latest Message
- `lastMessageAt` → used to sort chat list

### Message
- `conversation` → which chat it belongs to
- `sender` → who sent it
- `content` → text only
- `deliveredAt` → when the recipient received it (null until delivered)
- `readAt` → when the recipient read it (null until read)

---

## 4. REST API Endpoints

All require header: `Authorization: Bearer <JWT token>`

### Conversations (`/api/conversations`)

| Method | URL | What it does |
|--------|-----|--------------|
| GET | `/api/conversations` | List your 1-on-1 chats |
| POST | `/api/conversations` | Start or find chat with one user. Body: `{ "recipientId": "..." }` |
| GET | `/api/conversations/:id` | Get one chat by ID |
| GET | `/api/conversations/:conversationId/messages` | Load message history |
| POST | `/api/conversations/:conversationId/messages` | Send a message. Body: `{ "content": "hello" }` |
| PATCH | `/api/conversations/:conversationId/read` | Mark all messages in chat as read |

### Messages (`/api/messages`)

| Method | URL | What it does |
|--------|-----|--------------|
| PATCH | `/api/messages/:messageId/read` | Mark one message as read |

---

## 5. Socket.io Setup

### Helper functions

| Function | Purpose |
|----------|---------|
| `isUserOnline(userId)` | Is this user connected? |
| `sendToUser(userId, event, data)` | Send event to one user |
| `notifyChatPartners(userA, userB, event, data)` | Send event to both people in a 1-on-1 chat |

### Socket events

| Event | When | Who receives |
|-------|------|--------------|
| `connected` | Client connects | That client |
| `message:new` | Message sent | Both users in the chat |
| `message:delivered` | Recipient got the message | The sender |
| `message:read` | Recipient read the message | The sender |

---

## 6. Key Flows

### Start a 1-on-1 chat
`POST /api/conversations { recipientId }` → finds existing chat with that person or creates a new one with exactly 2 participants.

### Send a message
Save to DB → if other person is online mark delivered → Socket `message:new` to **you and the other person**.

### Message status (for your sent messages)
1. `readAt` is set → **[seen]**
2. else `deliveredAt` is set → **[delivered]**
3. else → **[sent]**

---

## 7. Important Rules

- Conversations always have exactly 2 users (enforced by schema)
- `ConversationService.getOtherUserId()` returns the other person in the chat
- Socket uses `notifyChatPartners(userA, userB, ...)` to update both sides
