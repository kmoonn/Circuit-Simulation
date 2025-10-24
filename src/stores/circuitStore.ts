import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getCircuitTypeById } from '@/data/circuitData'

// 组件类型，供各组件引用
export interface Component {
  id: string
  type: string
  value: number
  unit: string
  position: { x: number; y: number }
}

// 电路配置（当前选择后在本地维护的副本）
export interface CircuitConfig {
  components: Component[]
  input: {
    type: string
    value: number
    frequency?: number
  }
}

// 简单仿真结果占位（当前不强依赖）
export interface SimulationResult {
  voltage: number
  current: number
  frequency?: number
  phase?: number
}

// 元件参数求解结果（用于右侧面板展示）
export interface SolveResult {
  componentId: string
  parameter: string
  value: number
  unit?: string
  details?: string
}

export const useCircuitStore = defineStore('circuit', () => {
  // 基本状态
  const selectedCircuit = ref<string>('')
  const components = ref<Component[]>([])
  const input = ref<{ type: string; value: number; frequency?: number } | null>(null)

  const selectedComponent = ref<Component | null>(null)
  const parameterPanelVisible = ref(false)

  // 简单仿真与求解占位状态
  const simulationResult = ref<SimulationResult | null>(null)
  const targetComponentId = ref<string>('')
  const simulationInputs = ref<{ Vin?: number; Vout?: number; Iin?: number; Iout?: number }>({})
  const componentSolveResult = ref<SolveResult | null>(null)

  // 计算属性
  const currentCircuitConfig = computed<CircuitConfig | null>(() => {
    if (!selectedCircuit.value || !input.value) return null
    return { components: components.value, input: input.value }
  })
  const currentComponents = computed<Component[]>(() => components.value)

  // 选择电路并加载默认参数为本地可编辑副本
  function selectCircuit(circuitType: string) {
    const type = getCircuitTypeById(circuitType)
    selectedCircuit.value = circuitType
    selectedComponent.value = null
    parameterPanelVisible.value = false
    componentSolveResult.value = null
    simulationResult.value = null

    if (type) {
      // 深拷贝默认组件与输入为本地状态，便于编辑
      components.value = type.components.map((c) => ({ ...c, position: { ...c.position } }))
      input.value = { ...type.input }
    } else {
      components.value = []
      input.value = { type: 'AC', value: 0 }
    }
  }

  // 选择元件并打开参数面板
  function selectComponent(component: Component) {
    selectedComponent.value = component
    parameterPanelVisible.value = true
  }

  // 更新元件数值（直接更新本地副本）
  function updateComponentValue(componentId: string, newValue: number) {
    const idx = components.value.findIndex((c) => c.id === componentId)
    if (idx >= 0) {
      const old = components.value[idx];
      components.value[idx] = { ...old, value: newValue } as Component;
      simulationResult.value = null
      componentSolveResult.value = null
    }
  }

  function closeParameterPanel() {
    parameterPanelVisible.value = false
    selectedComponent.value = null
  }

  // 右侧面板：设置目标与输入
  function setTargetComponent(id: string) {
    targetComponentId.value = id
  }
  function setSimulationInputs(inputs: Partial<{ Vin: number; Vout: number; Iin: number; Iout: number }>) {
    simulationInputs.value = { ...simulationInputs.value, ...inputs }
  }

  // 简单参数求解：演示二极管压降与 MOS gm
  function solveTargetParameter(): SolveResult {
    if (!selectedCircuit.value) throw new Error('没有选择电路')
    const comp = components.value.find((c) => c.id === targetComponentId.value)
    if (!comp) throw new Error('目标元件不存在')

    const { Vin, Vout, Iout } = simulationInputs.value

    // 示例：二极管压降 Vf = Vin - Vout
    if (comp.type.includes('二极管') || comp.id.toLowerCase().includes('diod')) {
      if (typeof Vin !== 'number' || typeof Vout !== 'number') {
        throw new Error('计算二极管压降需要提供 Vin 和 Vout')
      }
      const vf = Vin - Vout
      components.value = components.value.map((c) => (c.id === comp.id ? { ...c, value: vf } : c))
      componentSolveResult.value = {
        componentId: comp.id,
        parameter: '压降',
        value: vf,
        unit: 'V',
        details: 'Vf = Vin - Vout（简化示例）',
      }
      return componentSolveResult.value
    }

    // 示例：MOS gm = Iout / Vin（占位）
    if (comp.type.includes('MOS') || comp.id.toLowerCase().includes('mos')) {
      if (typeof Vin !== 'number' || typeof Iout !== 'number' || Vin === 0) {
        throw new Error('计算 MOS gm 需要提供 Vin 与 Iout，且 Vin ≠ 0')
      }
      const gm = Iout / Vin
      componentSolveResult.value = {
        componentId: comp.id,
        parameter: 'gm',
        value: gm,
        unit: 'S',
        details: 'gm = Iout / Vin（占位示例）',
      }
      return componentSolveResult.value
    }

    throw new Error('暂不支持该元件的参数求解')
  }

  // 简易占位仿真：返回输入电压与零电流
  function runSimulation(): SimulationResult {
    if (!input.value) throw new Error('没有选择电路')
    const result: SimulationResult = { voltage: input.value.value, current: 0, frequency: input.value.frequency }
    simulationResult.value = result
    return result
  }

  // 导出当前配置与占位仿真结果
  function exportResults() {
    const cfg = currentCircuitConfig.value
    if (!cfg) throw new Error('没有选择电路')
    const result = simulationResult.value ?? runSimulation()
    return { circuitType: selectedCircuit.value, components: cfg.components, input: cfg.input, simulationResult: result }
  }

  return {
    // 状态
    selectedCircuit,
    components,
    input,
    selectedComponent,
    parameterPanelVisible,
    simulationResult,
    targetComponentId,
    simulationInputs,
    componentSolveResult,

    // 计算属性
    currentCircuitConfig,
    currentComponents,

    // 方法
    selectCircuit,
    selectComponent,
    updateComponentValue,
    closeParameterPanel,
    setTargetComponent,
    setSimulationInputs,
    solveTargetParameter,
    runSimulation,
    exportResults,
  }
})