/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Environment variables for client-side
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '',
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || '',
  },
  
  // Only use rewrites if no direct backend URL is configured
  async rewrites() {
    // Skip rewrites if we have a direct backend URL configured
    if (process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL) {
      return [];
    }
    
    // Default rewrite for development and Docker environments
    const backendUrl = process.env.BACKEND_URL || 'http://backend:8000';

    // Check if backendUrl already includes /api
    const destination = backendUrl.endsWith('/api')
    ? `${backendUrl}/:path*`
    : `${backendUrl}/api/:path*`;
    
    return [
      {
        source: '/api/:path*',
        destination: destination,
      },
    ];
  },
  
  // Configure server for OpenHands and Render
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
