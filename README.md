# Pact Contract Testing Demo

A demonstration project showing how to implement [Pact](https://pact.io/) contract testing between two APIs using TypeScript.

Contract testing ensures that a **consumer** (an API client) and a **provider** (an API server) agree on the shape of their interactions, without requiring both services to be running at the same time.

## Project Structure

```
.
├── consumer/              # Consumer service (Express API)
│   ├── api/api.ts         # UserRepository — HTTP client calling the provider
│   ├── index.ts           # Consumer entrypoint
│   └── __test__/contract/ # Consumer-side pact test (generates the contract)
├── provider/              # Provider service (Express API)
│   ├── src/http/server.ts # Express server exposing GET /users/:id
│   ├── index.ts           # Provider entrypoint
│   └── __test__/contract/ # Provider-side pact test (verifies the contract)
├── compose.yaml           # Docker Compose for Pact Broker + PostgreSQL
├── package.json
└── tsconfig.json
```

**Consumer** — An Express API that calls the provider's `GET /users/:id` endpoint through a `UserRepository` client.

**Provider** — An Express API that exposes `GET /users/:id` and returns user data.

## Tech Stack

- TypeScript + Node.js
- Express 5
- Pact (v16) for contract testing
- Vitest as the test runner
- Pact Broker (Docker) for contract storage and verification tracking

## Prerequisites

- Node.js (v20+)
- pnpm
- Docker & Docker Compose

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start the Pact Broker

The Pact Broker provides a central place to share contracts and verification results. Start it with Docker Compose:

```bash
docker compose up -d
```

The broker will be available at [http://localhost:9292](http://localhost:9292) (credentials: `pact` / `pact`).

### 3. Run the services (optional)

You can start both services independently for manual testing:

```bash
# Start the provider
pnpm start:provider

# Start the consumer
pnpm start:consumer
```

## Contract Testing Workflow

The full workflow follows the Pact lifecycle: **generate** the contract on the consumer side, **publish** it to the broker, **verify** it on the provider side, and check deployment safety with **can-i-deploy**.

### Step 1 — Generate the Pact (Consumer Side)

The consumer test defines the expected interactions with the provider and generates a pact file:

```bash
pnpm test:consumer
```

This starts a local Pact mock server, runs the consumer's expectations against it, and outputs a pact JSON file to `consumer/pacts/`.

### Step 2 — Publish the Pact to the Broker

Push the generated contract to the Pact Broker so the provider can access it:

```bash
pnpm pact:publish
```

You can view the published contract in the broker UI at [http://localhost:9292](http://localhost:9292).

### Step 3 — Verify the Pact (Provider Side)

The provider test fetches the contract from the broker and replays the interactions against the real provider:

```bash
pnpm test:provider
```

If all interactions match, the verification result is published back to the broker.

### Step 4 — Can I Deploy?

Before deploying the consumer, check whether its contract has been successfully verified by the provider:

```bash
pnpm pact:can-i-deploy
```

This queries the broker and returns a pass/fail result indicating whether it is safe to deploy.

## How It Works

1. The **consumer test** declares: *"When I call `GET /users/1`, I expect a JSON response with `id` and `firstName`."* Pact records this as a contract.
2. The contract is **published** to the Pact Broker.
3. The **provider test** replays the contract against its real HTTP server. If the provider returns responses matching the contract, verification passes.
4. **can-i-deploy** acts as a CI gate — it checks the broker to confirm that all contracts between services are verified before allowing a deployment.

## Breaking the Contract

The provider includes a commented-out example in `provider/src/http/server.ts` that demonstrates what happens when the provider introduces a breaking change.

The current response shape (`UserV1`) matches the consumer's expectations:

```json
{ "id": "1", "firstName": "John Doe" }
```

If you uncomment the `UserV2` line and comment out `UserV1`, the response shape changes to:

```json
{ "id": "1", "name": { "first": "John Doe" } }
```

The `firstName` field the consumer depends on is replaced by a nested `name.first` structure. Running `pnpm test:provider` will now **fail** — Pact detects that the provider no longer satisfies the contract, catching the breaking change before it reaches production.

## Resources

- [Pact Documentation](https://docs.pact.io/)
- [Pact JS](https://github.com/pact-foundation/pact-js)
- [Pact Broker](https://github.com/pact-foundation/pact_broker)
- [Pact Workshop JS](https://github.com/pact-foundation/pact-workshop-js)
