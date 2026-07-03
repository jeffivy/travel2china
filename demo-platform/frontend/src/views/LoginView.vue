<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const auth = useAuthStore()

const username = ref('admin')
const password = ref('')
const loading = ref(false)

async function handleLogin() {
  if (!username.value || !password.value) {
    ElMessage.warning('请输入用户名和密码')
    return
  }
  loading.value = true
  try {
    await auth.login(username.value, password.value)
    ElMessage.success('登录成功')
    router.push('/')
  } catch {
    // 错误由拦截器处理
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-bg-particles"></div>

    <div class="login-card">
      <div class="login-header">
        <div class="login-icon">
          <el-icon :size="48"><Monitor /></el-icon>
        </div>
        <h1>网络安全模拟演示平台</h1>
        <p>中国电信 · 安全业务事业部</p>
      </div>

      <el-form @submit.prevent="handleLogin" class="login-form">
        <el-form-item>
          <el-input
            v-model="username"
            placeholder="用户名"
            prefix-icon="User"
            size="large"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="password"
            type="password"
            placeholder="密码"
            prefix-icon="Lock"
            size="large"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            @click="handleLogin"
            class="login-btn"
          >
            {{ loading ? '登录中...' : '登 录' }}
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-footer">
        <span>默认账号: admin / Demo@2026</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: radial-gradient(ellipse at center, #0d2b4e 0%, #0a1929 70%);
  position: relative;
  overflow: hidden;
}

.login-card {
  width: 420px;
  padding: 48px 40px;
  background: linear-gradient(135deg, rgba(19, 40, 63, 0.95), rgba(26, 58, 92, 0.95));
  border: 1px solid var(--border-color);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  z-index: 1;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;

  .login-icon {
    color: var(--color-primary-light);
    margin-bottom: 16px;
  }

  h1 {
    font-size: 22px;
    color: var(--text-primary);
    margin: 0 0 8px;
  }

  p {
    font-size: 13px;
    color: var(--text-muted);
    margin: 0;
  }
}

.login-form {
  margin-bottom: 16px;

  .login-btn {
    width: 100%;
    height: 44px;
    font-size: 16px;
    letter-spacing: 4px;
  }
}

.login-footer {
  text-align: center;
  font-size: 12px;
  color: var(--text-muted);
}
</style>
