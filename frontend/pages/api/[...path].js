// API proxy to forward requests to the backend
export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).end();
    return;
  }

  const { path } = req.query;
  const apiPath = Array.isArray(path) ? path.join('/') : path;
  
  // Add query parameters if they exist
  const queryString = new URLSearchParams(req.query);
  queryString.delete('path'); // Remove the path parameter
  const queryStr = queryString.toString();
  
  // Get backend URL from environment variable or fallback
  const backendBaseUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://backend:8000';

  // Check if backendBaseUrl already includes /api
  const baseUrl = backendBaseUrl.endsWith('/api') ? backendBaseUrl : `${backendBaseUrl}/api`;
  const backendUrl = `${baseUrl}/${apiPath}${queryStr ? `?${queryStr}` : ''}`;
  
  console.log(`Proxying ${req.method} ${req.url} -> ${backendUrl}`);
  
  try {
    const fetchOptions = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      fetchOptions.body = JSON.stringify(req.body);
    }
    
    const response = await fetch(backendUrl, fetchOptions);
    
    const data = await response.text();
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    res.status(response.status);
    
    // Try to parse as JSON, fallback to text
    try {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    } catch {
      res.send(data);
    }
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy error', details: error.message });
  }
}