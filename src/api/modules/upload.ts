// src/api/modules/upload.ts
/**
 * 文件上传相关接口
 */
export const uploadFile = (): Promise<any> => {
  // 实际项目中替换为真实的上传请求
  return Promise.resolve({ data: { url: 'https://example.com/file' } })
}

export const uploadVideo = (): Promise<any> => {
  // 实际项目中替换为真实的上传请求
  return Promise.resolve({ data: { url: 'https://example.com/video' } })
}
