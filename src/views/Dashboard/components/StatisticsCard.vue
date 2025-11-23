<!-- src/views/Dashboard/components/StatisticsCard.vue -->
<template>
  <el-card :style="{ backgroundColor: color + '10', borderLeft: `4px solid ${color}`, flex: '1', minWidth: '240px' }">
    <div class="card-content">
      <div class="card-header">
        <span class="card-title">{{ title }}</span>
        <el-icon :style="{ color }" class="card-icon">
          <component :is="icon" />
        </el-icon>
      </div>
      <div class="card-value">{{ value }}</div>
      <div class="card-change" :class="{ up: change > 0, down: change < 0, flat: change === 0 }">
        <el-icon v-if="change > 0" size="14">
          <CaretTop />
        </el-icon>
        <el-icon v-if="change < 0" size="14">
          <CaretBottom />
        </el-icon>
        <span>{{ change === 0 ? '持平' : `${Math.abs(change)}%` }}</span>
        <span class="change-desc">较昨日</span>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { CaretTop, CaretBottom } from '@element-plus/icons-vue'
// 原有图标保留，新增审批相关图标
import { User, Search, Document, Money, Check, Close } from '@element-plus/icons-vue'

const _props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [Number, String],
    required: true
  },
  change: {
    type: Number,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  isAmount: {
    type: Boolean,
    default: false
  }
})

// 注册图标组件：新增Check和Close图标，支持审批卡片
const _components = {
  User,
  Search,
  Document,
  Money,
  Check, // 审批通过图标
  Close // 审批不通过图标
}
</script>

<style scoped>
/* 原有样式完全不变 */
.card-content {
  padding: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-title {
  color: #666;
  font-size: 14px;
}

.card-icon {
  font-size: 24px;
}

.card-value {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 8px;
}

.card-change {
  font-size: 14px;
  display: flex;
  align-items: center;
}

.up {
  color: #f53f3f;
}

.down {
  color: #00b42a;
}

.flat {
  color: #9c8686;
}

.change-desc {
  margin-left: 4px;
  color: #86909c;
}
</style>
