export default [
  {
    moduleId: 1,
    name: 'mos',
    components: [
      { id: 1, name: '输入电压', signal: 'Vin', value: 0, unit: 'V' },
      { id: 2, name: '输出电压', signal: 'Vout', value: 0, unit: 'V' },
      { id: 3, name: '额定功率', signal: 'Pout', value: 0, unit: 'W' }
    ],
    outputs: [
      { id: 1, name: '结果1', signal: '符号1', value: 0, unit: '单位1' },
      { id: 2, name: '结果2', signal: '符号2', value: 0, unit: '单位2' }
    ]
  },
  {
    moduleId: 2,
    name: 'rc',
    components: [
      { id: 1, name: '输入电压', signal: 'Vin', value: 0, unit: 'V' },
      { id: 2, name: '电阻', signal: 'R', value: 1000, unit: 'Ω' },
      { id: 3, name: '电容', signal: 'C', value: 1e-6, unit: 'F' }
    ],
    outputs: [
      { id: 1, name: '结果1', signal: '符号1', value: 0, unit: '单位1' },
      { id: 2, name: '结果2', signal: '符号2', value: 0, unit: '单位2' }
    ]
  }
]