# 💬 CloudChat Lite — React Client (v1)

> **Production-style React SPA · Auth-aware routing · API-driven state management**  
> **Scope:** Frontend architecture, React patterns, and client-side integration

CloudChat Lite’s React client is a **single-page application** built to demonstrate modern React fundamentals: **composition, state isolation, async data management, routing, and backend integration**—with clear separation of concerns and production-oriented structure.

## 🏗 Tech Stack & Frontend Capabilities

| Area                    | Technology / Implementation                                  |
| ----------------------- | ------------------------------------------------------------ |
| Framework               | React (Vite-based SPA)                                       |
| Routing                 | React Router (protected routes, redirects)                   |
| State Management        | React Context + custom hooks                                 |
| Server State            | React Query (conversation list caching & lifecycle handling) |
| API Integration         | Axios with centralized abstraction layer                     |
| Authentication Handling | Context-driven auth state + route guards                     |
| UI & Layout             | Bootstrap (responsive, column-based layout)                  |
| Architecture            | Feature-based folders, clear separation of concerns          |

## Implemented Use Cases

- User authentication (login flow)
- Address book retrieval and display
  - Client-side user search
- Conversation list retrieval for authenticated user

## Not Implemented (v1)

- Message list retrieval and rendering per conversation

## Architecture Notes (Selective Detail)

### Application Composition

- Root composition via **nested context providers**
  - `AuthProvider` for authentication state
  - `PhonebookProvider` for shared contact data
- Centralized routing via `AppRoutes`
- Explicit separation between **pages**, **components**, **hooks**, and **API layer**

### Backend Integration

- Axios abstraction located at `src/api/client.js`
- Consistent GET / POST helpers aligned with backend Lambdas

```js
callLambdaWithPost(endpoint, payload, accessToken);
callLambdaWithGet(endpoint, queryParams, accessToken);
```

## Status

Frontend v1 is intentionally scoped to **authentication, contacts, and conversation discovery**.
The client is structured to support message rendering, pagination, and richer UI state in subsequent iterations.
