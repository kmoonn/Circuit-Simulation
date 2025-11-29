<template>
  <lay-layout class="main">
    <!-- 左侧菜单 -->
    <lay-side class="side">
      <div class="side-header">
        <h3>电路模块</h3>
      </div>
      <div class="side-content">
        <CircuitList :activeId="activeModule?.moduleId" @select="activeModule = $event" />
      </div>
    </lay-side>

    <!-- 主体区域 -->
    <lay-layout class="main-content">

      <!-- 主要内容区域 -->
      <lay-body class="body">
        <lay-container fluid>
          <lay-row space="15">
            <!-- 电路图区域 -->
            <lay-col md="16">
              <div class="panel">
                <div class="panel-header">
                  <h3>电路图</h3>
                </div>
                <div class="panel-content circuit-content">
                  <CircuitImage :moduleId="activeModule?.moduleId" />
                </div>
              </div>
            </lay-col>

            <!-- 参数面板区域 -->
            <lay-col md="8">
              <div class="panel">
                <div class="panel-header">
                  <h3>参数设置</h3>
                </div>
                <div class="panel-content param-content">
                  <div v-if="activeModule">
                    <ParameterPanel
                      v-for="component in activeModule.components"
                      :key="component.id"
                      :component="component"
                    />
                  </div>
                </div>
              </div>
            </lay-col>
          </lay-row>

          <!-- 结果输出区域 -->
          <lay-row space="15" style="margin-top: 15px;">
            <lay-col md="24">
              <div class="panel">
                <div class="panel-header">
                  <div class="panel-header-row">
                    <h3>仿真结果</h3>
                    <div class="button-group">
                      <lay-button type="primary" size="sm" @click="simulate" :disabled="!activeModule">仿真</lay-button>
                      <lay-button type="primary" size="sm" @click="exportDoc" :disabled="!activeModule">导出</lay-button>
                      <lay-button type="danger" size="sm" @click="reset" :disabled="!activeModule">重置</lay-button>
                      <lay-select v-model="presetKind" :options="presetOptions" placeholder="示例" size="sm" :disabled="!activeModule" style="width:100px" @change="applyPreset" />
                    </div>
                  </div>
                </div>
                <div class="panel-content">
                  <div v-if="activeModule">
                    <div class="result-content">
                      <div class="result-grid">
                        <ResultOutput
                          v-for="output in activeModule.outputs"
                          :key="output.id"
                          :output="output"
                        />
                      </div>
                    </div>
                    <div class="panel" style="margin-top: 10px;">
                      <div class="panel-header">
                        <h3>选型建议</h3>
                      </div>
                      <div class="panel-content">
                        <div v-for="(item, idx) in advice" :key="idx" style="padding:4px 0;">{{ item }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </lay-col>
          </lay-row>

        </lay-container>
      </lay-body>

    </lay-layout>
  </lay-layout>
</template>

<script setup>
import { ref } from "vue";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { add, multiply } from "mathjs";
import { computeMOS } from '@/logic/mos.js'

import CircuitList from '@/components/CircuitList.vue';
import CircuitImage from '@/components/CircuitImage.vue';
import ParameterPanel from '@/components/ParameterPanel.vue';
import ResultOutput from '@/components/ResultOutput.vue';

const activeModule = ref(null);
const presetKind = ref('')
const presetOptions = [
  { label: 'DCM', value: 'DCM' },
  { label: '临界', value: '临界' },
  { label: 'CCM', value: 'CCM' }
]
const advice = ref([])

const reset = () => {
  if (!activeModule.value) return
    const mod = activeModule.value
    for (const c of mod.components) c.value = 0
    mod.outputs = mod.outputs.map(o => ({ ...o, value: o.signal === 'Mode' ? '' : 0 }))
    advice.value = []
    presetKind.value = ''
    return
}

const simulate = () => {
  if (!activeModule.value) return;

  const mod = activeModule.value;
  const inputMap = Object.create(null);
  for (const c of mod.components) {
    inputMap[c.signal] = Number(c.value) || 0;
  }

  if (mod.moduleId === 1) {
    const res = computeMOS(inputMap)
    mod.outputs = mod.outputs.map(o => ({
      ...o,
      value: typeof res[o.signal] === 'number' ? Number(res[o.signal].toFixed(3)) : res[o.signal]
    }))
    const vin = Number(inputMap['Vin']) || 0
    const vout = Number(inputMap['Vout']) || 0
    const lin = Number(inputMap['Lin']) || 0
    advice.value = [
      `状态：${res.Mode}`,
      `MOS：电压 > ${vout} V，电流 > ${Number(res.ILpeak.toFixed(3))} A`,
      `二极管：电压 > ${vout} V，电流 > ${Number(res.ILpeak.toFixed(3))} A`,
      `差模电感：L = ${lin} H，@ILrms = ${Number(res.ILrms.toFixed(3))} A，峰值电流 > ${Number(res.ILpeak.toFixed(3))} A`,
      `输入电容：容值 > ${Number(res.CinMin.toFixed(3))} uF，电压 > ${vin} V`,
      `输出电容：容值 > ${Number(res.CoutMin.toFixed(3))} uF，电压 > ${vout} V`
    ]
  } else if (mod.moduleId === 2) {
    const r = inputMap["R"] ?? 0;
    const c = inputMap["C"] ?? 0;
    const vin = inputMap["Vin"] ?? 0;

    const tau = multiply(r, c);
    mod.outputs = mod.outputs.map((o, idx) => ({
      ...o,
      value: idx === 0 ? tau : vin
    }));
  }
}

const exportDoc = async () => {
  if (!activeModule.value) return;

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          children: [
            new TextRun({ text: "仿真结果", bold: true, size: 28})
          ]
        }),
        new Paragraph({ text: "" }),
        ...activeModule.value.outputs.map(output =>
          new Paragraph({
            children: [
              new TextRun({ text: `输出名称: ${output.name}`, bold: true }),
              new TextRun({ text: `  值: ${output.value}` })
            ]
          })
        )
      ]
    }]
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "仿真结果.docx");
};

