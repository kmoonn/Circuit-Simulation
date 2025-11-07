<template>
  <lay-layout class="main">
    <!-- 左侧菜单 -->
    <lay-side class="side">
      <div class="side-header">
        <h3>电路模块</h3>
      </div>
      <div class="side-content">
        <CircuitList :activeId="activeModule" @select="activeModule = $event" />
      </div>
    </lay-side>

    <!-- 主体区域 -->
    <lay-layout class="main">

      <!-- 主要内容区域 -->
      <lay-body class="body">
        <lay-container fluid>
          <lay-row space="15">
            <!-- 电路图区域 -->
            <lay-col md="16">
              <div class="circuit-container">
                <div class="panel-header">
                  <h3>电路图</h3>
                </div>
                <div class="panel-content">
                  <CircuitImage :moduleId="activeModule" />
                </div>
              </div>
            </lay-col>

            <!-- 参数面板区域 -->
            <lay-col md="8">
              <div class="param-container">
                <div class="panel-header">
                  <h3>参数设置</h3>
                </div>
                <div class="panel-content">
                  <ParameterPanel />
                </div>
              </div>
            </lay-col>
          </lay-row>

          <!-- 结果输出区域 -->
          <lay-row space="15" style="margin-top: 15px;">
            <lay-col md="24">
              <div class="result-container">
                <div class="panel-header">
                  <h3>仿真结果</h3>
                </div>
                <div class="panel-content">
                  <ResultOutput />
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
/* 整体布局样式 */
.main {
  height: 100vh;
  background: #f5f5f5;
}

/* 左侧菜单 */
.side {
  width: 260px;
  background: #fff;
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.side-header {
  padding: 20px;
  background: #fafafa;
  border-bottom: 1px solid #e8e8e8;
}

.side-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: 500;
  text-align: center;
}

.side-content {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

/* 主体内容区 */
.body {
  padding: 20px;
  background: #f5f5f5;
  height: calc(100vh - 70px);
  overflow-y: auto;
}

/* 面板容器样式 */
.circuit-container,
.param-container,
.result-container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 面板头部 */
.panel-header {
  padding: 15px 20px;
  background: #fafafa;
  border-bottom: 1px solid #e8e8e8;
  border-radius: 8px 8px 0 0;
}

.panel-header h3 {
  margin: 0;
  color: #333;
  font-size: 16px;
  font-weight: 500;
}

/* 面板内容区 */
.panel-content {
  flex: 1;
  padding: 20px;
  overflow: auto;
}

/* 电路图容器 */
.circuit-container {
  min-height: 500px;
}

/* 参数面板容器 */
.param-container {
  min-height: 500px;
}

/* 结果输出容器 */
.result-container {
  min-height: 300px;
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