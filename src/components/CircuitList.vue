<template>
  <div class="list">
    <div
      class="item"
      v-for="m in modules"
      :key="m.id"
      @click="select(m)"
      :class="{ active: m.id === activeId }"
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
      { id: 1, name: "mos" },
    ]

    const select = (m) => {
      emit("select", m.id)
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}
</style>