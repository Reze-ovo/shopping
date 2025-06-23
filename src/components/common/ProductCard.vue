<template>
  <el-card class="card" shadow="hover">
    <img :src="product.image" class="card-img" />
    <div class="card-body">
      <h3 class="card-title">{{ product.title }}</h3>
      <p class="card-price">¥{{ product.price.toFixed(2) }}</p>
    </div>
  </el-card>
</template>

<script setup>
const props = defineProps({
  product: { type: Object, required: true }
})
// 不再在这里做任何路由跳转
</script>

<style scoped>
.card {
  cursor: pointer; /* 鼠标移上去仍显示小手，但点击逻辑已移到父组件 */
}
.card-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}
.card-body {
  text-align: center;
  padding: 12px 0;
}
.card-title {
  font-size: 1rem;
  margin-bottom: 8px;
}
.card-price {
  color: #f56c6c;
  font-weight: bold;
}
</style>
