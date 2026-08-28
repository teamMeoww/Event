# EventOne Backend

EventOne is an enterprise-grade, microservice-based backend for high-volume event ticketing, attendance tracking, blockchain verification, and AI-driven recommendations.

## Tech Stack
- **Core**: Java 21, Spring Boot 3.2
- **Persistence**: MongoDB, Redis
- **Event-Driven**: Kafka (Outbox Pattern)
- **Blockchain**: EVM-compatible (Web3j), Solidity
- **AI**: Spring AI (OpenAI)

## Architecture
See `FINAL_REPORT.md` for a comprehensive breakdown of the topology, domains, testing methodologies, and architectural decisions.

## Quickstart (Docker Compose)
To run the entire platform locally:
```bash
cp .env.example .env
docker-compose up --build
```

## Local Development (Maven)
```bash
cd backend-spring
./mvnw clean package
```
