import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import client from '@/api/client'

export interface StepResult {
  stepId: string
  scriptId: string
  status: 'pending' | 'running' | 'success' | 'failed' | 'blocked' | 'error'
  logs: string[]
  blockedBy?: string[]
}

export const useScenarioStore = defineStore('scenario', () => {
  const currentExecutionId = ref<string>('')
  const playStatus = ref<'idle' | 'starting' | 'running' | 'stopping' | 'completed'>('idle')
  const defenseMode = ref<'none' | 'partial' | 'full'>('none')
  const enabledProducts = ref<Set<string>>(new Set())
  const stepResults = ref<Map<string, StepResult>>(new Map())
  const executionStats = ref({
    totalSteps: 0,
    completedSteps: 0,
    blockedSteps: 0,
    successSteps: 0,
  })

  const progressPct = computed(() =>
    executionStats.value.totalSteps > 0
      ? Math.round((executionStats.value.completedSteps / executionStats.value.totalSteps) * 100)
      : 0
  )

  async function startScenario(scenarioId: string, speed: string = 'normal') {
    playStatus.value = 'starting'
    const res: any = await client.post(`/scenarios/${scenarioId}/start`, { speed })
    currentExecutionId.value = res.data.execution_id
    playStatus.value = 'running'
    stepResults.value.clear()
    executionStats.value = { totalSteps: 0, completedSteps: 0, blockedSteps: 0, successSteps: 0 }
    return res.data
  }

  async function stopScenario(scenarioId: string) {
    playStatus.value = 'stopping'
    await client.post(`/scenarios/${scenarioId}/stop`)
    playStatus.value = 'idle'
  }

  async function switchDefenseMode(mode: 'none' | 'partial' | 'full', products: string[] = []) {
    defenseMode.value = mode
    enabledProducts.value = new Set(products)
    if (currentExecutionId.value) {
      await client.post(`/executions/${currentExecutionId.value}/defense-mode`, {
        mode,
        enabled_products: products,
      })
    }
  }

  async function fetchExecutionSteps(executionId: string) {
    const res: any = await client.get(`/executions/${executionId}/steps`)
    const steps = res.data || []
    for (const step of steps) {
      stepResults.value.set(step.step_id, {
        stepId: step.step_id,
        scriptId: step.script_id,
        status: step.status,
        logs: step.result?.logs || [],
        blockedBy: step.result?.blocked_by?.map((b: any) => b.product) || [],
      })
    }
    return steps
  }

  function reset() {
    currentExecutionId.value = ''
    playStatus.value = 'idle'
    stepResults.value.clear()
    executionStats.value = { totalSteps: 0, completedSteps: 0, blockedSteps: 0, successSteps: 0 }
  }

  return {
    currentExecutionId,
    playStatus,
    defenseMode,
    enabledProducts,
    stepResults,
    executionStats,
    progressPct,
    startScenario,
    stopScenario,
    switchDefenseMode,
    fetchExecutionSteps,
    reset,
  }
})
