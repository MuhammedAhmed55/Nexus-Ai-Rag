export interface Document {
    id: string;
    user_id: string;
    name: string;
    file_type: string;
    file_size: number;
    source_type: string;
    source_url: string | null;
    status: string;
    chunk_count: number;
    error_message: string | null;
    created_at: string;
    updated_at: string;
}
