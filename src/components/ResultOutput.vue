<template>
    <div class="output">
        <div class="item">
            <div class="label">
                {{ output.name }}
                <span class="signal">({{ output.signal }})</span>
            </div>
            <div>
                <span>{{ output.value }}</span>
                <span v-if="output.unit"> {{ output.unit }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        output: Object
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
}
</style>
