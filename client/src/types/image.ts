// 图片数据类型
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
    url: string;
    thumbnail_url?: string; // 添加缩略图URL
}

// 添加分页信息接口
export interface PaginationInfo {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
}

// 添加图片列表响应接口
export interface ImageListResponse {
    images: ImageData[];
    pagination: PaginationInfo;
}

// 添加单个图片上传响应接口
export interface ImageResponse {
    message: string;
    image: ImageData;
}

// 添加图片删除响应接口
export interface DeleteResponse {
    message: string;
}

// 添加切换图片公开状态响应接口
export interface TogglePublicResponse {
    message: string;
    is_public: boolean;
}