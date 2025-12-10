<!-- src/views/Dashboard/components/TrendChart.vue -->
<template>
  <!-- 修复：样式改为动态绑定，适配父容器 -->
  <div ref="chartRef" style="width: 100%; height: 100%; min-height: 500px"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, onUnmounted, watchEffect } from 'vue'
import * as echarts from 'echarts'
import type { ECharts, EChartsOption } from 'echarts'

// 修复：规范Props类型定义，使用interface明确结构
interface ChartData {
  dates: string[]
  customerData: number[]
  leadData: number[]
  contractData: number[]
  approvedData?: number[] // 可选字段，兼容旧数据
  rejectedData?: number[] // 可选字段，兼容旧数据
}

const props = defineProps({
  chartData: {
    type: Object as () => ChartData,
    required: true,
    // 默认值适配interface
    default: () => ({
      dates: [],
      customerData: [],
      leadData: [],
      contractData: [],
      approvedData: [],
      rejectedData: []
    })
  }
})

// 修复：使用ref绑定DOM，替代getElementById（Vue3推荐方式）
const chartRef = ref<HTMLDivElement | null>(null)
const chartInstance = ref<ECharts | null>(null)

// 封装图表初始化逻辑
const initChart = () => {
  if (!chartRef.value) return

  // 销毁旧实例，避免内存泄漏
  if (chartInstance.value) {
    chartInstance.value.dispose()
  }

  // 初始化图表实例
  chartInstance.value = echarts.init(chartRef.value, undefined, {
    width: 'auto',
    height: 'auto',
    devicePixelRatio: window.devicePixelRatio || 1
  })

  // 构建图表配置项
  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      textStyle: { fontSize: 14 }
    },
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
      splitLine: { lineStyle: { color: '#e5e6eb' } } // 修复：分割线颜色更柔和
    },
    series: [
      // 原有系列
      {
        name: '新增客户',
        type: 'bar',
        data: props.chartData.customerData,
        itemStyle: { color: '#4285f4' },
        barWidth: '18%',
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
      // 新增审批通过系列（兼容空数据）
      {
        name: '审批通过',
        type: 'bar',
        data: props.chartData.approvedData || [],
        itemStyle: { color: '#52c41a' },
        barWidth: '18%',
        emphasis: { itemStyle: { shadowBlur: 8, shadowColor: 'rgba(82, 196, 26, 0.3)' } }
      },
      // 新增审批不通过系列（兼容空数据）
      {
        name: '审批不通过',
        type: 'bar',
        data: props.chartData.rejectedData || [],
        itemStyle: { color: '#f5222d' },
        barWidth: '18%',
        emphasis: { itemStyle: { shadowBlur: 8, shadowColor: 'rgba(245, 34, 45, 0.3)' } }
      }
    ]
  }

  chartInstance.value.setOption(option, true)
}

// 窗口大小变化时自适应
const handleResize = () => {
  chartInstance.value?.resize()
}

// 监听数据变化，重新渲染图表
watch(
  () => props.chartData,
  () => {
    initChart()
  },
  { deep: true, immediate: true }
)

// 生命周期管理
onMounted(() => {
  // 确保DOM挂载后初始化
  watchEffect(() => {
    if (chartRef.value) {
      initChart()
      window.addEventListener('resize', handleResize)
    }
  })
})

onUnmounted(() => {
  // 清理事件监听和图表实例
  window.removeEventListener('resize', handleResize)
  if (chartInstance.value) {
    chartInstance.value.dispose()
    chartInstance.value = null
  }
})
</script>
