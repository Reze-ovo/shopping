<template>
  <div class="app-container">
    <!-- 顶部固定标题 -->
    <header class="app-header">Shopping Mall</header>

    <!-- 主体区域：仅此一个 router-view -->
    <main class="app-main">
      <router-view />
    </main>

    <!-- 底部导航：只渲染 BottomNav -->
    <BottomNav />
  </div>
</template>

<script setup>
import BottomNav from '@/components/common/BottomNav.vue'
</script>

<style>
/* 整个应用容器，底部空间留出 BottomNav 高度 */
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-bottom: 56px; /* 根据 BottomNav 定义的高度来留 */
}

/* 顶部标题栏 */
.app-header {
  position: sticky;
  top: 0;
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  background: #fff;
  border-bottom: 1px solid #ebeef5;
  z-index: 100;
}

/* 主体区域 */
.app-main {
  flex: 1;
  padding: 16px;
  box-sizing: border-box;
}
</style>
