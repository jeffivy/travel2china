<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import client from '@/api/client'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

const topologyId = ref(route.params.id as string || '')
const topologyName = ref('新建拓扑')
const topologyDesc = ref('')
const nodes = ref<any[]>([])
const edges = ref<any[]>([])
const nodeTypes = ref<any[]>([])
const canvasRef = ref<HTMLElement | null>(null)

// ---- 连接模式 ----
const connectMode = ref(false)
const connectSource = ref<string | null>(null)

// ---- 拖拽状态 ----
const dragging = ref<string | null>(null)
const dragOffset = ref({ x: 0, y: 0 })
const dragStart = ref({ x: 0, y: 0 })

// ---- 画布偏移（用于支持滚动） ----
const canvasScroll = ref({ x: 0, y: 0 })

onMounted(async () => {
  try {
    const res: any = await client.get('/config/node-types')
    const types = res.data || res || []
    nodeTypes.value = Array.isArray(types) ? types : []
    if (nodeTypes.value.length === 0) {
      ElMessage.warning('节点类型数据为空，请检查后端配置')
    }
  } catch (e: any) {
    console.error('Failed to load node types:', e)
    ElMessage.error('加载节点类型失败')
  }

  if (topologyId.value) {
    try {
      const res: any = await client.get(`/topologies/${topologyId.value}`)
      const topo = res.data || res
      topologyName.value = topo.name
      topologyDesc.value = topo.description || ''
      nodes.value = topo.nodes || []
      edges.value = topo.edges || []
    } catch {
      ElMessage.error('加载拓扑失败')
    }
  }
})

