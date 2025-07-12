import { getApiConfig } from './config';

// Universal fetcher that works in all environments
export const fetcher = async (url) => {
  const { apiUrl } = getApiConfig();
  
  // Ensure URL starts with /
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  const fullUrl = `${apiUrl}${cleanUrl}`;
  
  console.log(`Fetching: ${fullUrl}`);
  
  try {
    const res = await fetch(fullUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const error = new Error(`HTTP ${res.status}: ${res.statusText}`);
      
      // Try to get error details from response
      try {
        const errorData = await res.json();
        error.info = errorData;
      } catch {
        error.info = { detail: `Failed to fetch from ${fullUrl}` };
      }
      
      error.status = res.status;
      throw error;
    }
    
    return res.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

// POST request helper
export const postData = async (url, data) => {
  const { apiUrl } = getApiConfig();
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  const fullUrl = `${apiUrl}${cleanUrl}`;
  
  const res = await fetch(fullUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = new Error(`HTTP ${res.status}: ${res.statusText}`);
    try {
      error.info = await res.json();
    } catch {
      error.info = { detail: `Failed to post to ${fullUrl}` };
    }
    error.status = res.status;
    throw error;
  }

  return res.json();
};

// PUT request helper
export const putData = async (url, data) => {
  const { apiUrl } = getApiConfig();
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  const fullUrl = `${apiUrl}${cleanUrl}`;
  
  const res = await fetch(fullUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = new Error(`HTTP ${res.status}: ${res.statusText}`);
    try {
      error.info = await res.json();
    } catch {
      error.info = { detail: `Failed to put to ${fullUrl}` };
    }
    error.status = res.status;
    throw error;
  }

  return res.json();
};

// DELETE request helper
export const deleteData = async (url) => {
  const { apiUrl } = getApiConfig();
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  const fullUrl = `${apiUrl}${cleanUrl}`;
  
  const res = await fetch(fullUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const error = new Error(`HTTP ${res.status}: ${res.statusText}`);
    try {
      error.info = await res.json();
    } catch {
      error.info = { detail: `Failed to delete from ${fullUrl}` };
    }
    error.status = res.status;
    throw error;
  }

  // DELETE might return empty response
  const text = await res.text();
  return text ? JSON.parse(text) : {};
};