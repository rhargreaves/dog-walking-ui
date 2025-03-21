// Handle SPA routing in Cloudflare Pages
export async function onRequest(context) {
  const url = new URL(context.request.url);

  // Check if the request is for an asset (image, JS, CSS, etc.)
  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
    return await context.next();
  }

  // For API requests, pass them through
  if (url.pathname.startsWith('/api/')) {
    return await context.next();
  }

  // For all other routes, serve the index.html (SPA routing)
  const response = await context.env.ASSETS.fetch('https://dog-walking-ui.pages.dev/index.html');
  return new Response(response.body, response);
}