<template>
  <div class="list">
    <div
      class="item"
      v-for="m in modules"
      :key="m.moduleId"
      @click="select(m)"
      :class="{ active: m.moduleId === activeId }"
    >
      {{ m.name }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    activeId: Number
  },
  emits: ["select"],
  setup(props, { emit }) {
    const modules = [
      { 
        moduleId: 1, 
        name: "mos",
        components: [
          {id: 1, name: "输入电压", signal: "Vin", value: 0, unit: "V"},
          {id: 2, name: "输出电压", signal: "Vout", value: 0, unit: "V"},
          {id: 3, name: "额定功率", signal: "Pout", value: 0, unit: "W"}
        ],
        outputs: [
          {id: 1, name: "结果1", signal: "符号1", value: 0, unit: "单位1"},
          {id: 2, name: "结果2", signal: "符号2", value: 0, unit: "单位2"}
        ]
      },
    ]

    const select = (m) => {
      emit("select", m)
    }

    return { modules, select }
  }
}
</script>

<style>
.list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item {
  padding: 12px 16px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #495057;
  font-weight: 500;
}

.item:hover {
  background: #e9ecef;
  border-color: #dee2e6;
  transform: translateY(-1px);
}

.item.active {
  background: linear-gradient(135deg, #667eea 0%, rgb(75, 129, 162) 100%);
  color: white;
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}
</style>