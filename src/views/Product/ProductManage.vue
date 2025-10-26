<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="商品列表"
      rowKey="id"
      :columns="columns"
      :requestApi="ProductApi.page"
      :initParam="initParam"
      :dataCallback="dataCallback"
      :searchCol="{ xs: 2, sm: 3, md: 4, lg: 6, xl: 8 }"
    >
      <!-- 表格头部：新增商品按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增商品</el-button>
      </template>

      <!-- 表格操作栏：编辑、定时上下架 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="EditPen" v-hasPermi="['sys:product:edit']" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button
          type="success"
          link
          :icon="Check"
          v-hasPermi="['sys:product:up']"
          @click="openStateDialog({ title: '商品定时上架', row: scope.row })"
          v-if="scope.row.status !== 1"
          >商品上架</el-button
        >
        <el-button
          type="danger"
          link
          :icon="Bottom"
          v-hasPermi="['sys:product:down']"
          @click="openStateDialog({ title: '商品定时下架', row: scope.row })"
          v-if="scope.row.status === 1"
          >商品下架</el-button
        >
      </template>
    </ProTable>

    <!-- 商品新增/编辑弹窗 -->
    <ProductDialog ref="dialogRef" />
    <!-- 定时上下架弹窗 -->
    <ProductScheduleDialog ref="stateDialogRef" />
  </div>
</template>

<script setup lang="ts" name="ProductManager">
import { ref, reactive } from 'vue'
import { ColumnProps } from '@/components/ProTable/interface'
import ProTable from '@/components/ProTable/index.vue'
import { ProductStatusList } from '@/configs/enum'
import { ProductApi } from '@/api/modules/product'
import { Bottom, CirclePlus, EditPen, Check } from '@element-plus/icons-vue'
import ProductDialog from './components/ProductDialog.vue'
import ProductScheduleDialog from './components/ProductStateDialog.vue'

// 表格实例
const proTable = ref()
// 弹窗实例
const dialogRef = ref()
const stateDialogRef = ref()

// 初始化参数（默认查询未删除商品）
const initParam = reactive({
  deleteFlag: 0
})
// const initParam = reactive({})

// 表格数据处理
const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total
  }
}

// 表格列配置（仅保留需求字段：商品名称、价格、销量、库存、状态、操作）
const columns: ColumnProps[] = [
  { type: 'selection', fixed: 'left', width: 60 },
  {
    prop: 'name',
    label: '商品名称',
    minWidth: 120,
    search: { el: 'input' } // 商品名称搜索
  },
  {
    prop: 'price',
    label: '价格',
    minWidth: 120
  },
  {
    prop: 'sales',
    label: '销量',
    minWidth: 120
  },
  {
    prop: 'stock',
    label: '库存数量',
    minWidth: 120
  },
  {
    prop: 'status',
    label: '商品状态',
    minWidth: 120,
    enum: Object.values(ProductStatusList),
    search: {
      // 商品状态搜索
      el: 'select'
    },
    formatter: (row: any) => {
      const statusMap = { 0: '初始化', 1: '上架', 2: '下架' }
      const typeMap = { 0: 'info', 1: 'success', 2: 'danger' }
      return `<el-tag type="${typeMap[row.status]}">${statusMap[row.status]}</el-tag>`
    }
  },
  {
    prop: 'operation',
    label: '操作',
    fixed: 'right',
    width: 220
  }
]

// 打开新增/编辑弹窗
const openDrawer = (title: string, row: Partial<any> = {}) => {
  let params = {
    title,
    row: { ...row },
    isView: title === '查看',
    api: ProductApi.saveOrEdit,
    getTableList: proTable.value.getTableList,
    maxHeight: '300px'
  }
  dialogRef.value.acceptParams(params)
}

// 打开定时上下架弹窗
const openStateDialog = ({ title, row }: { title: string; row: Partial<any> }) => {
  let params = {
    title,
    row: { ...row },
    isView: title === '查看',
    api: ProductApi.saveOrEdit,
    getTableList: proTable.value.getTableList,
    maxHeight: '150px'
  }
  stateDialogRef.value.acceptParams(params)
}
</script>
