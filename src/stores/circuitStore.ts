import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getCircuitTypeById, toCircuitConfig } from '@/data/circuitData'

export interface Component {
  id: string
  type: string
  value: number
  unit: string
  position: { x: number; y: number }
}

export interface CircuitConfig {
  components: Component[]
  input: {
    type: string
    value: number
    frequency?: number
  }
}

export interface SimulationResult {
  voltage: number
  current: number
  frequency?: number
  phase?: number
}

export const useCircuitStore = defineStore('circuit', () => {
  // 状态
  const selectedCircuit = ref<string>('')
  const selectedComponent = ref<Component | null>(null)
  const parameterPanelVisible = ref(false)
  const simulationResult = ref<SimulationResult | null>(null)

  // 计算属性
  const currentCircuitConfig = computed(() => {
    if (!selectedCircuit.value) return null
    const circuitType = getCircuitTypeById(selectedCircuit.value)
    return circuitType ? toCircuitConfig(circuitType) : null
  })

  const currentComponents = computed(() => {
    return currentCircuitConfig.value?.components || []
  })

  // 方法
  function selectCircuit(circuitType: string) {
    selectedCircuit.value = circuitType
    simulationResult.value = null
  }

  function selectComponent(component: Component) {
    selectedComponent.value = component
    parameterPanelVisible.value = true
  }

  function updateComponentValue(componentId: string, newValue: number) {
    const config = currentCircuitConfig.value
    if (config) {
      const component = config.components.find((c) => c.id === componentId)
      if (component) {
        component.value = newValue
        // 清除之前的仿真结果，因为参数已改变
        simulationResult.value = null
      }
    }
  }

  function closeParameterPanel() {
    parameterPanelVisible.value = false
    selectedComponent.value = null
  }

  function runSimulation(): SimulationResult {
    const config = currentCircuitConfig.value
    if (!config) {
      throw new Error('没有选择电路')
    }

    const { components, input } = config
    let result: SimulationResult

    switch (selectedCircuit.value) {
      case 'rc':
        result = calculateRC(components, input)
        break
      case 'rl':
        result = calculateRL(components, input)
        break
      case 'rcl':
        result = calculateRCL(components, input)
        break
      default:
        throw new Error('不支持的电路类型')
    }

    simulationResult.value = result
    return result
  }

  // 电路计算函数
  function calculateRC(components: Component[], input: any): SimulationResult {
    const resistor = components.find((c) => c.type === '电阻')!
    const capacitor = components.find((c) => c.type === '电容')!

    const R = resistor.value
    const C = capacitor.value
    const V = input.value
    const f = input.frequency || 1000
    const omega = 2 * Math.PI * f

    // RC电路的阻抗计算
    const Zc = 1 / (omega * C)
    const Z = Math.sqrt(R * R + Zc * Zc)

    // 电流和电压计算
    const I = V / Z
    const Vout = I * R

    // 相位计算
    const phase = (Math.atan(-Zc / R) * 180) / Math.PI

    return {
      voltage: parseFloat(Vout.toFixed(3)),
      current: parseFloat(I.toFixed(6)),
      frequency: f,
      phase: parseFloat(phase.toFixed(2)),
    }
  }

  function calculateRL(components: Component[], input: any): SimulationResult {
    const resistor = components.find((c) => c.type === '电阻')!
    const inductor = components.find((c) => c.type === '电感')!

    const R = resistor.value
    const L = inductor.value
    const V = input.value
    const f = input.frequency || 1000
    const omega = 2 * Math.PI * f

    // RL电路的阻抗计算
    const Zl = omega * L
    const Z = Math.sqrt(R * R + Zl * Zl)

    // 电流和电压计算
    const I = V / Z
    const Vout = I * R

    // 相位计算
    const phase = (Math.atan(Zl / R) * 180) / Math.PI

    return {
      voltage: parseFloat(Vout.toFixed(3)),
      current: parseFloat(I.toFixed(6)),
      frequency: f,
      phase: parseFloat(phase.toFixed(2)),
    }
  }

  function calculateRCL(components: Component[], input: any): SimulationResult {
    const resistor = components.find((c) => c.type === '电阻')!
    const inductor = components.find((c) => c.type === '电感')!
    const capacitor = components.find((c) => c.type === '电容')!

    const R = resistor.value
    const L = inductor.value
    const C = capacitor.value
    const V = input.value
    const f = input.frequency || 1000
    const omega = 2 * Math.PI * f

    // RCL电路的阻抗计算
    const Zl = omega * L
    const Zc = 1 / (omega * C)
    const X = Zl - Zc // 电抗
    const Z = Math.sqrt(R * R + X * X)

    // 电流和电压计算
    const I = V / Z
    const Vout = I * R

    // 相位计算
    const phase = (Math.atan(X / R) * 180) / Math.PI

    // 谐振频率计算
    const resonanceFreq = 1 / (2 * Math.PI * Math.sqrt(L * C))

    return {
      voltage: parseFloat(Vout.toFixed(3)),
      current: parseFloat(I.toFixed(6)),
      frequency: f,
      phase: parseFloat(phase.toFixed(2)),
    }
  }

  return {
    // 状态
    selectedCircuit,
    selectedComponent,
    parameterPanelVisible,
    simulationResult,

    // 计算属性
    currentCircuitConfig,
    currentComponents,

    // 方法
    selectCircuit,
    selectComponent,
    updateComponentValue,
    closeParameterPanel,
    runSimulation,
  }
})
