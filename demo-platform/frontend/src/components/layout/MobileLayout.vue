<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const activeTab = ref('topo')

const tabs = [
  { key: 'topo', label: '拓扑', icon: 'Grid' },
  { key: 'strategy', label: '策略', icon: 'Setting' },
  { key: 'detail', label: '详情', icon: 'InfoFilled' },
  { key: 'packets', label: '报文', icon: 'Connection' },
]
</script>

<template>
  <div class="mobile-layout">
    <header class="mobile-header">
      <span class="logo">安全演示平台</span>
      <el-dropdown>
        <el-icon :size="22"><User /></el-icon>
        <template #dropdown>
          <el-dropdown-item @click="auth.logout()">退出</el-dropdown-item>
        </template>
      </el-dropdown>
    </header>

    <main class="mobile-main">
      <router-view :active-tab="activeTab" />
    </main>

    <nav class="mobile-tabs">
      <div
        v-for="tab in tabs"
        :key="tab.key"
        class="tab-item"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        <el-icon><component :is="tab.icon" /></el-icon>
        <span>{{ tab.label }}</span>
      </div>
    </nav>

    <div class="mobile-fab">
      <el-button type="primary" size="large" circle @click="router.push('/scenarios')">
        <el-icon :size="24"><VideoPlay /></el-icon>
      </el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mobile-layout {
  display: flex; flex-direction: column; height: 100vh; background: var(--bg-primary);
}
.mobile-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 16px; background: var(--bg-panel); border-bottom: 1px solid var(--border-color);
  .logo { font-size: 16px; font-weight: 600; color: var(--color-primary-light); }
}
.mobile-main { flex: 1; overflow-y: auto; }
.mobile-tabs {
  display: flex; background: var(--bg-panel); border-top: 1px solid var(--border-color);
  .tab-item {
    flex: 1; display: flex; flex-direction: column; align-items: center; gap: 2px;
    padding: 8px 0; font-size: 10px; color: var(--text-muted); cursor: pointer;
    &.active { color: var(--color-primary-light); }
  }
}
.mobile-fab {
  position: fixed; bottom: 80px; right: 20px; z-index: 50;
}
</style>
