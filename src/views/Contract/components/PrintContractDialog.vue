<template>
  <Dialog :model-value="dialogVisible" :title="dialogProps.title" :fullscreen="true" :max-height="dialogProps.maxHeight" :cancel-dialog="cancelDialog" width="100%">
    <div class="contract-print">
      <!-- 打印按钮（打印时隐藏） -->
      <div class="no-print" style="text-align: right; margin-bottom: 20px">
        <el-button type="primary" @click="printContract">打印合同</el-button>
      </div>

      <!-- 打印区域 -->
      <div id="printArea" class="contract-content">
        <h2 class="contract-title">合 同</h2>
        <h3 class="contract-subtitle">{{ dialogProps.row.name }}</h3>

        <table class="info-table">
          <tr>
            <td>合同编号：{{ dialogProps.row.number }}</td>
            <td style="text-align: right">下单日期：{{ dialogProps.row.signTime }}</td>
          </tr>
          <tr>
            <td>客户名称：{{ dialogProps.row.customerName }}</td>
          </tr>
          <tr>
            <td>开始日期：{{ dialogProps.row.startTime }}</td>
            <td>结束日期：{{ dialogProps.row.endTime }}</td>
          </tr>
          <tr>
            <td>合同金额：{{ dialogProps.row.amount }}</td>
            <td>已收款：{{ dialogProps.row.receivedAmount }}</td>
          </tr>
          <tr>
            <td colspan="2">备注：{{ dialogProps.row.remark }}</td>
          </tr>
        </table>

        <table class="product-table">
          <thead>
            <tr>
              <th colspan="6">购买产品或服务</th>
            </tr>
            <tr>
              <th>名称</th>
              <th>数量</th>
              <th>单价</th>
              <th>小计</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in dialogProps.row.products" :key="i">
              <td>{{ item.pName }}</td>
              <td>{{ item.count }}</td>
              <td>{{ item.price }}</td>
              <td>{{ item.totalPrice }}</td>
            </tr>
          </tbody>
        </table>

        <div class="signature-section">
          <div class="party">
            <div>甲方</div>
            <div>盖章签名：__________</div>
            <div>日期：__________</div>
          </div>
          <div class="party">
            <div>乙方</div>
            <div>盖章签名：__________</div>
            <div>日期：__________</div>
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Dialog } from '@/components/Dialog'
import printJS from 'print-js'

interface DialogProps {
  title: string
  isView: boolean
  fullscreen?: boolean
  row: any
  labelWidth?: number
  maxHeight?: number | string
  api?: (params: any) => Promise<any>
  getTableList?: () => Promise<any>
}
const dialogVisible = ref(false)
const dialogProps = ref<DialogProps>({
  isView: false,
  title: '',
  row: {},
  labelWidth: 120,
  fullscreen: false,
  maxHeight: '500px'
})

// 接收父组件传过来的参数
const acceptParams = (params: DialogProps): void => {
  params.row = { ...dialogProps.value.row, ...params.row }
  dialogProps.value = { ...dialogProps.value, ...params }
  dialogVisible.value = true
}

defineExpose({
  acceptParams
})

const cancelDialog = (isClean?: boolean) => {
  dialogVisible.value = false
  let condition = ['查看', '编辑']
  if (condition.includes(dialogProps.value.title) || isClean) {
    dialogProps.value.row = {}
  }
}

const printContract = () => {
  printJS({
    printable: 'printArea',
    type: 'html',
    targetStyles: ['*'], // 继承所有目标元素样式
    scanStyles: true, // 扫描并应用原有样式
    // 注入核心样式，确保优先级最高
    style: `
      @media print {
        @page { size: landscape !important; margin: 5mm !important; }
        #printArea { width: 100% !important; max-width: 280mm !important; margin: 0 auto !important; }
        .contract-content { width: 100% !important; padding: 0 10mm !important; }
      }
    `
  })
}
</script>
<style>
.contract-content {
  width: 600px;
  margin: 0 auto;
  font-size: 14px;
  color: #333;
}

.contract-title {
  text-align: center;
  color: #007bff;
  margin-bottom: 5px;
}

.contract-subtitle {
  text-align: center;
  color: #007bff;
  margin-top: 0;
  margin-bottom: 15px;
}

.info-table,
.product-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.info-table td,
.product-table td,
.product-table th {
  border: 1px solid #999;
  padding: 8px;
}

.product-table th {
  background-color: #f5f7fa;
  text-align: center;
}

.signature-section {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
  font-size: 14px;
}

.signature-section .party {
  width: 45%;
  text-align: left;
}

@media print {
  /* 全局重置 */
  body,
  html {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
  }
  /* 打印容器宽度适配纸张 */
  .contract-content {
    width: 100% !important;
    margin: 0 auto !important;
    padding: 0 !important;
    background: red;
  }
  /* 表格强制满宽+居中 */
  table {
    width: 100% !important;
    border-collapse: collapse !important;
  }
  th,
  td {
    border: 1px solid #000 !important;
    padding: 6px !important;
    text-align: center !important;
  }
  /* 签名区域强制布局 */
  .signature-section {
    display: flex !important;
    justify-content: space-between !important;
    width: 100% !important;
  }
  .signature-section .party {
    width: 45% !important;
  }
  /* 纸张方向+边距 */
  @page {
    size: landscape !important; /* 保持横向（因表格较宽） */
    margin: 5mm !important;
  }
}
</style>
