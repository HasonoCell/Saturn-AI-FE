import type { UploadChunkResponse } from "../../../types";

export interface MessageSenderProps {
  isNewConv?: boolean;
}

export interface UseMessageSenderProps {
  isNewConv?: boolean;
}

export interface ChunkType {
  data: Blob;
  index: number;
}

export interface UploadEventType {
  uploadId: string;
  fileName: string;
  fileSize: number;
  totalChunks: number;
  md5Hash: string;
  uploadedChunks: number[];
  status: "uploading" | "completed" | "failed";
}

export type TaskType = () => Promise<UploadChunkResponse>;
