<template>
    <div class="panel">
        <div class="item">
            <div class="label">
                {{ component.name }}
                <span class="signal">({{ component.signal }})</span>
            </div>
            <div class="input-row">
                <lay-input-number 
                    v-model="component.value"
                    type="number" 
                    size="sm"
                    class="num-input"/>
                <span class="unit">{{ component.unit }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        component: Object
    }
}
</script>

<style scoped>
.panel {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.item {
    padding: 2px 14px;
    background: #fff;
    border: 1px solid #ebeef5;
    border-radius: 6px;
    transition: box-shadow 0.2s ease;
}

.item:hover {
    box-shadow: 0 2px 10px rgba(0,0,0,0.06);
}

.label {
    font-size: 12px;
    font-weight: 600;
    color: #333;
    margin-bottom: 1px;
}

.signal {
    font-weight: 400;
    color: #909399;
}

.input-row {
    display: flex;
    align-items: center;
    gap: 8px;
}

.num-input {
    flex: 1;
}

.unit {
    font-size: 10px;
    font-weight: bold;
    color: #606266;
    padding: 0 4px;
}
</style>