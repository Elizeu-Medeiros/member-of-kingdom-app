export interface LaravelLink { url: string | null; label: string; active: boolean; }
export interface Paginated<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: LaravelLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}
export interface ApiResponse<T> { message?: string; data: T; }
