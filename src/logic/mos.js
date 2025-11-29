export function computeMOS(input) {
  const vin = Number(input.Vin) || 0
  const vout = Number(input.Vout) || 0
  const poutKw = Number(input.Pout) || 0
  const lin = Number(input.Lin) || 0
  const fres = Number(input.fres) || 0
  const rho = Number(input['ρ']) || 1
  const vinRipple = Number(input.VinRipple) || 0
  const voutRipple = Number(input.VoutRipple) || 0
  const r = Number(input.Rsingle) || 0

  const pout = poutKw * 1000
  const iout = vout > 0 && pout > 0 ? pout / vout : (vout > 0 && r > 0 ? vout / r : 0)
  const iin = vin > 0 && rho > 0 ? (iout * vout) / (vin * rho) : 0
  const m = vin > 0 ? Math.min(Math.max(vout / vin, 0), 1) : 0
  const d_ccm = m
  const delta_ccm = lin > 0 && fres > 0 ? (vin - vout) * d_ccm / (lin * fres) : 0
  const i_crit = delta_ccm / 2
  const eps = Math.max(1e-6, 1e-3 * Math.max(iout, i_crit))
  let mode = 'CCM'
  if (Math.abs(iout - i_crit) <= eps) mode = '临界'
  else if (iout < i_crit) mode = 'DCM'

  if (mode === 'CCM') {
    const d = d_ccm
    const deltaIL = delta_ccm
    const iLpeak = iout + deltaIL / 2
    const iLrms = Math.sqrt(iout * iout + (deltaIL * deltaIL) / 12)
    const iCinRms = iin * Math.sqrt(Math.max(d * (1 - d), 0))
    const iCinRipple = deltaIL
    const iCoutRms = Math.sqrt(Math.max(iLrms * iLrms - iout * iout, 0))
    const iCoutRipple = deltaIL
    const cInMin_uF = fres > 0 && vinRipple > 0 ? iCinRipple / (8 * fres * vinRipple) * 1e6 : 0
    const cOutMin_uF = fres > 0 && voutRipple > 0 ? deltaIL / (8 * fres * voutRipple) * 1e6 : 0
    return { Mode: mode, D: d, Iin: iin, Iout: iout, ILpeak: iLpeak, ILrms: iLrms, ICinRms: iCinRms, ICinRipple: iCinRipple, ICoutRms: iCoutRms, ICoutRipple: iCoutRipple, CinMin: cInMin_uF, CoutMin: cOutMin_uF }
  }

  if (mode === '临界') {
    const d = vin > vout && lin > 0 && fres > 0 ? Math.min(Math.max((2 * iout * lin * fres) / (vin - vout), 0), 1) : d_ccm
    const deltaIL = lin > 0 && fres > 0 ? (vin - vout) * d / (lin * fres) : 0
    const iLpeak = deltaIL
    const beta = vout > 0 ? d * vin / vout : 0
    const iLrms = iLpeak / Math.sqrt(3) * Math.sqrt(Math.max(beta, 0))
    const iCinRms = iin * Math.sqrt(Math.max(d * (1 - d), 0))
    const iCinRipple = deltaIL
    const iCoutRms = Math.sqrt(Math.max(iLrms * iLrms - iout * iout, 0))
    const iCoutRipple = deltaIL
    const cInMin_uF = fres > 0 && vinRipple > 0 ? iCinRipple / (8 * fres * vinRipple) * 1e6 : 0
    const cOutMin_uF = fres > 0 && voutRipple > 0 ? deltaIL / (8 * fres * voutRipple) * 1e6 : 0
    return { Mode: mode, D: d, Iin: iin, Iout: iout, ILpeak: iLpeak, ILrms: iLrms, ICinRms: iCinRms, ICinRipple: iCinRipple, ICoutRms: iCoutRms, ICoutRipple: iCoutRipple, CinMin: cInMin_uF, CoutMin: cOutMin_uF }
  }

  const k = r > 0 ? (2 * lin * fres) / r : 0
  const d = k > 0 && m > 0 && m < 1 ? Math.sqrt(Math.max((k * m) / (1 - m), 0)) : d_ccm
  const deltaIL = lin > 0 && fres > 0 ? (vin - vout) * d / (lin * fres) : 0
  const iLpeak = deltaIL
  const beta = vout > 0 ? d * vin / vout : 0
  const iLrms = iLpeak / Math.sqrt(3) * Math.sqrt(Math.max(beta, 0))
  const iCinRms = iLrms * Math.sqrt(Math.max(d, 0))
  const iCinRipple = deltaIL
  const iCoutRms = Math.sqrt(Math.max(iLrms * iLrms - iout * iout, 0))
  const iCoutRipple = deltaIL
  const cInMin_uF = fres > 0 && vinRipple > 0 ? iCinRipple / (8 * fres * vinRipple) * 1e6 : 0
  const cOutMin_uF = fres > 0 && voutRipple > 0 ? deltaIL / (8 * fres * voutRipple) * 1e6 : 0
  return { Mode: mode, D: d, Iin: iin, Iout: iout, ILpeak: iLpeak, ILrms: iLrms, ICinRms: iCinRms, ICinRipple: iCinRipple, ICoutRms: iCoutRms, ICoutRipple: iCoutRipple, CinMin: cInMin_uF, CoutMin: cOutMin_uF }
}
