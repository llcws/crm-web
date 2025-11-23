import http from '@/api'
import { COMMON_ADMIN_API } from '@/api/axios/servicePort'
/**
 * @name ⽇志管理
 */
export const OperLogApi = {
  page: (params: any) => http.post(COMMON_ADMIN_API + '/operLog/page', params)
}
