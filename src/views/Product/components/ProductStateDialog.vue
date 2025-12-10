<template>
  <Dialog
    :model-value="dialogVisible"
    :title="dialogProps.title"
    :fullscreen="dialogProps.fullscreen"
    :max-height="dialogProps.maxHeight"
    :cancel-dialog="cancelDialog"
    width="35%"
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
        <el-form-item :label="dialogProps.title + '时间'" prop="time">
          <el-date-picker
            v-model="dialogProps.row.time"
            type="datetime"
            :placeholder="`请选择${dialogProps.title}时间`"
            value-format="YYYY-MM-DD HH:mm:ss"
            :disabled-date="(time) => time.getTime() < Date.now() - 8.64e7"
          />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <slot name="footer">
        <el-button @click="cancelDialog">取消</el-button>
        <el-button type="primary" v-show="!dialogProps.isView" @click="handleSubmit">确定</el-button>
      </slot>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { dayjs, ElMessage, FormInstance } from 'element-plus'
import { Dialog } from '@/components/Dialog'

// 接口类型定义
type ProductApiType = (params: any) => Promise<any>
interface DialogProps {
  title: string
  isView: boolean
  fullscreen?: boolean
  row: {
    id: string | number
    time?: string
    onShelfTime?: string
    offShelfTime?: string
    [key: string]: any
  }
  labelWidth?: number
  maxHeight?: number | string
  api: ProductApiType
  getTableList?: () => Promise<any>
}

// 响应式数据
const dialogVisible = ref(false)
const dialogProps = ref<DialogProps>({
  isView: false,
  title: '',
  row: { id: '' },
  labelWidth: 160,
  fullscreen: false,
  maxHeight: '500px',
  api: () => Promise.resolve({ code: 0, message: '成功' })
})

// 接收父组件参数
const acceptParams = (params: DialogProps): void => {
  dialogProps.value.row = JSON.parse(JSON.stringify(params.row))
  dialogProps.value = { ...dialogProps.value, ...params }
  if (dialogProps.value.title.includes('上架')) {
    dialogProps.value.row.time = dialogProps.value.row.onShelfTime || ''
  } else if (dialogProps.value.title.includes('下架')) {
    dialogProps.value.row.time = dialogProps.value.row.offShelfTime || ''
  }
  if (!dialogProps.value.row.id) {
    ElMessage.warning('商品ID不能为空，请刷新页面重试！')
    dialogVisible.value = false
    return
  }
  dialogVisible.value = true
}
defineExpose({ acceptParams })

// 表单校验规则
const rules = computed(() => ({
  time: [
    { required: true, message: `请选择${dialogProps.value.title}时间`, trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (!value) return callback(new Error(`请选择${dialogProps.value.title}时间`))
        const now = dayjs()
        const selected = dayjs(value)
        if (selected.isBefore(now.startOf('minute'), 'minute')) {
          return callback(new Error(`${dialogProps.value.title}时间不能早于当前时间`))
        }
        callback()
      },
      trigger: 'change'
    }
  ]
}))

const ruleFormRef = ref<FormInstance>()

// 提交处理
const handleSubmit = async () => {
  const submitBtn = document.querySelector('.el-dialog__footer .el-button--primary')
  submitBtn?.setAttribute('disabled', 'disabled')

  try {
    if (!ruleFormRef.value) throw new Error('表单初始化失败')
    const valid = await ruleFormRef.value.validate()
    if (!valid) return

    const { row, title, api } = dialogProps.value
    if (!row.id) throw new Error('商品ID缺失')

    // 构建极简参数：仅ID + 时间字段
    const requestParams = {
      id: row.id,
      ...(title.includes('上架') ? { onShelfTime: row.time } : { offShelfTime: row.time })
    }

    // 调用专用接口
    const res = await api(requestParams)

    // 适配后端返回格式（code=0成功，其他失败）
    if (res?.code === 0 || res?.success) {
      ElMessage.success(res?.message || `${title}成功！`)
      dialogProps.value.getTableList?.()
      cancelDialog(true)
    } else {
      ElMessage.error(res?.message || `${title}失败！`)
    }
  } catch (error: any) {
    const errMsg = error?.response?.data?.message || error.message || '操作失败，请联系管理员！'
    ElMessage.error(errMsg)
    console.error('提交失败：', error)
  } finally {
    const submitBtn = document.querySelector('.el-dialog__footer .el-button--primary')
    submitBtn?.removeAttribute('disabled')
  }
}

// 取消弹窗
const cancelDialog = (isClean?: boolean) => {
  dialogVisible.value = false
  if (['商品定时上架', '商品定时下架'].includes(dialogProps.value.title) || isClean) {
    dialogProps.value.row = { id: '' }
    ruleFormRef.value?.resetFields()
  }
}
</script>
