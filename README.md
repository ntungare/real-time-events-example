# Real-Time Events Example

This repository demonstrates multiple approaches to building real-time event-driven applications using different server and client technologies. It includes implementations using WebSockets and Server-Sent Events (SSE) with both Node.js and Spring Boot backends, as well as a modern TypeScript/React frontend.

## Project Structure

- **main-server/**: Spring Boot server (main server, acts as a proxy for the other servers)
- **sse-spring-server/**: Spring Boot server with Server-Sent Events (SSE)
- **ws-spring-server/**: Spring Boot server with WebSocket support
- **ws-node-server/**: Node.js server with WebSocket support
- **ui-server/**: TypeScript/React frontend (Vite-based)

## Features

- Real-time chat/message streaming using WebSockets and SSE
- Multiple backend implementations (Node.js, Spring Boot)
- Modern React frontend with Vite
- Example code for integrating real-time APIs

## Getting Started

### Prerequisites
- Node.js (for frontend and ws-node-server)
- Java 25+ (for Spring Boot servers)
- pnpm (for managing JS/TS dependencies)

### Install Dependencies

```sh
# Install JS/TS dependencies
pnpm install
```

### Running the Servers

#### Spring Boot Servers

Each Spring Boot server can be started from its directory:

```sh
cd main-server
./gradlew bootRun
```

Repeat for `sse-spring-server` and `ws-spring-server` as needed.

#### Node.js WebSocket Server

```sh
cd ws-node-server
pnpm install
pnpm run start:dev
```

#### UI Server (Frontend)

```sh
cd ui-server
pnpm install
pnpm run start:dev
```

The frontend will be available at [http://localhost:8080/ui/\<route\>](http://localhost:8080/ui/<route>) by default (where `<route>` refers to one of below).


## Routes

The UI server provides the following routes for testing different real-time backends:

- `/chatNode`: Connects to the Node.js WebSocket backend
- `/chatSpring`: Connects to the Spring Boot WebSocket backend
- `/chatSse`: Connects to the Spring Boot SSE backend

## Usage

- Open the frontend in your browser.
- Navigate to one of the above routes to test the corresponding backend.
- Choose a backend (Node WebSocket, Spring WebSocket, or Spring SSE) to connect and test real-time messaging.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please open issues or pull requests for improvements or bug fixes.
