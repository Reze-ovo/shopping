<template>
  <div class="favorites-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">
        <Icon icon="mdi:heart" class="title-icon" />
        我的收藏
        <span class="count-badge">{{ favoriteCount }}</span>
      </h1>
      <button
        v-if="favoriteCount > 0"
        class="clear-btn"
        @click="clearAllFavorites"
      >
        <Icon icon="mdi:delete-outline" />
        清空收藏
      </button>
    </div>

    <!-- 空状态 -->
    <div v-if="favoriteCount === 0" class="empty-state">
      <div class="empty-icon">
        <Icon icon="mdi:heart-broken-outline" />
      </div>
      <h3 class="empty-title">还没有收藏任何商品</h3>
      <p class="empty-desc">去首页看看有什么心仪的商品吧</p>
      <button class="go-shopping-btn" @click="goHome">
        <Icon icon="mdi:shopping-outline" />
        去逛逛
      </button>
    </div>

    <!-- 收藏列表 -->
    <div v-else class="favorites-grid">
      <div
        v-for="item in favoriteList"
        :key="item.id"
        class="favorite-item"
        @click="goToProduct(item)"
      >
        <div class="item-image">
          <img v-lazy="item.image" :alt="item.title" />
          <button
            class="remove-btn"
            @click.stop="removeFavorite(item.id)"
            title="取消收藏"
          >
            <Icon icon="mdi:close" />
          </button>
        </div>
        <div class="item-info">
          <h3 class="item-title">{{ item.title }}</h3>
          <p class="item-spec">{{ item.spec }}</p>
          <div class="item-footer">
            <span class="item-price">¥{{ item.price.toFixed(2) }}</span>
            <span class="added-time">{{ formatTime(item.addedAt) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { Icon } from '@iconify/vue'
import { ElMessageBox } from 'element-plus'

const store = useStore()
const router = useRouter()
const toast = useToast()

// 计算属性
const favoriteList = computed(() => store.getters['favorites/favoriteList'])
const favoriteCount = computed(() => store.getters['favorites/favoriteCount'])

// 格式化时间
const formatTime = (timeStr) => {
  const date = new Date(timeStr)
  const now = new Date()
  const diff = now - date
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString()
}

// 移除收藏
const removeFavorite = async (productId) => {
  try {
    await ElMessageBox.confirm(
      '确定要取消收藏这个商品吗？',
      '确认操作',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    store.dispatch('favorites/removeFavorite', productId)
    toast.success('已取消收藏')
  } catch {
    // 用户取消操作
  }
}

// 清空所有收藏
const clearAllFavorites = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要清空所有收藏吗？此操作不可恢复。',
      '确认清空',
      {
        confirmButtonText: '确定清空',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    store.dispatch('favorites/clearFavorites')
    toast.success('已清空所有收藏')
  } catch {
    // 用户取消操作
  }
}

// 跳转到商品详情
const goToProduct = (item) => {
  router.push({
    name: 'product-detail',
    params: {
      category: item.category,
      id: item.id
    }
  })
}

// 回到首页
const goHome = () => {
  router.push({ name: 'home' })
}
</script>

<style scoped>
.favorites-container {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--bg-secondary) 0%, #f0f4f8 100%);
  padding: var(--space-xl) var(--space-lg);
  padding-bottom: 100px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3xl);
  padding: var(--space-xl);
  background: var(--bg-primary);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-md);
}

.page-title {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin: 0;
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
}

.title-icon {
  font-size: 32px;
  color: var(--error-color);
}

.count-badge {
  background: var(--primary-gradient);
  color: var(--text-inverse);
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
}

.clear-btn {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-lg);
  background: var(--error-gradient);
  color: var(--text-inverse);
  border: none;
  border-radius: var(--radius-lg);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.clear-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* 空状态样式 */
.empty-state {
  text-align: center;
  padding: var(--space-6xl) var(--space-xl);
  background: var(--bg-primary);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-md);
}

.empty-icon {
  font-size: 80px;
  color: var(--text-muted);
  margin-bottom: var(--space-xl);
}

.empty-title {
  font-size: var(--font-size-2xl);
  color: var(--text-primary);
  margin-bottom: var(--space-md);
}

.empty-desc {
  color: var(--text-secondary);
  margin-bottom: var(--space-3xl);
}

.go-shopping-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-lg) var(--space-3xl);
  background: var(--primary-gradient);
  color: var(--text-inverse);
  border: none;
  border-radius: var(--radius-xl);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.go-shopping-btn:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

/* 收藏网格 */
.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-xl);
}

.favorite-item {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
  cursor: pointer;
  position: relative;
}

.favorite-item:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-2xl);
}

.item-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.favorite-item:hover .item-image img {
  transform: scale(1.1);
}

.remove-btn {
  position: absolute;
  top: var(--space-md);
  right: var(--space-md);
  width: 32px;
  height: 32px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: all var(--transition-normal);
}

.favorite-item:hover .remove-btn {
  opacity: 1;
}

.remove-btn:hover {
  background: var(--error-color);
  transform: scale(1.1);
}

.item-info {
  padding: var(--space-lg);
}

.item-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--space-sm) 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-spec {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  margin: 0 0 var(--space-md) 0;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-price {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.added-time {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .favorites-container {
    padding: var(--space-lg) var(--space-md);
  }

  .page-header {
    flex-direction: column;
    gap: var(--space-lg);
    text-align: center;
  }

  .favorites-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: var(--space-lg);
  }
}

@media (max-width: 480px) {
  .favorites-grid {
    grid-template-columns: 1fr;
  }

  .page-title {
    font-size: var(--font-size-2xl);
  }
}
</style>
