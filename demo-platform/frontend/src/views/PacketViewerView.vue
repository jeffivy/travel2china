<script setup lang="ts">
import { ref, onMounted } from 'vue'
import client from '@/api/client'

const packets = ref<any[]>([])
const loading = ref(false)
const executions = ref<any[]>([])
const selectedExecId = ref('')
const total = ref(0)

onMounted(async () => {
  try {
    const res: any = await client.get('/executions?limit=50')
    executions.value = res.data || []
    if (executions.value.length > 0) {
      selectedExecId.value = executions.value[0].id
      await loadPackets()
    }
  } catch { /* */ }
})

async function loadPackets() {
  if (!selectedExecId.value) return
  loading.value = true
  try {
    const res: any = await client.get(`/executions/${selectedExecId.value}/packets?limit=200`)
    packets.value = res.data?.items || res.data || []
    total.value = packets.value.length
  } catch { /* */ }
  finally { loading.value = false }
}

function protoColor(p: string) {
  const map: Record<string,string> = {http:'success',https:'',tcp:'info',udp:'warning',dns:'',icmp:'danger'}
  return map[p] || ''
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h2>📡 流量包查看器</h2>
      <div class="controls">
        <el-select v-model="selectedExecId" @change="loadPackets" placeholder="选择执行" style="width:280px">
          <el-option v-for="ex in executions" :key="ex.id" :label="'执行 ' + ex.id.slice(0,8)" :value="ex.id" />
        </el-select>
        <el-tag>共 {{ total }} 条</el-tag>
      </div>
    </div>

    <el-table :data="packets" v-loading="loading" max-height="calc(100vh - 200px)" stripe size="small">
      <el-table-column label="时间" width="100">
        <template #default="{row}">{{ row.captured_at?.slice(11,19) || '-' }}</template>
      </el-table-column>
      <el-table-column label="协议" width="70">
        <template #default="{row}">
          <el-tag :type="protoColor(row.protocol)" size="small" effect="dark">{{ row.protocol?.toUpperCase() }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="源地址" width="200">
        <template #default="{row}">{{ row.src_ip }}:{{ row.src_port }}</template>
      </el-table-column>
      <el-table-column label="目的地址" width="200">
        <template #default="{row}">{{ row.dst_ip }}:{{ row.dst_port }}</template>
      </el-table-column>
      <el-table-column label="长度" width="70" prop="length" />
      <el-table-column label="标志位" width="80" prop="flags" />
      <el-table-column label="攻击脚本" width="90">
        <template #default="{row}">{{ row.attack_script_id || '-' }}</template>
      </el-table-column>
      <el-table-column label="拦截" width="80">
        <template #default="{row}">
          <el-tag v-if="row.is_blocked" type="success" size="small">已拦截</el-tag>
          <span v-else style="color:var(--text-muted)">-</span>
        </template>
      </el-table-column>
    </el-table>

    <el-empty v-if="!loading && packets.length === 0" description="暂无流量数据，请先执行剧本">
      <el-button type="primary" @click="$router.push('/scenarios')">前往剧本管理</el-button>
    </el-empty>
  </div>
</template>

<style scoped lang="scss">
.page { padding: 24px; height: 100%; overflow-y: auto; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;
  h2 { margin: 0; }
  .controls { display: flex; gap: 8px; align-items: center; }
}
</style>
