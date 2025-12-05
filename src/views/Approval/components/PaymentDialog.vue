<template>
  <Dialog
    :model-value="dialogVisible"
    :title="dialogProps.title"
    :fullscreen="dialogProps.fullscreen"
    :max-height="dialogProps.maxHeight"
    :cancel-dialog="cancelDialog"
    width="70%"
    top="8vh"
  >
    <div :style="'width: calc(100% - ' + dialogProps.labelWidth! / 2 + 'px)'">
      <el-form
        ref="ruleFormRef"
        label-position="right"
        :label-width="dialogProps.labelWidth + 'px'"
        :rules="rules"
        :model="dialogProps.row"
        :disabled="dialogProps.isView"
        :hide-required-asterisk="dialogProps.isView"
      >
        <!-- 基础信息区域 -->
        <el-form-item label="回款ID" prop="id" v-if="dialogProps.row.id">
          <el-input v-model="dialogProps.row.id" readonly placeholder="自动生成"></el-input>
        </el-form-item>

        <el-form-item label="合同编号" prop="contractNumber">
          <el-input v-model="dialogProps.row.contractNumber" readonly placeholder="关联合同编号" :disabled="dialogProps.isView || dialogProps.isAudit"></el-input>
        </el-form-item>

        <el-form-item label="合同名称" prop="contractName">
          <el-input v-model="dialogProps.row.contractName" readonly placeholder="关联合同名称"></el-input>
        </el-form-item>

        <div class="flex" style="width: 100%">
          <el-form-item label="客户名称" prop="customerName">
            <el-input v-model="dialogProps.row.customerName" readonly placeholder="关联客户名称"></el-input>
          </el-form-item>

          <el-form-item label="回款金额" prop="number">
            <el-input v-model.number="dialogProps.row.number" placeholder="回款金额（分）" :disabled="dialogProps.isView || dialogProps.isAudit"></el-input>
          </el-form-item>

          <el-form-item label="支付方式" prop="paymentMethod">
            <el-select v-model="dialogProps.row.paymentMethod" placeholder="选择支付方式" :disabled="dialogProps.isAudit">
              <el-option label="银行转账" value="1"></el-option>
              <el-option label="支付宝" value="2"></el-option>
              <el-option label="微信支付" value="3"></el-option>
            </el-select>
          </el-form-item>
        </div>

        <div class="flex" style="width: 100%">
          <el-form-item label="支付时间" prop="paymentTime">
            <el-date-picker v-model="dialogProps.row.paymentTime" type="datetime" placeholder="选择支付时间" value-format="YYYY-MM-DD HH:mm:ss" :disabled="dialogProps.isAudit" />
          </el-form-item>

          <el-form-item label="当前状态" prop="status" v-if="dialogProps.isView || dialogProps.isAudit">
            <el-select v-model="dialogProps.row.status" placeholder="审核状态" disabled>
              <el-option label="待审核" value="0"></el-option>
              <el-option label="审核通过" value="1"></el-option>
              <el-option label="审核驳回" value="2"></el-option>
            </el-select>
          </el-form-item>
        </div>

        <!-- 示例：让“回款备注”在审核时可编辑 -->
        <el-form-item label="回款备注" prop="remark">
          <el-input v-model="dialogProps.row.remark" type="textarea" :rows="3" placeholder="请输入回款备注" :disabled="dialogProps.isView"></el-input>
        </el-form-item>

        <!-- 审核专用区域（仅审核时显示） -->
        <el-form-item label="审核备注" prop="auditRemark" v-if="dialogProps.isAudit">
          <el-input v-model="dialogProps.row.auditRemark" type="textarea" :rows="3" placeholder="请输入审核备注（必填）" required></el-input>
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <slot name="footer">
        <el-button @click="cancelDialog">取消</el-button>

        <!-- 编辑模式：显示确定按钮 -->
        <el-button type="primary" v-show="!dialogProps.isView && !dialogProps.isAudit" @click="handleSubmit">保存编辑</el-button>

        <!-- 审核模式：显示通过/驳回按钮 -->
        <template v-if="dialogProps.isAudit">
          <el-button type="success" @click="handleAudit(1)">审核通过</el-button>
          <el-button type="danger" @click="handleAudit(2)">审核驳回</el-button>
        </template>
      </slot>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'
import { Dialog } from '@/components/Dialog'

