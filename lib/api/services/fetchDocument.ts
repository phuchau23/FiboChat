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
    data: {
      Title?: string;
      TopicId?: string;
      DocumentTypeId?: string;
      Version?: number;
      Status?: string;
      File?: File;
    }
  ): Promise<DocumentSingleResponse> => {
    const formData = new FormData();

    if (data.Title) formData.append("Title", data.Title);
    if (data.TopicId) formData.append("TopicId", data.TopicId);
    if (data.DocumentTypeId) formData.append("DocumentTypeId", data.DocumentTypeId);
    if (data.Version !== undefined) formData.append("Version", String(data.Version));
    if (data.Status) formData.append("Status", data.Status);
    if (data.File) formData.append("File", data.File);

    // axios tự set Content-Type: multipart/form-data khi dùng FormData
    const res = await apiService.put<DocumentSingleResponse>(`/course/api/documents/${id}`, formData);
    return res.data;
  },

  delete: async (id: string): Promise<DocumentSingleResponse> => {
    const res = await apiService.delete<DocumentSingleResponse>(`/course/api/documents/${id}`);
    return res.data;
  },

  publish: async (id: string): Promise<DocumentSingleResponse> => {
    const res = await apiService.post<DocumentSingleResponse>(`/course/api/documents/${id}/publish`);
    return res.data;
  },

  unpublish: async (id: string): Promise<DocumentSingleResponse> => {
    const res = await apiService.post<DocumentSingleResponse>(`/course/api/documents/${id}/unpublish`);
    return res.data;
  },
};
