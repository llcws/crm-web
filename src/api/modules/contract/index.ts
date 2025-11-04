import http from '@/api'
import { COMMON_ADMIN_API } from '@/api/axios/servicePort'

/**
 * @name 合同管理
 */
export const ContractApi = {
  page: (params: any) => http.post(COMMON_ADMIN_API + '/contract/page', params),
  saveOrEdit: (params: any) => http.post(COMMON_ADMIN_API + '/contract/saveOrUpdate', params)
}
