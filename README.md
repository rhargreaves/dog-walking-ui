# Dog Walking UI

Frontend React SPA for the [Dog Walking Service](https://github.com/rhargreaves/dog-walking).

> [!CAUTION]
> The code here has almost entirely been produced by AI :sparkles: since I am not a natural front-end developer. It is a quick-and-dirty UI which I am using to drive out new features for the underlying API. Do not judge me on it! :smile:

## Features

- View all registered dogs
- Register new dogs
- Update existing dog profiles
- Upload dog photos
- Automatic breed detection from photos
- Authentication with AWS Cognito
- Protected routes for authorized users

## Development Setup

### Prerequisites

- Node.js (v16 or newer)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
```
npm install
```

### Running the Application

For local development, the application uses a fake backend server that includes both authentication and API endpoints:

```
npm run dev
```

This will start both:
- The React application on port 3001
- A local development server on port 3002 (for authentication and API)

### Authentication

In development mode, the application uses a local authentication server. You can log in with any username and password.

In production, the application uses AWS Cognito for authentication. The authentication flow includes:

1. User login via Cognito
2. JWT token storage and management
3. Protected routes that require authentication

### Environment Variables

Create a `.env` file with the following variables for production:

```
REACT_APP_API_BASE_URL=https://your-api-domain.com
REACT_APP_COGNITO_USER_POOL_ID=your-cognito-user-pool-id
REACT_APP_COGNITO_CLIENT_ID=your-cognito-client-id
REACT_APP_AWS_REGION=your-aws-region
```

## Deployment

This application is deployed to Cloudflare Pages. Use the Makefile to handle deployment:

```
make deploy-preview  # Deploy to preview environment
make deploy-prod     # Deploy to production environment
```

## Server Communication

The API service for the application includes endpoints for:
- Managing dogs (CRUD operations)
- Uploading dog photos
- Detecting dog breeds from photos

In development mode, all API requests go to the local development server on port 3002.
In production, requests go to the real API defined by REACT_APP_API_BASE_URL.

## Building for Production

```
make build
```

This will create a production build in the `build` directory.

## SPA Routing

This app uses client-side routing. The `functions/_middleware.js` file is configured to handle SPA routing in Cloudflare Pages.

## License

MIT
