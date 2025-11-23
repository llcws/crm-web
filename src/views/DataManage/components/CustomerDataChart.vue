<template>
  <div id="tradeBar" style="height: 100%; width: 100%"></div>
</template>
<script lang="ts" name="CustomerDataChart" setup>
import * as echarts from 'echarts'
import { onMounted, ref, onUnmounted, PropType, watch } from 'vue'
import { TradeArray } from '@/api/interface'
const props = defineProps({
  data: {
    type: Object as PropType<TradeArray>,
    required: true
  }
})
// 存储图表实例
const myChart = ref<echarts.ECharts | null>(null)
// 初始化图表的⽅法
const initChart = () => {
  // 确保数据存在且有内容，并且图表容器已存在
  if (props.data.timeList.length > 0) {
    const chartDom = document.getElementById('tradeBar')
    if (chartDom) {
      // 如果已有实例，先销毁
      if (myChart.value) {
        myChart.value.dispose()
      }
      myChart.value = echarts.init(chartDom)
      const option = {
        tooltip: {
          trigger: 'item',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        legend: {
          data: ['客户数量']
        },
        xAxis: [
          {
            type: 'category',
            data: props.data.timeList,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '客户数量'
          }
        ],
        series: [
          {
            name: '客户总量',
            type: 'bar',
            data: props.data.countList
          },
          {
            name: '买入交易总量',
            type: 'line',
            data: props.data.countList
          }
        ]
      }

      myChart.value.setOption(option)

      // 添加窗口大小变化时的重绘逻辑
      const handleResize = () => {
        myChart.value?.resize()
      }

      window.addEventListener('resize', handleResize)

      // 组件卸载时清理
      onUnmounted(() => {
        window.removeEventListener('resize', handleResize)
        myChart.value?.dispose()
      })
    }
  }
}
// 监听数据变化，当数据加载完成后初始化图表
watch(
  () => props.data,
  (newData) => {
    if (newData.timeList.length > 0) {
      initChart()
    }
  },
  { immediate: true } // ⽴即执⾏⼀次
)
// 确保DOM挂载后检查数据
onMounted(() => {
  if (props.data.timeList && props.data.timeList.length > 0) {
    initChart()
  }
})
</script>
