type EnumInfo = {
  value: any
  label: string
}

export enum CustomerLevel {
  ORDINARY_CUSTOMER,
  PREMIUM_CUSTOMER,
  KEY_CUSTOMER,
  OTHER
}

export enum CustomerSource {
  PERSONAL_RESOURCE,
  CUSTOMER_REFERRAL,
  OFFICIAL_WEBSITE,
  OFFICIAL_ACCOUNT,
  DOUYIN,
  XIAOHONGSHU,
  OTHER
}

export enum Gender {
  MALE,
  FEMALE,
  SECRET
}

export enum FollowUpStatus {
  NEW_CUSTOMER,
  WAITING_FOR_COMMUNICATION,
  INTERESTED,
  CONVERTED_TO_OPPORTUNITY,
  INVALID
}

export enum IntoPublicSeaStatus {
  NOT_INTO_PUBLIC_SEA,
  INTO_PUBLIC_SEA
}

export enum IsKeyDecisionMaker {
  YES,
  NO
}

export enum ContractStatus {
  INITIALIZING,
  UNDER_REVIEW,
  APPROVED,
  REJECTED
}

export enum LeadStatus {
  NOT_CONVERTED, // 未转化成客户
  CONVERTED, // 已转化为客户
  INVALID // 无用线索
}

export enum FollowUpMethod {
  PHONE, // 电话
  VISIT, // 上门拜访
  WECHAT, // 微信
  SMS // 短信
}

export const CustomerLevelList: { [key in CustomerLevel]: EnumInfo } = {
  [CustomerLevel.ORDINARY_CUSTOMER]: { value: 0, label: '普通客户' },
  [CustomerLevel.PREMIUM_CUSTOMER]: { value: 1, label: '优质客户' },
  [CustomerLevel.KEY_CUSTOMER]: { value: 2, label: '重点客户' },
  [CustomerLevel.OTHER]: { value: 3, label: '其他' }
}

export const CustomerSourceList: { [key in CustomerSource]: EnumInfo } = {
  [CustomerSource.PERSONAL_RESOURCE]: { value: 0, label: '个人资源' },
  [CustomerSource.CUSTOMER_REFERRAL]: { value: 1, label: '客户介绍' },
  [CustomerSource.OFFICIAL_WEBSITE]: { value: 2, label: '官网咨询' },
  [CustomerSource.OFFICIAL_ACCOUNT]: { value: 3, label: '公众号' },
  [CustomerSource.DOUYIN]: { value: 4, label: '抖音' },
  [CustomerSource.XIAOHONGSHU]: { value: 5, label: '小红书' },
  [CustomerSource.OTHER]: { value: 6, label: '其他' }
}

export const FollowUpStatusList: { [key in FollowUpStatus]: EnumInfo } = {
  [FollowUpStatus.NEW_CUSTOMER]: { value: 0, label: '新客' },
  [FollowUpStatus.WAITING_FOR_COMMUNICATION]: { value: 1, label: '待再次沟通' },
  [FollowUpStatus.INTERESTED]: { value: 2, label: '有意向' },
  [FollowUpStatus.CONVERTED_TO_OPPORTUNITY]: { value: 3, label: '转入商机' },
  [FollowUpStatus.INVALID]: { value: 4, label: '无效' }
}

export const IntoPublicSeaStatusList: { [key in IntoPublicSeaStatus]: EnumInfo } = {
  [IntoPublicSeaStatus.NOT_INTO_PUBLIC_SEA]: { value: 0, label: '未转入公海' },
  [IntoPublicSeaStatus.INTO_PUBLIC_SEA]: { value: 1, label: '已转入公海' }
}

export const GenderList: { [key in Gender]: EnumInfo } = {
  [Gender.MALE]: { value: 0, label: '男' },
  [Gender.FEMALE]: { value: 1, label: '女' },
  [Gender.SECRET]: { value: 2, label: '保密' }
}

export const IsKeyDecisionMakerList: { [key in IsKeyDecisionMaker]: EnumInfo } = {
  [IsKeyDecisionMaker.YES]: { value: 0, label: '是' },
  [IsKeyDecisionMaker.NO]: { value: 1, label: '否' }
}

