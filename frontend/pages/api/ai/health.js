// Specific API proxy for AI health endpoint
export default async function handler(req, res) {
    console.log(`AI Health proxy: ${req.method} ${req.url}`);
  
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.status(200).end();
      return;
    }
  
    // Get backend URL from environment variable or fallback
    const backendBaseUrl = process.env.BACKEND_URL || 'http://backend:8000/api';
    const backendUrl = backendBaseUrl.endsWith('/api')
      ? `${backendBaseUrl}/ai/health/`
      : `${backendBaseUrl}/api/ai/health/`;
  
    console.log(`Proxying AI health ${req.method} -> ${backendUrl}`);
  
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
      console.error('AI Health proxy error:', error);
      res.status(500).json({ error: 'Proxy error', details: error.message });
    }
  }