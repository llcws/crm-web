<!-- src/views/Dashboard/components/StatisticsCard.vue -->
<template>
  <el-card :style="{ backgroundColor: color + '10', borderLeft: `4px solid ${color}`, flex: '1', minWidth: '240px' }">
    <div class="card-content">
      <div class="card-header">
        <span class="card-title">{{ title }}</span>
        <el-icon :style="{ color }" class="card-icon">
          <!-- 修复：使用动态组件时确保组件已正确注册 -->
          <component :is="iconComponent" />
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
        <!-- 修复：文案从“较昨日”改为“较上周”，匹配7日统计逻辑 -->
        <span class="change-desc">较上周</span>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CaretTop, CaretBottom } from '@element-plus/icons-vue'
// 导入所有需要的图标组件
import { User, Search, Document, Money, Check, Close } from '@element-plus/icons-vue'

// 定义Props（规范命名为props，而非_props）
const props = defineProps({
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
    required: true,
    // 限制图标取值范围，避免传参错误
    validator: (val: string) => ['User', 'Search', 'Document', 'Money', 'Check', 'Close'].includes(val)
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

// 修复：通过计算属性映射图标名称到组件，替代原有的_components对象
const iconComponent = computed(() => {
  const iconMap = {
    User,
    Search,
    Document,
    Money,
    Check,
    Close
  }
  return iconMap[props.icon as keyof typeof iconMap]
})
</script>

<style scoped>
/* 原有样式保持不变，优化可读性 */
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
  font-weight: 700;
  margin-bottom: 8px;
}

.card-change {
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px; /* 新增：优化间距，替代margin-left */
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
  color: #86909c;
}
</style>
