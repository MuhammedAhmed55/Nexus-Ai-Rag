import { ApiClient } from "./api";

export class DocumentService {
    /**
     * Upload a document to the FastAPI ingestion route
     */
    static async uploadDocument(file: File): Promise<{ data: any; error: Error | null }> {
        const formData = new FormData();
        formData.append("file", file);
        
        return ApiClient.post("/documents/upload", formData);
    }

    /**
     * Get all documents for the current user
     */
    static async getDocuments(): Promise<{ data: any; error: Error | null }> {
        return ApiClient.get("/documents");
    }

    /**
     * Delete a document by ID
     */
    static async deleteDocument(id: string): Promise<{ data: any; error: Error | null }> {
        return ApiClient.delete(`/documents/${id}`);
    }
}
