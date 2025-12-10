<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="商机列表"
      rowKey="id"
      :columns="columns"
      :requestApi="OpportunityApi.page"
      :initParam="initParam"
      :dataCallback="dataCallback"
      :searchCol="{ xs: 2, sm: 3, md: 4, lg: 6, xl: 8 }"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope" v-if="props.isShowHeader">
        <el-button type="primary" :icon="CirclePlus" v-hasPermi="['sys:opportunity:add']" @click="openDrawer('新增')">新增商机</el-button>
        <!-- 新增：从客户创建商机按钮 -->
        <el-button type="warning" :icon="User" v-hasPermi="['sys:opportunity:createFromCustomer']" @click="openCreateFromCustomerDialog">从客户创建商机</el-button>
        <el-button type="danger" :icon="Delete" :disabled="!scope.isSelected" v-hasPermi="['sys:opportunity:remove']" @click="batchDelete(scope.selectedListIds)"
          >批量删除</el-button
        >
      </template>

      <template #operation="scope">
        <el-button type="primary" link :icon="EditPen" v-hasPermi="['sys:opportunity:edit']" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="danger" link :icon="Delete" v-hasPermi="['sys:opportunity:remove']" @click="batchDelete([scope.row.id])">删除</el-button>
        <el-button type="info" link :icon="Edit" v-hasPermi="['sys:opportunity:follow']" @click="openFollowDrawer(scope.row)">跟进记录</el-button>
      </template>
    </ProTable>

    <!-- 原有弹窗 -->
    <OpportunityDialog ref="dialogRef" />
    <OpportunityFollowDialog ref="followDialogRef" />

    <!-- 新增：从客户创建商机弹窗 -->
    <el-dialog v-model="createFromCustomerDialogVisible" title="从客户创建商机" width="500px" destroy-on-close>
      <el-form ref="customerFormRef" :model="customerForm" label-width="100px" :rules="customerFormRules">
        <el-form-item label="客户选择" prop="customerIds">
          <!-- 客户下拉选择器（支持多选） -->
          <el-select
            v-model="customerForm.customerIds"
            multiple
            placeholder="请选择转入商机状态的客户"
            filterable
            remote
            reserve-keyword
            :remote-method="getCustomerList"
            style="width: 100%"
          >
            <el-option v-for="item in customerOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createFromCustomerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitCreateFromCustomer">确认创建</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="OpportunityManager">
import { ref, reactive } from 'vue'
import { ColumnProps } from '@/components/ProTable/interface'
import ProTable from '@/components/ProTable/index.vue'
import { OpportunityApi } from '@/api/modules/opportunity'
import { CustomerApi } from '@/api/modules/customer' // 导入客户API
import { CirclePlus, EditPen, Delete, Edit, User } from '@element-plus/icons-vue'
import { useHandleData } from '@/hooks/useHandleData'
import { OpportunityStatusList, OpportunityStageList, OpportunitySourceList } from '@/configs/enum'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import OpportunityDialog from './components/OpportunityDialog.vue'

// 获取 ProTable 元素
const proTable = ref()

const props = defineProps({
  isShowHeader: {
    type: Boolean,
    default: true
  }
})

defineExpose({
  proTable
})

// 初始化请求参数
const initParam = reactive({})

// 数据处理回调
const dataCallback = (data: { list: any[]; total: number }) => {
  return {
    list: data.list,
    total: data.total
  }
}

