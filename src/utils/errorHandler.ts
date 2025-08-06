export type ErrorType = "NETWORK_ERROR" | "BUSINESS_ERROR";
export type OperationType =
  | "login"
  | "register"
export interface EnhancedError extends Error {
  type: ErrorType;
}

// 错误类型检测
export const getErrorType = (error: unknown): ErrorType => {
  if (error && typeof error === "object") {
    const err = error as Record<string, unknown>;
    if (
      err?.code === "ERR_NETWORK" ||
      (typeof err?.message === "string" &&
        (err.message.includes("Network Error") ||
          err.message.includes("fetch") ||
          err.message.includes("Failed to fetch") ||
          err.message.includes("ECONNREFUSED"))) ||
      err?.name === "TypeError"
    ) {
      return "NETWORK_ERROR";
    }
  }
  return "BUSINESS_ERROR";
};

// 根据错误类型获取错误消息
export const getErrorMessage = (
  error: unknown,
  operation: OperationType
): string => {
  const errorType = getErrorType(error);

  // 网络错误
  if (errorType === "NETWORK_ERROR") {
    return "网络连接失败，请检查服务器状态";
  }

  // 业务错误 - 检查是否是 axios 错误
  if (error && typeof error === "object") {
    const axiosError = error as {
      response?: {
        data?: { message?: string };
        status?: number;
      };
      message?: string;
    };
    
    // 如果是 axios 错误，优先使用后端返回的错误消息
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    
    // 如果后端没有返回具体消息，但有 HTTP 状态码错误
    if (axiosError.response?.status) {
      const status = axiosError.response.status;
      if (status === 400) {
        return operation === 'login' 
          ? "账号或密码错误" 
          : "注册信息有误，请检查输入";
      }
      if (status === 401) {
        return "认证失败，请重新登录";
      }
      if (status === 403) {
        return "权限不足";
      }
      if (status >= 500) {
        return "服务器内部错误，请稍后重试";
      }
    }
  }

  // 如果是普通 Error 且不是 axios 错误
  if (error instanceof Error && error.message && !error.message.includes("Request failed with status code")) {
    return error.message;
  }

  // 默认错误消息
  const defaultMessages = {
    login: "登录失败，请检查账号或密码是否有误",
    register: "注册失败，请检查账号或密码是否有误",
  };

  return defaultMessages[operation];
};

// 创建增强错误对象
export const createEnhancedError = (
  error: unknown,
  operation: OperationType
): EnhancedError => {
  const errorMessage = getErrorMessage(error, operation);
  const enhancedError = new Error(errorMessage) as EnhancedError;
  enhancedError.type = getErrorType(error);
  return enhancedError;
};
