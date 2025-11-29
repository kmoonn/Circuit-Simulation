export default [
  {
    moduleId: 1,
    name: 'mos',
    components: [
      { id: 1, name: '输入电压', signal: 'Vin', value: 0, unit: 'V' },
      { id: 2, name: '输出电压', signal: 'Vout', value: 0, unit: 'V' },
      { id: 3, name: '额定功率', signal: 'Pout', value: 0, unit: 'kW' },
      { id: 4, name: '负载', signal: 'Rsingle', value: 0, unit: '' },
      { id: 5, name: '差模电感', signal: 'Lin', value: 0, unit: '' },
      { id: 6, name: '开关频率', signal: 'fres', value: 0, unit: 'Hz' },
      { id: 7, name: '输入电压纹波', signal: 'VinRipple', value: 0, unit: 'V' },
      { id: 8, name: '输出电压纹波', signal: 'VoutRipple', value: 0, unit: 'V' },
      { id: 9, name: '效率', signal: 'ρ', value: 0, unit: '' }
    ],
    outputs: [
      { id: 1, name: '结果1', signal: 'Psingle', value: 0, unit: '单位1' },
      { id: 2, name: '输入电流', signal: 'Iin', value: 0, unit: 'A' },
      { id: 3, name: '输出电流', signal: 'Iout', value: 0, unit: 'A' },
    ]
  },
  {
    moduleId: 2,
    name: '测试',
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