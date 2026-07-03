<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import client from '@/api/client'

const alerts = ref<any[]>([])
const loading = ref(false)
const executions = ref<any[]>([])
const selectedExecId = ref('')
const severityFilter = ref('')
const total = ref(0)

onMounted(async () => {
  await loadExecutions()
})

async function loadExecutions() {
  try {
    const res: any = await client.get('/executions?limit=50')
    executions.value = res.data || []
    if (executions.value.length > 0) {
      selectedExecId.value = executions.value[0].id
      await loadAlerts()
    }
  } catch { /* */ }
}

async function loadAlerts() {
  if (!selectedExecId.value) return
  loading.value = true
  try {
    let url = `/executions/${selectedExecId.value}/alerts?limit=200`
    if (severityFilter.value) url += `&severity=${severityFilter.value}`
    const res: any = await client.get(url)
    alerts.value = res.data || []
    total.value = alerts.value.length
  } catch { /* */ }
  finally { loading.value = false }
}

watch(severityFilter, loadAlerts)

const severities = ['critical', 'high', 'medium', 'low']

function severityColor(s: string) {
  return s === 'critical' ? 'danger' : s === 'high' ? 'warning' : s === 'medium' ? 'info' : 'success'
}

function formatTime(t: string) {
  if (!t) return '-'
  return new Date(t).toLocaleTimeString('zh-CN')
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h2>🔔 告警中心</h2>
      <div class="header-controls">
        <el-select v-model="selectedExecId" @change="loadAlerts" placeholder="选择执行" style="width:280px">
          <el-option v-for="ex in executions" :key="ex.id" :label="'执行 ' + ex.id.slice(0,8) + ' (' + ex.status + ')'" :value="ex.id" />
        </el-select>
        <el-select v-model="severityFilter" placeholder="严重度" clearable style="width:120px">
          <el-option v-for="s in severities" :key="s" :label="s" :value="s" />
        </el-select>
        <el-tag type="info">共 {{ total }} 条</el-tag>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-row" v-if="alerts.length > 0">
      <div class="stat-card" v-for="s in severities" :key="s" :class="s">
        <div class="stat-num">{{ alerts.filter(a => a.severity === s).length }}</div>
        <div class="stat-label">{{ s }}</div>
      </div>
    </div>

    <!-- 告警表格 -->
    <el-table :data="alerts" v-loading="loading" max-height="calc(100vh - 320px)" stripe>
      <el-table-column label="严重度" width="80">
        <template #default="{row}">
          <el-tag :type="severityColor(row.severity)" size="small" effect="dark">{{ row.severity }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="告警标题" min-width="280" show-overflow-tooltip />
      <el-table-column label="产品" width="140">
        <template #default="{row}">{{ row.product }}</template>
      </el-table-column>
      <el-table-column label="规则" width="80">
        <template #default="{row}">{{ row.rule_id || '-' }}</template>
      </el-table-column>
      <el-table-column label="攻击脚本" width="90">
        <template #default="{row}">{{ row.attack_script_id || '-' }}</template>
      </el-table-column>
      <el-table-column label="源IP" width="130">
        <template #default="{row}">{{ row.src_ip || '-' }}</template>
      </el-table-column>
      <el-table-column label="目标IP" width="130">
        <template #default="{row}">{{ row.dst_ip || '-' }}</template>
      </el-table-column>
      <el-table-column label="时间" width="90">
        <template #default="{row}">{{ formatTime(row.created_at) }}</template>
      </el-table-column>
      <el-table-column label="状态" width="70">
        <template #default="{row}">
          <el-tag :type="row.status === 'new' ? 'danger' : 'success'" size="small">{{ row.status === 'new' ? '未处理' : '已处理' }}</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <el-empty v-if="!loading && alerts.length === 0" description="暂无告警数据，请先执行剧本">
      <el-button type="primary" @click="$router.push('/scenarios')">前往剧本管理</el-button>
    </el-empty>
  </div>
</template>

<style scoped lang="scss">
.page { padding: 24px; height: 100%; overflow-y: auto; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;
  h2 { margin: 0; }
  .header-controls { display: flex; gap: 8px; align-items: center; }
}

.stats-row {
  display: flex; gap: 12px; margin-bottom: 16px;
  .stat-card {
    flex: 1; padding: 14px; border-radius: var(--radius-md); text-align: center;
    background: var(--bg-card); border: 1px solid var(--border-color);
    .stat-num { font-size: 24px; font-weight: 700; }
    .stat-label { font-size: 11px; color: var(--text-muted); text-transform: uppercase; }
    &.critical { border-color: var(--color-danger); .stat-num { color: var(--color-danger); } }
    &.high { border-color: var(--color-warn); .stat-num { color: var(--color-warn); } }
    &.medium { .stat-num { color: var(--color-info); } }
    &.low { .stat-num { color: var(--text-muted); } }
  }
}
</style>
