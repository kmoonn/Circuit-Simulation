<template>
  <div class="circuit-wrapper">
    <svg viewBox="0 0 800 300" class="diagram">

      <!-- DC 电源 -->
      <g class="component" transform="translate(40,100)" @click="select('DC 电源')">
        <circle cx="0" cy="0" r="20" stroke="black" fill="none"/>
        <line x1="-20" y1="0" x2="20" y2="0" stroke="black"/>
        <line x1="0" y1="-20" x2="0" y2="20" stroke="black"/>
        <text x="-10" y="50" font-size="14">DC</text>
      </g>

      <!-- 电感 -->
      <g class="component" transform="translate(150,100)" @click="select('电感滤波')">
        <path d="M0,0
                 c10,-20 30,20 40,0
                 c10,-20 30,20 40,0
                 c10,-20 30,20 40,0"
              stroke="black" fill="none"/>
        <text x="20" y="40" font-size="14">L</text>
      </g>

      <!-- 变压器 -->
      <g class="component" transform="translate(320,70)" @click="select('隔离变压器')">
        <circle cx="0" cy="30" r="20" stroke="black" fill="none"/>
        <circle cx="60" cy="30" r="20" stroke="black" fill="none"/>
        <line x1="30" y1="0" x2="30" y2="60" stroke="black"/>
        <text x="10" y="80" font-size="14">T</text>
      </g>

      <!-- 二极管整流 -->
      <g class="component" transform="translate(480,100)" @click="select('整流二极管')">
        <polygon points="0,0 30,15 0,30" stroke="black" fill="none"/>
        <line x1="30" y1="0" x2="30" y2="30" stroke="black"/>
        <text x="0" y="50" font-size="14">D</text>
      </g>

      <!-- 电容 -->
      <g class="component" transform="translate(600,100)" @click="select('滤波电容')">
        <line x1="0" y1="0" x2="0" y2="40" stroke="black"/>
        <line x1="20" y1="0" x2="20" y2="40" stroke="black"/>
        <text x="-5" y="60" font-size="14">C</text>
      </g>

      <!-- 负载 -->
      <g class="component" transform="translate(720,100)" @click="select('负载')">
        <rect x="0" y="0" width="40" height="40" stroke="black" fill="none"/>
        <text x="5" y="25" font-size="14">R</text>
      </g>

      <!-- 连接线 -->
      <line x1="60" y1="100" x2="150" y2="100" stroke="black"/>
      <line x1="230" y1="100" x2="320" y2="100" stroke="black"/>
      <line x1="380" y1="100" x2="480" y2="100" stroke="black"/>
      <line x1="510" y1="115" x2="600" y2="115" stroke="black"/>
      <line x1="620" y1="115" x2="720" y2="115" stroke="black"/>

    </svg>

    <!-- 右侧说明面板 -->
    <aside class="info-panel" v-if="active">
      <h3>{{ active }}</h3>
      <p>这里可以显示该器件的功能说明、参数等。</p>
      <button @click="active = ''">关闭</button>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const active = ref('')

function select(name: string) {
  active.value = name
}
</script>

<style scoped>
.circuit-wrapper {
  display: flex;
  gap: 12px;
}
.diagram {
  width: 70%;
  height: auto;
  border: 1px solid #ddd;
}
.component {
  cursor: pointer;
}
.info-panel {
  width: 30%;
  padding: 10px;
  border-left: 1px solid #ccc;
}
</style>
