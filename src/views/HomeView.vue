<template>
  <div class="home-container">
    <!-- 搜索框 -->
    <div class="search-bar-wrapper">
      <el-input
        v-model="searchTerm"
        placeholder="搜索商品名称"
        clearable
        @clear="onClearSearch"
        prefix-icon="el-icon-search"
        class="search-bar"
      />
    </div>

    <!-- 轮播图 -->
    <BannerCarousel />

    <!-- 分类菜单 -->
    <div class="category-bar">
      <el-menu
        mode="horizontal"
        :default-active="activeCategory"
        @select="handleCategorySelect"
        class="category-menu"
        unique-opened
      >
        <el-menu-item index="all">全部</el-menu-item>
        <el-menu-item index="phone">手机</el-menu-item>
        <el-menu-item index="computer">电脑</el-menu-item>
        <el-menu-item index="appliance">家电</el-menu-item>
        <el-menu-item index="clothing">服饰</el-menu-item>
      </el-menu>
    </div>

    <!-- 商品列表 -->
    <el-row :gutter="20" class="product-list">
      <el-col
        v-for="product in pagedProducts"
        :key="product.id"
        :xs="24" :sm="12" :md="8" :lg="6"
      >
        <!-- 统一在这里处理点击跳转 -->
        <div class="card-wrapper" @click="goDetail(product)">
          <ProductCard :product="product" />
        </div>
      </el-col>
    </el-row>

    <!-- 分页 -->
    <div class="pagination-wrapper">
      <PagiNation
        :total="filteredProducts.length"
        :page-size="pageSize"
        @update:currentPage="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import BannerCarousel from '@/components/common/BannerCarousel.vue'
import ProductCard from '@/components/common/ProductCard.vue'
import PagiNation from '@/components/common/PagiNation.vue'

import phoneProducts from '@/data/phone/products.js'
import computerProducts from '@/data/computer/products.js'
import applianceProducts from '@/data/appliance/products.js'
import clothingProducts from '@/data/clothing/products.js'

const router = useRouter()

// 搜索、分类、分页状态
const searchTerm = ref('')
const activeCategory = ref('all')
const currentPage = ref(1)
const pageSize = 8

// 合并所有产品数据
const allProducts = ref([
  ...phoneProducts,
  ...computerProducts,
  ...applianceProducts,
  ...clothingProducts
])

// 过滤后列表
const filteredProducts = computed(() => {
  let list = allProducts.value
  if (activeCategory.value !== 'all') {
    list = list.filter(p => p.category === activeCategory.value)
  }
  if (searchTerm.value.trim()) {
    const kw = searchTerm.value.trim().toLowerCase()
    list = list.filter(p => p.title.toLowerCase().includes(kw))
  }
  return list
})

// 分页数据
const pagedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredProducts.value.slice(start, start + pageSize)
})

// 跳转详情
function goDetail (product) {
  router.push({
    name: 'product-detail',
    params: {
      category: product.category,
      id: product.id
    }
  })
}

// 分类切换
function handleCategorySelect (cat) {
  activeCategory.value = cat
  currentPage.value = 1
}

// 分页回调
function handlePageChange (page) {
  currentPage.value = page
}

// 清空搜索
function onClearSearch () {
  searchTerm.value = ''
}
</script>

<style scoped>
.home-container {
  padding-top: 16px;
  padding-bottom: 80px; /* 给底部导航留足空间 */
}

/* 搜索框 */
.search-bar-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}
.search-bar {
  width: 80%;
  max-width: 600px;
}

/* 分类菜单 */
.category-bar {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}
.category-menu {
  width: 80%;
  max-width: 600px;
  background: #fff;
  border-radius: 4px;
}
.category-menu .el-menu-item {
  margin: 0 12px;
}

/* 卡片点击区域 */
.card-wrapper {
  cursor: pointer;
}
.card-wrapper:hover {
  transform: translateY(-4px);
  transition: transform .2s;
}

/* 商品列表 & 分页 */
.product-list {
  margin-bottom: 20px;
}
.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
</style>
