# Dog Walking UI

Frontend React SPA for the [Dog Walking Service](https://github.com/rhargreaves/dog-walking).

## Features

- View all registered dogs
- Register new dogs
- Update existing dog profiles
- Upload dog photos
- Automatic breed detection from photos

## Development

### Prerequisites

- Node.js 16+ and npm

### Setup

1. Clone the repository
2. Install dependencies:
   ```
   make install
   ```
3. Create a `.env` file with the API URL:
   ```
   REACT_APP_API_BASE_URL=https://your-api-url.com
   ```
4. Start the development server:
   ```
   make start
   ```

## Building for Production

```
make build
```

This will create a production build in the `build` directory.

## Deploying to Cloudflare Pages

### Initial Setup

1. Login to Cloudflare:
   ```
   make login
   ```

2. Create a new Cloudflare Pages project:
   ```
   make create-project
   ```

3. Set the API URL for development and production environments:
   ```
   make set-env-dev API_URL=https://dev-api.example.com
   make set-env-prod API_URL=https://api.example.com
   ```

### Deployment

To deploy to development environment:
```
make deploy
```

To deploy to production:
```
make deploy-prod
```

You can override the project name and API URL:
```
make deploy-prod PROJECT_NAME=my-project API_URL=https://my-api.example.com
```

## SPA Routing

This app uses client-side routing. The `functions/_middleware.js` file is configured to handle SPA routing in Cloudflare Pages.

## License

MIT
