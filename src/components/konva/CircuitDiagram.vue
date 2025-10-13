<template>
  <v-stage :config="stageConfig">
    <v-layer>
      <!-- 连接线 -->
      <v-line v-for="(line, index) in connectionLines" :key="`line-${index}`" :config="line" />

      <!-- 电气元件 -->
      <Resistor
        v-for="resistor in resistors"
        :key="resistor.id"
        :x="resistor.position.x"
        :y="resistor.position.y"
        :value="resistor.value"
        :unit="resistor.unit"
        @click="handleComponentClick"
      />

      <Capacitor
        v-for="capacitor in capacitors"
        :key="capacitor.id"
        :x="capacitor.position.x"
        :y="capacitor.position.y"
        :value="capacitor.value"
        :unit="capacitor.unit"
        @click="handleComponentClick"
      />

      <Inductor
        v-for="inductor in inductors"
        :key="inductor.id"
        :x="inductor.position.x"
        :y="inductor.position.y"
        :value="inductor.value"
        :unit="inductor.unit"
        @click="handleComponentClick"
      />

      <!-- 输入输出端口 -->
      <v-circle :config="inputPortConfig" />
      <v-circle :config="outputPortConfig" />
      <v-text :config="inputLabelConfig" />
      <v-text :config="outputLabelConfig" />
    </v-layer>
  </v-stage>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from '@/stores/circuitStore'
import Resistor from './Resistor.vue'
import Capacitor from './Capacitor.vue'
import Inductor from './Inductor.vue'

const props = defineProps<{
  components: Component[]
  width?: number
  height?: number
}>()

const emit = defineEmits<{
  'component-clicked': [component: { type: string; value: number }]
}>()

// 画布配置
const stageConfig = {
  width: props.width || 600,
  height: props.height || 400,
}

// 按类型分组元件
const resistors = computed(() => props.components.filter((c) => c.type === '电阻'))
const capacitors = computed(() => props.components.filter((c) => c.type === '电容'))
const inductors = computed(() => props.components.filter((c) => c.type === '电感'))

// 连接线配置
const connectionLines = computed(() => {
  const lines = []

  // 输入线
  lines.push({
    points: [50, 200, 80, 200],
    stroke: '#333333',
    strokeWidth: 2,
    lineCap: 'round',
  })

  // 输出线
  lines.push({
    points: [520, 200, 550, 200],
    stroke: '#333333',
    strokeWidth: 2,
    lineCap: 'round',
  })

  // 元件间连接线（简化版本）
  props.components.forEach((component, index) => {
    const nextComponent = props.components[index + 1]
    if (nextComponent) {
      lines.push({
        points: [
          component.position.x + 60, // 假设元件宽度
          component.position.y + 10, // 假设元件中心
          nextComponent.position.x,
          nextComponent.position.y + 10,
        ],
        stroke: '#666666',
        strokeWidth: 1.5,
        lineCap: 'round',
      })
    }
  })

  return lines
})

// 输入端口配置
const inputPortConfig = {
  x: 50,
  y: 200,
  radius: 6,
  fill: '#ff4444',
  stroke: '#cc0000',
  strokeWidth: 2,
}

// 输出端口配置
const outputPortConfig = {
  x: 550,
  y: 200,
  radius: 6,
  fill: '#44ff44',
  stroke: '#00cc00',
  strokeWidth: 2,
}

// 输入标签
const inputLabelConfig = {
  x: 50,
  y: 220,
  text: 'Vin',
  fontSize: 14,
  fontFamily: 'Arial',
  fill: '#333333',
  align: 'center',
}

// 输出标签
const outputLabelConfig = {
  x: 550,
  y: 220,
  text: 'Vout',
  fontSize: 14,
  fontFamily: 'Arial',
  fill: '#333333',
  align: 'center',
}

// 元件点击事件
function handleComponentClick(component: { type: string; value: number }) {
  console.log('CircuitDiagram received click:', component)
  emit('component-clicked', component)
}
</script>
