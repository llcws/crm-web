<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="⽇志列表"
      :columns="columns"
      :requestApi="OperLogApi.page"
      :initParam="initParam"
      :dataCallback="dataCallback"
      :searchCol="{ xs: 2, sm: 3, md: 4, lg: 6, xl: 8 }"
    >
    </ProTable>
  </div>
</template>
<script setup lang="ts" name="SysRole">
import { ref, reactive, h } from 'vue'
import { ColumnProps } from '@/components/ProTable/interface'
import ProTable from '@/components/ProTable/index.vue'
import { OperLogApi } from '@/api/modules/log'
import { ElTag } from 'element-plus'
// 获取 ProTable 元素，调⽤其获取刷新数据⽅法（还能获取到当前查询参数，⽅便导出携带参数）
const proTable = ref()
// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会⾃动带上该参数，此参数更改之后也会⼀直带上，改变此参数会⾃动刷新表格数据)
const initParam = reactive({})
// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 datalist && total 这些字段，那么你可以在这⾥进⾏处理成这些字段
const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total
  }
}
// 如果你想在请求之前对当前请求参数做⼀些操作，可以⾃定义如下函数：params 为当前所有的请求参数（包括分⻚），最后返回请求列表接⼝
const columns: ColumnProps[] = [
  { type: 'selection', fixed: 'left', width: 60 },
  {
    prop: 'title',
    label: '模块标题',
    width: 200
  },
  {
    prop: 'operType',
    label: '业务类型',
    width: 120,
    render(scope) {
      let text = scope.row.operType === 0 ? '其他' : scope.row.operType === 1 ? '查询' : scope.row.operType === 2 ? '修改' : '删除'
      let type: 'success' | 'warning' | 'danger' | 'info' =
        scope.row.operType === 0 ? 'danger' : scope.row.operType === 1 ? 'success' : scope.row.operType === 2 ? 'warning' : 'info'
      return h(ElTag, { type }, () => text)
    }
  },
  {
    prop: 'operUrl',
    label: '请求URL',
    width: 200,
    search: { el: 'input' }
  },
  {
    prop: 'operIp',
    label: '主机地址',
    width: 120
  },
  {
    prop: 'operLocation',
    label: ' 操作地点',
    width: 120
  },
  {
    prop: 'operName',
    label: '操作⼈员',
    width: 120,
    search: { el: 'input' }
  },
  {
    prop: 'status',
    label: '操作状态',
    width: 120,
    render(scope) {
      const text = scope.row.status === 1 ? '失败' : '成功'
      const type = scope.row.status === 1 ? 'danger' : 'success'
      return h(ElTag, { type }, () => text)
    }
  },
  {
    prop: 'requestMethod',
    label: '请求⽅法',
    width: 120
  },
  {
    prop: 'errorMsg',
    label: '错误消息',
    width: 260
  },
  {
    prop: 'costTime',
    label: '消耗时间',
    width: 120
  },
  {
    prop: 'jsonResult',
    label: ' 返回参数',
    width: 200
  },
  {
    prop: 'method',
    label: '⽅法名称',
    width: 120
  },
  {
    prop: 'operParam',
    label: '请求参数',
    width: 200
  },
  {
    prop: 'operTime',
    label: '操作时间',
    search: {
      el: 'date-picker',
      props: { type: 'datetimerange' },
      span: 3
    },
    width: 200
  }
]
</script>
