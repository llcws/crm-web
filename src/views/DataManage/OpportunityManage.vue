<template>
  <div class="container-box">
    <div class="select-box">
      <span>筛选：</span>
      <el-select v-model="selectedType" placeholder="选择统计类型" style="width: 240px; margin-left: 20px">
        <el-option label="按阶段统计（数量）" value="stage" />
        <el-option label="按阶段统计（金额）" value="stageAmount" />
        <el-option label="按来源统计" value="source" />
      </el-select>
      <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="margin-left: 20px" />
      <el-button type="primary" @click="getStatisData" style="margin-left: 20px">查询</el-button>
    </div>
    <div style="height: 80vh; width: 100%; display: flex; gap: 20px">
      <div style="width: 50%">
        <el-card>
          <template #header>商机分布</template>
          <OpportunityPieChart :data="pieData || {}" />
        </el-card>
      </div>
      <div style="width: 50%">
        <el-card>
          <template #header>商机趋势</template>
          <OpportunityTrendChart :data="trendData || {}" />
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import OpportunityPieChart from './components/OpportunityPieChart.vue'
import OpportunityTrendChart from './components/OpportunityTrendChart.vue'
import { OpportunityApi } from '@/api/modules/opportunity'
import { ElMessage } from 'element-plus'
import moment from 'moment'

// 统计类型
const selectedType = ref('stage')
// 日期范围
const dateRange = ref<Array<Date>>([])

// 饼图数据
interface PieData {
  typeList: string[]
  valueList: number[]
}
const pieData = ref<PieData>({
  typeList: [],
  valueList: []
})

// 趋势图数据
interface TrendData {
  dateList: string[]
  valueList: number[]
}
const trendData = ref<TrendData>({
  dateList: [],
  valueList: []
})

// 获取统计数据
const getStatisData = async () => {
  try {
    const params: any = {
      type: selectedType.value
    }

    // 处理日期范围
    if (dateRange.value && dateRange.value.length === 2) {
      params.startTime = moment(dateRange.value[0]).format('YYYY-MM-DD 00:00:00')
      params.endTime = moment(dateRange.value[1]).format('YYYY-MM-DD 23:59:59')
    }

    // 根据选择的类型获取不同的统计数据
    let res
    if (selectedType.value === 'stage' || selectedType.value === 'source') {
      res = await OpportunityApi.getOpportunityPieData(params)
    } else if (selectedType.value === 'stageAmount') {
      res = await OpportunityApi.getOpportunityAmountPieData(params)
    }

    // 获取趋势数据
    const trendRes = await OpportunityApi.getOpportunityTrendData(params)

    // 处理饼图数据
    pieData.value = {
      typeList: res.data.map((item: any) => item.name),
      valueList: res.data.map((item: any) => item.value)
    }

    // 处理趋势数据
    trendData.value = {
      dateList: trendRes.data.map((item: any) => item.date),
      valueList: trendRes.data.map((item: any) => item.value)
    }
  } catch (error) {
    console.error('获取商机统计数据失败:', error)
    ElMessage.error('获取统计数据失败')
  }
}

// 页面加载时初始化数据
onMounted(() => {
  getStatisData()
})
</script>

<style>
.container-box {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.select-box {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  height: 5vh;
}
</style>
