import { request, type ResponseData } from "../utils/request";
import type {
  InitUploadParams,
  InitUploadResponse,
  MergeChunksParams,
  MergeChunksResponse,
  UploadProgressResponse,
} from "../types";

export const fileAPI = {
  /**
   * 初始化上传事件
   */
  initUpload: (
    params: InitUploadParams
  ): Promise<ResponseData<InitUploadResponse>> => {
    return request<InitUploadResponse, InitUploadParams>(
      "file/init-upload",
      "POST",
      params
    );
  },

  /**
   * 上传单个分片
   */
  uploadSingleChunk: (formData: FormData): Promise<ResponseData<null>> => {
    return request<null, FormData>("file/upload-chunk", "POST", formData);
  },

  /**
   * 获取上传进度
   */
  getUploadProgress: (uploadId: string): Promise<ResponseData<UploadProgressResponse>> => {
    return request<UploadProgressResponse, void>(
      `file/progress/${uploadId}`,
      "GET"
    );
  },

  /**
   * 合并所有分片
   */
  mergeAllChunks: (
    params: MergeChunksParams
  ): Promise<ResponseData<MergeChunksResponse>> => {
    return request<MergeChunksResponse, MergeChunksParams>(
      "file/merge-chunks",
      "POST",
      params
    );
  },
};
