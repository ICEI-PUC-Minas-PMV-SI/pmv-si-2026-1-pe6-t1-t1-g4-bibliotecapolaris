const API_URL = process.env.EXPO_PUBLIC_API_URL ?? '';

let _token: string | null = null;

export function setAuthToken(token: string | null) {
  _token = token;
}

export function getAuthToken(): string | null {
  return _token;
}

type ApiFetchOptions = RequestInit & { auth?: boolean };

export async function apiFetch(path: string, options: ApiFetchOptions = {}) {
  const { auth = false, headers = {}, ...rest } = options;

  const resolvedHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  if (auth && _token) {
    resolvedHeaders['Authorization'] = `Bearer ${_token}`;
  }

  return fetch(`${API_URL}${path}`, {
    headers: resolvedHeaders,
    ...rest,
  });
}