// 定义 Dialog props 类型
interface DialogProps {
  title: string // 标题（编辑回款、审核回款、查看回款）
  isView: boolean // 是否查看模式（只读）
  isAudit: boolean // 是否审核模式（显示审核备注+通过/驳回按钮）
  fullscreen?: boolean
  row: any // 回款数据
  labelWidth?: number
  maxHeight?: number | string
  editApi?: (params: any) => Promise<any> // 编辑接口（父组件传入）
  auditApi?: (params: any) => Promise<any> // 审核接口（父组件传入）
  getTableList?: () => Promise<any> // 刷新列表回调（父组件传入）
}

// 初始化状态
const dialogVisible = ref(false)
const dialogProps = ref<DialogProps>({
  isView: false,
  isAudit: false,
  title: '',
  row: {
    id: '',
    contractNumber: '',
    contractName: '',
    customerName: '',
    number: 0, // 回款金额（分）
    paymentMethod: 1, // 支付方式（默认银行转账）
    paymentTime: '',
    status: 0, // 0-待审核，1-通过，2-驳回
    remark: '',
    auditRemark: '' // 审核备注
  },
  labelWidth: 120,
  fullscreen: false,
  maxHeight: '500px'
})

// 接收父组件参数
const acceptParams = (params: DialogProps): void => {
  // 合并参数，保留默认结构
  params.row = { ...dialogProps.value.row, ...params.row, number: params.row.number ? Number(params.row.number) : 0 }
  dialogProps.value = { ...dialogProps.value, ...params }
  dialogVisible.value = true
}

// 暴露给父组件
defineExpose({
  acceptParams
})

// 表单校验规则
const rules = reactive({
  number: [
    { required: true, message: '请输入回款金额', trigger: 'blur' },
    { type: 'number', message: '金额必须为数字', trigger: 'blur' }, // 新增类型校验
    { min: 1, message: '金额不能小于1分', trigger: 'blur' }
  ],
  paymentMethod: [{ required: true, message: '请选择支付方式', trigger: 'change' }],
  paymentTime: [{ required: true, message: '请选择支付时间', trigger: 'blur' }],
  auditRemark: [{ required: true, message: '请输入审核备注', trigger: 'blur' }] // 审核备注必填
})

// 表单引用
const ruleFormRef = ref<FormInstance>()

// 保存编辑（编辑模式）
const handleSubmit = async () => {
  const form = ruleFormRef.value
  if (!form) return

  try {
    await form.validate()
    // 移除无关字段
    const submitData = { ...dialogProps.value.row }
    delete submitData.updateTime
    delete submitData.createTime
    delete submitData.auditRemark // 编辑模式不需要审核备注

    // 调用父组件传入的编辑接口
    if (dialogProps.value.editApi) {
      await dialogProps.value.editApi(submitData)
      ElMessage.success('编辑回款成功！')
      await dialogProps.value.getTableList?.() // 刷新列表
      cancelDialog(true) // 关闭并重置
    }
  } catch (error) {
    ElMessage.error('编辑失败，请重试')
    console.error('编辑回款错误：', error)
  }
}

// 审核操作（通过/驳回）
const handleAudit = async (auditStatus: 1 | 2) => {
  const form = ruleFormRef.value
  if (!form) return

  try {
    await form.validate()
    // 构建审核参数（与接口参数格式对齐）
    const auditParams = {
      id: dialogProps.value.row.id,
      status: auditStatus, // 1-通过，2-驳回
      remark: dialogProps.value.row.auditRemark // 审核备注（与接口参数名一致）
    }

    // 调用父组件传入的审核接口
    if (dialogProps.value.auditApi) {
      await dialogProps.value.auditApi(auditParams)
      const auditText = auditStatus === 1 ? '通过' : '驳回'
      ElMessage.success(`回款审核${auditText}成功！`)
      await dialogProps.value.getTableList?.() // 刷新列表
      cancelDialog(true) // 关闭并重置
    }
  } catch (error) {
    const auditText = auditStatus === 1 ? '通过' : '驳回'
    ElMessage.error(`审核${auditText}失败，请重试`)
    console.error(`回款审核${auditText}错误：`, error)
  }
}

// 取消/关闭 Dialog
const cancelDialog = (isClean?: boolean) => {
  dialogVisible.value = false
  // 需要重置的场景：查看、编辑、审核后
  const needReset = ['查看', '编辑', '审核'].some((title) => dialogProps.value.title.includes(title)) || isClean
  if (needReset) {
    dialogProps.value.row = {
      id: '',
      contractNumber: '',
      contractName: '',
      customerName: '',
      number: 0,
      paymentMethod: 1,
      paymentTime: '',
      status: 0,
      remark: '',
      auditRemark: ''
    }
    ruleFormRef.value?.resetFields() // 重置表单
  }
}
</script>

<style scoped>
.flex {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.el-form-item {
  flex: 1;
  min-width: 200px;
}
</style>
