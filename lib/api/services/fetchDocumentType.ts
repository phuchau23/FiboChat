// --- fetchDocumentType.ts ---
import apiService from "@/lib/api/core";

export interface DocumentType {
  id: string;
  name: string;
  status: string;
  createdAt: string;
}

export interface DocumentTypePagination {
  items: DocumentType[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface DocumentTypeApiResponse {
  statusCode: number;
  code: string;
  message: string;
  data: DocumentTypePagination;
}

export interface DocumentTypeSingleResponse {
  statusCode: number;
  code: string;
  message: string;
  data: DocumentType;
}

export const fetchDocumentType = {
  getAll: async (page = 1, pageSize = 10): Promise<DocumentTypeApiResponse> => {
    const res = await apiService.get<DocumentTypeApiResponse>(
      `/course/api/document-types?page=${page}&pageSize=${pageSize}`
    );
    return res.data;
  },

  create: async (name: string): Promise<DocumentTypeSingleResponse> => {
    const formData = new FormData();
    formData.append("Name", name);

    const res = await apiService.post<DocumentTypeSingleResponse>(`/course/api/document-types`, formData);
    return res.data;
  },
};
