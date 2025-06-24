<template>
  <div class="app-container">
    <!-- 顶部固定标题 -->
    <header class="app-header">Shopping Mall</header>

    <!-- 主体区域：带动画的 router-view -->
    <main class="app-main">
      <router-view v-slot="{ Component, route }">
        <transition
          :name="getTransitionName(route)"
          mode="out-in"
          appear
        >
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </main>

    <!-- 底部导航：只渲染 BottomNav -->
    <BottomNav />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import BottomNav from '@/components/common/BottomNav.vue'

const route = useRoute()

// 根据路由决定过渡动画
const getTransitionName = (currentRoute) => {
  // 定义页面层级，用于决定动画方向
  const pageDepth = {
    home: 1,
    cart: 2,
    profile: 3,
    favorites: 3,
    'product-detail': 4,
    checkout: 4,
    login: 5,
    register: 5
  }

  const currentDepth = pageDepth[currentRoute.name] || 1
  const previousDepth = pageDepth[route.name] || 1

  if (currentDepth > previousDepth) {
    return 'slide-left'
  } else if (currentDepth < previousDepth) {
    return 'slide-right'
  } else {
    return 'fade'
  }
}
</script>

<style>
/* 整个应用容器，底部空间留出 BottomNav 高度 */
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-bottom: 80px; /* 根据新的 BottomNav 高度调整 */
  background: var(--bg-secondary);
}

/* 顶部标题栏 */
.app-header {
  position: sticky;
  top: 0;
  height: var(--header-height);
  line-height: var(--header-height);
  text-align: center;
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  z-index: var(--z-sticky);
  color: var(--text-primary);
  box-shadow: var(--shadow-sm);
}

.app-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--primary-gradient);
  opacity: 0.05;
  z-index: -1;
}

/* 主体区域 */
.app-main {
  flex: 1;
  box-sizing: border-box;
  position: relative;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .app-header {
    font-size: var(--font-size-xl);
    padding: 0 var(--space-lg);
  }
}

@media (max-width: 480px) {
  .app-container {
    padding-bottom: 70px;
  }

  .app-header {
    font-size: var(--font-size-lg);
    padding: 0 var(--space-md);
  }
}

/* 页面切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slide-left-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-right-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* 页面容器动画优化 */
.app-main {
  position: relative;
  overflow: hidden;
}

.app-main > * {
  width: 100%;
}
</style>
