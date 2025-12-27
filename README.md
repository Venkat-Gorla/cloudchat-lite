# CloudChat Lite – Full Stack Messaging App (v1)

> **Full-stack messaging app · React + AWS · Security-first backend design**  
> **Status:** Feature-complete prototype · Backend continued and refined in v2  
> **Scope of this document:** Backend architecture and implementation

CloudChat Lite is a **one-to-one messaging web application** built with **React on the frontend** and a **serverless AWS backend**.

This repository captures **v1 of the system**, with this document intentionally focusing on the **backend implementation**—highlighting strong fundamentals in **authentication, authorization, DynamoDB single-table design, and Infrastructure-as-Code**, while transparently documenting schema limitations that were resolved in **v2**.

## 🚀 Features

- One-to-one conversation model
- Fully asynchronous, stateless backend
- React-based web client (documented separately)
- Cognito-backed authentication with JWT validation
- Secure access-token verification using JWKs (RS256)
- Least-privilege IAM roles per Lambda
- DynamoDB single-table design (messages + metadata)
- CLI-based integration testing utilities
- Serverless Framework–managed infrastructure

## 🏗 Tech Stack

| Layer    | Category       | Technology / Description                   |
| -------- | -------------- | ------------------------------------------ |
| Frontend | Framework      | React (SPA)                                |
| Frontend | Communication  | REST-based communication with backend APIs |
| Backend  | Runtime        | Node.js (AWS Lambda)                       |
| Backend  | Infrastructure | AWS + Serverless Framework                 |
| Backend  | Authentication | Amazon Cognito (User Pools, JWT, JWKs)     |
| Backend  | Database       | Amazon DynamoDB                            |
| Backend  | Security       | `jsonwebtoken`, `jwks-rsa`                 |
| Backend  | Deployment     | Infrastructure-as-Code (`serverless.yml`)  |

## 📁 Project Structure

```
cloudchat-lite/
└── services/
    └── messaging-api/
        ├── handlers/           # Lambda entry points
        ├── utils/              # Auth and shared libraries
        ├── integration-test/   # CLI-based backend testing
        ├── constants.js        # Shared AWS config and identifiers
        ├── serverless.yml      # Infra + IAM definitions
        ├── lambda.yml          # Lambda deployment
        └── package.json        # Dependency management
└── react-client/
```

📌 **Note:**
Frontend documentation lives in `react-client/README.md` (placeholder).

## 🧱 Architecture

```
                        ┌─────────────────────┐
                        │   React Web Client  │
                        │   (SPA / Browser)   │
                        └─────────┬───────────┘
                                  │
                    REST API (JWT │ Access Token)
                                  │
                    ┌─────────────▼─────────────┐
                    │        AWS Lambda         │
                    │   (Stateless Handlers)    │
                    │───────────────────────────│
                    │ - Auth validation         │
                    │ - Conversation queries    │
                    │ - Message operations      │
                    └─────────────┬─────────────┘
                                  │
                 ┌────────────────▼────────────────┐
                 │      Authentication Boundary    │
                 │─────────────────────────────────│
                 │  Amazon Cognito User Pool       │
                 │  - User identity                │
                 │  - JWT issuer                   │
                 │  - JWKs (RS256)                 │
                 └────────────────┬────────────────┘
                                  │
                 Verify Access Token (JWT + JWKs)
                                  │
                    ┌─────────────▼─────────────┐
                    │        Data Layer         │
                    │───────────────────────────│
                    │   DynamoDB (Single Table) │
                    │                           │
                    │  - Conversation metadata  │
                    │  - Message items          │
                    │                           │
                    │  GSI:                     │
                    │  PK = user_id             │
                    │  SK = conversation_id     │
                    └─────────────┬─────────────┘
                                  │
                    Least-Privilege IAM Roles
                                  │
                        ┌─────────▼─────────┐
                        │     AWS IAM       │
                        │  (Per-Lambda)     │
                        └───────────────────┘
```

## 📚 Key Components

### Authentication & Authorization

- Cognito-based login flow
- Reusable JWT verification library
- Dynamic JWK resolution with caching
- Issuer validation and algorithm enforcement
- Structured auth results shared across Lambdas

### Messaging & Conversations

- Conversations queried via DynamoDB GSI
- User identity derived exclusively from access token
- Metadata rows enriched with sorted, de-duplicated participants

### Admin Model

- Users created by admin only
- End users can authenticate but not self-register
- Suitable for controlled, personal deployments

## 📦 Quick Start (Backend)

> Assumes AWS credentials with permissions to deploy Cognito, DynamoDB, and Lambda.

```bash
cd cloudchat-lite/services/messaging-api
npm install
serverless deploy
```

## 🧪 Testing

### Integration Testing Utilities

Located in `integration-test/`:

- **`ddb-messages-insert.js`**

  - Inserts realistic conversation metadata and message rows
  - Enables repeatable backend testing without frontend

- **`ddb-messages-fetch.js`**

  - CLI utility to query and print conversations/messages
  - Input: Cognito username
  - Validates access patterns and sorting behavior

## 📌 Project Goals

- Build a production-style full-stack messaging app
- Demonstrate secure, real-world Cognito integration
- Explore DynamoDB access patterns for chat workloads
- Apply Infrastructure-as-Code and least-privilege IAM
- Treat schema tradeoffs as explicit learning inputs

## 🔮 Known Limitations (v1) & v2 Fixes

> **These limitations are deliberate learning points and are fully addressed in v2.**

### v1 Limitations

- ❌ Limited scalability for high-volume conversations

- ❌ **Message sort key uses timestamp**

  - Risk of collisions and overwrites under concurrent writes

- ❌ **Conversation GSI uses**

  - `PK = user_id`
  - `SK = conversation_id`
  - Prevents server-side time-based sorting and pagination
  - Client must fetch all conversations and sort locally

### v2 Improvements

- ✅ Improved query patterns and scalability

- ✅ Message sort key uses **ULID**

  - Guarantees uniqueness and preserves time ordering

- ✅ Conversation GSI redesigned as:

  - `PK = user_id`
  - `SK = last_message_timestamp#conversation_id`
  - Enables efficient server-side sorting and pagination

📌 _See the v2 repository README for the evolved backend schema and access patterns._

## 🏷️ License

MIT License
