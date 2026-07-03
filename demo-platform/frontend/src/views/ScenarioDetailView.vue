<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import client from '@/api/client'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const scenarioId = route.params.id as string

const loading = ref(true)
const saving = ref(false)

// ---- 剧本数据 ----
const name = ref('')
const description = ref('')
const difficulty = ref('medium')
const tags = ref<string[]>([])
const topologyId = ref('')
const attackSequence = ref<any[]>([])
const defenseSnapshot = ref<Record<string, any>>({})

// ---- 关联数据 ----
const topologies = ref<any[]>([])
const attackScripts = ref<any[]>([])
const selectedTopo = computed(() => topologies.value.find(t => t.id === topologyId.value))
const topoNodes = computed(() => selectedTopo.value?.nodes || [])

// ---- 编辑中的攻击步骤 ----
const editingStep = ref<any>(null)
const editingStepIdx = ref(-1)
const showStepDialog = ref(false)

onMounted(async () => {
  await loadData()
})

async function loadData() {
  loading.value = true
  try {
    const [sRes, tRes, aRes]: any[] = await Promise.all([
      client.get(`/scenarios/${scenarioId}`),
      client.get('/topologies'),
      client.get('/config/attack-scripts'),
    ])
    const scn = sRes.data || sRes
    name.value = scn.name
    description.value = scn.description || ''
    difficulty.value = scn.difficulty || 'medium'
    tags.value = scn.tags || []
    topologyId.value = scn.topology_id || ''
    attackSequence.value = (scn.attack_sequence || []).map((s: any, i: number) => ({
      step_id: s.step_id || `step-${i + 1}`,
      order: s.order || i + 1,
      script_id: s.script_id || '',
      target_node_id: s.target_node_id || '',
      params: s.params || {},
      wait_after_sec: s.wait_after_sec || 2,
      continue_on_fail: s.continue_on_fail ?? false,
    }))
    defenseSnapshot.value = scn.defense_snapshot || {}

    topologies.value = tRes.data || []
    attackScripts.value = aRes.data || []
  } catch (e: any) {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

// ---- 基本字段保存 ----
async function saveBasicInfo() {
  saving.value = true
  try {
    await client.put(`/scenarios/${scenarioId}`, {
      name: name.value,
      description: description.value,
      difficulty: difficulty.value,
      topology_id: topologyId.value,
      tags: tags.value,
    })
    ElMessage.success('基本信息已保存')
  } catch (e: any) {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

// ---- 攻击步骤操作 ----
function addStep() {
  editingStep.value = {
    step_id: `step-${Date.now()}`,
    order: attackSequence.value.length + 1,
    script_id: 'ATT-001',
    target_node_id: topoNodes.value[0]?.id || '',
    params: {},
    wait_after_sec: 2,
    continue_on_fail: false,
  }
  editingStepIdx.value = -1 // -1 = new
  showStepDialog.value = true
}

function editStep(idx: number) {
  editingStep.value = { ...attackSequence.value[idx] }
  editingStepIdx.value = idx
  showStepDialog.value = true
}

function removeStep(idx: number) {
  attackSequence.value.splice(idx, 1)
  attackSequence.value.forEach((s, i) => { s.order = i + 1 })
}

function moveStep(idx: number, dir: number) {
  const newIdx = idx + dir
  if (newIdx < 0 || newIdx >= attackSequence.value.length) return
  const temp = attackSequence.value[idx]
  attackSequence.value[idx] = attackSequence.value[newIdx]
  attackSequence.value[newIdx] = temp
  attackSequence.value.forEach((s, i) => { s.order = i + 1 })
}

function saveStep() {
  if (!editingStep.value) return
  if (editingStepIdx.value >= 0) {
    attackSequence.value[editingStepIdx.value] = editingStep.value
  } else {
    attackSequence.value.push(editingStep.value)
  }
  attackSequence.value.forEach((s, i) => { s.order = i + 1 })
  showStepDialog.value = false
  editingStep.value = null
}

// ---- 全部保存 ----
async function saveAll() {
  saving.value = true
  try {
    await client.put(`/scenarios/${scenarioId}`, {
      name: name.value,
      description: description.value,
      difficulty: difficulty.value,
      topology_id: topologyId.value,
      tags: tags.value,
      attack_sequence: attackSequence.value,
      defense_snapshot: defenseSnapshot.value,
    })
    ElMessage.success('剧本已保存')
  } catch (e: any) {
    ElMessage.error('保存失败: ' + (e?.response?.data?.detail || e?.message || ''))
  } finally {
    saving.value = false
  }
}

// ---- 防御产品切换 ----
const defenseProducts = [
  { id: 'waf', name: '网站安全专家(WAF)', rules: ['DEF-020', 'DEF-021', 'DEF-022'] },
  { id: 'firewall-brain', name: '天翼安全大脑(防护版)', rules: ['DEF-001', 'DEF-002', 'DEF-003', 'DEF-004', 'DEF-005', 'DEF-006', 'DEF-007', 'DEF-008'] },
  { id: 'edr-server', name: '云镜(服务端EDR)', rules: ['DEF-015', 'DEF-016', 'DEF-017', 'DEF-018', 'DEF-019'] },
  { id: 'edr-pc', name: '云脉(PC端)', rules: ['DEF-011', 'DEF-012', 'DEF-013', 'DEF-014'] },
  { id: 'anti-ddos', name: '云堤(抗D)', rules: ['DEF-025'] },
  { id: 'soc', name: '璇玑(SOC)', rules: ['DEF-023', 'DEF-024'] },
  { id: 'audit-brain', name: '安全大脑(审计版)', rules: ['DEF-009', 'DEF-010'] },
  { id: 'llm-guardrail', name: '大模型围栏(见微)', rules: ['DEF-026', 'DEF-027'] },
]

function toggleDefenseProduct(prodId: string) {
  if (!defenseSnapshot.value[prodId]) {
    defenseSnapshot.value[prodId] = { enabled: false, rules: {} }
  }
  defenseSnapshot.value[prodId].enabled = !defenseSnapshot.value[prodId].enabled
}

function toggleDefenseRule(prodId: string, ruleId: string) {
  if (!defenseSnapshot.value[prodId]) return
  const rules = defenseSnapshot.value[prodId].rules || {}
  if (!rules[ruleId]) {
    rules[ruleId] = { enabled: false, config: {} }
  }
  rules[ruleId].enabled = !rules[ruleId].enabled
  defenseSnapshot.value[prodId].rules = rules
}

function isProductEnabled(prodId: string): boolean {
  return !!defenseSnapshot.value[prodId]?.enabled
}

function isRuleEnabled(prodId: string, ruleId: string): boolean {
  return !!defenseSnapshot.value[prodId]?.rules?.[ruleId]?.enabled
}
</script>

<template>
  <div class="editor" v-loading="loading">
    <!-- 顶部工具栏 -->
    <div class="toolbar">
      <el-button @click="router.back()" text><el-icon><ArrowLeft /></el-icon></el-button>
      <span class="title">编辑剧本</span>
      <el-button type="primary" :loading="saving" @click="saveAll">
        <el-icon><Check /></el-icon> 保存全部
      </el-button>
    </div>

    <div class="editor-body" v-if="!loading">
      <!-- 基本信息区 -->
      <div class="section">
        <div class="section-title">基本信息</div>
        <div class="basic-form">
          <el-input v-model="name" placeholder="剧本名称" size="large" style="width:300px" />
          <el-input v-model="description" placeholder="剧本描述" style="width:400px" />
          <el-select v-model="difficulty" style="width:120px">
            <el-option label="简单" value="easy" />
            <el-option label="中等" value="medium" />
            <el-option label="困难" value="hard" />
          </el-select>
          <el-select v-model="topologyId" placeholder="关联拓扑" style="width:240px">
            <el-option v-for="t in topologies" :key="t.id" :label="t.name + ' (' + t.nodes?.length + '节点)'" :value="t.id" />
          </el-select>
          <el-select v-model="tags" multiple filterable allow-create placeholder="标签（回车添加）" style="width:280px" size="default">
            <el-option v-for="t in ['web','sql注入','横向移动','WAF','EDR','钓鱼','勒索','DDoS','摄像头']" :key="t" :label="t" :value="t" />
          </el-select>
          <el-button size="small" @click="saveBasicInfo">保存基本信息</el-button>
        </div>
      </div>

      <!-- 攻击序列编辑 -->
      <div class="section">
        <div class="section-title">
          攻击序列 ({{ attackSequence.length }} 步骤)
          <el-button size="small" type="primary" @click="addStep"><el-icon><Plus /></el-icon> 添加步骤</el-button>
        </div>

        <div v-if="!topologyId" class="hint-warn">
          ⚠ 请先选择一个关联拓扑，才能为攻击步骤指定目标节点
        </div>

        <div v-else-if="attackSequence.length === 0" class="hint-empty">
          暂无攻击步骤，点击「添加步骤」开始编排
        </div>

        <div v-else class="step-list">
          <div v-for="(step, idx) in attackSequence" :key="step.step_id" class="step-card">
            <div class="step-order">{{ idx + 1 }}</div>
            <div class="step-main">
              <div class="step-script">
                <el-tag type="danger" size="small">{{ step.script_id }}</el-tag>
                <span class="arrow">→</span>
                <el-tag size="small">{{ step.target_node_id || '未选目标' }}</el-tag>
              </div>
              <div class="step-meta">
                等待 {{ step.wait_after_sec }}s
                <span v-if="step.continue_on_fail"> | 失败继续</span>
              </div>
            </div>
            <div class="step-actions">
              <el-button size="small" @click="moveStep(idx, -1)" :disabled="idx === 0" circle><el-icon><Top /></el-icon></el-button>
              <el-button size="small" @click="moveStep(idx, 1)" :disabled="idx === attackSequence.length - 1" circle><el-icon><Bottom /></el-icon></el-button>
              <el-button size="small" @click="editStep(idx)"><el-icon><Edit /></el-icon></el-button>
              <el-button size="small" type="danger" @click="removeStep(idx)" circle><el-icon><Delete /></el-icon></el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 防御配置 -->
      <div class="section">
        <div class="section-title">防御策略配置</div>
        <div class="defense-grid">
          <div v-for="prod in defenseProducts" :key="prod.id" class="defense-card" :class="{ active: isProductEnabled(prod.id) }">
            <div class="prod-header" @click="toggleDefenseProduct(prod.id)">
              <el-switch :model-value="isProductEnabled(prod.id)" size="small" @click.stop="toggleDefenseProduct(prod.id)" />
              <span class="prod-name">{{ prod.name }}</span>
            </div>
            <div v-if="isProductEnabled(prod.id)" class="prod-rules">
              <div v-for="rid in prod.rules" :key="rid" class="rule-row" @click="toggleDefenseRule(prod.id, rid)">
                <el-checkbox :model-value="isRuleEnabled(prod.id, rid)" size="small" />
                <code>{{ rid }}</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 攻击步骤编辑弹窗 -->
    <el-dialog v-model="showStepDialog" :title="editingStepIdx >= 0 ? '编辑步骤' : '添加步骤'" width="480px">
      <el-form v-if="editingStep" label-width="100px">
        <el-form-item label="攻击脚本">
          <el-select v-model="editingStep.script_id" style="width:100%">
            <el-option v-for="s in attackScripts" :key="s.id || s[0]" :label="(s.name || s[1]?.name) + ' (' + (s.id || s[0]) + ')'" :value="s.id || s[0]" />
          </el-select>
        </el-form-item>
        <el-form-item label="目标节点">
          <el-select v-model="editingStep.target_node_id" style="width:100%" placeholder="选择拓扑中的节点">
            <el-option v-for="n in topoNodes" :key="n.id" :label="n.label + ' (' + n.type + ')'" :value="n.id" />
          </el-select>
          <div v-if="topoNodes.length === 0" style="color:var(--color-warn);font-size:12px;margin-top:4px">请先在基本信息中选择关联拓扑</div>
        </el-form-item>
        <el-form-item label="步骤间隔">
          <el-input-number v-model="editingStep.wait_after_sec" :min="0" :max="30" /> 秒
        </el-form-item>
        <el-form-item label="失败继续">
          <el-switch v-model="editingStep.continue_on_fail" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showStepDialog = false">取消</el-button>
        <el-button type="primary" @click="saveStep">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg-primary);
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 20px;
  background: var(--bg-panel);
  border-bottom: 1px solid var(--border-color);
  .title { font-size: 17px; font-weight: 600; flex: 1; }
}

.editor-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.section {
  background: var(--bg-panel);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 16px;
  margin-bottom: 16px;

  .section-title {
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.basic-form {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.hint-warn, .hint-empty {
  padding: 24px;
  text-align: center;
  color: var(--text-muted);
  font-size: 13px;
}
.hint-warn { color: var(--color-warn); }

.step-list {
  .step-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    margin-bottom: 6px;

    .step-order {
      width: 28px; height: 28px; border-radius: 50%;
      background: var(--color-primary);
      display: flex; align-items: center; justify-content: center;
      font-size: 13px; font-weight: 700; flex-shrink: 0;
    }

    .step-main { flex: 1; min-width: 0;
      .step-script { display: flex; align-items: center; gap: 6px; margin-bottom: 2px; }
      .arrow { color: var(--text-muted); }
      .step-meta { font-size: 11px; color: var(--text-muted); }
    }

    .step-actions { display: flex; gap: 2px; flex-shrink: 0; }
  }
}

.defense-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;

  .defense-card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: 10px;
    cursor: pointer;
    transition: all 0.15s;

    &.active { border-color: var(--color-ok); background: rgba(39,174,96,0.08); }

    .prod-header {
      display: flex; align-items: center; gap: 8px;
      .prod-name { font-size: 12px; font-weight: 500; }
    }

    .prod-rules {
      margin-top: 6px; padding-top: 6px; border-top: 1px solid var(--border-color);
      .rule-row {
        display: flex; align-items: center; gap: 4px; padding: 2px 0;
        font-size: 11px; color: var(--text-muted);
        code { font-size: 10px; }
        &:hover { color: var(--text-primary); }
      }
    }
  }
}
</style>
