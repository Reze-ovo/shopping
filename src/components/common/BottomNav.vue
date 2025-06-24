<template>
  <nav class="bottom-nav">
    <div class="nav-background"></div>
    <div
      class="nav-item"
      :class="{ active: activeMenu === 'home' }"
      @click="go('home')"
    >
      <div class="nav-icon-container">
        <el-icon class="nav-icon"><House /></el-icon>
        <div class="nav-indicator" v-if="activeMenu === 'home'"></div>
      </div>
      <span class="nav-label">首页</span>
    </div>
    <div
      class="nav-item"
      :class="{ active: activeMenu === 'favorites' }"
      @click="go('favorites')"
    >
      <div class="nav-icon-container">
        <Icon icon="mdi:heart" class="nav-icon" />
        <div class="favorite-badge" v-if="favoriteCount > 0">{{ favoriteCount }}</div>
        <div class="nav-indicator" v-if="activeMenu === 'favorites'"></div>
      </div>
      <span class="nav-label">收藏</span>
    </div>
    <div
      class="nav-item"
      :class="{ active: activeMenu === 'cart' }"
      @click="go('cart')"
    >
      <div class="nav-icon-container">
        <el-icon class="nav-icon"><ShoppingCart /></el-icon>
        <div class="cart-badge" v-if="cartItemCount > 0">{{ cartItemCount }}</div>
        <div class="nav-indicator" v-if="activeMenu === 'cart'"></div>
      </div>
      <span class="nav-label">购物车</span>
    </div>
    <div
      class="nav-item"
      :class="{ active: activeMenu === 'profile' }"
      @click="go('profile')"
    >
      <div class="nav-icon-container">
        <el-icon class="nav-icon"><User /></el-icon>
        <div class="nav-indicator" v-if="activeMenu === 'profile'"></div>
      </div>
      <span class="nav-label">我的</span>
    </div>
  </nav>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, watch, computed } from 'vue'
import { useStore } from 'vuex'
import { House, ShoppingCart, User } from '@element-plus/icons-vue'
import { Icon } from '@iconify/vue'

const router = useRouter()
const route = useRoute()
const store = useStore()
const activeMenu = ref(route.name)

// 计算购物车商品数量
const cartItemCount = computed(() => {
  return store.state.cart?.items?.length || 0
})

// 计算收藏商品数量
const favoriteCount = computed(() => {
  return store.getters['favorites/favoriteCount'] || 0
})

watch(
  () => route.name,
  (n) => {
    activeMenu.value = n
  }
)

function go (name) {
  router.push({ name })
}
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 70px;
  display: flex;
  z-index: var(--z-fixed);
  padding: var(--space-sm) var(--space-lg);
  box-sizing: border-box;
}

.nav-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  z-index: 1;
  transition: all var(--transition-normal);
  border-radius: var(--radius-lg);
  padding: var(--space-xs);
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.nav-icon-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-xs);
}

.nav-icon {
  font-size: 24px;
  color: var(--text-secondary);
  transition: all var(--transition-normal);
}

.nav-item.active .nav-icon {
  color: var(--primary-color);
  transform: scale(1.1);
}

.nav-label {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-normal);
}

.nav-item.active .nav-label {
  color: var(--primary-color);
  font-weight: var(--font-weight-semibold);
}

.nav-indicator {
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  background: var(--primary-gradient);
  border-radius: var(--radius-full);
  animation: pulse 2s infinite;
}

.cart-badge, .favorite-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  min-width: 18px;
  height: 18px;
  background: var(--error-gradient);
  color: var(--text-inverse);
  border-radius: var(--radius-full);
  font-size: 10px;
  font-weight: var(--font-weight-bold);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  box-shadow: var(--shadow-sm);
  animation: pulse 1.5s infinite;
}

.favorite-badge {
  background: var(--accent-gradient);
}

/* 活跃状态的特殊效果 */
.nav-item.active {
  position: relative;
}

.nav-item.active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--primary-gradient);
  opacity: 0.1;
  border-radius: var(--radius-lg);
}

/* 点击动画 */
.nav-item:active {
  transform: scale(0.95);
}

.nav-item:active .nav-icon {
  transform: scale(1.05);
}

/* 响应式设计 */
@media (max-width: 480px) {
  .bottom-nav {
    height: 60px;
    padding: var(--space-xs) var(--space-md);
  }

  .nav-icon {
    font-size: 20px;
  }

  .nav-label {
    font-size: 10px;
  }
}

/* 安全区域适配 */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .bottom-nav {
    padding-bottom: calc(var(--space-sm) + env(safe-area-inset-bottom));
  }
}
</style>
