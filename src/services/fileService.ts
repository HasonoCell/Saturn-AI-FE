import { fileAPI } from "../apis/file";
import type {
  UploadChunkResponse,
  InitUploadParams,
  InitUploadResponse,
  MergeChunksParams,
  MergeChunksResponse,
  UploadProgressResponse,
} from "../types";

export const fileService = {
  /**
   * 初始化上传事件 (支持断点续传)
   */
  async initUpload(
    params: InitUploadParams
  ): Promise<InitUploadResponse | null> {
    const response = await fileAPI.initUpload(params);
    return response.code === 200 && response.data ? response.data : null;
  },

  /**
   * 上传单个分片
   */
  async uploadSingleChunk(formData: FormData): Promise<UploadChunkResponse> {
    const response = await fileAPI.uploadSingleChunk(formData);
    return response.code === 200
      ? { success: true }
      : { success: false, message: response.message || "上传失败" };
  },

  /**
   * 获取上传进度
   */
  async getUploadProgress(
    uploadId: string
  ): Promise<UploadProgressResponse | null> {
    const response = await fileAPI.getUploadProgress(uploadId);
    return response.code === 200 && response.data ? response.data : null;
  },

  /**
   * 合并所有分片
   */
  async mergeAllChunks(
    params: MergeChunksParams
  ): Promise<MergeChunksResponse | null> {
    const response = await fileAPI.mergeAllChunks(params);
    return response.code === 200 && response.data ? response.data : null;
  },
};
