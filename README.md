# AsetFlow

A modern, full-stack digital asset management system built with a monorepo architecture.

## 🚀 Features

- **Asset Management**: Upload, organize, and manage digital assets with ease
- **Folder Organization**: Hierarchical folder structure for better asset organization
- **Public API**: Share assets via public URLs with view tracking
- **Modern UI**: Built with Nuxt 3 and DaisyUI for a beautiful, responsive interface
- **Type-Safe**: Full TypeScript support across the entire stack
- **Monorepo Architecture**: Organized codebase with Turborepo

## 📦 Project Structure

```text
AsetFlow-App/
├── apps/
│ └── web/ # Frontend Nuxt application
├── packages/
│ ├── database/ # Prisma database schemas and migrations
│ ├── logger/ # Shared Logger for services
│ ├── shared/ # Shared utilities and helpers
│ ├── shared-types/ # Shared TypeScript types
│ └── validators/ # Zod validation schemas
├── services/
│ ├── backend-app/ # Backend API service
│ ├── public-service/ # Public asset delivery service
└── package.json
```

## 🛠️ Tech Stack

### Frontend

- **Nuxt 4** - Vue.js framework
- **TypeScript** - Type safety
- **Tailwind CSS** - CSS Framewrok
- **DaisyUI** - Tailwind CSS component library
- **Pinia** - State management

### Backend

- **Node.js** - Runtime environment
- **Prisma** - Database ORM
- **Express** (implied) - API framework
- **Zod** - Schema validation
- **Swagger** - API documentation
- **Multer** - File upload handling

### Tools

- **Turborepo** - Monorepo build system
- **pnpm** - Package manager
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 10.17.1+
- PostgreSQL database

## 🏗️ Key Features

### Asset Management

- [x] Upload and store digital assets
- [x] Support for multiple file types (images, documents, etc.)
- [ ] Automatic thumbnail generation
- [x] Asset metadata tracking (views, dimensions, size)

### Organization

- [x] Folder-based organization
- [x] Slug-based URLs for clean asset links
- [ ] Asset search and filtering

### Public API

- [x] Public asset delivery via slugs
- [x] View count tracking
- [x] CORS support for cross-origin requests

### Security

- [x] User authentication
- [ ] Role-based access control
- [x] Secure file storage
