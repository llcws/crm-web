// src/api/modules/dashboard/index.ts
import http from '@/api'
import { COMMON_ADMIN_API } from '@/api/axios/servicePort'

/**
 * @name 仪表盘数据统计
 */
export interface DashboardStatistics {
  newCustomerCount: number
  customerChange: number
  newLeadCount: number
  leadChange: number
  newContractCount: number
  contractChange: number
  contractAmount: number
  amountChange: number
  dailyApprovedCount: number // 当日审核通过数量
  dailyRejectedCount: number // 当日审核不通过数量
}

export interface DashboardTrend {
  dates: string[]
  customerData: number[]
  leadData: number[]
  contractData: number[]
}

export interface DashboardResponse {
  statistics: DashboardStatistics
  trend: DashboardTrend
}

/**
 * @name 仪表盘数据统计
 */
export const DashboardApi = {
  // 获取仪表盘统计数据，补充返回类型定义
  getDashboardData: (): Promise<{ data: DashboardResponse }> => http.post(COMMON_ADMIN_API + '/dashboard/getStatistics'),
  // 新增：带时间范围参数的方法
  getDashboardDataByDate: (startDate: string, endDate: string): Promise<{ data: DashboardResponse }> =>
    http.post(COMMON_ADMIN_API + '/dashboard/getStatistics', { startDate, endDate })
}
