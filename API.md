# Gamebook Backend API

Express + MongoDB REST API for authentication, user profiles, posts, and comments.

**Base URL:** `http://localhost:5000` (default; set via `PORT` in `.env`)

**Content-Type:** `application/json` for all request bodies unless noted otherwise.

---

## Table of Contents

1. [Authentication](#authentication)
2. [Common Response Format](#common-response-format)
3. [Data Models](#data-models)
4. [Health & Root](#health--root)
5. [Auth Routes](#auth-routes)
6. [User Routes](#user-routes)
7. [Post Routes](#post-routes)
8. [Comment Routes](#comment-routes)
9. [Error Status Codes](#error-status-codes)
10. [Environment Variables](#environment-variables)

---

## Authentication

Protected routes require a JWT in the `Authorization` header:

```
Authorization: Bearer <token>
```

- Tokens are issued on **login** and expire after **7 days**.
- JWT payload contains `_id` (user ID) and `role` (`"user"` | `"admin"`).
- Missing, invalid, or expired tokens return **401**.

---

## Common Response Format

Most endpoints return JSON with a `success` boolean.

### Success (with data)

```json
{
  "success": true,
  "message": "Optional human-readable message",
  "data": { }
}
```

Some list endpoints also include `count`:

```json
{
  "success": true,
  "count": 10,
  "data": [ ]
}
```

### Error

```json
{
  "success": false,
  "message": "Description of the error"
}
```

---

## Data Models

### User

| Field       | Type     | Required | Notes                          |
|-------------|----------|----------|--------------------------------|
| `_id`       | string   | —        | MongoDB ObjectId               |
| `name`      | string   | yes      |                                |
| `email`     | string   | yes      | Unique, lowercase              |
| `gamertag`  | string   | yes      | Unique                         |
| `password`  | string   | yes      | Min 6 chars; never returned in API responses |
| `avatarUrl` | string   | no       |                                |
| `bio`       | string   | no       |                                |
| `role`      | string   | —        | `"user"` (default) or `"admin"` |
| `createdAt` | ISO date | —        | Auto-managed                   |
| `updatedAt` | ISO date | —        | Auto-managed                   |

### Post

| Field        | Type     | Required | Notes                                      |
|--------------|----------|----------|--------------------------------------------|
| `_id`        | string   | —        | MongoDB ObjectId                           |
| `author`     | ObjectId | yes      | Ref to User; populated on read endpoints   |
| `type`       | string   | yes      | `"screenshot"` \| `"review"` \| `"text"` (default: `"text"`) |
| `game`       | string   | no       | Game name or identifier                    |
| `content`    | string   | no       | Post body text                             |
| `images`     | string[] | no       | URLs                                       |
| `visibility` | string   | —        | `"public"` (default) \| `"friends"`        |
| `createdAt`  | ISO date | —        | Auto-managed                               |
| `updatedAt`  | ISO date | —        | Auto-managed                               |

### Comment

| Field           | Type     | Required | Notes                                      |
|-----------------|----------|----------|--------------------------------------------|
| `_id`           | string   | —        | MongoDB ObjectId                           |
| `post`          | ObjectId | yes      | Ref to Post                                |
| `author`        | ObjectId | yes      | Ref to User; populated on read/create      |
| `content`       | string   | yes      |                                            |
| `parentComment` | ObjectId | no       | `null` for top-level; set for replies      |
| `createdAt`     | ISO date | —        | Auto-managed                               |
| `updatedAt`     | ISO date | —        | Auto-managed                               |

---

## Health & Root

### `GET /`

Simple health string.

**Auth:** None

**Response:** `200` — plain text

```
Express server running with ES Modules!
```

---

### `GET /api/health`

**Auth:** None

**Response:** `200`

```json
{
  "status": "UP",
  "timestamp": "2026-07-30T09:45:00.000Z"
}
```

---

## Auth Routes

Base path: `/api/auth`

### `POST /api/auth/register`

Create a new user account.

**Auth:** None

**Request body:**

| Field      | Type   | Required |
|------------|--------|----------|
| `name`     | string | yes      |
| `email`    | string | yes      |
| `password` | string | yes      |
| `gamertag` | string | yes      |

**Example request:**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123",
  "gamertag": "janedoe"
}
```

**Success response:** `201`

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "64a1b2c3d4e5f6789012345",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "gamertag": "janedoe",
    "bio": "",
    "avatarUrl": ""
  }
}
```

**Error responses:**

| Status | Message examples                          |
|--------|-------------------------------------------|
| `400`  | `"Email already exists"`, `"Gamertag already exists"`, validation errors |

---

### `POST /api/auth/login`

Authenticate and receive a JWT.

**Auth:** None

**Request body:**

| Field      | Type   | Required |
|------------|--------|----------|
| `email`    | string | yes      |
| `password` | string | yes      |

**Example request:**

```json
{
  "email": "jane@example.com",
  "password": "secret123"
}
```

**Success response:** `200`

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64a1b2c3d4e5f6789012345",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "user"
    }
  }
}
```

**Error responses:**

| Status | Message              |
|--------|----------------------|
| `401`  | `"Invalid credentials"` |

---

## User Routes

Base path: `/api/users`

All routes in this group require authentication.

### `GET /api/users/me`

Get the logged-in user's profile and post count.

**Auth:** Required

**Request body:** None

**Success response:** `200`

```json
{
  "success": true,
  "message": "Profile Fetched successfully",
  "data": {
    "user": {
      "_id": "64a1b2c3d4e5f6789012345",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "gamertag": "janedoe",
      "avatarUrl": "",
      "bio": "Hello world",
      "role": "user",
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-15T00:00:00.000Z"
    },
    "stats": {
      "totalPosts": 12
    }
  }
}
```

**Error responses:**

| Status | Message                                      |
|--------|----------------------------------------------|
| `401`  | `"Unauthorized: Authentication required."`   |
| `500`  | Server error message                         |

---

### `PATCH /api/users/:id`

Update the authenticated user's profile. Users may only update their own account (`:id` must match the token's `_id`).

**Auth:** Required

**URL params:**

| Param | Type   | Description   |
|-------|--------|---------------|
| `id`  | string | User ObjectId |

**Request body:** At least one field required.

| Field       | Type   | Required |
|-------------|--------|----------|
| `name`      | string | no       |
| `gamertag`  | string | no       |
| `bio`       | string | no       |
| `avatarUrl` | string | no       |

**Example request:**

```json
{
  "name": "Jane Smith",
  "bio": "Gamer and reviewer"
}
```

**Success response:** `200`

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "_id": "64a1b2c3d4e5f6789012345",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "gamertag": "janedoe",
    "avatarUrl": "",
    "bio": "Gamer and reviewer",
    "role": "user",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-07-30T09:45:00.000Z"
  }
}
```

**Error responses:**

| Status | Message                                                |
|--------|--------------------------------------------------------|
| `400`  | `"Nothing to update!"`, `"Gamertag is already taken."` |
| `401`  | `"Unauthorized: Authentication required."`             |
| `403`  | `"Forbidden: You can only update your own profile."`   |
| `404`  | `"User not found."`                                    |

---

### `DELETE /api/users/:id`

Delete the authenticated user's account and all of their posts (cascade delete). Users may only delete their own account.

**Auth:** Required

**URL params:**

| Param | Type   | Description   |
|-------|--------|---------------|
| `id`  | string | User ObjectId |

**Request body:** None

**Success response:** `200`

```json
{
  "success": true,
  "message": "Account and associated posts deleted successfully."
}
```

**Error responses:**

| Status | Message                                                |
|--------|--------------------------------------------------------|
| `400`  | `"Target id is missing in the url"`                    |
| `403`  | `"Forbidden: You can only delete your own account."`   |
| `404`  | `"User not found."`                                    |
| `500`  | Server error message                                   |

---

## Post Routes

Base path: `/api/post`

### `GET /api/post`

List public posts (paginated). Optionally filter by author.

**Auth:** None

**Query params:**

| Param      | Type   | Default | Description                    |
|------------|--------|---------|--------------------------------|
| `page`     | number | `1`     | Page number (1-based)          |
| `limit`    | number | `10`    | Items per page                 |
| `authorId` | string | —       | Filter to posts by this user   |

**Example:** `GET /api/post?page=1&limit=10&authorId=64a1b2c3d4e5f6789012345`

**Success response:** `200`

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "64b1c2d3e4f5a67890123456",
      "author": { "_id": "64a1b2c3d4e5f6789012345", "name": "Jane Doe" },
      "type": "text",
      "game": "Elden Ring",
      "content": "Great game!",
      "images": [],
      "visibility": "public",
      "createdAt": "2026-07-01T12:00:00.000Z",
      "updatedAt": "2026-07-01T12:00:00.000Z"
    }
  ]
}
```

> **Note:** Only posts with `visibility: "public"` are returned.

---

### `GET /api/post/myposts`

List all posts by the authenticated user (any visibility).

**Auth:** Required

**Query params:**

| Param   | Type   | Default | Description           |
|---------|--------|---------|-----------------------|
| `page`  | number | `1`     | Page number (1-based) |
| `limit` | number | `10`    | Items per page        |

**Success response:** `200`

```json
{
  "success": true,
  "count": 5,
  "data": [ /* array of Post objects */ ]
}
```

**Error responses:**

| Status | Message                                    |
|--------|--------------------------------------------|
| `401`  | `"Unauthorized: Authentication required."` |
| `500`  | Server error message                       |

---

### `GET /api/post/:id`

Get a single post by ID.

**Auth:** None

**URL params:**

| Param | Type   | Description    |
|-------|--------|----------------|
| `id`  | string | Post ObjectId  |

**Success response:** `200`

```json
{
  "success": true,
  "data": {
    "_id": "64b1c2d3e4f5a67890123456",
    "author": { "_id": "64a1b2c3d4e5f6789012345" },
    "type": "review",
    "game": "Hollow Knight",
    "content": "10/10",
    "images": ["https://example.com/img.png"],
    "visibility": "public",
    "createdAt": "2026-07-01T12:00:00.000Z",
    "updatedAt": "2026-07-01T12:00:00.000Z"
  }
}
```

**Error responses:**

| Status | Message            |
|--------|--------------------|
| `404`  | `"Post not found"` |
| `500`  | Server error       |

---

### `POST /api/post`

Create a new post. The `author` field is set automatically from the JWT.

**Auth:** Required

**Request body:**

| Field        | Type     | Required | Notes                                      |
|--------------|----------|----------|--------------------------------------------|
| `type`       | string   | no       | `"screenshot"` \| `"review"` \| `"text"`   |
| `game`       | string   | no       |                                            |
| `content`    | string   | no       |                                            |
| `images`     | string[] | no       |                                            |
| `visibility` | string   | no       | `"public"` \| `"friends"`                  |

**Example request:**

```json
{
  "type": "review",
  "game": "Celeste",
  "content": "Challenging platformer with a great story.",
  "images": [],
  "visibility": "public"
}
```

**Success response:** `201`

```json
{
  "success": true,
  "data": {
    "_id": "64b1c2d3e4f5a67890123456",
    "author": "64a1b2c3d4e5f6789012345",
    "type": "review",
    "game": "Celeste",
    "content": "Challenging platformer with a great story.",
    "images": [],
    "visibility": "public",
    "createdAt": "2026-07-30T09:45:00.000Z",
    "updatedAt": "2026-07-30T09:45:00.000Z"
  }
}
```

**Error responses:**

| Status | Message                                                          |
|--------|------------------------------------------------------------------|
| `400`  | Validation errors, `"Author does not exist"`                     |
| `401`  | `"Unauthorized: Valid authentication required to create a post."` |

---

### `PATCH /api/post/:id`

Update a post. Only the post author may update it.

**Auth:** Required

**URL params:**

| Param | Type   | Description   |
|-------|--------|---------------|
| `id`  | string | Post ObjectId |

**Request body:** Any subset of post fields (`type`, `game`, `content`, `images`, `visibility`).

**Example request:**

```json
{
  "content": "Updated review text",
  "visibility": "friends"
}
```

**Success response:** `200`

```json
{
  "success": true,
  "data": { /* updated Post object */ }
}
```

**Error responses:**

| Status | Message                                           |
|--------|---------------------------------------------------|
| `400`  | Validation errors                                 |
| `404`  | `"Post not found or unauthorized to edit"`        |

---

### `DELETE /api/post/:id`

Delete a post. Only the post author may delete it.

**Auth:** Required

**URL params:**

| Param | Type   | Description   |
|-------|--------|---------------|
| `id`  | string | Post ObjectId |

**Request body:** None

**Success response:** `200`

```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

**Error responses:**

| Status | Message                                              |
|--------|------------------------------------------------------|
| `404`  | `"Post not found or unauthorized to delete"`         |
| `500`  | Server error message                                 |

---

## Comment Routes

Base path: `/api/comments`

### `GET /api/comments/post/:postId`

Get top-level comments for a post (replies are fetched separately).

**Auth:** None

**URL params:**

| Param    | Type   | Description   |
|----------|--------|---------------|
| `postId` | string | Post ObjectId |

**Query params:**

| Param   | Type   | Default | Description           |
|---------|--------|---------|-----------------------|
| `page`  | number | `1`     | Page number (1-based) |
| `limit` | number | `10`    | Items per page        |

**Example:** `GET /api/comments/post/64b1c2d3e4f5a67890123456?page=1&limit=20`

**Success response:** `200`

```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "64c1d2e3f4a5b67890123456",
      "post": "64b1c2d3e4f5a67890123456",
      "author": {
        "_id": "64a1b2c3d4e5f6789012345",
        "gamertag": "janedoe",
        "avatarUrl": ""
      },
      "content": "Nice post!",
      "parentComment": null,
      "createdAt": "2026-07-02T10:00:00.000Z",
      "updatedAt": "2026-07-02T10:00:00.000Z"
    }
  ]
}
```

---

### `GET /api/comments/:commentId/replies`

Get replies to a specific comment (chronological order).

**Auth:** None

**URL params:**

| Param       | Type   | Description      |
|-------------|--------|------------------|
| `commentId` | string | Comment ObjectId |

**Query params:**

| Param   | Type   | Default | Description           |
|---------|--------|---------|-----------------------|
| `page`  | number | `1`     | Page number (1-based) |
| `limit` | number | `10`    | Items per page        |

**Success response:** `200`

```json
{
  "success": true,
  "count": 2,
  "data": [ /* array of Comment objects with populated author */ ]
}
```

---

### `POST /api/comments`

Create a top-level comment or a reply.

**Auth:** Required

**Request body:**

| Field             | Type   | Required | Notes                                    |
|-------------------|--------|----------|------------------------------------------|
| `postId`          | string | yes      | Post to comment on                       |
| `content`         | string | yes      | Comment text                             |
| `parentCommentId` | string | no       | Set to reply to an existing comment      |

**Example — top-level comment:**

```json
{
  "postId": "64b1c2d3e4f5a67890123456",
  "content": "Great screenshot!"
}
```

**Example — reply:**

```json
{
  "postId": "64b1c2d3e4f5a67890123456",
  "content": "Thanks!",
  "parentCommentId": "64c1d2e3f4a5b67890123456"
}
```

**Success response:** `201`

```json
{
  "success": true,
  "data": {
    "_id": "64c1d2e3f4a5b67890123456",
    "post": "64b1c2d3e4f5a67890123456",
    "author": {
      "_id": "64a1b2c3d4e5f6789012345",
      "gamertag": "janedoe",
      "avatarUrl": ""
    },
    "content": "Great screenshot!",
    "parentComment": null,
    "createdAt": "2026-07-30T09:45:00.000Z",
    "updatedAt": "2026-07-30T09:45:00.000Z"
  }
}
```

**Error responses:**

| Status | Message                                                          |
|--------|------------------------------------------------------------------|
| `400`  | `"postId and content are required."`, `"Post not found."`, `"Parent comment not found."`, `"Parent comment does not belong to this post."` |
| `401`  | `"Unauthorized: Authentication required."`                       |

---

### `DELETE /api/comments/:id`

Delete a comment and all of its nested replies. Allowed if the requester is the **comment author** or the **post author**.

**Auth:** Required

**URL params:**

| Param | Type   | Description      |
|-------|--------|------------------|
| `id`  | string | Comment ObjectId |

**Request body:** None

**Success response:** `200`

```json
{
  "success": true,
  "message": "Comment deleted successfully."
}
```

**Error responses:**

| Status | Message                                                              |
|--------|----------------------------------------------------------------------|
| `401`  | `"Unauthorized: Authentication required."`                           |
| `403`  | `"Comment not found or you are not authorized to delete it."`        |
| `500`  | Server error message                                                 |

---

## Error Status Codes

| Code | Meaning                                      |
|------|----------------------------------------------|
| `200`| OK                                           |
| `201`| Created                                      |
| `400`| Bad request / validation failure             |
| `401`| Missing or invalid authentication            |
| `403`| Authenticated but not authorized             |
| `404`| Resource not found                           |
| `500`| Internal server error                        |

---

## Environment Variables

Copy `.env.example` to `.env` in the `server/` directory:

| Variable      | Description                          | Default                              |
|---------------|--------------------------------------|--------------------------------------|
| `PORT`        | HTTP port                            | `5000`                               |
| `MONGODB_URI` | MongoDB connection string            | `mongodb://127.0.0.1:27017/default_db` |
| `JWT_SECRET`  | Secret for signing/verifying JWTs      | *(required in production)*           |

---

## Route Summary

| Method   | Path                              | Auth     | Description                    |
|----------|-----------------------------------|----------|--------------------------------|
| `GET`    | `/`                               | No       | Server status string           |
| `GET`    | `/api/health`                     | No       | Health check JSON              |
| `POST`   | `/api/auth/register`              | No       | Register user                  |
| `POST`   | `/api/auth/login`                 | No       | Login, get JWT                 |
| `GET`    | `/api/users/me`                    | Yes      | Current user profile + stats   |
| `PATCH`  | `/api/users/:id`                   | Yes      | Update own profile             |
| `DELETE` | `/api/users/:id`                   | Yes      | Delete own account + posts     |
| `GET`    | `/api/post`                       | No       | List public posts              |
| `GET`    | `/api/post/myposts`               | Yes      | List own posts                 |
| `GET`    | `/api/post/:id`                   | No       | Get post by ID                 |
| `POST`   | `/api/post`                       | Yes      | Create post                    |
| `PATCH`  | `/api/post/:id`                   | Yes      | Update own post                |
| `DELETE` | `/api/post/:id`                   | Yes      | Delete own post                |
| `GET`    | `/api/comments/post/:postId`      | No       | Top-level comments on a post   |
| `GET`    | `/api/comments/:commentId/replies`| No       | Replies to a comment           |
| `POST`   | `/api/comments`                   | Yes      | Create comment or reply        |
| `DELETE` | `/api/comments/:id`               | Yes      | Delete comment (+ replies)     |
