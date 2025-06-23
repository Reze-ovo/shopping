<template>
  <nav class="bottom-nav">
    <div
      class="nav-item"
      :class="{ active: activeMenu === 'home' }"
      @click="go('home')"
    >
      <el-icon><House /></el-icon>
      <span>首页</span>
    </div>
    <div
      class="nav-item"
      :class="{ active: activeMenu === 'cart' }"
      @click="go('cart')"
    >
      <el-icon><ShoppingCart /></el-icon>
      <span>购物车</span>
    </div>
    <div
      class="nav-item"
      :class="{ active: activeMenu === 'profile' }"
      @click="go('profile')"
    >
      <el-icon><User /></el-icon>
      <span>我的</span>
    </div>
  </nav>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import { House, ShoppingCart, User } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const activeMenu = ref(route.name)

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
  display: flex;
  background: #fff;
  border-top: 1px solid #ebeef5;
  height: 56px;
  z-index: 1000;
}
.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #606266;
  cursor: pointer;
}
.nav-item.is-active,
.nav-item.active {
  color: #409eff;
}
.nav-item el-icon {
  font-size: 20px;
  margin-bottom: 2px;
}
</style>
