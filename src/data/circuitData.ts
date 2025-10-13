import type { Component, CircuitConfig } from '@/stores/circuitStore'

// 电路类型定义
export interface CircuitType {
  id: string
  name: string
  description: string
  components: Component[]
  input: {
    type: string
    value: number
    frequency?: number
  }
}

// 预定义的电路配置
export const circuitTypes: Record<string, CircuitType> = {
  rc: {
    id: 'rc',
    name: 'RC 滤波电路',
    description: '电阻电容滤波器，用于信号滤波和相位调整',
    components: [
      { id: 'r1', type: '电阻', value: 100, unit: 'Ω', position: { x: 120, y: 180 } },
      { id: 'c1', type: '电容', value: 0.001, unit: 'F', position: { x: 300, y: 190 } },
    ],
    input: { type: 'AC', value: 5, frequency: 1000 },
  },
  rl: {
    id: 'rl',
    name: 'RL 电感电路',
    description: '电阻电感电路，用于电流控制和储能',
    components: [
      { id: 'r1', type: '电阻', value: 220, unit: 'Ω', position: { x: 100, y: 180 } },
      { id: 'l1', type: '电感', value: 0.05, unit: 'H', position: { x: 300, y: 190 } },
    ],
    input: { type: 'AC', value: 5, frequency: 1000 },
  },
  rcl: {
    id: 'rcl',
    name: 'RCL 振荡电路',
    description: '谐振振荡电路，用于频率选择和振荡',
    components: [
      { id: 'r1', type: '电阻', value: 150, unit: 'Ω', position: { x: 100, y: 180 } },
      { id: 'l1', type: '电感', value: 0.05, unit: 'H', position: { x: 250, y: 190 } },
      { id: 'c1', type: '电容', value: 0.001, unit: 'F', position: { x: 380, y: 190 } },
    ],
    input: { type: 'AC', value: 5, frequency: 1000 },
  },
}

// 获取所有电路类型列表
export function getCircuitTypesList(): CircuitType[] {
  return Object.values(circuitTypes)
}

// 根据ID获取电路类型
export function getCircuitTypeById(id: string): CircuitType | null {
  return circuitTypes[id] || null
}

// 转换为store格式
export function toCircuitConfig(circuitType: CircuitType): CircuitConfig {
  return {
    components: circuitType.components,
    input: circuitType.input,
  }
}
