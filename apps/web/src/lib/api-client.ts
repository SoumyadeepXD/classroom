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
    const errorBody = body?.error;
    throw new ApiError(
      errorBody?.code || 'API_ERROR',
      errorBody?.message || response.statusText || 'An unexpected error occurred',
      errorBody?.details
    );
  }

  return body?.data as T;
}
