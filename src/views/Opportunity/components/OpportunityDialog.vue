<template>
  <el-drawer v-model="visible" :title="title" :width="700" :destroy-on-close="true" :before-close="handleClose">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px" class="form-box">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="客户名称" prop="customerId">
            <el-select v-model="formData.customerId" placeholder="请选择客户" clearable filterable>
              <!-- 修复：item应为对象，绑定id和name -->
              <el-option v-for="item in customerList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商机名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入商机名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商机金额" prop="amount">
            <el-input v-model="formData.amount" type="number" placeholder="请输入商机金额" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商机阶段" prop="stage">
            <el-select v-model="formData.stage" placeholder="请选择商机阶段">
              <el-option v-for="item in OpportunityStageList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商机来源" prop="source">
            <el-select v-model="formData.source" placeholder="请选择商机来源">
              <!-- 修复：导入OpportunitySourceList -->
              <el-option v-for="item in OpportunitySourceList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="预计成交日期" prop="expectedCloseDate">
            <el-date-picker v-model="formData.expectedCloseDate" type="date" placeholder="请选择预计成交日期" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="成交概率(%)" prop="probability">
            <el-slider v-model="formData.probability" :min="0" :max="100" :step="5" show-input />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="负责人" prop="ownerId">
            <el-select v-model="formData.ownerId" placeholder="请选择负责人">
              <!-- 修复：item应为对象，绑定id和nickname -->
              <el-option v-for="item in ownerList" :key="item.id" :label="item.nickname" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="商机描述" prop="description">
            <el-input v-model="formData.description" type="textarea" rows="4" placeholder="请输入商机描述" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确认</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
// 修复：补充导入
import { OpportunityStageList, OpportunitySourceList } from '@/configs/enum'
import { CustomerApi } from '@/api/modules/customer'
// 修复：确保ManagerApi存在（若不存在则替换为实际模块）
import { ManagerApi } from '@/api/modules/manager'

// 修复：定义接口返回类型
interface ApiResponse<T> {
  success: boolean
  data: T
}

interface Customer {
  id: number
  name: string
}

interface Manager {
  id: number
  nickname: string
}

// 组件参数
const visible = ref(false)
const title = ref('')
const formRef = ref()
const isView = ref(false)
// 修复：指定api类型
const api = ref<((data: any) => Promise<ApiResponse<unknown>>) | null>(null)
const getTableList = ref<(() => void) | null>(null)

// 表单数据
const formData = reactive({
  id: undefined,
  customerId: undefined,
  name: '',
  amount: 0,
  stage: '',
  source: '',
  expectedCloseDate: '',
  probability: 0,
  ownerId: undefined,
  description: ''
})

// 验证规则
const rules = reactive({
  customerId: [{ required: true, message: '请选择客户', trigger: 'blur' }],
  name: [{ required: true, message: '请输入商机名称', trigger: 'blur' }],
  amount: [
    { required: true, message: '请输入商机金额', trigger: 'blur' },
    { type: 'number', min: 0, message: '金额不能为负数', trigger: 'blur' }
  ],
  stage: [{ required: true, message: '请选择商机阶段', trigger: 'blur' }],
  expectedCloseDate: [{ required: true, message: '请选择预计成交日期', trigger: 'blur' }]
})

// 下拉列表数据
const customerList = ref<Customer[]>([])
const ownerList = ref<Manager[]>([])

// 接收参数
const acceptParams = (params: { title: string; isView: boolean; api: (data: any) => Promise<ApiResponse<unknown>>; getTableList: () => void; row?: any }) => {
  title.value = params.title
  isView.value = params.isView
  api.value = params.api
  getTableList.value = params.getTableList

  // 重置表单
  formData.id = undefined
  formData.customerId = undefined
  formData.name = ''
  formData.amount = 0
  formData.stage = ''
  formData.source = ''
  formData.expectedCloseDate = ''
  formData.probability = 0
  formData.ownerId = undefined
  formData.description = ''

  // 如果是编辑或查看，填充数据
  if (params.row && params.row.id) {
    Object.assign(formData, params.row)
  }

  visible.value = true
}

// 获取客户列表
const getCustomerList = async () => {
  try {
    const res = (await CustomerApi.list({ pageSize: 1000 })) as unknown as ApiResponse<{ list: Customer[] }>
    customerList.value = res.data.list || []
  } catch (error) {
    console.error('获取客户列表失败:', error)
  }
}

// 获取负责人列表
const getOwnerList = async () => {
  try {
    // 修复：使用正确的API模块
    const res = (await ManagerApi.list()) as unknown as ApiResponse<Manager[]>
    ownerList.value = res.data || []
  } catch (error) {
    console.error('获取负责人列表失败:', error)
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value || !api.value) return
  try {
    await formRef.value.validate()
    const res = await api.value(formData)
    if (res.success) {
      ElMessage.success(title.value === '新增' ? '新增成功' : '编辑成功')
      visible.value = false
      getTableList.value?.()
    }
  } catch (error: unknown) {
    console.error('提交失败:', error)
    if (error instanceof Error && error.name !== 'Error') {
      throw error
    }
  }
}

// 关闭抽屉
const handleClose = () => {
  visible.value = false
  formRef.value?.resetFields()
}

// 初始化
onMounted(() => {
  getCustomerList()
  getOwnerList()
})

// 暴露方法
defineExpose({
  acceptParams
})
</script>

<style scoped>
/* 样式保持不变 */
</style>
