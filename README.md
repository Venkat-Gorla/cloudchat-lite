# 💬 CloudChat Lite – Full Stack Messaging App (v1)

![AWS](https://img.shields.io/badge/AWS-Serverless-orange)
![Node.js](https://img.shields.io/badge/Node.js-Lambda-green)
![DynamoDB](https://img.shields.io/badge/DynamoDB-Single--Table-blue)
![Cognito](https://img.shields.io/badge/Auth-Amazon%20Cognito-purple)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

> **Full-stack messaging app · React + AWS · Security-first backend design**  
> **Status:** Feature-complete prototype · Backend continued and refined in v2  
> **Scope of this document:** Backend architecture and implementation

CloudChat Lite is a **one-to-one messaging web application** built with **React on the frontend** and a **serverless AWS backend**.

This repository captures **v1 of the system**, with this document intentionally focusing on the **backend implementation**—highlighting strong fundamentals in **authentication, authorization, DynamoDB single-table design, and Infrastructure-as-Code**, while transparently documenting schema limitations that were resolved in **v2**.

## 📑 Table of Contents

- [🚀 Features](#-features)
- [🏗 Tech Stack (Backend)](#-tech-stack-backend)
- [📁 Project Structure](#-project-structure)
- [🧱 Architecture](#-architecture)
- [📚 Key Components](#-key-components)
- [📦 Quick Start (Backend)](#-quick-start-backend)
- [🧪 Testing](#-testing)
- [📌 Project Goals](#-project-goals)
- [🔮 Known Limitations (v1) & v2 Fixes](#-known-limitations-v1--v2-fixes)
- [🧠 What I’d Do Differently If Starting Today](#-what-id-do-differently-if-starting-today)
- [🏷️ License](#-license)

## 🚀 Features

- One-to-one messaging with a stateless, serverless backend
- Secure Cognito authentication with JWT + JWK-based verification
- DynamoDB single-table design for messages and conversations
- Least-privilege IAM enforced per Lambda
- CLI-based end-to-end integration and auth testing
- React web client (documented separately)

## 🏗 Tech Stack (Backend)

| Area           | Technology / Description                  |
| -------------- | ----------------------------------------- |
| Runtime        | Node.js (AWS Lambda)                      |
| Infrastructure | AWS + Serverless Framework                |
| Authentication | Amazon Cognito (User Pools, JWT, JWKs)    |
| Database       | Amazon DynamoDB (single-table design)     |
| Security       | `jsonwebtoken`, `jwks-rsa`                |
| Deployment     | Infrastructure-as-Code (`serverless.yml`) |

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
                    ┌─────────────▼───────────────┐
                    │        AWS Lambda           │
                    │   (Stateless Handlers)      │
                    │─────────────────────────────│
                    │ - Auth validation           │
                    │ - Conversation queries      │
                    │ - Message operations        │
                    │ - List users (address book) │
                    └─────────────┬───────────────┘
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

### 🔐 Security Posture

**Security:** API Gateway–only access, Cognito JWT authentication, JWK-based token verification, strict IAM scoping, and conservative throttling for abuse and cost protection.

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

### Operational & Integration Tooling

Located in `integration-test/`:

- **`ddb-messages-insert.js`**

  - Inserts realistic conversation metadata and message rows
  - Enables repeatable backend testing without frontend dependency

- **`ddb-messages-fetch.js`**

  - CLI utility to fetch and print conversations and messages
  - Input: Cognito username
  - Validates DynamoDB access patterns and sorting behavior

- **`auth/admin-cli.js`**

  - Admin CLI for creating new Cognito users
  - Exercises Cognito admin APIs used by the backend

- **`auth/login-cli.js`**

  - End-user login via Cognito
  - Validates returned ID and access tokens
  - Used to verify authentication and token integrity

- **`auth/get-conversations-cli.js`**

  - Authenticates a user via Cognito
  - Fetches conversations using real access tokens
  - Validates end-to-end auth → Lambda → DynamoDB flow

- **`auth/list-users-cli.js`**

  - Authenticates and lists Cognito users
  - Acts as an address book for initiating conversations

### ✅ Tests in Action

```bash
node ddb-messages-fetch.js alice
```

**Test Output:**

```
Fetching conversations for user: alice

Convo: CONV#alice#bob
 Participants: [ 'alice', 'bob' ]
 - [alice] Hi Bob!
 - [bob] Hey Alice!
Convo: CONV#alice#carol
 Participants: [ 'alice', 'carol' ]
 - [carol] Hi Alice!
 - [alice] How are you Carol?
```

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

## 🧠 What I’d Do Differently If Starting Today

I would design DynamoDB GSIs directly from access patterns, even when pagination initially appears unnecessary. As requirements evolved, I refined the schema to encode time-ordering into GSI sort keys, enabling server-side sorting while preserving the single-table design.

## 🏷️ License

MIT License
