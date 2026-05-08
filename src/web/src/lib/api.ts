const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) throw new Error('NEXT_PUBLIC_API_URL não está definida no ambiente.');

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('polaris:token');
}

type FetchOptions = RequestInit & { auth?: boolean; silentUnauthorized?: boolean };

export async function apiFetch(path: string, options: FetchOptions = {}) {
  const { auth = false, silentUnauthorized = false, headers = {}, ...rest } = options;

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

  // Só dispara logout global quando a chamada exigia auth e o caller não pediu para tratar internamente.
  if (res.status === 401 && auth && !silentUnauthorized) {
    const cloned = res.clone();
    const body = await cloned.text().catch(() => '<no body>');
    const tokenPresent = !!resolvedHeaders['Authorization'];
    console.error('[apiFetch 401]', {
      method: rest.method ?? 'GET',
      url: `${API_URL}${path}`,
      auth,
      tokenPresent,
      body,
    });
    window.dispatchEvent(new Event('polaris:unauthorized'));
  }

  return res;
}
