import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { getCookie } from "cookies-next";

// API error response data structure
export interface ApiErrorData {
  message?: string;
  code?: string | number;
  [key: string]: unknown;
}

// Error interface
export interface ApiError {
  status?: number;
  message: string;
  error?: ApiErrorData;
}

// Response wrapper
export interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

// Request parameters object
export interface RequestParams {
  [key: string]: string | number | boolean | undefined | null | string[];
}

export class ApiService {
  private client: AxiosInstance;
  private authToken: string | null = null;
  private onAuthError?: () => void;

  constructor(baseURL: string, timeout = 10000, onAuthError?: () => void) {
    this.client = axios.create({
      baseURL,
      headers: { "Content-Type": "application/json" },
      timeout,
    });

    this.onAuthError = onAuthError;
    this.setupInterceptors();
  }

  setAuthToken(token: string | null): void {
    this.authToken = token;
  }

  private setupInterceptors(): void {
   
this.client.interceptors.request.use(
  (config) => {
    const token = getCookie("auth-token"); // lấy trực tiếp cookie mỗi lần request
    if (token) config.headers.Authorization = `Bearer ${token}`;
    if (config.data instanceof FormData)
      delete config.headers["Content-Type"];
    return config;
  },
  (error) => Promise.reject(error)
);

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiErrorData>) => {
        if (error.response?.status === 401 && this.onAuthError)
          this.onAuthError();
        return Promise.reject({
          status: error.response?.status,
          message: error.response?.data?.message || error.message,
          error: error.response?.data,
        } as ApiError);
      }
    );
  }

  private toFormData(
    data: Record<string, unknown>,
    options: { flattenObjects?: boolean } = {}
  ): FormData {
    const formData = new FormData();
    const { flattenObjects = false } = options;

    const processValue = (key: string, value: unknown) => {
      if (value === undefined || value === null) return;

      if (Array.isArray(value)) {
        value.forEach((item, index) => processValue(`${key}[${index}]`, item));
      } else if (
        value instanceof Object &&
        !(value instanceof File) &&
        !(value instanceof Blob)
      ) {
        if (flattenObjects) {
          Object.entries(value).forEach(([subKey, subValue]) =>
            processValue(`${key}[${subKey}]`, subValue)
          );
        } else {
          formData.append(key, JSON.stringify(value));
        }
      } else if (value instanceof File || value instanceof Blob) {
        formData.append(key, value, (value as File).name || "file");
      } else {
        formData.append(key, String(value));
      }
    };

    Object.entries(data).forEach(([key, value]) => processValue(key, value));
    return formData;
  }

  private createParams(params?: RequestParams): URLSearchParams | undefined {
    if (!params) return undefined;
    const urlParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (Array.isArray(value))
        value.forEach((item) => urlParams.append(key, String(item)));
      else urlParams.append(key, String(value));
    });
    return urlParams;
  }

  private async request<T>(
    config: AxiosRequestConfig & { useJson?: boolean }
  ): Promise<ApiResponse<T>> {
    const updatedConfig: AxiosRequestConfig = { ...config };
    if (
      (updatedConfig.method?.toUpperCase() === "POST" ||
       updatedConfig.method?.toUpperCase() === "PUT") &&
      updatedConfig.data &&
      !(updatedConfig.data instanceof FormData) &&
      !config.useJson
    ) {
      updatedConfig.data = this.toFormData(updatedConfig.data);
    }
    const response: AxiosResponse<T> = await this.client(updatedConfig);
    return {
      data: response.data,
      status: response.status,
      headers: response.headers as Record<string, string>,
    };
  }

  async get<T>(url: string, params?: RequestParams): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: "GET",
      url,
      params: this.createParams(params),
    });
  }

  async patch<T>(
    url: string,
    data?: Record<string, unknown>
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ method: "PATCH", url, data });
  }

  async post<T, D = unknown>(
    url: string,
    data?: D,
    useJson: boolean = false
  ): Promise<ApiResponse<T>> {
    const config: AxiosRequestConfig & { useJson?: boolean } = {
      method: "POST",
      url,
      data: useJson ? JSON.stringify(data) : data,
      headers: useJson ? { "Content-Type": "application/json" } : {},
      useJson,
    };
    return this.request<T>(config);
  }

  async put<T, D = Record<string, unknown> | FormData>(
    url: string,
    data?: D,
    useJson: boolean = false
  ): Promise<ApiResponse<T>> {
    const config: AxiosRequestConfig & { useJson?: boolean } = {
      method: "PUT",
      url,
      data: useJson ? JSON.stringify(data) : data,
      headers: useJson ? { "Content-Type": "application/json" } : {},
      useJson,
    };
    if (
      !useJson &&
      data &&
      !(data instanceof FormData)
    ) {
      config.data = this.toFormData(data as Record<string, unknown>);
    }
    return this.request<T>(config);
  }

  async delete<T>(
    url: string,
    params?: RequestParams
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: "DELETE",
      url,
      params: this.createParams(params),
    });
  }

  async upload<T>(
    url: string,
    files: File | File[],
    fieldName = "file",
    additionalData?: Record<string, string | number | boolean>,
    onProgress?: (percentage: number) => void
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    if (Array.isArray(files))
      files.forEach((file) => formData.append(fieldName, file));
    else formData.append(fieldName, files);
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        if (value !== undefined && value !== null)
          formData.append(key, String(value));
      });
    }
    return this.request<T>({
      method: "POST",
      url,
      data: formData,
      onUploadProgress: onProgress
        ? (progressEvent) => {
            const percentage = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 100)
            );
            onProgress(percentage);
          }
        : undefined,
    });
  }
}

const apiService = new ApiService(
  process.env.NEXT_PUBLIC_API_BASE_URL || "",
  600000
);
export default apiService;