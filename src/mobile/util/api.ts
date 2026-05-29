const API_URL = process.env.EXPO_PUBLIC_API_URL ?? '';

let _token: string | null = null;
let _onUnauthorized: (() => void) | null = null;

export function setAuthToken(token: string | null) {
  _token = token;
}

export function getAuthToken(): string | null {
  return _token;
}

export function setOnUnauthorized(cb: (() => void) | null) {
  _onUnauthorized = cb;
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

  const res = await fetch(`${API_URL}${path}`, {
    headers: resolvedHeaders,
    ...rest,
  });

  if (res.status === 401 && _onUnauthorized) {
    _onUnauthorized();
  }

  return res;
}
