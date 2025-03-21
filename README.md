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
   npm install
   ```
3. Create a `.env` file with the API URL:
   ```
   REACT_APP_API_BASE_URL=https://your-api-url.com
   ```
4. Start the development server:
   ```
   npm start
   ```

## Building for Production

```
npm run build
```

This will create a production build in the `build` directory.

## Deployment to Cloudflare Pages

1. Create a new Cloudflare Pages project
2. Connect your GitHub repository
3. Configure the build settings:
   - Build command: `npm run build`
   - Build output directory: `build`
4. Add environment variables:
   - `REACT_APP_API_BASE_URL`: Your API URL

## SPA Routing

This app uses client-side routing. The `functions/_middleware.js` file is configured to handle SPA routing in Cloudflare Pages.

## License

MIT
