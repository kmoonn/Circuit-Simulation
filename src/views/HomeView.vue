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
import { ref, computed, watch } from "vue";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell } from "docx";
import { multiply } from "mathjs";
import modules from '@/modules/index.js'

import CircuitList from '@/components/CircuitList.vue';
import CircuitImage from '@/components/CircuitImage.vue';
import ParameterPanel from '@/components/ParameterPanel.vue';
import ResultOutput from '@/components/ResultOutput.vue';

const activeModule = ref(null);
const presetKind = ref('')
const presetOptions = computed(() => {
  const id = activeModule.value?.moduleId
  return (id && modules[id]?.presetOptions) || []
})
const advice = ref([])

const storageKey = (id) => `module-${id}`
const persistModule = (mod) => {
  const map = Object.create(null)
  for (const c of mod.components) map[c.signal] = c.value
  localStorage.setItem(storageKey(mod.moduleId), JSON.stringify(map))
}
const restoreModule = (mod) => {
  const raw = localStorage.getItem(storageKey(mod.moduleId))
  if (!raw) return
  try {
    const saved = JSON.parse(raw)
    for (const c of mod.components) {
      if (saved[c.signal] !== undefined) c.value = saved[c.signal]
    }
  } catch {}
}
watch(activeModule, (mod) => { if (mod) restoreModule(mod) }, { immediate: true })
watch(() => activeModule.value && activeModule.value.components, () => { const mod = activeModule.value; if (mod) persistModule(mod) }, { deep: true })

const reset = () => {
  if (!activeModule.value) return
  const mod = activeModule.value
  const ctrl = modules[mod.moduleId]
  if (ctrl && ctrl.reset) ctrl.reset(mod)
  advice.value = []
  presetKind.value = ''
  return
}

const simulate = () => {
  if (!activeModule.value) return
  const mod = activeModule.value
  if (mod.moduleId === 1) {
    const ctrl = modules[1]
    const { outputs, advice: adv } = ctrl.simulate(mod)
    mod.outputs = outputs
    advice.value = adv
  } else if (mod.moduleId === 2) {
    const inputMap = Object.create(null)
    for (const c of mod.components) inputMap[c.signal] = Number(c.value) || 0
    const r = inputMap["R"] ?? 0
    const c = inputMap["C"] ?? 0
    const vin = inputMap["Vin"] ?? 0
    const tau = multiply(r, c)
    mod.outputs = mod.outputs.map((o, idx) => ({
      ...o,
      value: idx === 0 ? tau : vin
    }))
  }
}

const exportDoc = async () => {
  if (!activeModule.value) return;
  const mod = activeModule.value
  const now = new Date()
  const ts = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
  const inputsTable = new Table({
    rows: [
      new TableRow({ children: [
        new TableCell({ children: [ new Paragraph({ children: [ new TextRun({ text: '参数', bold: true }) ] }) ] }),
        new TableCell({ children: [ new Paragraph({ children: [ new TextRun({ text: '信号', bold: true }) ] }) ] }),
        new TableCell({ children: [ new Paragraph({ children: [ new TextRun({ text: '值', bold: true }) ] }) ] }),
        new TableCell({ children: [ new Paragraph({ children: [ new TextRun({ text: '单位', bold: true }) ] }) ] })
      ]}),
      ...mod.components.map(c => new TableRow({ children: [
        new TableCell({ children: [ new Paragraph(c.name) ] }),
        new TableCell({ children: [ new Paragraph(c.signal) ] }),
        new TableCell({ children: [ new Paragraph(String(c.value)) ] }),
        new TableCell({ children: [ new Paragraph(c.unit || '') ] })
      ]}))
    ]
  })
  const outputsTable = new Table({
    rows: [
      new TableRow({ children: [
        new TableCell({ children: [ new Paragraph({ children: [ new TextRun({ text: '输出', bold: true }) ] }) ] }),
        new TableCell({ children: [ new Paragraph({ children: [ new TextRun({ text: '信号', bold: true }) ] }) ] }),
        new TableCell({ children: [ new Paragraph({ children: [ new TextRun({ text: '值', bold: true }) ] }) ] }),
        new TableCell({ children: [ new Paragraph({ children: [ new TextRun({ text: '单位', bold: true }) ] }) ] })
      ]}),
      ...mod.outputs.map(o => new TableRow({ children: [
        new TableCell({ children: [ new Paragraph(o.name) ] }),
        new TableCell({ children: [ new Paragraph(o.signal) ] }),
        new TableCell({ children: [ new Paragraph(String(o.value)) ] }),
        new TableCell({ children: [ new Paragraph(o.unit || '') ] })
      ]}))
    ]
  })
  const advList = advice.value && advice.value.length > 0 ? advice.value.map(x => new Paragraph({ text: x, bullet: { level: 0 } })) : [ new Paragraph({ text: '无' }) ]
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({ children: [ new TextRun({ text: '仿真报告', bold: true, size: 32 }) ] }),
        new Paragraph({ text: '' }),
        new Paragraph({ children: [ new TextRun({ text: `模块：${mod.name}` }) ] }),
        new Paragraph({ children: [ new TextRun({ text: `预设：${presetKind.value || '-'}` }) ] }),
        new Paragraph({ children: [ new TextRun({ text: `导出时间：${ts}` }) ] }),
        new Paragraph({ text: '' }),
        new Paragraph({ children: [ new TextRun({ text: '输入参数', bold: true, size: 28 }) ] }),
        inputsTable,
        new Paragraph({ text: '' }),
        new Paragraph({ children: [ new TextRun({ text: '仿真结果', bold: true, size: 28 }) ] }),
        outputsTable,
        new Paragraph({ text: '' }),
        new Paragraph({ children: [ new TextRun({ text: '选型建议', bold: true, size: 28 }) ] }),
        ...advList
      ]
    }]
  })
  const fileName = `仿真结果_${mod.name}_${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}_${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}.docx`
  const blob = await Packer.toBlob(doc)
  saveAs(blob, fileName)
}

const applyPreset = (val) => {
  const k = val || presetKind.value
  if (!activeModule.value) return
  const mod = activeModule.value
  const ctrl = modules[mod.moduleId]
  if (ctrl && ctrl.applyPreset) ctrl.applyPreset(mod, k)
  simulate()
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