// 表格配置项
const columns: ColumnProps[] = [
  { type: 'selection', fixed: 'left', width: 60 },
  {
    prop: 'name',
    label: '商机名称',
    search: { el: 'input' },
    minWidth: 150
  },
  {
    prop: 'customerName',
    label: '客户名称',
    search: { el: 'input' },
    minWidth: 150
  },
  {
    prop: 'amount',
    label: '商机金额',
    minWidth: 120
  },
  {
    prop: 'stage',
    label: '商机阶段',
    enum: Object.values(OpportunityStageList),
    minWidth: 120,
    search: { el: 'select' }
  },
  {
    prop: 'status',
    label: '商机状态',
    enum: Object.values(OpportunityStatusList),
    minWidth: 120,
    search: { el: 'select' }
  },
  {
    prop: 'source',
    label: '商机来源',
    enum: Object.values(OpportunitySourceList),
    minWidth: 120,
    search: { el: 'select' }
  },
  {
    prop: 'expectedCloseDate',
    label: '预计成交日期',
    minWidth: 150
  },
  {
    prop: 'probability',
    label: '成交概率(%)',
    minWidth: 120,
    formatter: (row: { probability: number }) => `${row.probability}%`
  },
  {
    prop: 'ownerName',
    label: '负责人',
    minWidth: 120
  },
  {
    prop: 'createTime',
    label: '创建时间',
    width: 200
  },
  { prop: 'operation', label: '操作', fixed: 'right', width: 380, isShow: props.isShowHeader }
]
// 打开抽屉
const dialogRef = ref<{ acceptParams: (params: any) => void } | null>(null)
const openDrawer = (title: string, row: Partial<any> = {}) => {
  if (!dialogRef.value) return
  const params = {
    title,
    row: { ...row },
    isView: title === '查看',
    api: OpportunityApi.saveOrEdit,
    getTableList: () => proTable.value?.getTableList(),
    maxHeight: '500px'
  }
  dialogRef.value.acceptParams(params)
}

// 打开跟进记录抽屉
const followDialogRef = ref<{ acceptParams: (params: any) => void } | null>(null)
const openFollowDrawer = (row: { id: number; name: string }) => {
  if (!followDialogRef.value) return
  const params = {
    opportunityId: row.id,
    opportunityName: row.name,
    getTableList: () => proTable.value?.getTableList()
  }
  followDialogRef.value.acceptParams(params)
}

// 删除选中商机
const batchDelete = async (ids: any[]) => {
  await useHandleData(OpportunityApi.remove, ids, '删除所选商机')
  proTable.value?.clearSelection()
  proTable.value?.getTableList()
}

// ========== 新增：从客户创建商机相关逻辑 ==========
// 弹窗显隐控制
const createFromCustomerDialogVisible = ref(false)
// 客户选择表单
const customerForm = reactive({
  customerIds: [] as number[] // 选中的客户ID数组
})
// 客户表单校验规则
const customerFormRules = ref<FormRules>({
  customerIds: [{ required: true, message: '请选择至少一个客户', trigger: 'change' }]
})
// 客户下拉选项
const customerOptions = ref<any[]>([])
// 表单Ref
const customerFormRef = ref<FormInstance>()

// 打开从客户创建商机弹窗
const openCreateFromCustomerDialog = () => {
  // 重置表单
  customerForm.customerIds = []
  customerFormRef.value?.resetFields()
  // 打开弹窗
  createFromCustomerDialogVisible.value = true
  // 初始化加载客户列表（仅转入商机状态）
  getCustomerList()
}

// 远程搜索/加载客户列表（仅follow_status=3的客户）
const getCustomerList = async (keyword = '') => {
  try {
    // 调用客户列表接口（后端已过滤follow_status=3的客户）
    const res = await CustomerApi.list({
      name: keyword // 支持按客户名称搜索
    })
    if (res.code === 200) {
      customerOptions.value = res.data || []
    }
  } catch (error) {
    ElMessage.error('加载客户列表失败，请重试')
    console.error('加载客户列表失败：', error)
  }
}

// 提交从客户创建商机
const submitCreateFromCustomer = async () => {
  if (!customerFormRef.value) return
  // 表单校验
  const valid = await customerFormRef.value.validate()
  if (!valid) return

  try {
    // 区分单个/批量创建
    if (customerForm.customerIds.length === 1) {
      // 单个客户创建
      await OpportunityApi.createFromCustomer({ id: customerForm.customerIds[0] })
    } else {
      // 批量客户创建
      await OpportunityApi.batchCreateFromCustomer(customerForm.customerIds)
    }
    // 提示成功
    ElMessage.success('商机创建成功')
    // 关闭弹窗
    createFromCustomerDialogVisible.value = false
    // 刷新表格
    proTable.value?.getTableList()
  } catch (error: any) {
    ElMessage.error(`创建失败：${error?.response?.data?.msg || '系统异常'}`)
    console.error('创建商机失败：', error)
  }
}
</script>
