import SparkMD5 from "spark-md5";
import { fileService } from "../services";
import type { ChunkType, TaskType } from "../components/AI/MessageSender/types";
import type { UploadChunkResponse } from "../types";

/**
 * 计算文件MD5哈希值
 * @param file 文件对象
 * @param chunkSize 切片大小，默认2MB
 * @returns Promise<string> MD5哈希值
 */
export const calculateFileMD5 = (
  file: File,
  chunkSize: number = 2 * 1024 * 1024
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // 创建 ArrayBuffer MD5 计算器(适合文件)
    // 为什么使用 SparkMD5?
    // 因为浏览器的 File API 有内存限制，不能一次性读取大文件到内存
    // SparkMD5? 可以分块计算大文件的 Hash 值，不需要一次性加载整个文件，内存友好
    const spark = new SparkMD5.ArrayBuffer();
    // 创建 File 读取器(用于异步读取文件内容)
    const fileReader = new FileReader();

    let currentChunk = 0;
    const count = Math.ceil(file.size / chunkSize);

    // 设置每个 chunk 读取完成的回调
    fileReader.onload = (e) => {
      if (e.target?.result) {
        // 分块增量计算
        spark.append(e.target.result as ArrayBuffer);
        currentChunk++;

        if (currentChunk < count) {
          loadNext();
        } else {
          // 结束 MD5 计算，并返回最终 Hash 值
          resolve(spark.end());
        }
      }
    };

    // 设置发生错误时的回调
    fileReader.onerror = reject;

    const loadNext = () => {
      const start = currentChunk * chunkSize;
      const end =
        start + chunkSize >= file.size ? file.size : start + chunkSize;
      const chunk = file.slice(start, end);
      // 开始以 ArrayBuffer(二进制) 形式读取文件
      fileReader.readAsArrayBuffer(chunk);
    };

    loadNext();
  });
};

/**
 * 将文件分割成切片
 * @param file 文件对象
 * @param chunkSize 切片大小，默认2MB
 * @returns 切片数组
 */
export const createFileChunks = (
  file: File,
  chunkSize: number = 2 * 1024 * 1024
) => {
  const chunks: ChunkType[] = [];
  const chunksCount = Math.ceil(file.size / chunkSize);

  for (let i = 0; i < chunksCount; i++) {
    const start = i * chunkSize;
    const end = start + chunkSize;
    const data = file.slice(start, end);

    chunks.push({
      data,
      index: i,
    });
  }

  return chunks;
};

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @returns 格式化后的文件大小字符串
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * 验证文件类型
 * @param file 文件对象
 * @param allowedTypes 允许的文件类型
 * @returns 是否为允许的文件类型
 */
export const validateFileType = (
  file: File,
  allowedTypes: string[]
): boolean => {
  return allowedTypes.some((type) => {
    if (type.includes("*")) {
      const mainType = type.split("/")[0];
      return file.type.startsWith(mainType);
    }
    return file.type === type;
  });
};

/**
 * 验证文件大小
 * @param file 文件对象
 * @param maxSize 最大文件大小（字节）
 * @returns 是否符合大小要求
 */
export const validateFileSize = (file: File, maxSize: number): boolean => {
  return file.size <= maxSize;
};

/**
 * 上传单个切片 (支持断点续传)
 * @param uploadId 上传ID
 * @param chunk 切片数据
 * @param skipUploaded 是否跳过已上传的切片
 * @param updateUploadedChunks 更新已上传切片列表的回调函数
 * @returns Promise<UploadChunkResponse>
 */
export const uploadSingleChunk = async (
  uploadId: string,
  chunk: ChunkType,
  updateUploadedChunks?: (chunkIndex: number) => void,
  skipUploaded?: boolean
): Promise<UploadChunkResponse> => {
  // 如果标记为跳过且已上传，直接返回成功
  if (skipUploaded) {
    if (updateUploadedChunks) {
      updateUploadedChunks(chunk.index);
    }
    return { success: true, message: "切片已存在，跳过上传" };
  }

  const formData = new FormData();
  formData.append("chunk", chunk.data);
  formData.append("uploadId", uploadId);
  formData.append("chunkIndex", chunk.index.toString());

  const result = await fileService.uploadSingleChunk(formData);

  // 更新已上传切片列表
  if (result.success && updateUploadedChunks) {
    updateUploadedChunks(chunk.index);
  }

  return result;
};

/**
 * 创建断点续传任务
 * @param uploadId 上传ID
 * @param chunks 所有切片
 * @param uploadedChunks 已上传的切片索引
 * @param updateUploadedChunks 更新回调
 * @returns 任务数组
 */
export const createResumeUploadTasks = (
  uploadId: string,
  chunks: ChunkType[],
  uploadedChunks: number[] = [],
  updateUploadedChunks?: (chunkIndex: number) => void
): TaskType[] => {
  return chunks.map((chunk) => () => {
    const isUploaded = uploadedChunks.includes(chunk.index);
    return uploadSingleChunk(uploadId, chunk, updateUploadedChunks, isUploaded);
  });
};

/**
 * 并发池函数 - 控制并发数量和重试机制
 * @param tasks 任务数组
 * @param poolLimit 并发限制
 * @param retryLimit 重试限制
 * @returns Promise<UploadChunkResponse[]>
 */
export const concurrentPool = async (
  tasks: TaskType[],
  poolLimit: number,
  retryLimit: number
): Promise<UploadChunkResponse[]> => {
  const result: UploadChunkResponse[] = [];
  let nextTaskId = 0;

  const runWithRetry = async (taskId: number): Promise<void> => {
    let attempt = 0;

    while (attempt < retryLimit) {
      try {
        result[taskId] = await tasks[taskId]();

        // 检查上传是否成功
        if (result[taskId].success) {
          return;
        } else {
          throw new Error(result[taskId].message || "上传失败");
        }
      } catch (error) {
        attempt++;
        if (attempt >= retryLimit) {
          console.error(
            `切片 ${taskId} 上传失败，已重试 ${retryLimit} 次:`,
            error
          );
          throw error;
        }

        // 等待一段时间后重试（指数退避）
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }
  };

  const workers = Array(poolLimit)
    .fill(0)
    /**
     * map 函数遍历过程中，为当前 worker 执行回调函数中的同步代码: 即创建 while 循环与确定 current 变量。随后遇到了 runWithRetry，由于此方法是异步的，
     * 就将 runWithRetry 加入事件循环队列中等待调度，随后继续处理下一个 worker 同步代码，一直等到处理完所有 worker 后，map 函数结束执行。
     * 现在事件循环中有三个 runWithRetry 等待执行，每个 runWithRetry 对应的 worker 被转换为一个 Promise，代表 runWithRetry 在未来执行完成后的结果。
     * 三个 runWithRetry 谁先执行完是不确定的，先执行完的 runWithRetry 会触发对应 worker 的下一轮 while 循环，那么此 worker 会根据 nextTaskId 取得下一个任务
     * worker 本质也是一个异步函数，会返回它的 Promise，它的 Promise 就代表该函数执行完，即 while 循环执行完的结果。
     * Promise.all 的作用就是确保每个 worker 的 Promise 都执行完成了，才返回 results。
     */
    .map(async () => {
      while (nextTaskId < tasks.length) {
        const current = nextTaskId++;
        await runWithRetry(current);
      }
    });

  await Promise.all(workers);
  return result;
};
