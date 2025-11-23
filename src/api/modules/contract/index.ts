import http from '@/api'
import { COMMON_ADMIN_API } from '@/api/axios/servicePort'

/**
 * @name 合同管理
 */
export const ContractApi = {
  page: (params: any) => http.post(COMMON_ADMIN_API + '/contract/page', params),
  saveOrEdit: (params: any) => http.post(COMMON_ADMIN_API + '/contract/saveOrUpdate', params),
  texport: (params: any) => http.post(COMMON_ADMIN_API + '/contract/export', params, { responseType: 'blob' }),
  // 合同统计数据接口
  getContractStatusPieData: () => http.post(COMMON_ADMIN_API + '/contract/statusPieData'),
  startApproval: (params: any) => http.post(COMMON_ADMIN_API + '/contract/startApproval', params),
  approvalContract: (params: any) => http.post(COMMON_ADMIN_API + '/contract/approvalContract', params)
}
