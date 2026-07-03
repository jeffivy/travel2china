<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useScenarioStore } from '@/stores/scenario'
import client from '@/api/client'
import { ElMessage } from 'element-plus'

const router = useRouter()
const auth = useAuthStore()
const scenarioStore = useScenarioStore()

const scenarios = ref<any[]>([])
const topologies = ref<any[]>([])
const currentScenarioId = ref('')
const selectedSpeed = ref('normal')
const loading = ref(false)

onMounted(async () => {
  await auth.fetchMe()
  await loadData()
})

const dataLoading = ref(true)
const dataError = ref('')

async function loadData() {
  dataLoading.value = true
  dataError.value = ''
  try {
    const [sRes, tRes]: any[] = await Promise.all([
      client.get('/scenarios'),
      client.get('/topologies'),
    ])
    scenarios.value = sRes.data || []
    topologies.value = tRes.data || []
    if (scenarios.value.length === 0) {
      dataError.value = '暂无剧本数据，请运行 scripts/init_data.py 初始化'
    }
  } catch (e: any) {
    const msg = e?.response?.data?.detail || e?.message || '无法连接后端服务'
    dataError.value = msg
    console.error('Dashboard loadData error:', e)
  } finally {
    dataLoading.value = false
  }
}

async function startDemo() {
  if (!currentScenarioId.value) {
    ElMessage.warning('请先在左侧剧本列表中点击选择一个剧本')
    return
  }
  loading.value = true
  try {
    await scenarioStore.startScenario(currentScenarioId.value, selectedSpeed.value)
    ElMessage.success('剧本已启动，正在跳转到演示页面...')
    // 自动跳转到演示播放页
    setTimeout(() => {
      router.push(`/scenarios/${currentScenarioId.value}/play`)
    }, 500)
  } catch (e: any) {
    const msg = e?.response?.data?.detail || e?.message || '启动失败，请检查后端服务'
    ElMessage.error(msg)
  } finally {
    loading.value = false
  }
}

function goToScenario(id: string) {
  router.push(`/scenarios/${id}/play`)
}

function goToTopology(id: string) {
  router.push(`/topology/${id}`)
}

async function createScenarioFromTopo(topo: any) {
  try {
    // 自动创建剧本：使用拓扑的第一个 web-server 作为攻击目标，默认 ATT-001
    const attackTarget = topo.nodes?.find((n: any) => n.type === 'web-server')?.id
      || topo.nodes?.find((n: any) => n.type === 'app-server')?.id
      || topo.nodes?.[0]?.id || ''

    const attackSequence = attackTarget ? [{
      step_id: 'step-1',
      order: 1,
      script_id: 'ATT-001',
      target_node_id: attackTarget,
      params: {},
      wait_after_sec: 2,
      continue_on_fail: false,
    }] : []

    const res: any = await client.post('/scenarios', {
      name: topo.name + ' - 演示剧本',
      description: '基于拓扑「' + topo.name + '」自动生成的演示剧本',
      topology_id: topo.id,
      attack_sequence: attackSequence,
      defense_snapshot: {},
      difficulty: 'medium',
      expected_duration_sec: 180,
      tags: [],
    })
    ElMessage.success('剧本已创建')
    // 刷新数据
    await loadData()
    // 跳转到剧本编辑页
    router.push(`/scenarios/${res.data.id}`)
  } catch (e: any) {
    ElMessage.error('创建失败: ' + (e?.response?.data?.detail || e?.message || ''))
  }
}

// 防御产品状态
const defenseProducts = ref([
  { id: 'waf', name: '网站安全专家(WAF)', enabled: false, icon: 'Monitor' },
  { id: 'firewall-brain', name: '天翼安全大脑(防护版)', enabled: false, icon: 'Umbrella' },
  { id: 'edr-server', name: '云镜(服务端EDR)', enabled: false, icon: 'DataAnalysis' },
  { id: 'edr-pc', name: '云脉(PC端)', enabled: false, icon: 'Iphone' },
  { id: 'anti-ddos', name: '云堤(抗D)', enabled: false, icon: 'Warning' },
  { id: 'soc', name: '璇玑(SOC)', enabled: false, icon: 'Odometer' },
  { id: 'audit-brain', name: '安全大脑(审计版)', enabled: false, icon: 'DocumentChecked' },
  { id: 'llm-guardrail', name: '大模型围栏(见微)', enabled: false, icon: 'Cpu' },
])

