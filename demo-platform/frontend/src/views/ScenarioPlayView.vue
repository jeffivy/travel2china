<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useScenarioStore } from '@/stores/scenario'
import client from '@/api/client'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const store = useScenarioStore()

const scenarioId = route.params.id as string
const scenario = ref<any>(null)
const steps = ref<any[]>([])
const logs = ref<string[]>([])
const loading = ref(false)
const ws = ref<WebSocket | null>(null)

onMounted(async () => {
  // 1. 加载剧本元数据
  try {
    const res: any = await client.get(`/scenarios/${scenarioId}`)
    scenario.value = res.data || res
    steps.value = scenario.value.attack_sequence || []
  } catch {
    ElMessage.error('加载剧本失败')
    router.push('/scenarios')
    return
  }

  // 2. 如果 Dashboard 已经启动了执行，自动恢复轮询
  if (store.playStatus === 'running' && store.currentExecutionId) {
    logs.value = [
      '═══════════════════════════════════',
      '  检测到正在运行的演示',
      `  执行ID: ${store.currentExecutionId}`,
      '═══════════════════════════════════',
      '',
    ]
    store.executionStats.totalSteps = steps.value.length
    try { connectWebSocket(store.currentExecutionId) } catch { /* optional */ }
    pollSteps(store.currentExecutionId)
  } else if (store.playStatus !== 'running') {
    // 3. 全新进入（非 Dashboard 跳转）：重置状态，启用启动按钮
    store.reset()
    logs.value = []
  }
})

onUnmounted(() => {
  ws.value?.close()
})

function connectWebSocket(execId: string) {
  const token = localStorage.getItem('token')
  const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:'
  const wsUrl = `${protocol}//${location.host}/ws?topic=scenario:${execId}&token=${token}`

  ws.value = new WebSocket(wsUrl)
  ws.value.onmessage = (e) => {
    try {
      const msg = JSON.parse(e.data)
      if (msg.type === 'step_complete') {
        logs.value.push(...(msg.result?.result?.logs || ['步骤完成']))
      } else if (msg.type === 'scenario_complete') {
        ElMessage.success('剧本演示完成')
        store.playStatus = 'completed'
      }
    } catch { /* */ }
  }
}

async function startPlay() {
  loading.value = true
  logs.value = []
  try {
    const result = await store.startScenario(scenarioId, 'normal')
    logs.value = [
      '═══════════════════════════════════',
      '  剧本演示启动',
      `  执行ID: ${result.execution_id}`,
      '═══════════════════════════════════',
      '',
    ]
    // WebSocket 可能不可用，主要靠轮询
    try { connectWebSocket(result.execution_id) } catch { /* optional */ }
    // 轮询步骤状态
    pollSteps(result.execution_id)
  } catch (e: any) {
    const msg = e?.response?.data?.detail || e?.message || '启动失败'
    ElMessage.error(msg)
    logs.value = [`[错误] ${msg}`]
  } finally {
    loading.value = false
  }
}

async function stopPlay() {
  await store.stopScenario(scenarioId)
  ws.value?.close()
  ElMessage.info('已停止演示')
}

let pollTimer: any = null
let pollCount = 0
async function pollSteps(executionId: string) {
  pollCount = 0
  const delay = 2000
  const maxPolls = 60 // 最多轮询 2 分钟
  const poll = async () => {
    try {
      pollCount++
      const s = await store.fetchExecutionSteps(executionId)
      if (!s || s.length === 0) {
        if (pollCount <= 3) {
          logs.value.push(`[轮询 ${pollCount}] 等待步骤数据...`)
        }
      } else {
        store.executionStats.totalSteps = s.length
        store.executionStats.completedSteps = s.filter((x: any) => x.status !== 'pending' && x.status !== 'running').length
        store.executionStats.successSteps = s.filter((x: any) => x.status === 'success').length
        store.executionStats.blockedSteps = s.filter((x: any) => x.status === 'blocked').length

        // 更新日志
        for (const step of s) {
          const result = store.stepResults.get(step.step_id)
          if (result && result.logs.length > 0 && !logs.value.includes(`[步骤${step.order_num}] ${result.logs[0]}`)) {
            logs.value.push(`[步骤${step.order_num}] ${step.script_id}: ${step.status}`)
            for (const l of result.logs.slice(0, 3)) {
              logs.value.push(`  ${l}`)
            }
          }
        }

        const allDone = s.every((x: any) => ['success', 'failed', 'blocked', 'error'].includes(x.status))
        if (allDone && store.playStatus === 'running') {
          store.playStatus = 'completed'
          logs.value.push('')
          logs.value.push('═══════════════════════════════════')
          logs.value.push('  演示完成!')
          logs.value.push(`  攻击成功: ${store.executionStats.successSteps}  |  被拦截: ${store.executionStats.blockedSteps}`)
          logs.value.push('═══════════════════════════════════')
          ElMessage.success('所有步骤执行完毕')
          return
        }
      }
      if (store.playStatus === 'running' && pollCount < maxPolls) {
        pollTimer = setTimeout(poll, delay)
      } else if (pollCount >= maxPolls) {
        logs.value.push('[超时] 轮询已停止（超过2分钟）')
      }
    } catch {
      if (pollCount <= 3) {
        logs.value.push(`[轮询 ${pollCount}] 获取步骤失败，重试中...`)
      }
      if (store.playStatus === 'running' && pollCount < maxPolls) {
        pollTimer = setTimeout(poll, delay)
      }
    }
  }
  poll()
}
</script>

