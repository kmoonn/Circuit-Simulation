<template>
  <v-group :config="groupConfig" @click="handleClick">
    <!-- 电感线圈 -->
    <v-path :config="coilConfig" />
    <!-- 电感标签 -->
    <v-text :config="labelConfig" />
  </v-group>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  x: number
  y: number
  radius?: number
  value: number
  unit: string
  selected?: boolean
}>()

const emit = defineEmits<{
  click: [value: { type: string; value: number }]
}>()

const inductorRadius = props.radius || 20

// 组配置
const groupConfig = computed(() => ({
  x: props.x,
  y: props.y,
  draggable: false,
}))

// 电感线圈路径
const coilConfig = computed(() => {
  const coils = 4 // 线圈数量
  const coilSpacing = inductorRadius / coils
  let pathData = ''

  for (let i = 0; i < coils; i++) {
    const x = i * coilSpacing
    const y1 = -inductorRadius
    const y2 = inductorRadius

    if (i === 0) {
      pathData += `M ${x} ${y1} `
    }

    pathData += `C ${x + coilSpacing / 2} ${y1} ${x + coilSpacing / 2} ${y2} ${x + coilSpacing} ${y2} `
    pathData += `C ${x + coilSpacing / 2} ${y2} ${x + coilSpacing / 2} ${y1} ${x + coilSpacing} ${y1} `
  }

  return {
    data: pathData,
    stroke: props.selected ? '#ff9800' : '#ff9800',
    strokeWidth: 3,
    fill: 'transparent',
    lineCap: 'round',
    shadowColor: props.selected ? '#ff9800' : '#000000',
    shadowBlur: props.selected ? 8 : 4,
    shadowOffset: { x: 2, y: 2 },
    shadowOpacity: 0.3,
  }
})

// 标签配置
const labelConfig = computed(() => ({
  x: (inductorRadius * 3) / 2,
  y: inductorRadius + 20,
  text: `${props.value}${props.unit}`,
  fontSize: 12,
  fontFamily: 'Arial',
  fill: '#333333',
  align: 'center',
}))

// 点击事件
function handleClick() {
  emit('click', { type: '电感', value: props.value })
}
</script>
