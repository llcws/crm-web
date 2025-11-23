// * 请求枚举配置
/**
 * @description：请求配置
 */
export enum ResultEnum {
  SUCCESS = 0,
  ERROR = 500,
  OVERDUE = 401,
  TIMEOUT = 50000,
  TYPE = 'success'
}

/**
 * @description：请求方法
 */
export enum RequestEnum {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

/**
 * @description：常用的contentTyp类型
 */
export enum ContentTypeEnum {
  // json
  JSON = 'application/json;charset=UTF-8',
  // text
  TEXT = 'text/plain;charset=UTF-8',
  // form-data 一般配合qs
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  // form-data 上传
  FORM_DATA = 'multipart/form-data;charset=UTF-8'
}

/** 合同状态枚举（统一管理所有状态值） */
export enum ContractStatus {
  /** 初始化默认值 */
  INIT = 0,
  /** 审核中 */
  PENDING = 1,
  /** 审核通过 */
  APPROVED = 2,
  /** 审核不通过 */
  REJECTED = 3
}

/** 合同状态文本映射（与枚举值一一对应） */
export const ContractStatusLabelMap = {
  [ContractStatus.INIT]: '初始化',
  [ContractStatus.PENDING]: '审核中',
  [ContractStatus.APPROVED]: '审核通过',
  [ContractStatus.REJECTED]: '审核不通过'
}

/** 从数值获取状态文本的工具函数 */
export const getContractStatusLabel = (status: ContractStatus): string => {
  return ContractStatusLabelMap[status] || `未知状态(${status})`
}
