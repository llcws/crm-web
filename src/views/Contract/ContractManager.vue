<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="合同列表"
      :columns="columns"
      :requestApi="ContractApi.page"
      :initParam="initParam"
      :dataCallback="dataCallback"
      :searchCol="{ xs: 2, sm: 3, md: 4, lg: 6, xl: 8 }"
    >
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" v-hasPermi="['sys:contract:add']" @click="openDrawer('新增')">新增合同</el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="EditPen" v-hasPermi="['sys:contract:edit']" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="success" link :icon="MessageBox" v-hasPermi="['sys:contract:print']" @click="openPrintDrawer('打印合同', scope.row)">打印</el-button>
        <el-button type="info" link :icon="Share" v-hasPermi="['sys:contract:audit']" v-if="scope.row.status == 0" @click="startApproval(scope.row)">审核</el-button>
      </template>
    </ProTable>
    <ContractDialog ref="dialogRef" />
    <PrintContractDialog ref="printDialogRef" />
  </div>
</template>

<script setup lang="ts" name="ContractManage">
import { ref, reactive } from 'vue'
import { ColumnProps } from '@/components/ProTable/interface'
import ProTable from '@/components/ProTable/index.vue'
import { ContractApi } from '@/api/modules/contract'
import { ContractStatusList } from '@/configs/enum'
import { CirclePlus, EditPen, MessageBox, Share } from '@element-plus/icons-vue'
import ContractDialog from './components/ContractDialog.vue'
import PrintContractDialog from './components/PrintContractDialog.vue'
import { useHandleData } from '@/hooks/useHandleData'

const proTable = ref()
const initParam = reactive({})

const dataCallback = (data: any) => {
  // 关联销售邮箱
  const mappedList = data.list.map((item) => ({
    ...item,
    salesEmail: item.sales ? item.sales.email : '未设置'
  }))
  return {
    list: mappedList,
    total: data.total
  }
}

const columns: ColumnProps[] = [
  { type: 'selection', fixed: 'left', width: 60 },
  {
    prop: 'name',
    label: '合同名称',
    minWidth: 120,
    search: { el: 'input' }
  },
  {
    prop: 'number',
    label: '合同编号',
    minWidth: 120,
    search: { el: 'input' }
  },
  {
    prop: 'customerName',
    label: '客户姓名',
    minWidth: 120,
    search: { el: 'input' }
  },
  {
    prop: 'amount',
    label: '合同金额',
    minWidth: 100
  },
  {
    prop: 'receivedAmount',
    label: '已收到款项',
    minWidth: 140
  },
  {
    prop: 'status',
    label: '合同状态',
    minWidth: 120,
    enum: Object.values(ContractStatusList),
    search: { el: 'select' }
  },
  {
    // 新增：销售邮箱列
    prop: 'salesEmail',
    label: '销售邮箱',
    minWidth: 140
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
  { prop: 'operation', label: '操作', fixed: 'right', width: 330 }
]

const dialogRef = ref()
const openDrawer = (title: string, row: Partial<any> = {}) => {
  let params = {
    title,
    row: { ...row },
    isView: title === '查看',
    api: ContractApi.saveOrEdit,
    getTableList: proTable.value.getTableList,
    maxHeight: '550px'
  }
  dialogRef.value.acceptParams(params)
}

const printDialogRef = ref()
const openPrintDrawer = (title: string, row: Partial<any> = {}) => {
  let params = {
    title,
    row: { ...row },
    isView: true,
    maxHeight: '600px',
    fullscreen: true
  }
  printDialogRef.value.acceptParams(params)
}

const startApproval = async (row: any) => {
  await useHandleData(ContractApi.startApproval, { id: row.id }, '发起合同审核')
  proTable.value.getTableList()
}
</script>
