// 补充管理员相关类型（需添加到该文件）
export namespace SysManager {
  // 列表查询参数
  export interface ReqGetManagerParams {
    current?: number
    size?: number
    account?: string
    nickname?: string
    email?: string
    departId?: number
    roleId?: number
  }

  // 列表返回项
  export interface ResManagerList {
    id: number
    account: string
    nickname: string
    email: string
    departId: number
    roleId: number
    status: number
    createTime: string
  }

  // 新增/编辑参数
  export interface ReqEditManagerParams {
    id?: number
    account: string
    nickname: string
    email: string
    password?: string
    departId: number
    roleId: number
    status: number
  }

  // 重置密码参数
  export interface ReqEditPasswordParams {
    id: number
    password: string
  }
}

// 分页返回通用类型
export interface ResPage<T> {
  list: T[]
  total: number
  records?: T[]
}
