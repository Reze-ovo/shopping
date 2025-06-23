<!-- eslint-disable vue/no-setup-props-destructure, no-undef, no-unused-vars -->
<template>
  <el-pagination
    :current-page="props.currentPage"
    :page-size="props.pageSize"
    :total="props.total"
    @current-change="onChange"
    layout="prev, pager, next, jumper"
  />
</template>

<script setup>
const props = defineProps({
  currentPage: { type: Number, default: 1 },
  pageSize: { type: Number, default: 10 },
  total: { type: Number, required: true }
})
const emit = defineEmits(['update:currentPage'])

function onChange (page) {
  emit('update:currentPage', page)
}
</script>

<style scoped>
/* 可根据项目主题覆盖分页器样式 */
</style>
