<!-- src/views/ProfileView.vue -->
<template>
  <div class="profile-container">
    <!-- 未登录状态 -->
    <div v-if="!isLoggedIn" class="login-prompt">
      <div class="prompt-card">
        <div class="prompt-icon">
          <Icon icon="mdi:account-circle-outline" />
        </div>
        <h2 class="prompt-title">欢迎来到个人中心</h2>
        <p class="prompt-desc">登录后可查看个人信息、收藏商品和历史订单</p>
        <div class="prompt-actions">
          <button class="login-btn" @click="goLogin">
            <Icon icon="mdi:login" />
            立即登录
          </button>
          <button class="register-btn" @click="goRegister">
            <Icon icon="mdi:account-plus" />
            注册账号
          </button>
        </div>
      </div>
    </div>

    <!-- 已登录状态 -->
    <div v-else class="profile-content">
      <!-- 用户信息卡片 -->
      <div class="user-card">
        <div class="user-background"></div>
        <div class="user-info">
          <div class="avatar-container">
            <img :src="profile.avatar" :alt="profile.name" class="user-avatar" />
            <div class="avatar-badge">
              <Icon icon="mdi:check-circle" />
            </div>
          </div>
          <div class="user-details">
            <h2 class="user-name">{{ profile.name }}</h2>
            <p class="user-email">{{ profile.email }}</p>
            <div class="user-stats">
              <div class="stat-item">
                <span class="stat-number">{{ orderCount }}</span>
                <span class="stat-label">订单</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ favoriteCount }}</span>
                <span class="stat-label">收藏</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ cartItemCount }}</span>
                <span class="stat-label">购物车</span>
              </div>
            </div>
          </div>
          <button class="logout-btn" @click="onLogout" title="退出登录">
            <Icon icon="mdi:logout" />
          </button>
        </div>
      </div>

      <!-- 功能菜单 -->
      <div class="menu-grid">
        <div class="menu-item" @click="goToFavorites">
          <div class="menu-icon favorites">
            <Icon icon="mdi:heart" />
          </div>
          <span class="menu-label">我的收藏</span>
          <span class="menu-count">{{ favoriteCount }}</span>
        </div>
        <div class="menu-item" @click="goToCart">
          <div class="menu-icon cart">
            <Icon icon="mdi:cart" />
          </div>
          <span class="menu-label">购物车</span>
          <span class="menu-count">{{ cartItemCount }}</span>
        </div>
        <div class="menu-item" @click="showOrderHistory">
          <div class="menu-icon orders">
            <Icon icon="mdi:clipboard-list" />
          </div>
          <span class="menu-label">历史订单</span>
          <span class="menu-count">{{ orderCount }}</span>
        </div>
        <div class="menu-item" @click="showSettings">
          <div class="menu-icon settings">
            <Icon icon="mdi:cog" />
          </div>
          <span class="menu-label">设置</span>
        </div>
      </div>

      <!-- 历史订单区域 -->
      <div class="orders-section" v-if="showOrders">
        <div class="section-header">
          <h3 class="section-title">
            <Icon icon="mdi:clipboard-list" />
            历史订单
          </h3>
          <button class="view-all-btn" @click="viewAllOrders">
            查看全部
            <Icon icon="mdi:arrow-right" />
          </button>
        </div>

        <div v-if="orders.length === 0" class="empty-orders">
          <div class="empty-icon">
            <Icon icon="mdi:clipboard-outline" />
          </div>
          <p class="empty-text">暂无订单记录</p>
          <button class="go-shopping-btn" @click="goShopping">
            <Icon icon="mdi:shopping" />
            去购物
          </button>
        </div>

        <div v-else class="orders-list">
          <div
            v-for="order in recentOrders"
            :key="order.id"
            class="order-card"
            @click="viewOrderDetail(order)"
          >
            <div class="order-header">
              <div class="order-info">
                <span class="order-id">订单 #{{ order.id }}</span>
                <span class="order-date">{{ formatDate(order.date) }}</span>
              </div>
              <div class="order-status">
                <span class="status-badge completed">已完成</span>
              </div>
            </div>
            <div class="order-content">
              <div class="order-summary">
                <Icon icon="mdi:package-variant" class="package-icon" />
                <span class="item-count">{{ getOrderItemCount(order) }} 件商品</span>
              </div>
              <div class="order-total">
                <span class="total-label">总计</span>
                <span class="total-amount">¥{{ order.total.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { Icon } from '@iconify/vue'
import { ElMessageBox } from 'element-plus'

const store = useStore()
const router = useRouter()
const toast = useToast()

// 响应式状态
const showOrders = ref(true)

// 计算属性
const isLoggedIn = computed(() => store.state.user.isLoggedIn)
const profile = computed(() => store.state.user.profile)
const orders = computed(() => store.state.user.orders)
const orderCount = computed(() => store.getters['user/orderCount'])
const favoriteCount = computed(() => store.getters['favorites/favoriteCount'])
const cartItemCount = computed(() => store.state.cart?.items?.length || 0)

// 最近订单（显示最新3条）
const recentOrders = computed(() => {
  return orders.value.slice(-3).reverse()
})

// 导航函数
const goLogin = () => {
  router.push({ name: 'login' })
}

const goRegister = () => {
  router.push({ name: 'register' })
}

const goToFavorites = () => {
  router.push({ name: 'favorites' })
}

const goToCart = () => {
  router.push({ name: 'cart' })
}

const goShopping = () => {
  router.push({ name: 'home' })
}

// 退出登录
const onLogout = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要退出登录吗？',
      '确认退出',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    store.dispatch('user/logout')
    toast.success('已退出登录')
    router.push({ name: 'home' })
  } catch {
    // 用户取消操作
  }
}

