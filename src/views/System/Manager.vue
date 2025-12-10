<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="管理员列表"
      :columns="columns"
      :requestApi="getTableList"
      :initParam="initParam"
      :dataCallback="dataCallback"
      :searchCol="{ xs: 2, sm: 3, md: 4, lg: 6, xl: 8 }"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')" v-hasPermi="['sys:manager:add']">新增管理员</el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="info" link :icon="View" @click="openDrawer('查看', scope.row)" v-hasPermi="['sys:manager:view']">查看</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)" v-hasPermi="['sys:manager:edit']">编辑</el-button>
        <el-button type="warning" link :icon="EditPen" @click="openDrawer('重置', scope.row)" v-hasPermi="['sys:manager:reset-psw']">重置密码</el-button>
        <el-button type="danger" link :icon="Delete" @click="deleteAccount(scope.row)" v-hasPermi="['sys:manager:remove']">删除</el-button>
      </template>
    </ProTable>
    <ManagerDialog ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="SysManager">
import { ref, reactive } from 'vue'
import { SysManager } from '@/api/interface'
import { ColumnProps } from '@/components/ProTable/interface'
import { useHandleData } from '@/hooks/useHandleData'
import { useAuthButtons } from '@/hooks/useAuthButtons'
import ProTable from '@/components/ProTable/index.vue'
import ManagerDialog from '@/views/System/components/ManagerDialog.vue'
import { CirclePlus, Delete, EditPen, View } from '@element-plus/icons-vue'
import { getManagerPage, addManager, editManager, deleteManager, changePassword } from '@/api/modules/manager'
import { getRoleList } from '@/api/modules/role'
import { useDepartmentStore } from '@/store/modules/department'

const proTable = ref()
const initParam = reactive({})
const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total
  }
}

const getTableList = (params: any) => {
  let newParams = { ...params }
  return getManagerPage(newParams)
}

const { BUTTONS } = useAuthButtons()
const departmentStore = useDepartmentStore()

// 表格列配置
const columns: ColumnProps<SysManager.ResManagerList & { email: string }>[] = [
  { type: 'selection', fixed: 'left', width: 60 },
  {
    prop: 'account',
    label: '用户名',
    search: { el: 'input' }
  },
  {
    prop: 'nickname',
    label: '昵称',
    search: { el: 'input' }
  },
  {
    prop: 'email',
    label: '邮箱',
    minWidth: 140,
    search: { el: 'input' }
  },
  {
    prop: 'departId',
    label: '所属部门',
    enum: departmentStore.departmentList,
    fieldNames: { label: 'name', value: 'id' },
    search: { el: 'cascader', span: 2, props: { props: { checkStrictly: true }, filterable: true } }
  },
  {
    prop: 'roleId',
    tag: true,
    label: '角色',
    enum: getRoleList,
    fieldNames: { label: 'name', value: 'id' }
  },
  {
    prop: 'status',
    label: '状态',
    render: (scope) => {
      return (
        <>
          {BUTTONS.value.status ? (
            <el-switch model-value={scope.row.status} active-text={scope.row.status ? '启用' : '禁用'} active-value={1} inactive-value={0} />
          ) : (
            <el-tag type={scope.row.status ? 'success' : 'danger'}>{scope.row.status ? '启用' : '禁用'}</el-tag>
          )}
        </>
      )
    }
  },
  {
    prop: 'createTime',
    label: '创建时间',
    width: 200
  },
  { prop: 'operation', label: '操作', fixed: 'right', width: 330 }
]

// 删除管理员
const deleteAccount = async (params: SysManager.ResManagerList & { email: string }) => {
  await useHandleData(deleteManager, [params.id], `删除【${params.account}】用户`)
  proTable.value.getTableList()
}

// 弹窗引用
const dialogRef = ref()
// 打开弹窗（新增/编辑/查看/重置密码）
const openDrawer = (title: string, row: Partial<SysManager.ResManagerList & { email: string }> = {}) => {
  let params = {
    title,
    row: { ...row },
    isView: title === '查看',
    // 核心：重置密码绑定专用接口
    api: title === '新增' ? addManager : title === '编辑' ? editManager : title === '重置' ? changePassword : '',
    getTableList: proTable.value.getTableList,
    maxHeight: title === '重置' ? '200px' : '420px'
  }
  dialogRef.value.acceptParams(params)
}
</script>
