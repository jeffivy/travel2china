import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import client from '@/api/client'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any>(null)
  const token = ref<string>(localStorage.getItem('token') || '')

  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  async function login(username: string, password: string) {
    const res: any = await client.post('/auth/login', { username, password })
    const data = res.data
    token.value = data.access_token
    user.value = data.user
    localStorage.setItem('token', data.access_token)
    localStorage.setItem('userRole', data.user.role)
    return data
  }

  async function fetchMe() {
    try {
      const res: any = await client.get('/auth/me')
      user.value = res.data
      localStorage.setItem('userRole', res.data.role)
    } catch {
      logout()
    }
  }

  function logout() {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    window.location.href = '/login'
  }

  return { user, token, isLoggedIn, isAdmin, login, fetchMe, logout }
})
