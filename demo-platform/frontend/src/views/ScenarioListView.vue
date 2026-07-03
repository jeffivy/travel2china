<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import client from '@/api/client'
import { ElMessage } from 'element-plus'

const router = useRouter()
const scenarios = ref<any[]>([])
const topologies = ref<any[]>([])
const loading = ref(false)
const showCreateDialog = ref(false)

// 新建剧本表单
const newScenario = ref({
  name: '',
  description: '',
  topology_id: '',
  difficulty: 'medium',
})

onMounted(loadData)

async function loadData() {
  loading.value = true
  try {
    const [sRes, tRes]: any[] = await Promise.all([
      client.get('/scenarios'),
      client.get('/topologies'),
    ])
    scenarios.value = sRes.data || []
    topologies.value = tRes.data || []
  } catch { /* */ }
  finally { loading.value = false }
}

async function createScenario() {
  if (!newScenario.value.name || !newScenario.value.topology_id) {
    ElMessage.warning('请填写剧本名称并选择拓扑')
    return
  }
  try {
    const topo = topologies.value.find(t => t.id === newScenario.value.topology_id)
    const attackSequence = (topo?.nodes || []).length > 0 ? [
      {
        step_id: 'step-1',
        order: 1,
        script_id: 'ATT-001',
        target_node_id: topo.nodes.find((n: any) => n.type === 'web-server')?.id || topo.nodes[0]?.id || '',
        params: {},
        wait_after_sec: 2,
        continue_on_fail: false,
      },
    ] : []

    const res: any = await client.post('/scenarios', {
      name: newScenario.value.name,
      description: newScenario.value.description,
      topology_id: newScenario.value.topology_id,
      attack_sequence: attackSequence,
      defense_snapshot: {},
      difficulty: newScenario.value.difficulty,
      expected_duration_sec: 180,
      tags: [],
    })
    ElMessage.success('剧本创建成功')
    showCreateDialog.value = false
    newScenario.value = { name: '', description: '', topology_id: '', difficulty: 'medium' }
    await loadData()
    router.push(`/scenarios/${res.data.id}`)
  } catch (e: any) {
    ElMessage.error('创建失败: ' + (e?.response?.data?.detail || e?.message || ''))
  }
}

function goToPlay(id: string) {
  router.push(`/scenarios/${id}/play`)
}

function goToDetail(id: string) {
  router.push(`/scenarios/${id}`)
}

async function deleteScenario(id: string, name: string) {
  try {
    await ElMessage.confirm(`确定删除剧本 "${name}"？`, '确认删除', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
    await client.delete(`/scenarios/${id}`)
    ElMessage.success('已删除')
    await loadScenarios()
  } catch { /* cancelled */ }
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h2>📋 剧本管理</h2>
      <div style="display:flex;gap:8px;">
        <el-button type="primary" @click="showCreateDialog = true">
          <el-icon><Plus /></el-icon> 新建剧本
        </el-button>
        <el-button @click="router.push('/topology')">
          <el-icon><Grid /></el-icon> 新建拓扑
        </el-button>
      </div>
    </div>

    <!-- 创建剧本对话框 -->
    <el-dialog v-model="showCreateDialog" title="创建新剧本" width="500px">
      <el-form :model="newScenario" label-width="80px">
        <el-form-item label="剧本名称" required>
          <el-input v-model="newScenario.name" placeholder="如：Web渗透演示" />
        </el-form-item>
        <el-form-item label="关联拓扑" required>
          <el-select v-model="newScenario.topology_id" placeholder="选择一个拓扑作为战场地图" style="width:100%">
            <el-option v-for="t in topologies" :key="t.id" :label="t.name + ' (' + t.nodes?.length + '节点)'" :value="t.id" />
          </el-select>
          <div v-if="topologies.length === 0" style="color:var(--color-warn);font-size:12px;margin-top:4px;">
            暂无拓扑，请先创建拓扑
          </div>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="newScenario.description" type="textarea" :rows="2" placeholder="剧本描述" />
        </el-form-item>
        <el-form-item label="难度">
          <el-radio-group v-model="newScenario.difficulty">
            <el-radio value="easy">简单</el-radio>
            <el-radio value="medium">中等</el-radio>
            <el-radio value="hard">困难</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" @click="createScenario">创建</el-button>
      </template>
    </el-dialog>

    <el-table :data="scenarios" v-loading="loading" style="width: 100%">
      <el-table-column prop="name" label="名称" min-width="180" />
      <el-table-column label="难度" width="80">
        <template #default="{ row }">
          <el-tag :type="row.difficulty === 'easy' ? 'success' : row.difficulty === 'hard' ? 'danger' : 'warning'" size="small">
            {{ row.difficulty === 'easy' ? '简单' : row.difficulty === 'hard' ? '困难' : '中等' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="步骤" width="60" prop="attack_sequence">
        <template #default="{ row }">{{ row.attack_sequence?.length || 0 }}</template>
      </el-table-column>
      <el-table-column label="预计时长" width="100">
        <template #default="{ row }">~{{ Math.round((row.expected_duration_sec || 180) / 60) }} 分钟</template>
      </el-table-column>
      <el-table-column label="标签" width="180">
        <template #default="{ row }">
          <el-tag v-for="tag in (row.tags || [])" :key="tag" size="small" class="mr-1">{{ tag }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="260" fixed="right">
        <template #default="{ row }">
          <el-button size="small" type="success" @click="goToPlay(row.id)">
            <el-icon><VideoPlay /></el-icon> 演示
          </el-button>
          <el-button size="small" @click="goToDetail(row.id)">
            <el-icon><Edit /></el-icon> 编辑
          </el-button>
          <el-button size="small" type="danger" @click="deleteScenario(row.id, row.name)">
            <el-icon><Delete /></el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped lang="scss">
.page {
  padding: 24px;
  height: 100%;
  overflow-y: auto;
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    h2 { margin: 0; }
  }
}
.mr-1 { margin-right: 4px; }
</style>
