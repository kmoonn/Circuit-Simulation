<template>
  <el-dialog v-model="visible" title="参数设置" width="400px">
    <el-form label-width="100px" v-if="component">
      <el-form-item label="类型">
        <el-input v-model="component.type" disabled />
      </el-form-item>
      <el-form-item label="数值">
        <el-input v-model="componentValue" />
      </el-form-item>
      <el-form-item label="单位">
        <el-input v-model="component.unit" disabled />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useCircuitStore, type Component } from '@/stores/circuitStore'

const circuitStore = useCircuitStore()

const props = defineProps<{
  visible: boolean
  component: Component | null
}>()

const emit = defineEmits(['update:visible'])

const visible = ref(props.visible)
watch(
  () => props.visible,
  (val) => (visible.value = val),
)
watch(visible, (val) => emit('update:visible', val))

const componentValue = computed({
  get: () => props.component?.value || 0,
  set: (value: number) => {
    if (props.component) {
      circuitStore.updateComponentValue(props.component.id, value)
    }
  },
})

function save() {
  circuitStore.closeParameterPanel()
}
</script>
