import { computeMOS } from '@/logic/mos.js'

export const presetOptions = [
  { label: 'DCM', value: 'DCM' },
  { label: '临界', value: '临界' },
  { label: 'CCM', value: 'CCM' }
]

const setVal = (mod, sig, val) => {
  const c = mod.components.find(x => x.signal === sig)
  if (c) c.value = val
}

export const applyPreset = (mod, kind) => {
  if (!mod) return
  if (kind === 'DCM') presetDCM(mod)
  else if (kind === '临界') presetCritical(mod)
  else if (kind === 'CCM') presetCCM(mod)
}

export const simulate = (mod) => {
  const inputMap = Object.create(null)
  for (const c of mod.components) inputMap[c.signal] = Number(c.value) || 0
  const res = computeMOS(inputMap)
  const outputs = mod.outputs.map(o => ({
    ...o,
    value: typeof res[o.signal] === 'number' ? Number(res[o.signal].toFixed(3)) : res[o.signal]
  }))
  const vin = Number(inputMap['Vin']) || 0
  const vout = Number(inputMap['Vout']) || 0
  const lin = Number(inputMap['Lin']) || 0
  const advice = [
    `状态：${res.Mode}`,
    `MOS：电压 > ${vout} V，电流 > ${Number(res.ILpeak.toFixed(3))} A`,
    `二极管：电压 > ${vout} V，电流 > ${Number(res.ILpeak.toFixed(3))} A`,
    `差模电感：L = ${lin} H，@ILrms = ${Number(res.ILrms.toFixed(3))} A，峰值电流 > ${Number(res.ILpeak.toFixed(3))} A`,
    `输入电容：容值 > ${Number(res.CinMin.toFixed(3))} uF，电压 > ${vin} V`,
    `输出电容：容值 > ${Number(res.CoutMin.toFixed(3))} uF，电压 > ${vout} V`
  ]
  return { outputs, advice }
}

export const reset = (mod) => {
  for (const c of mod.components) c.value = 0
  mod.outputs = mod.outputs.map(o => ({ ...o, value: o.signal === 'Mode' ? '' : 0 }))
}

const presetDCM = (mod) => {
  const Vin = 1000
  const D = 0.3048
  const Vout = Number((Vin * D).toFixed(3))
  const Iout = 21.506
  const PoutKw = Number(((Vout * Iout) / 1000).toFixed(3))
  const Lin = 0.00015
  const fres = 20000
  const Rsingle = Number((Vout / Iout).toFixed(3))
  const VinRipple = Number((Vin * 0.03).toFixed(3))
  const VoutRipple = Number((Vout * 0.02).toFixed(3))
  setVal(mod, 'Vin', Vin)
  setVal(mod, 'Vout', Vout)
  setVal(mod, 'Pout', PoutKw)
  setVal(mod, 'Lin', Lin)
  setVal(mod, 'fres', fres)
  setVal(mod, 'Rsingle', Rsingle)
  setVal(mod, 'VinRipple', VinRipple)
  setVal(mod, 'VoutRipple', VoutRipple)
  setVal(mod, 'ρ', 1)
}

const presetCritical = (mod) => {
  const Vin = 1218.35
  const D = 0.1878
  const Vout = Number((Vin * D).toFixed(3))
  const Iout = 21.506
  const PoutKw = Number(((Vout * Iout) / 1000).toFixed(3))
  const Lin = 0.000215
  const fres = 20000
  const Rsingle = Number((Vout / Iout).toFixed(3))
  const VinRipple = Number((Vin * 0.03).toFixed(3))
  const VoutRipple = Number((Vout * 0.02).toFixed(3))
  setVal(mod, 'Vin', Vin)
  setVal(mod, 'Vout', Vout)
  setVal(mod, 'Pout', PoutKw)
  setVal(mod, 'Lin', Lin)
  setVal(mod, 'fres', fres)
  setVal(mod, 'Rsingle', Rsingle)
  setVal(mod, 'VinRipple', VinRipple)
  setVal(mod, 'VoutRipple', VoutRipple)
  setVal(mod, 'ρ', 1)
}

const presetCCM = (mod) => {
  const Vin = 1250
  const D = 0.1667
  const Vout = Number((Vin * D).toFixed(3))
  const Iout = 21.506
  const PoutKw = Number(((Vout * Iout) / 1000).toFixed(3))
  const Lin = 0.00022
  const fres = 20000
  const Rsingle = Number((Vout / Iout).toFixed(3))
  const VinRipple = Number((Vin * 0.03).toFixed(3))
  const VoutRipple = Number((Vout * 0.02).toFixed(3))
  setVal(mod, 'Vin', Vin)
  setVal(mod, 'Vout', Vout)
  setVal(mod, 'Pout', PoutKw)
  setVal(mod, 'Lin', Lin)
  setVal(mod, 'fres', fres)
  setVal(mod, 'Rsingle', Rsingle)
  setVal(mod, 'VinRipple', VinRipple)
  setVal(mod, 'VoutRipple', VoutRipple)
  setVal(mod, 'ρ', 1)
}

export default { presetOptions, applyPreset, simulate, reset }
