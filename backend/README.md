# Backend API

Node.js + Express.js backend for the music streaming application.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file:
   ```bash
   cp ../.env.example .env
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with hot reload

## API Endpoints

### Health Check
- **GET** `/api/health` - Server health status

## Project Structure

```
backend/
├── src/
│   ├── routes/         # API route definitions
│   ├── controllers/    # Request handlers
│   ├── services/       # Business logic (future)
│   ├── middleware/     # Custom middleware (future)
│   ├── config/         # Configuration files (future)
│   └── app.js          # Express app setup
├── package.json
└── README.md
```

## Environment Variables

See `.env.example` in the root directory for required environment variables.

## Tech Stack

- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **Nodemon** - Development auto-reload