// 订单相关函数
const showOrderHistory = () => {
  showOrders.value = !showOrders.value
}

const viewAllOrders = () => {
  // 可以跳转到专门的订单列表页
  toast.info('订单列表页面开发中...')
}

const viewOrderDetail = (order) => {
  // 跳转到订单详情页
  router.push({
    name: 'order-detail',
    params: { id: order.id }
  })
}

const showSettings = () => {
  router.push({ name: 'settings' })
}

// 工具函数
const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now - date
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString()
}

const getOrderItemCount = (order) => {
  // 假设每个订单包含1-3件商品
  return Math.floor(Math.random() * 3) + 1
}
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--bg-secondary) 0%, #f0f4f8 100%);
  padding: var(--space-xl) var(--space-lg);
  padding-bottom: 100px;
}

/* 未登录状态样式 */
.login-prompt {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.prompt-card {
  background: var(--bg-primary);
  border-radius: var(--radius-3xl);
  padding: var(--space-6xl) var(--space-4xl);
  text-align: center;
  box-shadow: var(--shadow-2xl);
  max-width: 500px;
  width: 100%;
}

.prompt-icon {
  font-size: 80px;
  color: var(--primary-color);
  margin-bottom: var(--space-xl);
}

.prompt-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin: 0 0 var(--space-lg) 0;
}

.prompt-desc {
  color: var(--text-secondary);
  font-size: var(--font-size-lg);
  margin: 0 0 var(--space-3xl) 0;
  line-height: var(--line-height-relaxed);
}

.prompt-actions {
  display: flex;
  gap: var(--space-lg);
  justify-content: center;
}

.login-btn, .register-btn {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-lg) var(--space-3xl);
  border: none;
  border-radius: var(--radius-xl);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.login-btn {
  background: var(--primary-gradient);
  color: var(--text-inverse);
}

.register-btn {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 2px solid var(--border-light);
}

.login-btn:hover, .register-btn:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

/* 已登录状态样式 */
.profile-content {
  max-width: 1200px;
  margin: 0 auto;
}

/* 用户信息卡片 */
.user-card {
  position: relative;
  background: var(--bg-primary);
  border-radius: var(--radius-3xl);
  overflow: hidden;
  box-shadow: var(--shadow-xl);
  margin-bottom: var(--space-3xl);
}

.user-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 120px;
  background: var(--primary-gradient);
  opacity: 0.1;
}

.user-info {
  position: relative;
  display: flex;
  align-items: center;
  padding: var(--space-3xl);
  gap: var(--space-xl);
}

.avatar-container {
  position: relative;
}

.user-avatar {
  width: 100px;
  height: 100px;
  border-radius: var(--radius-full);
  border: 4px solid var(--bg-primary);
  box-shadow: var(--shadow-lg);
  object-fit: cover;
}

