<template>
  <div class="dashboard-container">
    <!-- 1. 统计卡片区域 -->
    <div class="stats-card-wrapper">
      <div class="statistics-card-group">
        <!-- 原有卡片：文案改为“近7日” -->
        <StatisticsCard title="近7日新增客户" :value="statisticsData.newCustomerCount" :change="statisticsData.customerChange" icon="User" color="#4285f4" />
        <StatisticsCard title="近7日新增线索" :value="statisticsData.newLeadCount" :change="statisticsData.leadChange" icon="Search" color="#00b42a" />
        <StatisticsCard title="近7日新增合同" :value="statisticsData.newContractCount" :change="statisticsData.contractChange" icon="Document" color="#ff7d00" />
        <StatisticsCard
          title="近7日合同总金额"
          :value="formatCurrency(statisticsData.contractAmount)"
          :change="statisticsData.amountChange"
          icon="Money"
          color="#f53f3f"
          :isAmount="true"
        />
        <!-- 新增审核卡片：文案改为“近7日” -->
        <StatisticsCard title="近7日审核通过" :value="statisticsData.dailyApprovedCount" :change="0" icon="Check" color="#52c41a" />
        <StatisticsCard title="近7日审核不通过" :value="statisticsData.dailyRejectedCount" :change="0" icon="Close" color="#f5222d" />
      </div>
    </div>

    <!-- 2. 图表区域：标题保持“近7日数据趋势”（明细） -->
    <div class="chart-wrapper">
      <el-card class="full-height-card">
        <template #header>近7日数据趋势</template>
        <TrendChart :chartData="trendData" />
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
// 直接导入API文件中定义的类型，删除本地重复定义
import { ref, onMounted } from 'vue'
import { DashboardApi, DashboardStatistics, DashboardTrend } from '@/api/modules/dashboard'
import StatisticsCard from './components/StatisticsCard.vue'
import TrendChart from './components/TrendChart.vue'

// 直接使用导入的类型定义响应式数据，无需本地重新声明接口
const statisticsData = ref<DashboardStatistics>({
  newCustomerCount: 0,
  customerChange: 0,
  newLeadCount: 0,
  leadChange: 0,
  newContractCount: 0,
  contractChange: 0,
  contractAmount: 0,
  amountChange: 0,
  dailyApprovedCount: 0,
  dailyRejectedCount: 0
})
const trendData = ref<DashboardTrend>({
  dates: [],
  customerData: [],
  leadData: [],
  contractData: []
})

// 金额格式化函数：兼容BigDecimal返回的数字（保留2位小数）
const formatCurrency = (value: number) => {
  // 处理0值和空值
  if (!value || value === 0) return '¥0.00'
  return `¥${value.toFixed(2)}`
}

const fetchStatisticsData = async () => {
  try {
    const res = await DashboardApi.getDashboardData()
    if (res.data?.statistics && res.data?.trend) {
      statisticsData.value = res.data.statistics
      trendData.value = res.data.trend
    } else {
      console.error('获取的数据格式不正确')
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

onMounted(() => fetchStatisticsData())
</script>

<style scoped>
/* 根容器：垂直布局，占满屏幕 */
.dashboard-container {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 60px);
  padding: 20px;
  box-sizing: border-box;
  gap: 24px;
}

/* 统计卡片容器：自适应高度 */
.stats-card-wrapper {
  min-height: 160px; /* 确保卡片有基础高度 */
}

/* 卡片组：核心布局控制 */
.statistics-card-group {
  display: flex;
  gap: 20px; /* 卡片间距 */
  width: 100%;
  justify-content: space-between; /* 均匀分配空间 */
  flex-wrap: wrap; /* 自动换行 */
  align-items: stretch; /* 卡片高度一致 */
}

/* 单个卡片：灵活分配宽度 */
.statistics-card-group > .el-card {
  flex: 1; /* 平分可用空间 */
  min-width: 200px; /* 最小宽度，防止过窄 */
  max-width: calc(100% / 3 - 14px); /* 默认最多3个一行（6个卡片分两行） */
}

/* 响应式调整：根据屏幕宽度优化每行数量 */
@media (min-width: 1200px) {
  .statistics-card-group > .el-card {
    max-width: calc(100% / 4 - 15px); /* 宽屏时4个一行 */
  }
}

@media (max-width: 900px) {
  .statistics-card-group > .el-card {
    max-width: calc(50% - 10px); /* 中屏时2个一行 */
  }
}

@media (max-width: 600px) {
  .statistics-card-group > .el-card {
    max-width: 100%; /* 窄屏时1个一行 */
  }
}

/* 图表区域样式 */
.chart-wrapper {
  flex: 1;
  min-height: 350px;
}

.full-height-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.full-height-card .el-card__body {
  flex: 1;
  padding: 16px;
  box-sizing: border-box;
  margin: 0;
}
</style>
