import http from '@/api'
import { COMMON_ADMIN_API } from '@/api/axios/servicePort'

const BASE_URL = `${COMMON_ADMIN_API}/approval/payment`

export const PaymentApi = {
  // 分页查询回款列表
  getPage: (params: any) => http.get(`${BASE_URL}/getPage`, { params }),

  // 生成回款数据（从合同表）
  generatePayment: () => http.post(`${BASE_URL}/generate`),

  // 编辑回款（适配弹窗组件的 editApi 参数格式）
  updatePayment: (params: any) => http.post(`${BASE_URL}/updateAmount`, params),

  // 审核回款（适配弹窗组件的 auditApi 参数格式）
  approvePayment: (params: { id: number; status: 1 | 2; remark: string }) =>
    http.post(`${BASE_URL}/approve/${params.id}/${params.status}`, {}, { params: { remark: params.remark } }),

  // 查询回款详情（用于编辑/查看回显，可选）
  getDetail: (id: number) => http.get(`${BASE_URL}/getDetail/${id}`)
}
