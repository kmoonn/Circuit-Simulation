<template>
  <div class="container">
    <tiny-container
        :aside-width="150"
        :footer-height="100"
        :header-height="40"
        pattern="fashion"
    >
      <div class="center">
        Main
<!--        <Demo/>-->

      </div>

      <template #header>
        <div class="center">
          仿真模拟
        </div>
      </template>

      <template #aside>
        <div class="center">
          模块列表
        </div>
      </template>
    </tiny-container>
  </div>
</template>

<script setup lang="ts">
import { TinyContainer } from '@opentiny/vue'
import Demo from "./components/Demo.vue";
</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

*, *::before, *::after {
  box-sizing: inherit;
}

.container {
  width: 100%;
  height: 100%;
}

.container .tiny-container {
  width: 100%;
  height: 100%;
}


.container .tiny-container :deep(.tiny-container__header) {
  background-color: var(--tv-color-info-bg-light);
  border: 3px solid var(--tv-color-border-container);
  color: var(--tv-color-info-text);
  line-height: 40px; /* 和 header-height 对齐 */
}

.container .tiny-container :deep(.tiny-container__aside) {
  background-color: var(--tv-color-error-bg-light);
  border: 3px solid var(--tv-color-border-container);
  color: var(--tv-color-error-text);
}

.container .tiny-container :deep(.tiny-container__main) {
  background-color: var(--tv-color-warn-bg-light);
  border: 3px solid var(--tv-color-border-container);
  color: var(--tv-color-warn-text);
}

.container .tiny-container :deep(.tiny-container__footer) {
  background-color: var(--tv-color-success-bg-light);
  border: 3px solid var(--tv-color-border-container);
  color: var(--tv-color-success-text);
  line-height: 100px;
}
</style>
