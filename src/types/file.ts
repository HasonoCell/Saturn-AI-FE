export interface InitUploadParams {
  fileName: string;
  fileSize: number;
  totalChunks: number;
  md5Hash: string;
}

export interface InitUploadResponse {
  uploadId: string;
  tempDir: string;
  uploadedChunks?: number[];
}

export interface UploadChunkResponse {
  success: boolean;
  message?: string;
}

export interface UploadProgressResponse {
  uploaded: number;
  total: number;
  percent: number;
}

export interface MergeChunksParams {
  uploadId: string;
}

export interface MergeChunksResponse {
  success: boolean;
  fileId?: string;
  filePath?: string;
  fileUrl?: string;
}
