# 💬 CloudChat Lite — React Client (v1)

> **Production-style React SPA · Auth-aware routing · API-driven state management**  
> **Scope:** Frontend architecture, React patterns, and client-side integration

CloudChat Lite’s React client is a **single-page application** built to demonstrate modern React fundamentals: **composition, state isolation, async data management, routing, and backend integration**—with clear separation of concerns and production-oriented structure.

## Implemented Use Cases

- User authentication (login flow)
- Address book retrieval and display
  - Client-side user search
- Conversation list retrieval for authenticated user

## Not Implemented (v1)

- Message list retrieval and rendering per conversation

## Core Frontend Capabilities

### Application Architecture

- Root composition via **nested context providers**
  - `AuthProvider` for authentication state
  - `PhonebookProvider` for contact data
- Centralized routing layer (`AppRoutes`)
- Explicit separation between **pages**, **components**, **hooks**, and **API layer**

### Routing & Access Control

- **React Router** for SPA navigation
- **Protected routes** enforcing authentication boundaries
- Predictable redirect behavior for unknown paths

### State & Data Management

- **React Context** for global, cross-cutting concerns
- **Custom hooks** encapsulating domain logic and side effects
- **React Query**
  - Server-state management for conversations
  - Caching, refetching, and lifecycle control

### Backend Integration

- **Axios abstraction layer** (`src/api/client.js`)
- Centralized HTTP configuration and auth token handling
- Explicit GET / POST helpers aligned with backend Lambdas

```js
callLambdaWithPost(endpoint, payload, accessToken);
callLambdaWithGet(endpoint, queryParams, accessToken);
```

### UI & Layout

- **Bootstrap** for responsive, column-based layouts
- Clear separation of layout vs. business logic
- Component-driven page composition

## Status

Frontend v1 is intentionally scoped to **authentication, contacts, and conversation discovery**.
The client cleanly demonstrates extensibility for message rendering and pagination in later iterations.
