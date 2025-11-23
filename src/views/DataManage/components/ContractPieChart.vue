<template>
  <div id="contractPie" style="height: 100%; width: 100%"></div>
</template>
<script lang="ts" name="ContractPieChart" setup>
import * as echarts from 'echarts'
import { onMounted, ref, onUnmounted, PropType, watch } from 'vue'

// 定义合同统计数据类型
interface ContractStatData {
  typeList: string[] // 合同类型列表
  valueList: number[] // 对应类型的数量
}

const props = defineProps({
  data: {
    type: Object as PropType<ContractStatData>,
    required: true
  }
})

const myChart = ref<echarts.ECharts | null>(null)

// 初始化饼图
const initChart = () => {
  if (props.data.typeList.length > 0) {
    const chartDom = document.getElementById('contractPie')
    if (chartDom) {
      if (myChart.value) myChart.value.dispose()

      myChart.value = echarts.init(chartDom)
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 10,
          data: props.data.typeList
        },
        series: [
          {
            name: '合同数量',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 16,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: props.data.typeList.map((type, index) => ({
              name: type,
              value: props.data.valueList[index]
            }))
          }
        ]
      }

      myChart.value.setOption(option)

      const handleResize = () => myChart.value?.resize()
      window.addEventListener('resize', handleResize)

      onUnmounted(() => {
        window.removeEventListener('resize', handleResize)
        myChart.value?.dispose()
      })
    }
  }
}

// 监听数据变化
watch(
  () => props.data,
  (newData) => {
    if (newData.typeList.length > 0) initChart()
  },
  { immediate: true }
)

onMounted(() => {
  if (props.data.typeList.length > 0) initChart()
})
</script>
