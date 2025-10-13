<template>
  <el-card class="box-card" header="仿真结果">
    <div v-if="!circuitStore.selectedCircuit">
      <el-empty description="请先选择电路类型" />
    </div>
    <div v-else-if="!circuitStore.simulationResult">
      <el-empty description="请先运行仿真" />
    </div>
    <div v-else class="simulation-results">
      <div class="result-item">
        <span class="label">输出电压：</span>
        <span class="value">{{ circuitStore.simulationResult.voltage }} V</span>
      </div>
      <div class="result-item">
        <span class="label">输出电流：</span>
        <span class="value">{{ circuitStore.simulationResult.current }} A</span>
      </div>
      <div class="result-item" v-if="circuitStore.simulationResult.frequency">
        <span class="label">频率：</span>
        <span class="value">{{ circuitStore.simulationResult.frequency }} Hz</span>
      </div>
      <div class="result-item" v-if="circuitStore.simulationResult.phase">
        <span class="label">相位：</span>
        <span class="value">{{ circuitStore.simulationResult.phase }}°</span>
      </div>
    </div>
    <div class="actions">
      <el-button
        type="primary"
        @click="runSimulation"
        :disabled="!circuitStore.selectedCircuit"
        :loading="isRunning"
      >
        {{ isRunning ? '计算中...' : '运行仿真' }}
      </el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCircuitStore } from '@/stores/circuitStore'

const circuitStore = useCircuitStore()
const isRunning = ref(false)

async function runSimulation() {
  if (!circuitStore.selectedCircuit) {
    return
  }

  isRunning.value = true
  try {
    // 模拟计算延迟
    await new Promise((resolve) => setTimeout(resolve, 500))
    circuitStore.runSimulation()
  } catch (error) {
    console.error('仿真计算错误:', error)
  } finally {
    isRunning.value = false
  }
}
</script>

<style scoped>
.box-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.box-card .el-card__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
}

.simulation-results {
  margin-bottom: 16px;
  flex: 1;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding: 8px 0;
  border-bottom: 1px solid #e9ecef;
  min-height: 32px;
}

.result-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.label {
  font-weight: 500;
  color: #495057;
  flex: 1;
}

.value {
  font-weight: 600;
  color: #2c3e50;
  font-family: 'Courier New', monospace;
  flex: 0 0 auto;
}

.actions {
  text-align: center;
  padding-top: 16px;
  border-top: 1px solid #e9ecef;
  margin-top: auto;
}
</style>
