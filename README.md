# CloudChat Lite – Backend (v1)

> **Serverless messaging backend · AWS-native · Security-first design** > **Status:** Feature-complete prototype · Continued and refined in v2
> **Scope:** Backend only (frontend intentionally excluded)

CloudChat Lite is a **one-to-one messaging backend** designed to explore **secure, scalable serverless architectures on AWS**.
This repository captures **v1** of the backend—highlighting strong fundamentals in **authentication, authorization, DynamoDB access patterns, and Infrastructure-as-Code**, while transparently documenting design limitations later resolved in **v2**.

## 🚀 Features

- One-to-one conversation model
- Fully asynchronous, stateless backend
- Cognito-backed authentication with JWT validation
- Secure access-token verification using JWKs (RS256)
- Least-privilege IAM roles per Lambda
- DynamoDB single-table design (messages + metadata)
- CLI-based integration testing utilities
- Serverless Framework–managed infrastructure

## 🏗 Tech Stack

- **Runtime:** Node.js (AWS Lambda)
- **Infrastructure:** AWS + Serverless Framework
- **Authentication:** Amazon Cognito (User Pools, JWT, JWKs)
- **Database:** Amazon DynamoDB
- **Security:** `jsonwebtoken`, `jwks-rsa`
- **Deployment:** Infrastructure-as-Code (`serverless.yml`)

## 📁 Project Structure

```
cloudchat-lite/
└── services/
    └── messaging-api/
        ├── constants.js        # Shared AWS config and identifiers
        ├── handlers/           # Lambda entry points
        ├── utils/              # Auth and shared libraries
        ├── integration-test/   # CLI-based backend testing
        ├── serverless.yml      # Infra + IAM definitions
        ├── lambda.yml
        └── package.json
```

## 🧱 Architecture

- **Serverless-first design**

  - All compute via AWS Lambda
  - Stateless handlers

- **Authentication boundary**

  - Cognito User Pool for identity
  - JWT access tokens validated per request

- **Data layer**

  - DynamoDB single-table design
  - Messages and conversation metadata co-located

- **Security posture**

  - RS256 token validation using Cognito JWKs
  - IAM roles scoped per function (least privilege)

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
- Client-side sorting required (v1 tradeoff)

### Admin Model

- Users created by admin only
- End users can authenticate but not self-register
- Suitable for controlled, personal deployments

## 📦 Quick Start

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

- Demonstrate secure, production-style Cognito integration
- Explore DynamoDB access patterns for chat workloads
- Apply Infrastructure-as-Code and least-privilege IAM
- Build reusable authentication primitives for Lambdas
- Identify and document architectural tradeoffs early

## 🔮 Future Enhancements (Implemented in v2)

<!-- vegorla, refer v2 Readme -->

> **Known limitations in v1 are intentional learning points.**

- ❌ Mixed message + metadata rows in a single table
- ❌ No server-side pagination
- ❌ Limited scalability for high-volume conversations

**v2 addresses:**

- Refined DynamoDB schema
- Clear separation of concerns
- Improved query patterns and scalability
- Cleaner domain boundaries

📌 _See the v2 repository for the evolved backend architecture._

## 🏷️ License

MIT License