const setVal = (mod, sig, val) => {
  const c = mod.components.find(x => x.signal === sig)
  if (c) c.value = val
}

const applyPreset = (val) => {
  const k = val || presetKind.value
  if (k === 'DCM') presetDCM()
  else if (k === '临界') presetCritical()
  else if (k === 'CCM') presetCCM()
  simulate()
}

const presetDCM = () => {
  if (!activeModule.value) return
  const mod = activeModule.value
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

const presetCritical = () => {
  if (!activeModule.value) return
  const mod = activeModule.value
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

const presetCCM = () => {
  if (!activeModule.value) return
  const mod = activeModule.value
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
</script>


<style>
/* 整体布局 */
.main {
  height: 100vh;
  background: #f4f6f8;
}

/* 右侧主内容 */
.main-content {
  background: #f4f6f8;
}

/* 左侧菜单 */
.side {
  width: 240px;
  background: #fff;
  border-right: 1px solid #e5e6eb;
  display: flex;
  flex-direction: column;
}

.side-header {
  padding: 18px;
  background: #fafafa;
  border-bottom: 1px solid #e5e6eb;
}

.side-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  color: #333;
}

.side-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

/* 主体内容区 */
.body {
  padding: 16px;
  background: #f4f6f8;
  height: calc(100vh - 64px);
  overflow-y: auto;
}

/* 面板基础样式 */
.panel {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
}

/* 面板头部 */
.panel-header {
  padding: 14px 18px;
  background: #fafafa;
  border-bottom: 1px solid #e5e6eb;
  border-radius: 8px 8px 0 0;
}

.panel-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-header h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

/* 面板内容区 */
.panel-content {
  padding: 18px;
  overflow: auto;
}

.param-content {
  height: 380px;
  overflow-y: auto;
}

.result-content {
  height: 380px;
  overflow-y: auto;
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.circuit-content {
  height: 380px;
  overflow-y: auto;
}

/* 更自然的滚动体验 */
.panel-content::-webkit-scrollbar {
  width: 6px;
}

.panel-content::-webkit-scrollbar-thumb {
  background: #d0d0d0;
  border-radius: 3px;
}

/* 按钮组 */
.button-group {
  display: flex;
  gap: 8px;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .side {
    width: 200px;
  }

  .body {
    padding: 10px;
  }

  .param-content {
    height: 280px;
  }

  .result-content {
    height: 280px;
  }

  .result-grid {
    grid-template-columns: 1fr;
  }

  .circuit-content {
    height: 280px;
  }
}
</style>
