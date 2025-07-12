// Dynamic configuration that works in all environments
export const getApiConfig = () => {
  // Check if we're in browser or server
  const isClient = typeof window !== 'undefined';
  
  // For server-side rendering, use internal Docker network
  if (!isClient) {
    return {
      apiUrl: 'http://backend:8000/api',
      baseUrl: 'http://backend:8000'
    };
  }
  
  // For client-side, detect environment dynamically
  const currentHost = window.location.host;
  const protocol = window.location.protocol;
  
  // Check if we're in development
  if (currentHost.includes('localhost') || currentHost.includes('127.0.0.1')) {
    return {
      apiUrl: 'http://localhost:8000/api',
      baseUrl: 'http://localhost:8000'
    };
  }
  
  // Check if we're in the OpenHands environment (work-* domains)
  if (currentHost.includes('work-2-')) {
    // Replace work-2 with work-1 for API calls
    const apiHost = currentHost.replace('work-2-', 'work-1-');
    return {
      apiUrl: `${protocol}//${apiHost}/api`,
      baseUrl: `${protocol}//${apiHost}`,
      useProxy: false
    };
  }
  
  // For production (Render, Vercel, etc.), check for environment variable
  const envApiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envApiUrl) {
    return {
      apiUrl: envApiUrl,
      baseUrl: envApiUrl.replace('/api', '')
    };
  }
  
  // Default fallback - assume API is on same host with /api path (proxy mode)
  return {
    apiUrl: `/api`,
    baseUrl: `${protocol}//${currentHost}`,
    useProxy: true
  };
};

// Get the current API configuration
export const apiConfig = getApiConfig();