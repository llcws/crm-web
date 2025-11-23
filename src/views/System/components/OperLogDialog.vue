<!-- src/views/System/components/OperLogDialog.vue -->
<template>
  <el-dialog :visible="visible" @update:visible="(val) => $emit('update:visible', val)" title="操作日志详情" width="70%" :destroy-on-close="true">
    <el-card>
      <el-descriptions column="1" border>
        <el-descriptions-item label="日志ID">{{ logInfo.id }}</el-descriptions-item>
        <el-descriptions-item label="模块标题">{{ logInfo.title }}</el-descriptions-item>
        <el-descriptions-item label="业务类型">
          <el-tag v-if="logInfo.operType === 0">其它</el-tag>
          <el-tag v-if="logInfo.operType === 1" type="success">新增</el-tag>
          <el-tag v-if="logInfo.operType === 2" type="warning">修改</el-tag>
          <el-tag v-if="logInfo.operType === 3" type="danger">删除</el-tag>
          <el-tag v-if="logInfo.operType === 4" type="info">查询</el-tag>
          <el-tag v-if="logInfo.operType === 5" type="primary">登录</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="操作人">{{ logInfo.operName }}</el-descriptions-item>
        <el-descriptions-item label="操作时间">{{ logInfo.operTime }}</el-descriptions-item>
        <el-descriptions-item label="操作IP">{{ logInfo.operIp }}</el-descriptions-item>
        <el-descriptions-item label="操作地点">{{ logInfo.operLocation }}</el-descriptions-item>
        <el-descriptions-item label="操作状态">
          <el-tag v-if="logInfo.status === 0" type="success">正常</el-tag>
          <el-tag v-if="logInfo.status === 1" type="danger">异常</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="请求URL">{{ logInfo.operUrl }}</el-descriptions-item>
        <el-descriptions-item label="请求方式">{{ logInfo.requestMethod }}</el-descriptions-item>
        <el-descriptions-item label="请求参数">
          <el-collapse>
            <el-collapse-item title="查看参数">
              <pre v-if="logInfo.operParam" class="param-pre">{{ formatJson(logInfo.operParam) }}</pre>
              <span v-else>无参数</span>
            </el-collapse-item>
          </el-collapse>
        </el-descriptions-item>
        <el-descriptions-item label="返回结果">
          <el-collapse>
            <el-collapse-item title="查看结果">
              <pre v-if="logInfo.jsonResult" class="param-pre">{{ formatJson(logInfo.jsonResult) }}</pre>
              <span v-else>无返回结果</span>
            </el-collapse-item>
          </el-collapse>
        </el-descriptions-item>
        <el-descriptions-item label="错误信息" v-if="logInfo.status === 1">
          <div class="error-message">{{ logInfo.errorMsg || '未知错误' }}</div>
        </el-descriptions-item>
        <el-descriptions-item label="消耗时间">{{ logInfo.costTime }}ms</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <template #footer>
      <el-button @click="$emit('update:visible', false)">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue' // 移除未使用的ref
import { SysOperLog } from '@/api/interface'

// 格式化JSON显示
const formatJson = (jsonStr: string) => {
  try {
    const jsonObj = JSON.parse(jsonStr)
    return JSON.stringify(jsonObj, null, 2)
  } catch (e) {
    return jsonStr
  }
}

// 组件属性 - 使用解构赋值直接获取props，避免变量未使用警告
const { visible, logInfo } = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  logInfo: {
    type: Object as () => SysOperLog.ResOperLogList,
    default: () => ({})
  }
})

// 组件事件 - 直接使用emit调用，避免变量未使用警告
defineEmits(['update:visible', 'close'])
</script>

<style scoped>
.param-pre {
  background-color: #f5f7fa;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
  color: #333;
}

.error-message {
  color: #f56c6c;
  background-color: #fef0f0;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #fbc4c4;
}

::v-deep .el-descriptions-item__content {
  word-break: break-all;
}
</style>
