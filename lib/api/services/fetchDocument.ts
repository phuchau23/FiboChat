import apiService from "@/lib/api/core";

// === Interfaces ===
export interface Topic {
  id: string;
  name: string;
  description: string;
  masterTopicId: string;
  status: string;
  createdAt: string;
}

export interface DocumentType {
  id: string;
  name: string;
  status: string;
  createdAt: string;
}

export interface FileInfo {
  id: string;
  ownerUserId: string;
  fileName: string;
  filePath: string;
  fileContentType: string;
  fileSize: number;
  fileUrl: string;
  fileKey: string;
  fileBucket: string;
  fileRegion: string;
  fileAcl: string;
  createdAt: string;
  updatedAt: string;
  status: string;
}

export interface Document {
  id: string;
  topicId: string;
  documentTypeId: string;
  fileId: string;
  title: string;
  version: number;
  extractedTextPath: string;
  embeddingStatus: number;
  isEmbedded: boolean;
  embeddedAt: string | null;
  status: "Draft" | "Published" | "Inactive";
  verifiedById: string;
  updatedById: string;
  createdAt: string;
  updatedAt: string;
  topic: Topic;
  documentType: DocumentType;
  file: FileInfo;
}

export interface DocumentPagination {
  items: Document[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface DocumentApiResponse {
  statusCode: number;
  code: string;
  message: string;
  data: DocumentPagination;
}

export interface DocumentSingleResponse {
  statusCode: number;
  code: string;
  message: string;
  data: Document;
}

// === fetchDocument ===
export const fetchDocument = {
  getAll: async (page = 1, pageSize = 10): Promise<DocumentApiResponse> => {
    const res = await apiService.get<DocumentApiResponse>(`/course/api/documents?page=${page}&pageSize=${pageSize}`);
    return res.data;
  },

  getByTopicId: async (topicId: string, page = 1, pageSize = 10): Promise<DocumentApiResponse> => {
    const res = await apiService.get<DocumentApiResponse>(
      `/course/api/documents/topic/${topicId}?page=${page}&pageSize=${pageSize}`
    );
    return res.data;
  },

  getByLecturerId: async (lecturerId: string, page = 1, pageSize = 10): Promise<DocumentApiResponse> => {
    const res = await apiService.get<DocumentApiResponse>(
      `/course/api/documents/lecturer/${lecturerId}?page=${page}&pageSize=${pageSize}`
    );
    return res.data;
  },

  upload: async (formData: FormData): Promise<DocumentSingleResponse> => {
    // Thêm 2 trường auto
    formData.append("AutoEmbed", "true");
    formData.append("AutoLoadCache", "true");

    const res = await apiService.post<DocumentSingleResponse>("/course/api/documents/upload", formData);
    return res.data;
  },

  getById: async (id: string): Promise<DocumentSingleResponse> => {
    const res = await apiService.get<DocumentSingleResponse>(`/course/api/documents/${id}`);
    return res.data;
  },

  update: async (
    id: string,
    data: { Title?: string; Version?: number; Status?: string }
  ): Promise<DocumentSingleResponse> => {
    const formData = new FormData();
    if (data.Title !== undefined) formData.append("Title", data.Title);
    if (data.Version !== undefined) formData.append("Version", String(data.Version));
    if (data.Status !== undefined) formData.append("Status", data.Status);

    // Không cần headers, Axios tự set multipart/form-data cho FormData
    const res = await apiService.put<DocumentSingleResponse>(`/course/api/documents/${id}`, formData);
    return res.data;
  },

  delete: async (id: string): Promise<DocumentSingleResponse> => {
    const res = await apiService.delete<DocumentSingleResponse>(`/course/api/documents/${id}`);
    return res.data;
  },
};
