export interface ImageData {
  id: number;
  user_id: number;
  filename: string;
  original_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  width?: number;
  height?: number;
  is_public: boolean;
  created_at: string;
  updated_at?: string;
  url: string;
}

export interface ImageResponse {
  message: string;
  image: ImageData;
}

export interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface ImageListResponse {
  images: ImageData[];
  pagination: Pagination;
}
