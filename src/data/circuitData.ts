import type { Component, CircuitConfig } from '@/stores/circuitStore'

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

export const circuitTypes: Record<string, CircuitType> = {
  mos: {
    id: 'mos',
    name: 'MOS 模块电路',
    description: '包含 MOS 管、输入电容、耦合电容、二极管和电感',
    components: [
      { id: 'Cin2', type: '电容', value: 0.00047, unit: 'F', position: { x: 36, y: 106 } },
      { id: 'L10', type: '电感', value: 0.01, unit: 'H', position: { x: 121, y: 15 } },
      { id: 'Diod', type: '二极管', value: 0.7, unit: 'V', position: { x: 336, y: 15 } },
      { id: 'CB', type: '电容', value: 0.00047, unit: 'F', position: { x: 384, y: 107 } },
      { id: 'MOS', type: 'MOS管', value: 2.0, unit: 'V', position: { x: 235, y: 92 } },
    ],
    input: { type: 'AC', value: 5, frequency: 1000 },
  },
}

export function getCircuitTypeById(id: string): CircuitType | null {
  return circuitTypes[id] || null
}

export function toCircuitConfig(circuitType: CircuitType): CircuitConfig {
  return {
    components: circuitType.components,
    input: circuitType.input,
  }
}
