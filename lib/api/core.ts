import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { getCookie } from "cookies-next";

export interface ApiErrorData {
  message?: string;
  code?: string | number;
  [key: string]: unknown;
}

export interface ApiError {
  status?: number;
  message: string;
  error?: ApiErrorData;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

// Param type
export interface RequestParams {
  [key: string]: string | number | boolean | undefined | null | string[];
}

export class ApiService {
  private client: AxiosInstance;
  private onAuthError?: () => void;

  constructor(baseURL: string, timeout = 15000, onAuthError?: () => void) {
    this.client = axios.create({
      baseURL,
      timeout,
    });
    this.onAuthError = onAuthError;
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request Interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = getCookie("auth-token");
        if (token) config.headers.Authorization = `Bearer ${token}`;

        // Nếu data là FormData thì xoá Content-Type để axios tự thêm boundary
        if (config.data instanceof FormData) {
          delete config.headers["Content-Type"];
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response Interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiErrorData>) => {
        const status = error.response?.status;
        const data = error.response?.data;

        if (status === 401 && this.onAuthError) {
          this.onAuthError();
        }

        const message =
          data?.message ||
          (data && "Message" in data && String((data as Record<string, unknown>).Message)) ||
          (data && "error_description" in data &&
            String((data as Record<string, unknown>).error_description)) ||
          error.message ||
          "Lỗi không xác định từ máy chủ.";

        const apiError: ApiError = {
          status,
          message,
          error: data,
        };

        return Promise.reject(apiError);
      }
    );
  }

  // Chuyển object sang FormData (fallback)
  private toFormData(data: Record<string, unknown>): FormData {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    return formData;
  }

  // Tạo URLSearchParams từ object params
  private createParams(params?: RequestParams): URLSearchParams | undefined {
    if (!params) return undefined;
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (Array.isArray(value)) {
        value.forEach((item) => searchParams.append(key, String(item)));
      } else {
        searchParams.append(key, String(value));
      }
    });
    return searchParams;
  }

  // Hàm xử lý chính
  private async request<T>(
    config: AxiosRequestConfig & { useJson?: boolean }
  ): Promise<ApiResponse<T>> {
    const updatedConfig = { ...config };
    const method = updatedConfig.method?.toUpperCase();

    // Nếu là POST/PUT và data không phải FormData, không dùng JSON → convert sang FormData
    if (
      (method === "POST" || method === "PUT") &&
      updatedConfig.data &&
      !(updatedConfig.data instanceof FormData) &&
      !config.useJson
    ) {
      updatedConfig.data = this.toFormData(updatedConfig.data);
    }

    // Nếu là FormData, axios tự thêm header, không cần set Content-Type
    if (updatedConfig.data instanceof FormData) {
      delete updatedConfig.headers?.["Content-Type"];
    }

    const response: AxiosResponse<T> = await this.client(updatedConfig);
    return {
      data: response.data,
      status: response.status,
      headers: response.headers as Record<string, string>,
    };
  }

  // GET
  async get<T>(url: string, params?: RequestParams): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: "GET",
      url,
      params: this.createParams(params),
    });
  }

  //  POST
  async post<T, D = Record<string, unknown>>(
    url: string,
    data?: D | FormData,
    useJson = false
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: "POST",
      url,
      data,
      headers: useJson ? { "Content-Type": "application/json" } : {},
      useJson,
    });
  }

  // PUT
  async put<T, D = Record<string, unknown>>(
    url: string,
    data?: D | FormData,
    useJson = false
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: "PUT",
      url,
      data,
      headers: useJson ? { "Content-Type": "application/json" } : {},
      useJson,
    });
  }

  // DELETE
  async delete<T>(url: string, params?: RequestParams): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: "DELETE",
      url,
      params: this.createParams(params),
    });
  }
}

//Instance mặc định
const apiService = new ApiService(process.env.NEXT_PUBLIC_API_BASE_URL || "");
export default apiService;
