<template>
  <v-group :config="groupConfig" @click="handleClick">
    <!-- 电阻本体 -->
    <v-rect :config="resistorConfig" />
    <!-- 电阻丝纹路 -->
    <v-line v-for="(line, index) in resistorLines" :key="`line-${index}`" :config="line" />
    <!-- 电阻标签 -->
    <v-text :config="labelConfig" />
  </v-group>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  x: number
  y: number
  width?: number
  height?: number
  value: number
  unit: string
  selected?: boolean
}>()

const emit = defineEmits<{
  click: [value: { type: string; value: number }]
}>()

const resistorWidth = props.width || 60
const resistorHeight = props.height || 20

// 组配置
const groupConfig = computed(() => ({
  x: props.x,
  y: props.y,
  draggable: false,
}))

// 电阻本体配置
const resistorConfig = computed(() => ({
  width: resistorWidth,
  height: resistorHeight,
  fill: props.selected ? '#e3f2fd' : '#ffffff',
  stroke: props.selected ? '#2196f3' : '#666666',
  strokeWidth: 2,
  cornerRadius: 4,
  shadowColor: props.selected ? '#2196f3' : '#000000',
  shadowBlur: props.selected ? 8 : 4,
  shadowOffset: { x: 2, y: 2 },
  shadowOpacity: 0.3,
  listening: true,
}))

// 电阻丝纹路
const resistorLines = computed(() => {
  const lines = []
  const lineCount = 5
  const lineSpacing = resistorWidth / (lineCount + 1)

  for (let i = 1; i <= lineCount; i++) {
    const x = lineSpacing * i
    lines.push({
      points: [x, 4, x, resistorHeight - 4],
      stroke: props.selected ? '#2196f3' : '#666666',
      strokeWidth: 1.5,
      listening: false,
    })
  }
  return lines
})

// 标签配置
const labelConfig = computed(() => ({
  x: resistorWidth / 2,
  y: resistorHeight + 15,
  text: `${props.value}${props.unit}`,
  fontSize: 12,
  fontFamily: 'Arial',
  fill: '#333333',
  align: 'center',
  listening: false,
}))

// 点击事件
function handleClick() {
  console.log('Resistor clicked:', { type: '电阻', value: props.value })
  emit('click', { type: '电阻', value: props.value })
}
</script>
