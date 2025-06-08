# REM Waste

[![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=nodedotjs)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18.2-lightgrey?logo=express)](https://expressjs.com/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-purple?logo=vite)](https://vitejs.dev/)

This repository contains a production-grade, full-stack e-commerce application for REM Waste, engineered for high performance and scalability.

## 🚀 Live Demo

You can access the live application here: [https://8c7e8e9f-4326-4a98-b9ab-2b8679f02aad-00-1zyg3gvh9x44v.worf.replit.dev/](https://8c7e8e9f-4326-4a98-b9ab-2b8679f02aad-00-1zyg3gvh9x44v.worf.replit.dev/)

## ✨ Key Architectural & Technical Highlights

This project is more than a simple e-commerce application; it's a production-grade boilerplate engineered for scalability, performance, and maintainability, aligning with modern FAANG-level standards.

### Architecture & Design Patterns

-   **Scalable Monorepo:** Organized as a monorepo using `npm workspaces`, containing separate `client`, `server`, and `shared` packages for clean separation of concerns and streamlined development.
-   **Backend-for-Frontend (BFF) Pattern:** The Express.js server acts as a BFF, decoupling the client from external data sources. This enhances security by hiding API keys, improves performance via server-side caching, and simplifies client-side data fetching.
-   **Clean, Layered Backend:** The server follows a clean architecture with distinct layers for controllers and services, promoting separation of concerns and testability.
-   **End-to-End Type Safety:** A dedicated `shared` package provides TypeScript types and data transformation logic used by both the client and server, ensuring robust type safety across the entire stack and eliminating API contract mismatches.
-   **SOLID & DRY Principles:** The architecture adheres to principles like Single Responsibility (e.g., `useProducts` hook, `cache.service.ts`) and Don't Repeat Yourself (e.g., the `shared` package).

### Performance & Scalability

-   **Built for Large Datasets:** The application is designed to handle millions of products efficiently.
    -   **API Pagination:** The backend API is paginated to deliver data in manageable chunks.
    -   **List Virtualization:** The frontend uses `@tanstack/react-virtual` to render only the visible items in a list, ensuring smooth scrolling and low memory usage even with massive datasets.
-   **Advanced Caching:**
    -   **Server-Side Caching:** An in-memory LRU cache (`lru-cache`) is implemented on the server to minimize latency and reduce load on external APIs.
    -   **Client-Side Caching:** TanStack Query provides sophisticated client-side caching, request deduplication, and background refetching out of the box.
-   **Optimized Data Fetching:** Implements a resilient `fetchWithRetry` mechanism on both client and server to handle transient network errors gracefully.
-   **Ready for Modern Deployment:** The decoupled architecture is primed for advanced deployment strategies like Server-Side Rendering (SSR) or Static Site Generation (SSG) to optimize SEO and initial load times.

### React & TypeScript Best Practices

-   **Modern React:** Employs the latest React features and best practices.
    -   **Custom Hooks:** Business logic is cleanly abstracted into reusable hooks (e.g., `useProducts`).
    -   **Context Abstraction:** UI state is managed via a clean Context API (`ProductProvider`), avoiding prop-drilling.
    -   **Intelligent State Management:** Correctly distinguishes between server state (managed by **TanStack Query**) and global UI state (managed by **React Context**), which is a hallmark of modern, high-performance React applications.
-   **Effective TypeScript:** Leverages TypeScript to its full potential, not just for basic type definitions but for creating a strongly-typed, maintainable, and less error-prone codebase.

## 🛠️ Tech Stack

### Frontend

| Dependency                 | Version | Description                               |
| -------------------------- | ------- | ----------------------------------------- |
| **React**                  | 18.3.1  | A JavaScript library for building user interfaces |
| **Vite**                   | 6.3.5   | Next-generation frontend tooling          |
| **TypeScript**             | 5.3.3   | Typed superset of JavaScript              |
| **Tailwind CSS**           | 3.4.0   | A utility-first CSS framework             |
| **TanStack Query**         | 5.80.6  | Data-fetching and state management        |
| **React Router**           | 6.21.1  | Declarative routing for React             |
| **Axios**                  | 1.6.2   | Promise based HTTP client                 |
| **Framer Motion**          | 12.16.0 | A production-ready motion library for React |
| **ESLint & Prettier**      | -       | For code linting and formatting           |

### Backend

| Dependency            | Version | Description                             |
| --------------------- | ------- | --------------------------------------- |
| **Node.js**           | 18+     | JavaScript runtime                      |
| **Express.js**        | 4.18.2  | Fast, unopinionated, minimalist web framework for Node.js |
| **TypeScript**        | 5.3.3   | Typed superset of JavaScript            |
| **Nodemon**           | 3.1.10  | Monitors for changes and automatically restarts the server |
| **tsx**               | 4.7.1   | Node.js enhanced with TypeScript      |
| **dotenv**            | 16.3.1  | Loads environment variables from a `.env` file |
| **LRU Cache**         | 10.0.1  | In-memory caching                       |
| **ESLint & Prettier** | -       | For code linting and formatting         |


## 📂 Project Structure

This project is a monorepo containing two main packages:

-   `client/`: A React application built with Vite.
-   `server/`: An Express.js server.
-   `shared/`: Contains shared types and utilities between the client and server.

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18 or higher recommended)
-   npm, yarn, or pnpm

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/WEB-DEVELOPER-ENGINEER/REM-Waste.git
    ```

2.  Navigate to the project directory:

    ```bash
    cd REM-Waste
    ```

3.  Install dependencies from the root directory. This will install dependencies for both the `client` and `server`.

    ```bash
    npm install
    ```

### Running the Application

You can run both the client and server concurrently with a single command from the root directory:

```bash
npm run dev
```

This will start:
- The React development server on `http://localhost:5173` (or the next available port).
- The Express backend server on `http://localhost:5000` (or as configured in `server/.env`).


## 📜 Available Scripts

### Root

| Script        | Description                                  |
| ------------- | -------------------------------------------- |
| `npm run dev` | Starts both client and server in development mode. |
| `npm install` | Installs dependencies for all workspaces.    |
| `npm run build` | Builds both client and server for production. |

### Client (`client/`)

| Script                  | Description                                |
| ----------------------- | ------------------------------------------ |
| `npm run start`         | Starts the Vite development server.        |
| `npm run build`         | Builds the application for production.     |
| `npm run preview`       | Previews the production build.             |
| `npm run lint`          | Lints the source code.                     |
| `npm run lint:fix`      | Lints and fixes the source code.           |
| `npm run format`        | Formats the code with Prettier.            |
| `npm run type-check`    | Performs a TypeScript type check.          |

### Server (`server/`)

| Script               | Description                                |
| -------------------- | ------------------------------------------ |
| `npm run dev`        | Starts the server in development mode with hot-reloading using `nodemon`. |
| `npm run build`      | Compiles TypeScript to JavaScript.         |
| `npm run start`      | Starts the production server.              |
| `npm run lint`       | Lints the source code.                     |
| `npm run lint:fix`   | Lints and fixes the source code.           |
| `npm run type-check` | Performs a TypeScript type check.          |