function toggleProduct(prod: any) {
  prod.enabled = !prod.enabled
  const enabled = defenseProducts.value.filter(p => p.enabled).map(p => p.id)
  const mode = enabled.length === 0 ? 'none' : enabled.length === 8 ? 'full' : 'partial'
  scenarioStore.switchDefenseMode(mode, enabled)
}
</script>

<template>
  <div class="dashboard">
    <!-- 三屏布局 -->
    <div class="three-panel">
      <!-- 左侧: 拓扑预览 + 剧本列表 -->
      <div class="panel-left">
        <el-tabs model-value="topology" type="border-card" class="panel-tabs">
          <el-tab-pane label="拓扑模板" name="topology">
            <div class="topology-grid">
              <div
                v-for="topo in topologies"
                :key="topo.id"
                class="topo-card"
              >
                <div @click="goToTopology(topo.id)" style="cursor:pointer">
                  <el-icon :size="32"><Grid /></el-icon>
                  <div class="topo-name">{{ topo.name }}</div>
                  <div class="topo-desc">{{ topo.nodes?.length || 0 }}节点 {{ topo.edges?.length || 0 }}连线</div>
                </div>
                <el-button size="small" type="primary" @click="createScenarioFromTopo(topo)" style="margin-top:8px;width:100%">
                  <el-icon><Plus /></el-icon> 创建剧本
                </el-button>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane label="剧本列表" name="scenarios">
            <div class="scenario-list">
              <div
                v-for="scn in scenarios"
                :key="scn.id"
                class="scenario-item"
                :class="{ active: currentScenarioId === scn.id }"
                @click="currentScenarioId = scn.id"
                @dblclick="goToScenario(scn.id)"
              >
                <div class="scn-header">
                  <el-tag :type="scn.difficulty === 'easy' ? 'success' : scn.difficulty === 'hard' ? 'danger' : 'warning'" size="small">
                    {{ scn.difficulty === 'easy' ? '简单' : scn.difficulty === 'hard' ? '困难' : '中等' }}
                  </el-tag>
                  <span class="scn-name">{{ scn.name }}</span>
                </div>
                <div class="scn-desc">{{ scn.description?.slice(0, 50) }}</div>
                <div class="scn-meta">
                  <span>{{ scn.attack_sequence?.length || 0 }} 步骤</span>
                  <span>~{{ Math.round((scn.expected_duration_sec || 180) / 60) }} 分钟</span>
                </div>
              </div>
              <div v-if="scenarios.length === 0" class="empty-hint">
                暂无剧本，请在"剧本管理"中创建或导入
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- 中间: 策略配置 -->
      <div class="panel-center">
        <div class="panel-title">🛡 防御策略配置</div>
        <div class="defense-list">
          <div
            v-for="prod in defenseProducts"
            :key="prod.id"
            class="defense-item"
            :class="{ enabled: prod.enabled }"
            @click="toggleProduct(prod)"
          >
            <div class="defense-icon">
              <el-icon :size="24"><component :is="prod.icon" /></el-icon>
            </div>
            <div class="defense-info">
              <div class="defense-name">{{ prod.name }}</div>
              <el-switch :model-value="prod.enabled" size="small" @click.stop="toggleProduct(prod)" />
            </div>
          </div>
        </div>

        <div class="quick-start">
          <el-select v-model="currentScenarioId" placeholder="选择剧本" size="large" style="width: 100%; margin-bottom: 12px;">
            <el-option v-for="s in scenarios" :key="s.id" :label="s.name" :value="s.id" />
          </el-select>

          <el-select v-model="selectedSpeed" size="default" style="width: 100%; margin-bottom: 12px;">
            <el-option label="正常速度" value="normal" />
            <el-option label="慢速 (3x)" value="slow" />
            <el-option label="快速 (3x)" value="fast" />
          </el-select>

          <el-button
            type="primary"
            size="large"
            :loading="loading"
            @click="startDemo"
            style="width: 100%"
          >
            <el-icon><VideoPlay /></el-icon>
            {{ loading ? '启动中...' : '▶ 启动演示' }}
          </el-button>
        </div>
      </div>

      <!-- 右侧: 实时状态 -->
      <div class="panel-right">
        <div class="panel-title">📊 实时状态</div>

        <!-- 数据加载失败 -->
        <div v-if="dataError" class="status-idle" style="text-align:center;">
          <el-icon :size="48"><WarningFilled /></el-icon>
          <p style="color: var(--color-danger);">{{ dataError }}</p>
          <el-button size="small" @click="loadData">重试加载</el-button>
        </div>

        <!-- 数据加载中 -->
        <div v-else-if="dataLoading" class="status-idle">
          <el-icon :size="48" class="is-loading"><Loading /></el-icon>
          <p>正在加载数据...</p>
        </div>

        <!-- 剧本执行中 -->
        <div v-else-if="scenarioStore.playStatus !== 'idle'" class="status-running">
          <div class="progress-bar">
            <el-progress
              :percentage="scenarioStore.progressPct"
              :status="scenarioStore.playStatus === 'completed' ? 'success' : ''"
            />
          </div>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-num">{{ scenarioStore.executionStats.completedSteps }}</div>
              <div class="stat-label">已完成</div>
            </div>
            <div class="stat-item success">
              <div class="stat-num">{{ scenarioStore.executionStats.successSteps }}</div>
              <div class="stat-label">攻击成功</div>
            </div>
            <div class="stat-item blocked">
              <div class="stat-num">{{ scenarioStore.executionStats.blockedSteps }}</div>
              <div class="stat-label">被拦截</div>
            </div>
          </div>
          <div class="defense-mode">
            防御模式: <el-tag :type="scenarioStore.defenseMode === 'none' ? 'info' : scenarioStore.defenseMode === 'full' ? 'success' : 'warning'">
              {{ scenarioStore.defenseMode === 'none' ? '无防御' : scenarioStore.defenseMode === 'full' ? '全面防御' : '部分防御' }}
            </el-tag>
          </div>
        </div>

        <!-- 空闲：等待用户操作 -->
        <div v-else class="status-idle">
          <el-icon :size="64"><Monitor /></el-icon>
          <p>选择剧本并启动演示</p>
          <p class="hint">
            {{ scenarios.length > 0 ? '👈 在左侧面板选择剧本后点击「启动演示」' : '暂无可用剧本' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dashboard {
  height: 100%;
  overflow: hidden;
}

.three-panel {
  display: flex;
  height: 100%;
  gap: 1px;
  background: var(--border-color);
}

.panel-left {
  flex: 2;
  background: var(--bg-panel);
  overflow-y: auto;
}

.panel-center {
  flex: 1;
  background: var(--bg-panel);
  padding: 16px;
  overflow-y: auto;
}

.panel-right {
  flex: 1;
  background: var(--bg-panel);
  padding: 16px;
  overflow-y: auto;
}

.panel-tabs {
  height: 100%;
  background: transparent;
  :deep(.el-tabs__content) { height: calc(100% - 40px); overflow-y: auto; }
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color);
}

.topology-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 12px;
  .topo-card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: 16px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    &:hover {
      border-color: var(--color-primary-light);
      background: var(--bg-hover);
    }
    .topo-name { font-size: 14px; margin: 8px 0 4px; }
    .topo-desc { font-size: 11px; color: var(--text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  }
}

.scenario-list {
  padding: 8px;
  .scenario-item {
    padding: 12px;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    margin-bottom: 8px;
    cursor: pointer;
    transition: all 0.2s;
    &:hover, &.active {
      border-color: var(--color-primary-light);
    }
    .scn-header { display: flex; gap: 8px; align-items: center; margin-bottom: 4px; }
    .scn-name { font-size: 14px; font-weight: 500; }
    .scn-desc { font-size: 12px; color: var(--text-muted); margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .scn-meta { font-size: 11px; color: var(--text-muted); display: flex; gap: 16px; }
  }
}

.defense-list {
  .defense-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    margin-bottom: 8px;
    cursor: pointer;
    transition: all 0.2s;
    &.enabled {
      border-color: var(--color-ok);
      background: rgba(39, 174, 96, 0.1);
    }
    &:hover { background: var(--bg-hover); }
    .defense-info {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .defense-name { font-size: 13px; }
    }
  }
}

.quick-start {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.status-idle {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60%;
  color: var(--text-muted);
  p { margin: 8px 0; font-size: 14px; }
  .hint { font-size: 12px; }
}

.status-running {
  .progress-bar { margin-bottom: 24px; }
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 16px;
    .stat-item {
      background: var(--bg-card);
      border-radius: var(--radius-md);
      padding: 16px 8px;
      text-align: center;
      .stat-num { font-size: 28px; font-weight: 700; }
      .stat-label { font-size: 12px; color: var(--text-muted); margin-top: 4px; }
      &.success .stat-num { color: var(--color-ok); }
      &.blocked .stat-num { color: var(--color-danger); }
    }
  }
  .defense-mode { text-align: center; }
}

.empty-hint {
  padding: 32px;
  text-align: center;
  color: var(--text-muted);
  font-size: 13px;
}
</style>
