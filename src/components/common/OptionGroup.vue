<template>
  <div class="option-group">
    <span class="opt-label">{{ label }}</span>
    <el-button-group>
      <el-button
        v-for="opt in options"
        :key="opt"
        :type="modelValue === opt ? 'primary' : 'default'"
        @click="$emit('update:modelValue', opt)"
      >
        {{ opt }}
      </el-button>
    </el-button-group>
  </div>
</template>

<script setup>
const props = defineProps({
  label: { type: String, required: true },
  options: { type: Array, required: true },
  modelValue: { type: String, default: '' }
})
</script>

<style scoped>
.option-group { margin-bottom: 16px; display: flex; align-items: center; }
.opt-label { width: 80px; flex-shrink: 0; }
</style>