// ---- 拖拽节点 ---- //
function onNodeMouseDown(e: MouseEvent, nodeId: string) {
  if (connectMode.value) return // 连线模式下不拖拽
  e.preventDefault()
  e.stopPropagation()
  const node = nodes.value.find(n => n.id === nodeId)
  if (!node) return

  dragging.value = nodeId
  dragOffset.value = {
    x: e.clientX - node.position.x,
    y: e.clientY - node.position.y,
  }
  dragStart.value = { x: node.position.x, y: node.position.y }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

function onMouseMove(e: MouseEvent) {
  if (!dragging.value) return
  const node = nodes.value.find(n => n.id === dragging.value)
  if (!node) return

  node.position = {
    x: Math.max(0, e.clientX - dragOffset.value.x),
    y: Math.max(0, e.clientY - dragOffset.value.y),
  }
}

function onMouseUp(_e: MouseEvent) {
  dragging.value = null
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
}

onUnmounted(() => {
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
})

// ---- 连线 ---- //
function toggleConnectMode() {
  connectMode.value = !connectMode.value
  connectSource.value = null
  if (connectMode.value) {
    ElMessage.info('连线模式已开启：点击第一个节点作为源，再点击第二个节点作为目标')
  } else {
    ElMessage.info('连线模式已关闭')
  }
}

function onNodeClickForConnect(nodeId: string) {
  if (!connectMode.value) return
  if (!connectSource.value) {
    connectSource.value = nodeId
    ElMessage.success('已选择源节点，请点击目标节点')
  } else if (connectSource.value === nodeId) {
    ElMessage.warning('不能连接到自身')
    connectSource.value = null
  } else {
    // 检查是否已存在相同连线
    const exists = edges.value.some(
      e => e.source_node_id === connectSource.value && e.target_node_id === nodeId
    )
    if (exists) {
      ElMessage.warning('该连线已存在')
    } else {
      edges.value.push({
        id: `edge-${Date.now()}`,
        source_node_id: connectSource.value,
        target_node_id: nodeId,
        protocol: 'tcp',
      })
      ElMessage.success('连线已创建')
    }
    connectSource.value = null
  }
}

function removeEdge(edgeId: string) {
  edges.value = edges.value.filter(e => e.id !== edgeId)
  ElMessage.success('连线已删除')
}

// ---- 节点操作 ---- //
function addNode(nodeType: any) {
  const newNode = {
    id: `node-${Date.now()}`,
    type: nodeType.id,
    label: nodeType.name,
    position: {
      x: 150 + Math.random() * 400,
      y: 80 + Math.random() * 300,
    },
    config: {},
    vulnerabilities: [],
  }
  nodes.value.push(newNode)
  ElMessage.success(`已添加节点: ${nodeType.name}`)
}

function removeNode(nodeId: string) {
  nodes.value = nodes.value.filter(n => n.id !== nodeId)
  edges.value = edges.value.filter(e => e.source_node_id !== nodeId && e.target_node_id !== nodeId)
  connectSource.value = null
}

// ---- 现有连线上的节点可点击选中 ---- //
const selectedNode = ref<string | null>(null)

function selectNode(nodeId: string) {
  if (connectMode.value) {
    onNodeClickForConnect(nodeId)
    return
  }
  selectedNode.value = selectedNode.value === nodeId ? null : nodeId
}

// ---- 画布点击空白处取消选中 ---- //
function onCanvasClick(e: MouseEvent) {
  if ((e.target as HTMLElement).closest('.canvas-node')) return
  selectedNode.value = null
  if (connectMode.value) connectSource.value = null
}

// ---- 从拓扑创建剧本 ---- //
async function createScenarioFromTopo() {
  if (!topologyId.value) {
    ElMessage.warning('请先保存拓扑')
    return
  }
  try {
    const attackTarget = nodes.value.find((n: any) => n.type === 'web-server')?.id
      || nodes.value.find((n: any) => n.type === 'app-server')?.id
      || nodes.value[0]?.id || ''

    const attackSequence = attackTarget ? [{
      step_id: 'step-1', order: 1, script_id: 'ATT-001',
      target_node_id: attackTarget, params: {},
      wait_after_sec: 2, continue_on_fail: false,
    }] : []

    const res: any = await client.post('/scenarios', {
      name: topologyName.value + ' - 演示剧本',
      description: topologyDesc.value || '基于拓扑「' + topologyName.value + '」创建的演示剧本',
      topology_id: topologyId.value,
      attack_sequence: attackSequence,
      defense_snapshot: {},
      difficulty: 'medium',
      expected_duration_sec: 180,
      tags: [],
    })
    ElMessage.success('剧本已创建，正在跳转...')
    router.push(`/scenarios/${res.data.id}`)
  } catch (e: any) {
    ElMessage.error('创建剧本失败: ' + (e?.response?.data?.detail || e?.message || ''))
  }
}

// ---- 保存 ---- //
async function saveTopology() {
  const data = {
    name: topologyName.value,
    description: topologyDesc.value,
    nodes: nodes.value,
    edges: edges.value,
    defense_config: {},
  }
  try {
    if (topologyId.value) {
      await client.put(`/topologies/${topologyId.value}`, data)
      ElMessage.success('拓扑已更新')
    } else {
      const res: any = await client.post('/topologies', data)
      topologyId.value = res.data.id
      ElMessage.success('拓扑已创建')
    }
  } catch (e: any) {
    ElMessage.error('保存失败: ' + (e?.response?.data?.detail || e?.message || '未知错误'))
  }
}

// 分类节点类型
const groupedNodes = computed(() => ({
  防御产品: nodeTypes.value.filter((n: any) => n.category === 'defense'),
  客户设备: nodeTypes.value.filter((n: any) => n.category !== 'defense' && n.category !== 'attacker'),
  攻击威胁: nodeTypes.value.filter((n: any) => n.category === 'attacker'),
}))

// 计算连线 SVG 的坐标（需要加上节点宽高的一半作为中心点）
const NODE_W = 140
const NODE_H = 56
function getEdgeCoords(edge: any) {
  const src = nodes.value.find(n => n.id === edge.source_node_id)
  const tgt = nodes.value.find(n => n.id === edge.target_node_id)
  if (!src || !tgt) return null
  return {
    x1: src.position.x + NODE_W / 2,
    y1: src.position.y + NODE_H / 2,
    x2: tgt.position.x + NODE_W / 2,
    y2: tgt.position.y + NODE_H / 2,
  }
}

const selectedNodeData = computed(() => {
  if (!selectedNode.value) return null
  return nodes.value.find(n => n.id === selectedNode.value)
})

function getNodeColor(typeId: string) {
  return nodeTypes.value.find(n => n.id === typeId)?.color || '#666'
}
</script>

<template>
  <div class="topology-editor">
    <!-- 左侧：节点类型库 -->
    <div class="editor-sidebar">
      <div class="sidebar-title">节点类型库</div>
      <div v-for="(types, catName) in groupedNodes" :key="catName" class="node-category">
        <div class="category-title">{{ catName }} ({{ types.length }})</div>
        <div
          v-for="nt in types"
          :key="nt.id"
          class="node-type-item"
          @click="addNode(nt)"
        >
          <div class="nt-color" :style="{ background: nt.color }"></div>
          <div class="nt-info">
            <div class="nt-name">{{ nt.name }}</div>
            <div class="nt-id">{{ nt.id }}</div>
          </div>
          <el-icon><Plus /></el-icon>
        </div>
      </div>
    </div>

    <!-- 中间：画布 -->
    <div class="editor-canvas">
      <div class="canvas-toolbar">
        <el-input v-model="topologyName" placeholder="拓扑名称" size="small" style="width:180px" />
        <el-input v-model="topologyDesc" placeholder="描述" size="small" style="width:260px" />
        <el-divider direction="vertical" />
        <el-button
          :type="connectMode ? 'warning' : 'default'"
          size="small"
          @click="toggleConnectMode"
        >
          <el-icon><Connection /></el-icon>
          {{ connectMode ? '退出连线' : '连线模式' }}
        </el-button>
        <el-button type="primary" size="small" @click="saveTopology">
          <el-icon><Check /></el-icon> 保存拓扑
        </el-button>
        <el-button type="success" size="small" @click="createScenarioFromTopo" :disabled="!topologyId">
          <el-icon><VideoPlay /></el-icon> 创建演示剧本
        </el-button>
        <span class="hint">{{ connectMode ? '点击两个节点建立连线 |' : '拖拽节点调整位置 |' }} {{ nodes.length }}节点 {{ edges.length }}连线</span>
      </div>

      <div class="simple-canvas" @click="onCanvasClick" @mousedown="onCanvasClick">
        <!-- 连线 SVG -->
        <svg class="edges-svg">
          <template v-for="edge in edges" :key="edge.id">
            <line
              v-if="getEdgeCoords(edge)"
              :x1="getEdgeCoords(edge)!.x1"
              :y1="getEdgeCoords(edge)!.y1"
              :x2="getEdgeCoords(edge)!.x2"
              :y2="getEdgeCoords(edge)!.y2"
              stroke="#1e88e5"
              stroke-width="2"
              class="edge-line"
              @click.stop="removeEdge(edge.id)"
            >
              <title>点击删除连线</title>
            </line>
            <!-- 箭头 -->
            <polygon
              v-if="getEdgeCoords(edge)"
              :points="(() => {
                const c = getEdgeCoords(edge)!
                const angle = Math.atan2(c.y2 - c.y1, c.x2 - c.x1)
                const l = 10
                const x = c.x2 - l * Math.cos(angle - Math.PI / 6)
                const y = c.y2 - l * Math.sin(angle - Math.PI / 6)
                const x2 = c.x2 - l * Math.cos(angle + Math.PI / 6)
                const y2 = c.y2 - l * Math.sin(angle + Math.PI / 6)
                return `${c.x2},${c.y2} ${x},${y} ${x2},${y2}`
              })()"
              fill="#1e88e5"
            />
          </template>
          <!-- 连线中虚线（源已选，目标未选） -->
          <line
            v-if="connectSource && connectMode"
            :x1="(nodes.find(n => n.id === connectSource)?.position?.x || 0) + NODE_W / 2"
            :y1="(nodes.find(n => n.id === connectSource)?.position?.y || 0) + NODE_H / 2"
            :x2="(nodes.find(n => n.id === connectSource)?.position?.x || 0) + NODE_W / 2 + 20"
            :y2="(nodes.find(n => n.id === connectSource)?.position?.y || 0) + NODE_H / 2 + 20"
            stroke="#f39c12"
            stroke-width="2"
            stroke-dasharray="6 3"
          />
        </svg>

        <!-- 节点 -->
        <div
          v-for="node in nodes"
          :key="node.id"
          class="canvas-node"
          :class="{
            selected: selectedNode === node.id,
            'connect-source': connectSource === node.id,
            dragging: dragging === node.id,
          }"
          :style="{
            left: node.position.x + 'px',
            top: node.position.y + 'px',
            borderColor: getNodeColor(node.type),
          }"
          @mousedown="(e) => onNodeMouseDown(e, node.id)"
          @click.stop="selectNode(node.id)"
        >
          <div class="node-color-dot" :style="{ background: getNodeColor(node.type) }"></div>
          <div class="node-body">
            <div class="node-label">{{ node.label }}</div>
            <div class="node-type-tag">{{ node.type }}</div>
          </div>
          <div class="node-ports">
            <span class="port port-in" title="输入">◀</span>
            <span class="port port-out" title="输出">▶</span>
          </div>
          <el-button
            class="node-remove"
            type="danger"
            size="small"
            circle
            @click.stop="removeNode(node.id)"
          >
            <el-icon><Close /></el-icon>
          </el-button>
        </div>

        <div v-if="nodes.length === 0" class="canvas-empty">
          <el-icon :size="48"><Grid /></el-icon>
          <p>从左侧节点库点击添加节点到画布</p>
          <p class="sub">添加后可以拖拽调整位置，使用连线模式连接节点</p>
        </div>
      </div>
    </div>

    <!-- 右侧：属性面板 -->
    <div class="editor-props">
      <div class="props-title">属性面板</div>
      <div class="node-stats">
        <div class="stat-item">
          <span class="stat-num">{{ nodes.length }}</span>
          <span class="stat-label">节点</span>
        </div>
        <div class="stat-item">
          <span class="stat-num">{{ edges.length }}</span>
          <span class="stat-label">连线</span>
        </div>
      </div>

      <!-- 选中节点详情 -->
      <div v-if="selectedNodeData" class="selected-info">
        <div class="info-title">选中节点</div>
        <div class="info-row"><span>名称</span><span>{{ selectedNodeData.label }}</span></div>
        <div class="info-row"><span>类型</span><span>{{ selectedNodeData.type }}</span></div>
        <div class="info-row"><span>X</span><span>{{ Math.round(selectedNodeData.position.x) }}</span></div>
        <div class="info-row"><span>Y</span><span>{{ Math.round(selectedNodeData.position.y) }}</span></div>
      </div>

      <div v-else class="no-selection">
        <el-icon :size="32"><InfoFilled /></el-icon>
        <p>点击画布上的节点查看详情</p>
      </div>

      <el-divider />
      <el-button @click="router.push('/')" size="small" style="width:100%">返回仪表板</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.topology-editor {
  display: flex;
  height: 100%;
  gap: 1px;
  background: var(--border-color);
}

