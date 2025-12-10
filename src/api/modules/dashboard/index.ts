// src/api/modules/dashboard/index.ts
import http from '@/api'
import { COMMON_ADMIN_API } from '@/api/axios/servicePort'

/**
 * @name 仪表盘数据统计 - 近7日汇总数据
 * 字段说明：所有核心指标均为【近7日汇总】，变化率为【近7日 vs 上7日】的对比
 */
export interface DashboardStatistics {
  newCustomerCount: number // 近7日新增客户数
  customerChange: number // 近7日新增客户数 对比 上7日 的变化率(%)
  newLeadCount: number // 近7日新增线索数
  leadChange: number // 近7日新增线索数 对比 上7日 的变化率(%)
  newContractCount: number // 近7日新增合同数
  contractChange: number // 近7日新增合同数 对比 上7日 的变化率(%)
  contractAmount: number // 近7日合同总金额（元）
  amountChange: number // 近7日合同金额 对比 上7日 的变化率(%)
  dailyApprovedCount: number // 近7日审核通过合同数（字段名暂兼容，建议后续改为 sevenDaysApprovedCount）
  dailyRejectedCount: number // 近7日审核不通过合同数（字段名暂兼容，建议后续改为 sevenDaysRejectedCount）
}

/**
 * @name 仪表盘趋势数据 - 近7日每日明细
 * 用于渲染折线图，展示近7天每日的新增数据
 */
export interface DashboardTrend {
  dates: string[] // 近7日日期列表（格式：yyyy-MM-dd）
  customerData: number[] // 近7日每日新增客户数（与dates一一对应）
  leadData: number[] // 近7日每日新增线索数（与dates一一对应）
  contractData: number[] // 近7日每日新增合同数（与dates一一对应）
}

/**
 * @name 仪表盘接口返回数据结构
 */
export interface DashboardResponse {
  statistics: DashboardStatistics // 近7日汇总统计数据
  trend: DashboardTrend // 近7日每日趋势明细数据
}

/**
 * @name 仪表盘数据统计API
 */
export const DashboardApi = {
  /**
   * 获取默认近7日仪表盘统计数据（无需传参，后端自动计算近7日范围）
   * @returns 近7日汇总数据 + 近7日每日趋势数据
   */
  getDashboardData: (): Promise<{ data: DashboardResponse }> => http.post(COMMON_ADMIN_API + '/dashboard/getStatistics'),

  /**
   * 自定义时间范围获取仪表盘统计数据（扩展方法）
   * @param startDate 开始日期（格式：yyyy-MM-dd）
   * @param endDate 结束日期（格式：yyyy-MM-dd）
   * @returns 指定时间范围的汇总数据 + 每日趋势数据
   */
  getDashboardDataByDate: (startDate: string, endDate: string): Promise<{ data: DashboardResponse }> =>
    http.post(COMMON_ADMIN_API + '/dashboard/getStatistics', { startDate, endDate })
}
