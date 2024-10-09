# Sprites Monorepo

## Overview

Welcome to the Sprites Monorepo! This repository contains both the frontend and backend components of the Sprites project. It is structured to facilitate efficient development and deployment of the application.

## Project Structure

- **frontend/**: Contains the source code and assets for the frontend application built with Vite and React.
- **backend/**: Contains the source code for the backend services.
- **package.json**: Defines scripts and dependencies for the entire monorepo.

## Getting Started

To get started with the project, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/siamakf/sprites
   cd sprites
   ```

2. **Install dependencies for both frontend and backend**:

   ```bash
   npm install --workspaces
   ```

3. **Run the development servers**:

   ```bash
   npm run dev
   ```

   This will start both the frontend and backend development servers concurrently.

## Available Scripts

- **`npm run dev`**: Starts both the frontend and backend development servers.
- **`npm run build:frontend`**: Builds the frontend application for production.
- **`npm run build:backend`**: Builds the backend services.
- **`npm run lint:frontend`**: Lints the frontend codebase using ESLint.
- **`npm run format`**: Formats the codebase using Prettier.

## Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **Vite**: A fast build tool and development server for the frontend.
- **TypeScript**: A typed superset of JavaScript.
- **Node.js**: JavaScript runtime for the backend.
