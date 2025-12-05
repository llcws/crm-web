<template>
  <div class="app-container">
    <!-- 功能按钮区 -->
    <div class="button-group" style="margin-bottom: 20px">
      <el-button type="success" size="mini" @click="generatePayment"> 从合同生成回款数据 </el-button>
      <el-button type="primary" size="mini" @click="resetQuery"> 重置筛选 </el-button>
    </div>

    <!-- 筛选查询表单 -->
    <el-form :model="queryForm" :inline="true" size="mini" style="margin-bottom: 20px">
      <el-form-item label="合同编号" prop="contractNumber">
        <el-input v-model="queryForm.contractNumber" placeholder="请输入合同编号" clearable style="width: 200px" />
      </el-form-item>
      <el-form-item label="合同名称" prop="contractName">
        <el-input v-model="queryForm.contractName" placeholder="请输入合同名称" clearable style="width: 200px" />
      </el-form-item>
      <el-form-item label="回款状态" prop="status">
        <el-select v-model="queryForm.status" placeholder="请选择状态" clearable style="width: 160px">
          <el-option label="待审核" value="0" />
          <el-option label="审核通过" value="1" />
          <el-option label="审核驳回" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="支付方式" prop="paymentMethod">
        <el-select v-model="queryForm.paymentMethod" placeholder="请选择支付方式" clearable style="width: 160px">
          <el-option label="银行转账" value="1" />
          <el-option label="支付宝" value="2" />
          <el-option label="微信支付" value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="客户ID" prop="customerId">
        <el-input v-model="queryForm.customerId" type="number" placeholder="请输入客户ID" clearable style="width: 160px" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="fetchPaymentPage"> 查询 </el-button>
      </el-form-item>
    </el-form>

    <!-- 回款列表 -->
    <el-table :data="paymentList" border style="width: 100%">
      <el-table-column prop="id" label="回款ID" width="80" />
      <el-table-column prop="contractNumber" label="合同编号" />
      <el-table-column prop="contractName" label="合同名称" />
      <el-table-column prop="customerName" label="客户名称" />
      <el-table-column prop="number" label="回款金额" :formatter="formatAmount" />
      <el-table-column prop="paymentMethod" label="支付方式" :formatter="formatPaymentMethod" />
      <el-table-column prop="paymentTime" label="回款时间" width="180" />
      <el-table-column prop="status" label="状态" :formatter="formatStatus" />
      <el-table-column prop="createrId" label="创建人ID" width="100" />
      <el-table-column label="操作" width="350">
        <template #default="scope">
          <!-- 查看按钮 -->
          <el-button type="text" size="small" @click="handleView(scope.row)">查看</el-button>
          <!-- 编辑按钮：仅待审核状态可编辑 -->
          <el-button type="warning" size="small" @click="handleEdit(scope.row)" :disabled="scope.row.status !== 0"> 编辑 </el-button>
          <!-- 审核按钮：仅待审核状态可操作 -->
          <el-button type="primary" size="small" @click="handleAudit(scope.row)" :disabled="scope.row.status !== 0"> 审核 </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryForm.page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="queryForm.limit"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      style="margin-top: 20px; text-align: right"
    />

    <!-- 引入回款详情弹窗组件 -->
    <PaymentDetail ref="paymentDetailRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import PaymentDetail from './components/PaymentDialog.vue' // 引入弹窗组件
import { PaymentApi } from '@/api/modules/approval/payment'

// 分页查询参数
const queryForm = reactive({
  page: 1,
  limit: 10,
  contractNumber: '',
  contractName: '',
  status: null,
  paymentMethod: null,
  customerId: null
})

// 列表数据
const paymentList = ref<any[]>([])
const total = ref(0)

// 弹窗组件引用
const paymentDetailRef = ref<any>(null)

// 分页查询回款数据
const fetchPaymentPage = async () => {
  try {
    const res = await PaymentApi.getPage(queryForm)
    if (res.code === 0) {
      paymentList.value = res.data.list || []
      total.value = res.data.total || 0
    } else {
      ElMessage.error(res.msg || '获取回款列表失败')
    }
  } catch (err) {
    ElMessage.error('网络异常，请重试')
    console.error(err)
  }
}

// 初始化加载列表
fetchPaymentPage()

// 从合同生成回款数据
const generatePayment = () => {
  ElMessageBox.confirm('确认从合同表生成未创建回款的数据吗？', '提示', {
    type: 'warning'
  })
    .then(async () => {
      try {
        const res = await PaymentApi.generatePayment()
        if (res.code === 0) {
          ElMessage.success(res.msg)
          fetchPaymentPage() // 刷新列表
        } else {
          ElMessage.error(res.msg)
        }
      } catch (err) {
        ElMessage.error('生成失败，请重试')
        console.error(err)
      }
    })
    .catch(() => {
      ElMessage.info('已取消生成操作')
    })
}

// 格式化金额（分转元）
const formatAmount = (row: any) => {
  if (!row?.number) return '0.00 元'
  return (row.number / 100).toFixed(2) + ' 元'
}

// 格式化支付方式
const formatPaymentMethod = (row: any) => {
  const methodMap = { 1: '银行转账', 2: '支付宝', 3: '微信支付' }
  return methodMap[row.paymentMethod] || '未知'
}

// 格式化状态
const formatStatus = (row: any) => {
  const statusMap = { 0: '待审核', 1: '审核通过', 2: '审核驳回' }
  return statusMap[row.status] || '未知'
}

// 查看回款
const handleView = (row: any) => {
  paymentDetailRef.value.acceptParams({
    title: '查看回款',
    isView: true,
    isAudit: false,
    row,
    getTableList: fetchPaymentPage
  })
}

// 编辑回款
const handleEdit = (row: any) => {
  paymentDetailRef.value.acceptParams({
    title: '编辑回款',
    isView: false,
    isAudit: false,
    row,
    editApi: PaymentApi.updatePayment, // 编辑接口（需与弹窗组件定义的 editApi 对应）
    getTableList: fetchPaymentPage
  })
}

// 审核回款
const handleAudit = (row: any) => {
  paymentDetailRef.value.acceptParams({
    title: '审核回款',
    isView: false,
    isAudit: true,
    row,
    auditApi: PaymentApi.approvePayment, // 审核接口（需与弹窗组件定义的 auditApi 对应）
    getTableList: fetchPaymentPage
  })
}

// 分页大小改变
const handleSizeChange = (limit: number) => {
  queryForm.limit = limit
  fetchPaymentPage()
}

// 当前页码改变
const handleCurrentChange = (page: number) => {
  queryForm.page = page
  fetchPaymentPage()
}

// 重置筛选条件
const resetQuery = () => {
  Object.assign(queryForm, {
    page: 1,
    limit: 10,
    contractNumber: '',
    contractName: '',
    status: null,
    paymentMethod: null,
    customerId: null
  })
  fetchPaymentPage()
}
</script>

<style scoped>
.app-container {
  padding: 20px;
}
.button-group {
  display: flex;
  gap: 10px;
  align-items: center;
}
</style>
