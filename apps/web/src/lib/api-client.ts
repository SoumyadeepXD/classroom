export class ApiError extends Error {
  code: string;
  details?: Array<{ field: string; issue: string }>;

  constructor(code: string, message: string, details?: Array<{ field: string; issue: string }>) {
    super(message);
    this.code = code;
    this.details = details;
  }
}

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const url = endpoint.startsWith('http') ? endpoint : `/api/v1${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('current_user');
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
        window.location.href = '/login';
      }
    }

    const errorBody = body?.error;
    throw new ApiError(
      errorBody?.code || 'API_ERROR',
      errorBody?.message || response.statusText || 'An unexpected error occurred',
      errorBody?.details
    );
  }

  return body?.data as T;
}
