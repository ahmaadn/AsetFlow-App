# Public API Service

Public API service untuk mengakses asset secara publik tanpa autentikasi.

## Features

- 🔗 Public asset access via slug
- 📊 View count tracking
- 🔄 Redirect to Cloudinary
- 🎯 Asset filtering by type

## API Endpoints

### 1. Get Asset (Redirect)

Redirect ke Cloudinary URL dan increment view count.

```
GET /v1/:slugFolder/:slugAsset
```

**Example:**

```bash
curl -L http://localhost:3002/v1/my-folder/my-image

# Response: 301 Redirect to Cloudinary URL
```

### 2. List Folder Assets

Get all assets dalam folder dengan format URL.

```
GET /v1/:slugFolder?type={assetType}
```

**Query Parameters:**

- `type` (optional): Filter by asset type (`image`, `video`, `audio`, `document`)

**Example:**

```bash
curl http://localhost:3002/v1/my-folder?type=image

# Response:
{
  "asset-1": "http://localhost:3002/v1/my-folder/asset-1",
  "asset-2": "http://localhost:3002/v1/my-folder/asset-2"
}
```

## Environment Variables

```bash
PORT=3002
DATABASE_URL="your-database-url"
```

## Installation

```bash
# Install dependencies
pnpm install

# Build logger package
cd ../../packages/logger
pnpm build

# Run development
cd ../../services/public-api
pnpm dev

# Build for production
pnpm build

# Run production
pnpm start
```

## Usage in Frontend

```typescript
// Get public asset URL
const publicUrl = `http://localhost:3002/v1/${folderSlug}/${assetSlug}`;

// Use in image tag
<img src={publicUrl} alt="Asset" />

// Or use as direct link
<a href={publicUrl} target="_blank">View Asset</a>
```

## Features

### View Count Tracking

Setiap kali asset diakses melalui endpoint redirect, view count akan otomatis bertambah 1.

### Error Handling

- `404 Not Found`: Folder atau asset tidak ditemukan
- `500 Internal Server Error`: Server error

## Development

```bash
# Watch mode
pnpm dev

# Type check
pnpm type-check

# Lint
pnpm lint
```

## License

MIT
