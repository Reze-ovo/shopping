<template>
  <div class="carousel-wrapper">
    <el-carousel
      arrow="always"
      :height="height"
      trigger="click"
      class="banner-carousel"
    >
      <el-carousel-item
        v-for="(img, idx) in images"
        :key="idx"
      >
        <img :src="img" class="banner-img" />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import banner1 from '@/assets/banners/banner1.png'
import banner2 from '@/assets/banners/banner2.png'
import banner3 from '@/assets/banners/banner3.png'
import banner4 from '@/assets/banners/banner4.png'

const images = [banner1, banner2, banner3, banner4]
// 固定高度，你可以根据设计改成 300px、150px 等
const height = ref('350px')
</script>

<style scoped>
/* 外层容器：限制最大宽度并水平居中 */
.carousel-wrapper {
  width: 100%;
  max-width: 1000px;    /* 最大宽度 */
  margin: 0 auto;      /* 居中 */
}

/* 让 el-carousel 填满外层容器 */
.banner-carousel {
  width: 100%;
}

/* 图片在固定高度下完整显示 */
.banner-img {
  width: 100%;
  height: 100%;
  object-fit: contain; /* 或 cover */
  background: #000;    /* 当使用 contain 时，补白区的背景色 */
}
</style>
