const API_URL = 'http://localhost:3333/api';

export const loginUser = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  return { status: response.status, data };
};

export const registerUser = async (name: string, email: string, password: string) => {
  const response = await fetch(`${API_URL}/users/register`, { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, type: 'student' }), 
  });
  const data = await response.json();
  return { status: response.status, data };
};