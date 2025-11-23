<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="合同审核"
      rowKey="id"
      :columns="columns"
      :requestApi="ContractApi.page"
      :initParam="initParam"
      :dataCallback="dataCallback"
      :searchCol="{ xs: 2, sm: 3, md: 4, lg: 6, xl: 8 }"
    >
      <template #operation="{ row }">
        <el-button
          type="success"
          link
          :icon="CircleCheckFilled"
          v-hasPermi="['sys:contract:pass']"
          @click="openApprovalDialog(row, 0)"
          :loading="approvalLoading[row.id]"
          :disabled="approvalLoading[row.id] || row.status !== 1"
        >
          审核通过
        </el-button>
        <el-button
          type="danger"
          link
          :icon="CircleCloseFilled"
          v-hasPermi="['sys:contract:reject']"
          @click="openApprovalDialog(row, 1)"
          :loading="approvalLoading[row.id]"
          :disabled="approvalLoading[row.id] || row.status !== 1"
        >
          审核不通过
        </el-button>
      </template>
    </ProTable>

    <!-- 审核内容录入弹窗 -->
    <el-dialog v-model="dialogVisible" title="填写审核内容" width="500px">
      <el-form ref="approvalFormRef" :model="approvalForm" :rules="approvalRules" label-width="100px">
        <el-form-item label="审核内容" prop="approvalContent">
          <el-input type="textarea" v-model="approvalForm.approvalContent" placeholder="请输入审核原因（通过/不通过的详细说明）" rows="4" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitApproval">确认提交</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="ContractApproval">
import { ref, reactive } from 'vue'
import { ColumnProps } from '@/components/ProTable/interface'
import ProTable from '@/components/ProTable/index.vue'
import { ContractApi } from '@/api/modules/contract'
import { CircleCheckFilled, CircleCloseFilled } from '@element-plus/icons-vue'
import { useHandleData } from '@/hooks/useHandleData'
import { ElMessage } from 'element-plus'
import { FormInstance } from 'element-plus'

const proTable = ref()
const initParam = reactive({ status: 1 })
const approvalLoading = ref<Record<number, boolean>>({})
const dialogVisible = ref(false)
const approvalForm = reactive({
  id: 0,
  type: 0,
  approvalContent: ''
})
const approvalFormRef = ref<FormInstance>()

// 表单校验规则
const approvalRules = {
  approvalContent: [
    { required: true, message: '审核内容不能为空', trigger: 'blur' },
    { min: 2, max: 500, message: '长度需在2-500字之间', trigger: 'blur' }
  ]
}

// 二次过滤确保仅加载状态为1的合同
const dataCallback = (data: any) => {
  const filteredList = data.list.filter((item: any) => item.status === 1)
  return {
    list: filteredList,
    total: filteredList.length
  }
}

// 表格列配置：严格通过枚举映射状态文本
const columns: ColumnProps[] = [
  { type: 'selection', fixed: 'left', width: 60 },
  {
    prop: 'name',
    label: '合同名称',
    minWidth: 120
  },
  {
    prop: 'number',
    label: '合同编号',
    minWidth: 120
  },
  {
    prop: 'customerName',
    label: '客户姓名',
    minWidth: 120
  },
  {
    prop: 'amount',
    label: '合同金额',
    minWidth: 100,
    formatter: (row: any) => `¥${row.amount.toFixed(2)}`
  },
  {
    prop: 'receivedAmount',
    label: '已收款项',
    minWidth: 140,
    formatter: (row: any) => `¥${row.receivedAmount.toFixed(2)}`
  },
  {
    prop: 'status',
    label: '合同状态',
    minWidth: 120,
    formatter: (row: any) => {
      const statusMap = {
        0: '初始化',
        1: '审核中',
        2: '审核通过',
        3: '审核不通过'
      }
      return statusMap[row.status] || '未知状态'
    }
  },
  {
    prop: 'signTime',
    label: '签约时间',
    minWidth: 140
  },
  {
    prop: 'startTime',
    label: '合同开始时间',
    minWidth: 140
  },
  {
    prop: 'endTime',
    label: '合同结束时间',
    minWidth: 140
  },
  {
    prop: 'operation',
    label: '操作',
    fixed: 'right',
    width: 330
  }
]

// 打开审核弹窗
const openApprovalDialog = (row: any, type: number) => {
  // 修复：将row.id转换为Number类型
  approvalForm.id = Number(row.id)
  approvalForm.type = type
  approvalForm.approvalContent = ''
  dialogVisible.value = true
}

// 修改submitApproval方法
const submitApproval = async () => {
  await approvalFormRef.value?.validate()
  approvalLoading.value[approvalForm.id] = true
  try {
    // 1. 提交审核
    await useHandleData(
      ContractApi.approvalContract,
      {
        id: approvalForm.id,
        type: approvalForm.type,
        approvalContent: approvalForm.approvalContent
      },
      approvalForm.type === 0 ? '合同审核通过' : '审核不通过'
    )

    dialogVisible.value = false
    proTable.value?.getTableList()
  } catch (error) {
    ElMessage.error('审核失败，请稍后重试')
  } finally {
    approvalLoading.value[approvalForm.id] = false
  }
}
</script>