// ---- 左侧节点库 ----
.editor-sidebar {
  width: 260px;
  background: var(--bg-panel);
  overflow-y: auto;
  padding: 12px;
  flex-shrink: 0;

  .sidebar-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border-color);
  }

  .node-category {
    margin-bottom: 16px;
    .category-title {
      font-size: 12px;
      color: var(--text-muted);
      margin-bottom: 6px;
      text-transform: uppercase;
    }
  }

  .node-type-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    margin-bottom: 4px;
    cursor: pointer;
    transition: all 0.15s;
    &:hover {
      background: var(--bg-hover);
      border-color: var(--color-primary-light);
    }
    .nt-color { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
    .nt-info { flex: 1; min-width: 0; }
    .nt-name { font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .nt-id { font-size: 10px; color: var(--text-muted); }
  }
}

// ---- 画布 ----
.editor-canvas {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  min-width: 0;

  .canvas-toolbar {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 8px 12px;
    background: var(--bg-panel);
    border-bottom: 1px solid var(--border-color);
    flex-wrap: wrap;
    .hint {
      font-size: 11px;
      color: var(--text-muted);
      margin-left: auto;
    }
  }

  .simple-canvas {
    flex: 1;
    position: relative;
    overflow: auto;
    min-height: 400px;

    .canvas-node {
      position: absolute;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: var(--bg-card);
      border: 2px solid;
      border-radius: var(--radius-md);
      cursor: grab;
      user-select: none;
      min-width: 130px;
      transition: box-shadow 0.15s, transform 0.1s;
      z-index: 1;

      &:hover { box-shadow: 0 0 16px rgba(30, 136, 229, 0.3); }

      &.selected {
        box-shadow: 0 0 0 2px var(--color-primary-light), 0 0 12px rgba(30, 136, 229, 0.4);
        z-index: 10;
      }

      &.connect-source {
        box-shadow: 0 0 0 3px var(--color-warn), 0 0 16px rgba(243, 156, 18, 0.5);
        animation: pulse-yellow 1s infinite;
        z-index: 10;
      }

      &.dragging {
        cursor: grabbing;
        opacity: 0.9;
        box-shadow: 0 4px 24px rgba(0,0,0,0.4);
        z-index: 100;
        transform: scale(1.03);
      }

      .node-color-dot {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        flex-shrink: 0;
      }

      .node-body {
        flex: 1;
        min-width: 0;
        .node-label { font-size: 13px; font-weight: 500; line-height: 1.3; }
        .node-type-tag { font-size: 9px; color: var(--text-muted); font-family: monospace; }
      }

      .node-ports {
        display: flex;
        flex-direction: column;
        gap: 2px;
        .port { font-size: 9px; color: var(--text-muted); cursor: crosshair; }
      }

      .node-remove {
        position: absolute;
        top: -10px;
        right: -10px;
        width: 22px;
        height: 22px;
        min-width: 22px;
        opacity: 0;
        transition: opacity 0.15s;
      }

      &:hover .node-remove { opacity: 1; }
    }

    .edges-svg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
      .edge-line {
        cursor: pointer;
        pointer-events: stroke;
        &:hover { stroke: var(--color-danger); stroke-width: 3; }
      }
    }

    .canvas-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: var(--text-muted);
      p { margin-top: 12px; font-size: 14px; }
      .sub { font-size: 12px; margin-top: 4px; }
    }
  }
}

