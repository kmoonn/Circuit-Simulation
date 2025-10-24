<script setup lang="ts">
import OutputResult from '@/components/OutputResult.vue'
import CircuitList from '@/components/CircuitList.vue'
import SVGCircuitDiagram from '@/components/SVGCircuitDiagram.vue'
import ParameterPanel from '@/components/ParameterPanel.vue'
import { useCircuitStore } from '@/stores/circuitStore'

const circuitStore = useCircuitStore()

function handleSelect(circuit: string) {
  circuitStore.selectCircuit(circuit)
}

function handleComponentClick(component: any) {
  circuitStore.selectComponent(component)
}
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="220px">
        <CircuitList @select="handleSelect" />
      </el-aside>
      <el-container>
        <el-main>
          <el-card class="box-card diagram-card">
            <template #header>电路图</template>
            <div class="diagram-content">
              <SVGCircuitDiagram
                v-if="circuitStore.selectedCircuit"
                :circuit-id="circuitStore.selectedCircuit"
                :components="circuitStore.currentComponents"
                @component-clicked="handleComponentClick"
              />
              <div v-else class="empty-state">
                <div class="empty-icon">⚡</div>
                <div class="empty-text">请先选择仿真模块</div>
              </div>
            </div>
          </el-card>

          <el-card class="box-card results-card">
            <template #header>仿真结果</template>
            <OutputResult />
          </el-card>
        </el-main>
      </el-container>
    </el-container>

    <ParameterPanel
      v-model:visible="circuitStore.parameterPanelVisible"
      :component="circuitStore.selectedComponent"
    />
  </div>
</template>

<style scoped>
.el-main {
  padding: 12px 16px;
}

.diagram-card .el-card__body {
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.results-card .el-card__body {
  padding: 16px;
  overflow: visible;
}

.diagram-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #6c757d;
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
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
