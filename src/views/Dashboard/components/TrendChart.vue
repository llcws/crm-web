<template>
  <!-- 图表容器：占满父容器高度，宽度100% -->
  <div id="trendChart" style="width: 100%; height: 500px"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, onUnmounted } from 'vue'
import * as echarts from 'echarts'

// 扩展props定义，新增审批相关数据（不影响原有结构）
const props = defineProps({
  chartData: {
    type: Object,
    required: true,
    default: () => ({
      dates: [],
      customerData: [],
      leadData: [],
      contractData: [],
      // 新增审批数据（默认空数组，兼容旧数据）
      approvedData: [], // 每日审批通过数量
      rejectedData: [] // 每日审批不通过数量
    })
  }
})

const chartInstance = ref<echarts.ECharts | null>(null)

// 初始化图表：保留原有逻辑，新增审批数据系列
const initChart = () => {
  const chartDom = document.getElementById('trendChart')
  if (!chartDom) return

  if (chartInstance.value) chartInstance.value.dispose()

  chartInstance.value = echarts.init(chartDom, null, {
    width: 'auto',
    height: 'auto',
    devicePixelRatio: window.devicePixelRatio || 1
  })

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      textStyle: { fontSize: 14 }
    },
    // 图例新增审批相关项
    legend: {
      data: ['新增客户', '新增线索', '新增合同', '审批通过', '审批不通过'],
      top: 10,
      left: 'center',
      textStyle: { fontSize: 14 }
    },
    grid: {
      left: '2%',
      right: '2%',
      bottom: '10%',
      top: '12%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: props.chartData.dates,
      position: 'bottom',
      axisLabel: {
        fontSize: 12,
        rotate: 45,
        margin: 15
      },
      axisLine: { show: true, lineStyle: { color: '#86909c' } }
    },
    yAxis: {
      type: 'value',
      min: 0,
      axisLabel: { fontSize: 12 },
      axisLine: { show: true, lineStyle: { color: '#86909c' } },
      splitLine: { lineStyle: { color: '#86909c' } }
    },
    series: [
      // 原有三个系列保持不变
      {
        name: '新增客户',
        type: 'bar',
        data: props.chartData.customerData,
        itemStyle: { color: '#4285f4' },
        barWidth: '18%', // 宽度调整为18%（5个系列适配）
        emphasis: { itemStyle: { shadowBlur: 8, shadowColor: 'rgba(66, 133, 244, 0.3)' } }
      },
      {
        name: '新增线索',
        type: 'bar',
        data: props.chartData.leadData,
        itemStyle: { color: '#00b42a' },
        barWidth: '18%',
        emphasis: { itemStyle: { shadowBlur: 8, shadowColor: 'rgba(0, 180, 42, 0.3)' } }
      },
      {
        name: '新增合同',
        type: 'bar',
        data: props.chartData.contractData,
        itemStyle: { color: '#ff7d00' },
        barWidth: '18%',
        emphasis: { itemStyle: { shadowBlur: 8, shadowColor: 'rgba(255, 125, 0, 0.3)' } }
      },
      // 新增：审批通过系列
      {
        name: '审批通过',
        type: 'bar',
        data: props.chartData.approvedData,
        itemStyle: { color: '#52c41a' }, // 绿色
        barWidth: '18%',
        emphasis: { itemStyle: { shadowBlur: 8, shadowColor: 'rgba(82, 196, 26, 0.3)' } }
      },
      // 新增：审批不通过系列
      {
        name: '审批不通过',
        type: 'bar',
        data: props.chartData.rejectedData,
        itemStyle: { color: '#f5222d' }, // 红色
        barWidth: '18%',
        emphasis: { itemStyle: { shadowBlur: 8, shadowColor: 'rgba(245, 34, 45, 0.3)' } }
      }
    ]
  }

  chartInstance.value.setOption(option)
}

// 以下逻辑完全不变
const handleResize = () => chartInstance.value?.resize()

watch(() => props.chartData, initChart, { deep: true })

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance.value?.dispose()
})
</script>
