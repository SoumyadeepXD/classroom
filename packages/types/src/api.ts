export interface ApiResponse<T> {
  data: T;
  meta?: {
    timestamp: string;
    requestId?: string;
  };
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

export interface ApiErrorDetail {
  field: string;
  issue: string;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: ApiErrorDetail[];
    timestamp: string;
    requestId?: string;
  };
}