.avatar-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 32px;
  height: 32px;
  background: var(--success-color);
  color: var(--text-inverse);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid var(--bg-primary);
  font-size: 16px;
}

.user-details {
  flex: 1;
}

.user-name {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin: 0 0 var(--space-sm) 0;
}

.user-email {
  color: var(--text-secondary);
  font-size: var(--font-size-lg);
  margin: 0 0 var(--space-xl) 0;
}

.user-stats {
  display: flex;
  gap: var(--space-3xl);
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--primary-color);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
}

.logout-btn {
  width: 48px;
  height: 48px;
  background: var(--error-gradient);
  color: var(--text-inverse);
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.logout-btn:hover {
  transform: scale(1.1);
  box-shadow: var(--shadow-lg);
}

/* 功能菜单网格 */
.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-xl);
  margin-bottom: var(--space-3xl);
}

.menu-item {
  background: var(--bg-primary);
  border-radius: var(--radius-2xl);
  padding: var(--space-3xl);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
}

.menu-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--primary-gradient);
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.menu-item:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-2xl);
}

.menu-item:hover::before {
  opacity: 0.05;
}

.menu-icon {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-2xl);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-bottom: var(--space-lg);
  position: relative;
  z-index: 1;
}

.menu-icon.favorites {
  background: var(--error-gradient);
  color: var(--text-inverse);
}

.menu-icon.cart {
  background: var(--warning-gradient);
  color: var(--text-inverse);
}

.menu-icon.orders {
  background: var(--success-gradient);
  color: var(--text-inverse);
}

.menu-icon.settings {
  background: var(--primary-gradient);
  color: var(--text-inverse);
}

.menu-label {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
  position: relative;
  z-index: 1;
}

.menu-count {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  background: var(--bg-tertiary);
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-full);
  position: relative;
  z-index: 1;
}

/* 订单区域样式 */
.orders-section {
  background: var(--bg-primary);
  border-radius: var(--radius-2xl);
  padding: var(--space-3xl);
  box-shadow: var(--shadow-md);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3xl);
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin: 0;
}

.view-all-btn {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  background: var(--primary-gradient);
  color: var(--text-inverse);
  border: none;
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-lg);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.view-all-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* 空订单状态 */
.empty-orders {
  text-align: center;
  padding: var(--space-6xl) var(--space-xl);
}

.empty-icon {
  font-size: 64px;
  color: var(--text-muted);
  margin-bottom: var(--space-xl);
}

.empty-text {
  color: var(--text-secondary);
  font-size: var(--font-size-lg);
  margin-bottom: var(--space-3xl);
}

.go-shopping-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  background: var(--primary-gradient);
  color: var(--text-inverse);
  border: none;
  padding: var(--space-lg) var(--space-3xl);
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

/* 订单列表 */
.orders-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.order-card {
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  cursor: pointer;
  transition: all var(--transition-normal);
  border: 2px solid transparent;
}

.order-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-color);
  background: var(--bg-primary);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.order-id {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.order-date {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.order-status {
  display: flex;
  align-items: center;
}

.status-badge {
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
}

.status-badge.completed {
  background: var(--success-gradient);
  color: var(--text-inverse);
}

.order-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-summary {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--text-secondary);
}

.package-icon {
  font-size: 20px;
  color: var(--primary-color);
}

.item-count {
  font-size: var(--font-size-base);
}

.order-total {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-xs);
}

.total-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.total-amount {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .profile-container {
    padding: var(--space-lg) var(--space-md);
  }

  .user-info {
    flex-direction: column;
    text-align: center;
    gap: var(--space-lg);
  }

  .user-stats {
    justify-content: center;
  }

  .menu-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-lg);
  }

  .prompt-actions {
    flex-direction: column;
  }

  .section-header {
    flex-direction: column;
    gap: var(--space-lg);
    text-align: center;
  }
}

@media (max-width: 480px) {
  .menu-grid {
    grid-template-columns: 1fr;
  }

  .user-avatar {
    width: 80px;
    height: 80px;
  }

  .user-name {
    font-size: var(--font-size-2xl);
  }

  .order-content {
    flex-direction: column;
    gap: var(--space-md);
    align-items: flex-start;
  }

  .order-total {
    align-items: flex-start;
  }
}
</style>
