<script setup lang="ts">
import OutputResult from '@/components/OutputResult.vue'
import CircuitList from '@/components/CircuitList.vue'
import CircuitCanvas from '@/components/CircuitCanvas.vue'
import ParameterPanel from '@/components/ParameterPanel.vue'
import { useCircuitStore } from '@/stores/circuitStore'

const circuitStore = useCircuitStore()

function handleSelect(circuit: string) {
  circuitStore.selectCircuit(circuit)
}

function handleComponentClick(component: any) {
  console.log('App.vue received click:', component)
  const circuitConfig = circuitStore.currentCircuitConfig
  if (circuitConfig) {
    const foundComponent = circuitConfig.components.find((c) => c.type === component.type)
    console.log('Found component:', foundComponent)
    if (foundComponent) {
      circuitStore.selectComponent(foundComponent)
      console.log('Parameter panel should be visible now')
    }
  }
}
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">
        <CircuitList @select="handleSelect" />
      </el-aside>
      <el-container>
        <el-header>模块结构</el-header>
        <el-main>
          <CircuitCanvas
            :selectedCircuit="circuitStore.selectedCircuit"
            @component-clicked="handleComponentClick"
          />
          <OutputResult />
        </el-main>
      </el-container>
    </el-container>

    <ParameterPanel
      v-model:visible="circuitStore.parameterPanelVisible"
      :component="circuitStore.selectedComponent"
    />
  </div>
</template>
