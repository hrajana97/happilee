# Happilee

A modern wedding planning application built with Next.js and Express.

## Project Structure

```
.
├── app/                  # Next.js app directory (routes and pages)
├── components/          # React components
├── api/                 # Express backend API
├── lib/                 # Shared utilities and helpers
├── hooks/              # React custom hooks
├── styles/             # Global styles and CSS modules
└── public/             # Static assets
```

## Development Setup

### Prerequisites

- Docker and Docker Compose
- Node.js 20.x (for local development without Docker)
- npm or yarn

### Running with Docker

For development:
```bash
docker-compose -f docker-compose.dev.yml up --build
```

For production:
```bash
docker-compose up --build
```

### Development vs Production

The project uses different Docker configurations for development and production environments:

#### Development (`docker-compose.dev.yml`)
- Hot reloading enabled for both frontend and API
- Source code mounted via volumes for instant updates
- Development servers with detailed error messages
- Source maps and debugging tools enabled
- File watchers active for automatic rebuilds
- Development-specific environment variables

#### Production (`docker-compose.yml`)
- Optimized builds with minimized bundles
- No source code mounting
- Production-grade Node.js server
- No development tools or hot reloading
- Better security and performance
- Smaller container sizes
- More efficient resource usage

### Environment Variables

Frontend:
- `NODE_ENV`: Set to 'development' or 'production'
- `API_URL`: Internal Docker network URL for API
- `NEXT_PUBLIC_API_URL`: Public-facing API URL

API:
- `NODE_ENV`: Set to 'development' or 'production'
- `PORT`: API server port (default: 4000)

### Available Scripts

Frontend:
- `npm run dev`: Start development server
- `npm run build`: Create production build
- `npm start`: Start production server

API:
- `npm run dev`: Start development server with hot reload
- `npm start`: Start production server

### Ports

- Frontend: http://localhost:3001
- API: http://localhost:4000

## Contributing

1. Use the development Docker setup
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## Troubleshooting

### Hot Reload Issues
If hot reloading isn't working:
1. Ensure you're using the dev configuration
2. Check if file watchers are running
3. Verify volume mounts are correct

### Container Issues
If containers aren't starting:
1. Check Docker logs
2. Verify ports aren't in use
3. Ensure all services are healthy 