<template>
  <div class="play-view">
    <div class="play-topbar">
      <el-button @click="router.back()" text>
        <el-icon><ArrowLeft /></el-icon> 返回
      </el-button>
      <span class="play-title">{{ scenario?.name || '演示播放' }}</span>
      <div class="play-controls">
        <el-button
          type="success"
          size="large"
          :loading="loading"
          @click="startPlay"
          :disabled="store.playStatus === 'running'"
        >
          <el-icon><VideoPlay /></el-icon> 启动
        </el-button>
        <el-button
          type="danger"
          size="large"
          @click="stopPlay"
          :disabled="store.playStatus !== 'running'"
        >
          <el-icon><VideoPause /></el-icon> 停止
        </el-button>
      </div>
    </div>

    <div class="play-main">
      <div class="play-steps">
        <h3>攻击步骤</h3>
        <div
          v-for="(step, idx) in steps"
          :key="step.step_id"
          class="step-card"
          :class="{
            running: store.executionStats.completedSteps === idx,
            done: store.stepResults.get(step.step_id)?.status && store.stepResults.get(step.step_id)!.status !== 'running',
          }"
        >
          <div class="step-num">{{ idx + 1 }}</div>
          <div class="step-info">
            <div class="step-script">{{ step.script_id }}</div>
            <div class="step-target">目标: {{ step.target_node_id }}</div>
          </div>
          <el-tag
            v-if="store.stepResults.get(step.step_id)?.status"
            :type="store.stepResults.get(step.step_id)!.status === 'success' ? 'danger' : store.stepResults.get(step.step_id)!.status === 'blocked' ? 'success' : 'info'"
            size="small"
          >
            {{ store.stepResults.get(step.step_id)!.status === 'success' ? '攻击成功' : store.stepResults.get(step.step_id)!.status === 'blocked' ? '已拦截' : store.stepResults.get(step.step_id)!.status }}
          </el-tag>
        </div>
      </div>

      <div class="play-log">
        <h3>执行日志</h3>
        <div class="log-area">
          <div v-for="(line, i) in logs" :key="i" class="log-line">{{ line }}</div>
          <div v-if="logs.length === 0" class="log-empty">等待启动...</div>
        </div>
      </div>
    </div>

    <div class="play-statusbar">
      <span>状态: <el-tag>{{ store.playStatus }}</el-tag></span>
      <span>进度: {{ store.executionStats.completedSteps }}/{{ store.executionStats.totalSteps || steps.length }}</span>
      <span>防御: <el-tag :type="store.defenseMode === 'full' ? 'success' : 'info'">{{ store.defenseMode }}</el-tag></span>
      <el-progress :percentage="store.progressPct" style="width: 200px;" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.play-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #0a0f18;
}

.play-topbar {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  background: var(--bg-panel);
  border-bottom: 1px solid var(--border-color);
  gap: 16px;
  .play-title {
    flex: 1;
    font-size: 18px;
    font-weight: 600;
  }
  .play-controls {
    display: flex;
    gap: 8px;
  }
}

.play-main {
  flex: 1;
  display: flex;
  gap: 1px;
  background: var(--border-color);
  overflow: hidden;

  .play-steps {
    width: 280px;
    background: var(--bg-panel);
    padding: 16px;
    overflow-y: auto;
    h3 { margin: 0 0 12px; font-size: 15px; }

    .step-card {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      margin-bottom: 8px;
      transition: all 0.2s;

      &.running { border-color: var(--color-warn); }
      &.done { opacity: 0.7; }

      .step-num {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: var(--color-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 700;
        flex-shrink: 0;
      }
      .step-info {
        flex: 1;
        min-width: 0;
        .step-script { font-size: 13px; font-weight: 500; }
        .step-target { font-size: 11px; color: var(--text-muted); }
      }
    }
  }

  .play-log {
    flex: 1;
    background: var(--bg-panel);
    padding: 16px;
    display: flex;
    flex-direction: column;
    h3 { margin: 0 0 12px; font-size: 15px; }

    .log-area {
      flex: 1;
      background: #0d1117;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      padding: 12px;
      overflow-y: auto;
      font-family: 'Fira Code', 'Menlo', monospace;
      font-size: 12px;
      .log-line { padding: 2px 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
      .log-empty { color: var(--text-muted); text-align: center; padding-top: 40px; }
    }
  }
}

.play-statusbar {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 10px 20px;
  background: var(--bg-panel);
  border-top: 1px solid var(--border-color);
  font-size: 13px;
}
</style>
