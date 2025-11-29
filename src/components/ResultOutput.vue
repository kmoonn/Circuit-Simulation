<template>
    <div class="output" @click="copy">
        <div class="item">
            <div class="label">
                {{ output.name }}
                <span class="signal">({{ output.signal }})</span>
            </div>
            <div class="value-row">
                <span class="value" :class="{ badge: isMode }">{{ output.value }}</span>
                <span v-if="output.unit" class="unit"> {{ output.unit }}</span>
            </div>
        </div>
        <span v-if="copied" class="copied-tip">已复制</span>
    </div>
</template>

<script>
export default {
    props: {
        output: Object
    },
    data() {
        return { copied: false }
    },
    computed: {
        isMode() {
            return this.output && this.output.signal === 'Mode'
        }
    },
    methods: {
        copy() {
            const v = this.output && this.output.value != null ? String(this.output.value) : ''
            const u = this.output && this.output.unit ? ` ${this.output.unit}` : ''
            const text = `${v}${u}`
            if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text)
            }
            this.copied = true
            setTimeout(() => { this.copied = false }, 1200)
        }
    }
}
</script>

<style scoped>
.output {
    font-size: smaller;
    padding: 8px 10px;
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #495057;
    font-weight: 500;
    position: relative;
}
.value-row { display: flex; align-items: baseline; gap: 4px; }
.value { color: #e53935; font-weight: 600; }
.unit { color: #e53935; font-weight: 600; }
.badge { background: #fdecea; padding: 2px 6px; border-radius: 10px; }
.copied-tip { position: absolute; top: 6px; right: 8px; font-size: 10px; color: #2e7d32; background: #e8f5e9; border: 1px solid #c8e6c9; border-radius: 10px; padding: 2px 6px; }
</style>
