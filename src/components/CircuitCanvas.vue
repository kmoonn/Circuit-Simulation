<template>
  <div class="canvas-wrapper">
    <div v-if="!selectedCircuit" class="empty-state">
      <div class="empty-icon">⚡</div>
      <div class="empty-text">请先选择模块</div>
    </div>
    <CircuitDiagram v-else :components="currentComponents" @component-clicked="onClickComponent" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCircuitStore } from '@/stores/circuitStore'
import CircuitDiagram from './konva/CircuitDiagram.vue'

const props = defineProps<{
  selectedCircuit: string | null
}>()

const emit = defineEmits(['component-clicked'])

const circuitStore = useCircuitStore()

// 获取当前电路的组件
const currentComponents = computed(() => {
  const circuitConfig = circuitStore.currentCircuitConfig
  return circuitConfig ? circuitConfig.components : []
})

// 点击元件时触发弹窗
function onClickComponent(component: { type: string; value: number }) {
  console.log('CircuitCanvas received click:', component)
  emit('component-clicked', component)
}
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #6c757d;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-text {
  font-size: 16px;
  font-weight: 500;
}
</style>
