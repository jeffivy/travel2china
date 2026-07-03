import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue'),
      meta: { public: true },
    },
    {
      path: '/',
      component: () => import('@/components/layout/PcLayout.vue'),
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: () => import('@/views/DashboardView.vue'),
          meta: { title: '仪表板' },
        },
        {
          path: 'topology/:id?',
          name: 'TopologyEditor',
          component: () => import('@/views/TopologyEditorView.vue'),
          meta: { title: '拓扑编辑器', role: 'admin' },
        },
        {
          path: 'scenarios',
          name: 'Scenarios',
          component: () => import('@/views/ScenarioListView.vue'),
          meta: { title: '剧本管理' },
        },
        {
          path: 'scenarios/:id',
          name: 'ScenarioDetail',
          component: () => import('@/views/ScenarioDetailView.vue'),
          meta: { title: '剧本详情' },
        },
        {
          path: 'scenarios/:id/play',
          name: 'ScenarioPlay',
          component: () => import('@/views/ScenarioPlayView.vue'),
          meta: { title: '演示播放', layout: 'fullscreen' },
        },
        {
          path: 'alerts',
          name: 'AlertCenter',
          component: () => import('@/views/AlertCenterView.vue'),
          meta: { title: '告警中心' },
        },
        {
          path: 'packets',
          name: 'PacketViewer',
          component: () => import('@/views/PacketViewerView.vue'),
          meta: { title: '流量查看' },
        },
        {
          path: 'admin/users',
          name: 'AdminUsers',
          component: () => import('@/views/AdminUsersView.vue'),
          meta: { title: '用户管理', role: 'admin' },
        },
        {
          path: 'admin/audit',
          name: 'AdminAudit',
          component: () => import('@/views/AdminAuditView.vue'),
          meta: { title: '审计日志', role: 'admin' },
        },
      ],
    },
  ],
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta.public) {
    next()
    return
  }

  if (!token) {
    next('/login')
    return
  }

  // 角色检查
  const userRole = localStorage.getItem('userRole')
  if (to.meta.role && to.meta.role !== userRole && userRole !== 'admin') {
    next('/')
    return
  }

  next()
})

export default router
