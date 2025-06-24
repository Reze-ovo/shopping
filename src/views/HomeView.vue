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
  min-height: 100vh;
  background: linear-gradient(135deg, var(--bg-secondary) 0%, #f0f4f8 100%);
  padding-top: var(--space-xl);
  padding-bottom: 100px; /* 给底部导航留足空间 */
}

/* 搜索框 */
.search-bar-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: var(--space-xl);
  padding: 0 var(--space-lg);
}

.search-bar {
  width: 100%;
  max-width: 600px;
}

.search-bar :deep(.el-input__wrapper) {
  background: var(--bg-primary);
  border-radius: var(--radius-3xl);
  box-shadow: var(--shadow-inner), var(--shadow-md);
  border: 2px solid transparent;
  transition: all var(--transition-normal);
  padding: var(--space-md) var(--space-xl);
}

.search-bar :deep(.el-input__wrapper):hover {
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-color);
}

.search-bar :deep(.el-input__wrapper.is-focus) {
  box-shadow: var(--shadow-xl);
  border-color: var(--primary-color);
  background: var(--bg-primary);
}

.search-bar :deep(.el-input__inner) {
  font-size: var(--font-size-base);
  color: var(--text-primary);
  font-weight: var(--font-weight-medium);
}

.search-bar :deep(.el-input__inner)::placeholder {
  color: var(--text-muted);
  font-weight: var(--font-weight-normal);
}

.search-bar :deep(.el-input__prefix) {
  color: var(--primary-color);
  font-size: var(--font-size-lg);
}

/* 分类菜单 */
.category-bar {
  display: flex;
  justify-content: center;
  margin: var(--space-xl) 0;
  padding: 0 var(--space-lg);
}

.category-menu {
  width: 100%;
  max-width: 600px;
  background: var(--bg-primary);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-light);
  overflow: hidden;
}

.category-menu :deep(.el-menu-item) {
  margin: 0;
  padding: var(--space-md) var(--space-lg);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
  transition: all var(--transition-normal);
  position: relative;
  border-radius: 0;
  border: none;
}

.category-menu :deep(.el-menu-item):hover {
  background: var(--bg-secondary);
  color: var(--primary-color);
  transform: translateY(-2px);
}

.category-menu :deep(.el-menu-item.is-active) {
  background: var(--primary-gradient);
  color: var(--text-inverse);
  font-weight: var(--font-weight-semibold);
}

.category-menu :deep(.el-menu-item.is-active)::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 3px;
  background: var(--text-inverse);
  border-radius: var(--radius-full);
}

/* 卡片点击区域 */
.card-wrapper {
  cursor: pointer;
  margin-bottom: var(--space-xl);
}

/* 商品列表 & 分页 */
.product-list {
  margin: var(--space-3xl) 0;
  padding: 0 var(--space-lg);
}

.product-list :deep(.el-col) {
  margin-bottom: var(--space-xl);
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin: var(--space-3xl) 0;
  padding: 0 var(--space-lg);
}

.pagination-wrapper :deep(.el-pagination) {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-md);
  box-shadow: var(--shadow-md);
}

.pagination-wrapper :deep(.el-pager li) {
  background: transparent;
  border-radius: var(--radius-md);
  margin: 0 var(--space-xs);
  transition: all var(--transition-normal);
}

.pagination-wrapper :deep(.el-pager li:hover) {
  background: var(--bg-secondary);
  transform: translateY(-2px);
}

.pagination-wrapper :deep(.el-pager li.is-active) {
  background: var(--primary-gradient);
  color: var(--text-inverse);
  font-weight: var(--font-weight-semibold);
}

/* 轮播图区域美化 */
.home-container :deep(.el-carousel) {
  margin: var(--space-xl) var(--space-lg);
  border-radius: var(--radius-2xl);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.home-container :deep(.el-carousel__item) {
  background: var(--primary-gradient);
}

/* 响应式网格优化 */
@media (max-width: 768px) {
  .product-list {
    padding: 0 var(--space-md);
  }

  .product-list :deep(.el-col) {
    margin-bottom: var(--space-lg);
  }
}

@media (max-width: 480px) {
  .home-container {
    padding-top: var(--space-lg);
  }

  .product-list {
    padding: 0 var(--space-sm);
  }
}
</style>
