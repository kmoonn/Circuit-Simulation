<template>
  <v-group :config="groupConfig" @click="handleClick">
    <!-- 电容极板1 -->
    <v-line :config="plate1Config" />
    <!-- 电容极板2 -->
    <v-line :config="plate2Config" />
    <!-- 电容符号 -->
    <v-circle :config="symbolConfig" />
    <!-- 电容标签 -->
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

const capacitorRadius = props.radius || 15

// 组配置
const groupConfig = computed(() => ({
  x: props.x,
  y: props.y,
  draggable: false,
}))

// 极板1配置（左极板）
const plate1Config = computed(() => ({
  points: [0, -capacitorRadius, 0, capacitorRadius],
  stroke: props.selected ? '#4caf50' : '#4caf50',
  strokeWidth: 3,
  lineCap: 'round',
}))

// 极板2配置（右极板）
const plate2Config = computed(() => ({
  points: [capacitorRadius * 2, -capacitorRadius, capacitorRadius * 2, capacitorRadius],
  stroke: props.selected ? '#4caf50' : '#4caf50',
  strokeWidth: 3,
  lineCap: 'round',
}))

// 电容符号圆圈
const symbolConfig = computed(() => ({
  x: capacitorRadius,
  y: 0,
  radius: capacitorRadius,
  fill: 'transparent',
  stroke: props.selected ? '#4caf50' : '#4caf50',
  strokeWidth: 2,
  shadowColor: props.selected ? '#4caf50' : '#000000',
  shadowBlur: props.selected ? 8 : 4,
  shadowOffset: { x: 2, y: 2 },
  shadowOpacity: 0.3,
}))

// 标签配置
const labelConfig = computed(() => ({
  x: capacitorRadius,
  y: capacitorRadius + 20,
  text: `${props.value}${props.unit}`,
  fontSize: 12,
  fontFamily: 'Arial',
  fill: '#333333',
  align: 'center',
}))

// 点击事件
function handleClick() {
  emit('click', { type: '电容', value: props.value })
}
</script>
