<template>
  <div class="circuit-list">
    <div class="list-header">
      <h3>模块列表</h3>
    </div>
    <div class="list-content">
      <div
        v-for="circuit in circuitOptions"
        :key="circuit.value"
        class="circuit-item"
        :class="{ active: circuitStore.selectedCircuit === circuit.value }"
        @click="handleSelect(circuit.value)"
      >
        <div class="circuit-info">
          <div class="circuit-name">{{ circuit.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCircuitStore } from '@/stores/circuitStore'
import { getCircuitTypesList } from '@/data/circuitData'

const circuitStore = useCircuitStore()
const emit = defineEmits(['select'])

// 使用电路数据文件中的电路类型
const circuitOptions = getCircuitTypesList().map((circuit) => ({
  value: circuit.id,
  name: circuit.name,
}))

function handleSelect(value: string) {
  emit('select', value)
}
</script>

<style scoped>
.circuit-list {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.list-header {
  padding: 16px 0 12px 0;
  border-bottom: 1px solid #e9ecef;
  margin-bottom: 16px;
}

.list-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  text-align: center;
}

.list-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.circuit-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #ffffff;
}

.circuit-item:hover {
  border-color: #adb5bd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transform: translateY(-1px);
}

.circuit-item.active {
  border-color: #6c757d;
  background: #f8f9fa;
  box-shadow: 0 2px 8px rgba(108, 117, 125, 0.15);
}

.circuit-item.active .circuit-icon {
  background: #6c757d;
  color: #ffffff;
  border-color: #6c757d;
}

.circuit-info {
  flex: 1;
  min-width: 0;
}

.circuit-name {
  font-size: 14px;
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 2px;
  line-height: 1.2;
}

.circuit-item.active .circuit-name {
  color: #2c3e50;
  font-weight: 600;
}
</style>
