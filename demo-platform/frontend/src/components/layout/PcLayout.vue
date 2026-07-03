<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

function goTo(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="pc-layout">
    <!-- 顶部导航 -->
    <header class="app-header">
      <div class="header-left">
        <div class="logo" @click="goTo('/')">
          <el-icon :size="24"><Monitor /></el-icon>
          <span class="logo-text">网络安全模拟演示平台</span>
        </div>
      </div>

      <div class="header-center">
        <el-button type="primary" @click="goTo('/scenarios')" size="small">
          <el-icon><VideoPlay /></el-icon> 剧本管理
        </el-button>
        <el-button type="success" @click="goTo('/topology')" size="small" v-if="auth.isAdmin">
          <el-icon><Grid /></el-icon> 拓扑编辑
        </el-button>
        <el-button @click="goTo('/alerts')" size="small">
          <el-icon><Bell /></el-icon> 告警中心
        </el-button>
      </div>

      <div class="header-right">
        <el-dropdown>
          <span class="user-menu">
            <el-icon><User /></el-icon>
            {{ auth.user?.display_name || auth.user?.username || '用户' }}
            <el-icon><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="goTo('/admin/users')" v-if="auth.isAdmin">
                <el-icon><Setting /></el-icon> 用户管理
              </el-dropdown-item>
              <el-dropdown-item @click="goTo('/admin/audit')" v-if="auth.isAdmin">
                <el-icon><Document /></el-icon> 审计日志
              </el-dropdown-item>
              <el-dropdown-item divided @click="auth.logout()">
                <el-icon><SwitchButton /></el-icon> 退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<style scoped lang="scss">
.pc-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--bg-primary);
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 20px;
  background: var(--bg-panel);
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
  z-index: 100;

  .header-left {
    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      user-select: none;
      .logo-text {
        font-size: 16px;
        font-weight: 600;
        color: var(--text-primary);
        background: linear-gradient(90deg, #1e88e5, #00e676);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }

  .header-center {
    display: flex;
    gap: 8px;
  }

  .header-right {
    .user-menu {
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      color: var(--text-primary);
      padding: 6px 12px;
      border-radius: var(--radius-md);
      &:hover { background: var(--bg-hover); }
    }
  }
}

.app-main {
  flex: 1;
  overflow: hidden;
}
</style>
