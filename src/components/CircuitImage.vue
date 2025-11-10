<template>
  <div class="circuit">
    <div v-if="moduleId === 1">
      <img src="../circuits/mos.jpg"></img>
    </div>
    <div v-else-if="moduleId === 2">

    </div>
    <div v-else>请先在左侧选择电路模块</div>
  </div>
</template>

<script>
export default {
  props: {
    moduleId: Number
  }
}
</script>

<style>
.circuit {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>