import http from '@/api'
import { COMMON_ADMIN_API } from '@/api/axios/servicePort'

/**
 * @name 商机管理
 */
export const OpportunityApi = {
  // 获取商机列表 - 路径和后端一致
  page: (params: any) => http.post(COMMON_ADMIN_API + '/opportunity/page', params),
  // 根据ID查询商机详情
  getById: (params: any) => http.post(COMMON_ADMIN_API + '/opportunity/getById', params),
  // 新增/编辑商机 - 修正接口名称为saveOrEdit
  saveOrEdit: (params: any) => http.post(COMMON_ADMIN_API + '/opportunity/saveOrEdit', params),
  // 删除商机 - 适配后端POST+RequestBody传参风格（原REST风格改为项目统一风格）
  remove: (params: any) => http.post(COMMON_ADMIN_API + '/opportunity/remove', params),
  // ========== 新增：从客户创建商机接口（适配后端） ==========
  // 从单个客户创建商机
  createFromCustomer: (params: any) => http.post(COMMON_ADMIN_API + '/opportunity/createFromCustomer', params),
  // 批量从客户创建商机
  batchCreateFromCustomer: (params: any) => http.post(COMMON_ADMIN_API + '/opportunity/batchCreateFromCustomer', params)
}
