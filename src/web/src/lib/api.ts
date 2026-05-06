const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333/api';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('polaris:token');
}

type FetchOptions = RequestInit & { auth?: boolean };

export async function apiFetch(path: string, options: FetchOptions = {}) {
  const { auth = false, headers = {}, ...rest } = options;

  const resolvedHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  if (auth) {
    const token = getToken();
    if (token) resolvedHeaders['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    headers: resolvedHeaders,
    ...rest,
  });

  return res;
}
