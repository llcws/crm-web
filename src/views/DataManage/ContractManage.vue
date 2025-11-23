<template>
  <div class="container-box">
    <div class="select-box">
      <span>筛选：</span>
      <el-select v-model="selectedType" placeholder="选择统计类型" style="width: 240px; margin-left: 20px">
        <el-option label="按状态统计（数量）" value="status" />
      </el-select>
      <el-button type="primary" @click="getStatisData" style="margin-left: 20px">查询</el-button>
    </div>
    <div style="height: 80vh; width: 100%">
      <ContractPieChart :data="contractData || {}" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ContractPieChart from './components/ContractPieChart.vue'
import { ContractApi } from '@/api/modules/contract'
import { ElMessage } from 'element-plus'

// 统计类型：初始值改为与下拉选项匹配的"status"
const selectedType = ref('status')

// 合同统计数据
interface ContractStatData {
  typeList: string[]
  valueList: number[]
}
const contractData = ref<ContractStatData>({
  typeList: [],
  valueList: []
})

// 获取统计数据的方法
const getStatisData = async () => {
  try {
    // 调用状态统计接口（按数量统计）
    const res = await ContractApi.getContractStatusPieData()

    // 转换数据格式（与后端ContractTrendPieVO字段匹配）
    const typeList = res.data.map((item: any) => {
      // 状态值映射为中文名称
      const statusMap = {
        0: '待审核',
        1: '审核中',
        2: '已通过'
        // 可根据实际业务补充其他状态
      }
      // 优先使用后端返回的状态名称，如果没有则使用映射
      return item.statusName || statusMap[item.status] || `状态${item.status}`
    })
    // 从后端返回的count字段获取数量
    const valueList = res.data.map((item: any) => item.count)

    contractData.value = { typeList, valueList }
  } catch (error) {
    console.error('获取合同统计数据失败:', error)
    ElMessage.error('获取统计数据失败')
  }
}

// 页面加载时初始化数据
onMounted(() => {
  getStatisData()
})
</script>
