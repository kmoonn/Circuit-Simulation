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
                <div class="panel-content">
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
                <div class="panel-content">
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
                      <lay-button type="primary" size="sm" @click="simulate">仿真</lay-button>
                      <lay-button type="primary" size="sm" @click="export">导出</lay-button>
                    </div>
                  </div>
                </div>
                <div class="panel-content">
                  <div v-if="activeModule">
                    <ResultOutput
                      v-for="output in activeModule.outputs"
                      :key="output.id"
                      :output="output"
                    />
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
import { ref } from "vue"

import CircuitList from '@/components/CircuitList.vue'
import CircuitImage from '@/components/CircuitImage.vue'
import ParameterPanel from '@/components/ParameterPanel.vue'
import ResultOutput from '@/components/ResultOutput.vue'

const activeModule = ref(null)
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
}
</style>