export enum ProductStatus {
  INITIALIZING,
  ONLINE,
  OFFLINE
}

export const ProductStatusList: { [key in ProductStatus]: EnumInfo } = {
  [ProductStatus.INITIALIZING]: { value: 0, label: '初始化' },
  [ProductStatus.ONLINE]: { value: 1, label: '上架' },
  [ProductStatus.OFFLINE]: { value: 2, label: '下架' }
}

export const ContractStatusList: { [key in ContractStatus]: EnumInfo } = {
  [ContractStatus.INITIALIZING]: { value: 0, label: '初始化' },
  [ContractStatus.UNDER_REVIEW]: { value: 1, label: '审核中' },
  [ContractStatus.APPROVED]: { value: 2, label: '审核通过' },
  [ContractStatus.REJECTED]: { value: 3, label: '审核未通过' }
}

export const LeadStatusList: { [key in LeadStatus]: EnumInfo } = {
  [LeadStatus.NOT_CONVERTED]: { value: 0, label: '未转化成客户' },
  [LeadStatus.CONVERTED]: { value: 1, label: '已转化为客户' },
  [LeadStatus.INVALID]: { value: 2, label: '无用线索' }
}

export const FollowUpMethodList: { [key in FollowUpMethod]: EnumInfo } = {
  [FollowUpMethod.PHONE]: { value: 0, label: '电话' },
  [FollowUpMethod.VISIT]: { value: 1, label: '上门拜访' },
  [FollowUpMethod.WECHAT]: { value: 2, label: '微信' },
  [FollowUpMethod.SMS]: { value: 3, label: '短信' }
}

// 商机状态
export enum OpportunityStatus {
  PENDING_FOLLOW_UP, // 待跟进
  IN_NEGOTIATION, // 洽谈中
  CLOSED_WON, // 已成交
  CLOSED_LOST, // 已失败
  CONVERTED
}

// 商机阶段
export enum OpportunityStage {
  QUALIFICATION, // 需求确认
  PROPOSAL, // 方案制定
  NEGOTIATION, // 商务谈判
  CLOSED // 已关闭
}

// 商机来源
export enum OpportunitySource {
  CUSTOMER_INITIATIVE, // 客户主动
  SALES_DISCOVERY, // 销售挖掘
  REFERRAL, // 转介绍
  MARKETING, // 市场推广
  OTHER // 其他
}

// 商机状态列表（用于前端展示）
export const OpportunityStatusList: { [key in OpportunityStatus]: EnumInfo } = {
  [OpportunityStatus.PENDING_FOLLOW_UP]: { value: 0, label: '待跟进' },
  [OpportunityStatus.IN_NEGOTIATION]: { value: 1, label: '洽谈中' },
  [OpportunityStatus.CLOSED_WON]: { value: 2, label: '已成交' },
  [OpportunityStatus.CLOSED_LOST]: { value: 3, label: '已失败' },
  [OpportunityStatus.CONVERTED]: {
    value: undefined,
    label: ''
  }
}

// 商机阶段列表（用于前端展示）
export const OpportunityStageList: { [key in OpportunityStage]: EnumInfo } = {
  [OpportunityStage.QUALIFICATION]: { value: 0, label: '需求确认' },
  [OpportunityStage.PROPOSAL]: { value: 1, label: '方案制定' },
  [OpportunityStage.NEGOTIATION]: { value: 2, label: '商务谈判' },
  [OpportunityStage.CLOSED]: { value: 3, label: '已关闭' }
}

// 商机来源列表（用于前端展示）
export const OpportunitySourceList: { [key in OpportunitySource]: EnumInfo } = {
  [OpportunitySource.CUSTOMER_INITIATIVE]: { value: 0, label: '客户主动' },
  [OpportunitySource.SALES_DISCOVERY]: { value: 1, label: '销售挖掘' },
  [OpportunitySource.REFERRAL]: { value: 2, label: '转介绍' },
  [OpportunitySource.MARKETING]: { value: 3, label: '市场推广' },
  [OpportunitySource.OTHER]: { value: 4, label: '其他' }
}
