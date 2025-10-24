<template>
  <div class="svg-circuit-diagram" :style="containerStyle">
    <div ref="svgContainer" v-html="svgContent"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, nextTick } from 'vue'
import type { Component } from '@/stores/circuitStore'

const props = defineProps<{
  circuitId?: string | null
  components: Component[]
  width?: number
  height?: number
}>()

const emit = defineEmits<{ 'component-clicked': [component: Component] }>()

const svgContainer = ref<HTMLElement | null>(null)
const aspectRatio = ref<number | null>(null)

const containerStyle = computed(() => {
  const style: Record<string, string> = {
    width: props.width ? `${props.width}px` : '100%',
  }
  if (props.height) {
    style.height = `${props.height}px`
  } else {
    style.height = 'auto'
    if (aspectRatio.value) {
      style.aspectRatio = String(aspectRatio.value)
    }
  }
  return style
})

const svgFiles = import.meta.glob('@/circuits/*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
const svgContent = computed(() => {
  if (!props.circuitId) return ''
  const possibleKeys = [
    `/src/circuits/${props.circuitId}.svg`,
    `c:/Users/hi/Desktop/Work/Interactive-Circuit-Module-Simulator/src/circuits/${props.circuitId}.svg`,
    `${new URL(`../circuits/${props.circuitId}.svg`, import.meta.url).pathname}`,
  ]
  for (const key of possibleKeys) {
    if (svgFiles[key]) return svgFiles[key]
  }
  const match = Object.entries(svgFiles).find(([path]) => path.endsWith(`/${props.circuitId}.svg`))
  return match ? match[1] : ''
})

function computeAspectRatio() {
  if (!svgContainer.value) return
  const svgEl = svgContainer.value.querySelector('svg') as SVGSVGElement | null
  if (!svgEl) return
  const viewBox = svgEl.getAttribute('viewBox')
  if (viewBox) {
    const parts = viewBox.split(/\s+/).map((v) => parseFloat(v))
    if (parts && parts.length === 4 && parts[3] !== undefined && parts[3] > 0) {
      aspectRatio.value = parts[2]! / parts[3]!
      return
    }
  }
  const parseNum = (val: string | null) => {
    if (!val) return null
    const m = val.match(/([\d.]+)/)
    return m && m[1] !== undefined ? parseFloat(m[1]) : null
  }
  const w = parseNum(svgEl.getAttribute('width'))
  const h = parseNum(svgEl.getAttribute('height'))
  if (w && h && h > 0) {
    aspectRatio.value = w / h
    return
  }
  try {
    const bbox = svgEl.getBBox()
    if (bbox.height > 0) aspectRatio.value = bbox.width / bbox.height
  } catch (e) {
    // ignore
  }
}

function attachClickHandlers() {
  if (!svgContainer.value) return
  props.components.forEach((comp) => {
    const el = svgContainer.value!.querySelector(`[data-component-id="${comp.id}"]`)
    if (el) {
      el.addEventListener('click', () => emit('component-clicked', comp))
      ;(el as HTMLElement).style.cursor = 'pointer'
    }
  })

  const textNodes = svgContainer.value!.querySelectorAll('text')
  textNodes.forEach((t) => {
    const label = (t.textContent || '').trim()
    if (!label) return
    const comp = props.components.find((c) => c.id.toLowerCase() === label.toLowerCase())
    if (comp) {
      const clickable = t.closest('g') || t
      clickable.addEventListener('click', () => emit('component-clicked', comp))
      ;(clickable as unknown as HTMLElement).style.cursor = 'pointer'
    }
  })
}

watch(svgContent, async () => {
  await nextTick()
  computeAspectRatio()
  attachClickHandlers()
})

onMounted(() => {
  computeAspectRatio()
  attachClickHandlers()
})
</script>

<style scoped>
.svg-circuit-diagram {
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.svg-circuit-diagram > div {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.svg-circuit-diagram svg {
  width: 100% !important;
  height: auto !important;
  display: block;
}
</style>