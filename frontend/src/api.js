// Backend API URL - change this after deploying to Render
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// API endpoints
export const endpoints = {
  login: `${API_URL}/api/login`,
  job: `${API_URL}/api/job`,
  jobTrigger: `${API_URL}/api/job/trigger`,
  status: `${API_URL}/api/status`
};

// Fetch helpers with auth
export async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(endpoint, {
    ...options,
    headers,
  });
  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.reload();
  }
  return response;
}