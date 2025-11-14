# Turing Machine Frontend

A modern React frontend for the Turing Machine application built with TanStack Router, React Query, and Tailwind CSS.

## Overview

This frontend application provides a user interface for interacting with the Turing Machine backend API. It allows users to create, manage, and visualize Turing Machine tapes and their execution.

## Tech Stack

- **React 19** - UI library
- **TanStack Router** - Type-safe routing with file-based routing
- **TanStack React Query** - Server state management
- **Zustand** - Client state management
- **Vite** - Build tool and dev server (using Rolldown)
- **Tailwind CSS 4** - Utility-first CSS framework
- **Base UI Components** - Accessible component library
- **TypeScript** - Type safety
- **Lucide React** - Icon library

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn
- Backend server running (see backend README)

### Installation

1. **Install dependencies**:
pnpm install2. **Start development server**:
pnpm devThe app will be available at `http://localhost:5173` (or the next available port).

### Build for Production

pnpm buildThe built files will be in the `dist/` directory.

### Preview Production Build

pnpm startThis serves the production build using Vite's preview server.

## Project Structure


src/
├── api/                    # API client and endpoints
│   ├── client.ts          # API client configuration
│   └── endpoints/         # API endpoint definitions
│
├── app/                    # Route definitions (TanStack Router)
│   ├── __root.tsx         # Root route with layout
│   ├── index.tsx          # Home page route
│   ├── about.tsx          # About page route
│   ├── posts.tsx          # Posts page route
│   └── providers.tsx      # Providers page route
│
├── components/            # React components
│   ├── layout/           # Layout components
│   │   └── Main/         # Main layout wrapper
│   │       └── index.tsx
│   ├── pages/            # Page components
│   │   └── home-page.tsx
│   └── ui/               # Reusable UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── dialog.tsx
│       └── ... (many more Base UI components)
│
├── features/             # Feature modules (organized by feature)
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
│   └── utils.ts         # Common utilities (clsx, tailwind-merge)
├── types/                # TypeScript type definitions
├── assets/               # Static assets
│   └── index.css        # Global styles
├── main.tsx             # Application entry point
└── routeTree.gen.ts     # Auto-generated route tree (DO NOT EDIT)

```