// ---- 右侧属性 ----
.editor-props {
  width: 220px;
  background: var(--bg-panel);
  padding: 12px;
  flex-shrink: 0;
  overflow-y: auto;

  .props-title { font-size: 16px; font-weight: 600; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid var(--border-color); }

  .node-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 16px;
    .stat-item {
      background: var(--bg-card);
      border-radius: var(--radius-md);
      padding: 12px;
      text-align: center;
      .stat-num { font-size: 22px; font-weight: 600; display: block; }
      .stat-label { font-size: 11px; color: var(--text-muted); }
    }
  }

  .selected-info {
    background: var(--bg-card);
    border-radius: var(--radius-md);
    padding: 12px;
    border: 1px solid var(--border-color);
    .info-title { font-size: 13px; font-weight: 600; margin-bottom: 8px; color: var(--color-primary-light); }
    .info-row { display: flex; justify-content: space-between; padding: 3px 0; font-size: 12px; color: var(--text-muted);
      span:last-child { color: var(--text-primary); }
    }
  }

  .no-selection {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 0;
    color: var(--text-muted);
    p { font-size: 12px; margin-top: 8px; text-align: center; }
  }
}

@keyframes pulse-yellow {
  0%, 100% { box-shadow: 0 0 0 3px var(--color-warn), 0 0 16px rgba(243, 156, 18, 0.5); }
  50% { box-shadow: 0 0 0 6px var(--color-warn), 0 0 24px rgba(243, 156, 18, 0.3); }
}
</style>
