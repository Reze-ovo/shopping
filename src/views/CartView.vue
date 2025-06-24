<!-- src/views/CartView.vue -->
<template>
  <div class="cart-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">
        <Icon icon="mdi:cart" class="title-icon" />
        购物车
        <span class="item-count" v-if="hasItems">({{ items.length }})</span>
      </h1>
      <div class="header-actions" v-if="hasItems">
        <button class="clear-btn" @click="onClear">
          <Icon icon="mdi:delete-outline" />
          清空
        </button>
      </div>
    </div>

    <!-- 购物车内容 -->
    <div class="cart-content">
      <!-- 空状态 -->
      <div v-if="!hasItems" class="empty-state">
        <div class="empty-animation">
          <Icon icon="mdi:cart-outline" class="empty-icon" />
          <div class="empty-waves">
            <div class="wave wave-1"></div>
            <div class="wave wave-2"></div>
            <div class="wave wave-3"></div>
          </div>
        </div>
        <h3 class="empty-title">购物车空空如也</h3>
        <p class="empty-desc">快去挑选心仪的商品吧</p>
        <button class="go-shopping-btn" @click="goShopping">
          <Icon icon="mdi:shopping" />
          去购物
        </button>
      </div>

      <!-- 商品列表 -->
      <div v-else class="cart-items">
        <div
          v-for="(item, index) in items"
          :key="`${item.id}-${item.spec}`"
          class="cart-item"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="item-image">
            <img :src="getProductImage(item)" :alt="item.title" />
          </div>

          <div class="item-info">
            <h3 class="item-title">{{ item.title }}</h3>
            <p class="item-spec">{{ item.spec }}</p>
            <div class="item-price">
              <span class="price-label">单价</span>
              <span class="price-value">¥{{ item.price.toFixed(2) }}</span>
            </div>
          </div>

          <div class="item-controls">
            <div class="quantity-control">
              <button
                class="qty-btn minus"
                @click="decreaseQty(item)"
                :disabled="item.qty <= 1"
              >
                <Icon icon="mdi:minus" />
              </button>
              <span class="qty-display">{{ item.qty }}</span>
              <button class="qty-btn plus" @click="increaseQty(item)">
                <Icon icon="mdi:plus" />
              </button>
            </div>

            <div class="item-subtotal">
              <span class="subtotal-label">小计</span>
              <span class="subtotal-value">¥{{ (item.price * item.qty).toFixed(2) }}</span>
            </div>

            <button class="remove-btn" @click="onRemove(item.id)" title="删除商品">
              <Icon icon="mdi:close" />
            </button>
          </div>
        </div>
      </div>

      <!-- 底部结算区域 -->
      <div v-if="hasItems" class="checkout-section">
        <div class="price-summary">
          <div class="summary-row">
            <span class="summary-label">商品总价</span>
            <span class="summary-value">¥{{ totalPrice.toFixed(2) }}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">运费</span>
            <span class="summary-value free">免费</span>
          </div>
          <div class="summary-row total">
            <span class="summary-label">合计</span>
            <span class="summary-value">¥{{ totalPrice.toFixed(2) }}</span>
          </div>
        </div>

        <div class="checkout-actions">
          <button class="continue-shopping-btn" @click="goShopping">
            <Icon icon="mdi:arrow-left" />
            继续购物
          </button>
          <button class="checkout-btn" @click="onCheckout">
            <Icon icon="mdi:credit-card" />
            立即结算 ({{ items.length }})
          </button>
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
const items = computed(() => store.state.cart.items)
const hasItems = computed(() => items.value.length > 0)
const totalPrice = computed(() =>
  items.value.reduce((sum, it) => sum + it.qty * it.price, 0)
)

// 获取商品图片（模拟）
const getProductImage = (item) => {
  // 这里可以根据商品ID或类别返回对应的图片
  return 'https://via.placeholder.com/80x80?text=' + encodeURIComponent(item.title.substring(0, 2))
}

// 清空购物车
const onClear = async () => {
  if (!hasItems.value) return
  try {
    await ElMessageBox.confirm(
      '确定要清空购物车吗？此操作不可撤销。',
      '清空确认',
      {
        confirmButtonText: '确定清空',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    store.dispatch('cart/clearCart')
    toast.success('购物车已清空', { icon: '🗑️' })
  } catch {
    // 取消操作
  }
}

// 增加数量
const increaseQty = (item) => {
  const updatedItem = { ...item, qty: item.qty + 1 }
  updateCartItem(item, updatedItem)
  toast.success(`已增加 ${item.title} 的数量`)
}

// 减少数量
const decreaseQty = (item) => {
  if (item.qty <= 1) return
  const updatedItem = { ...item, qty: item.qty - 1 }
  updateCartItem(item, updatedItem)
  toast.info(`已减少 ${item.title} 的数量`)
}

// 更新购物车商品
const updateCartItem = (oldItem, newItem) => {
  const updated = items.value.map(i =>
    i.id === oldItem.id && i.spec === oldItem.spec ? newItem : i
  )
  store.dispatch('cart/clearCart')
  updated.forEach(i => store.dispatch('cart/addToCart', i))
}

// 删除商品
const onRemove = async (id) => {
  try {
    await ElMessageBox.confirm(
      '确定要从购物车删除该商品吗？',
      '删除确认',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    const remaining = items.value.filter(i => i.id !== id)
    store.dispatch('cart/clearCart')
    remaining.forEach(i => store.dispatch('cart/addToCart', i))
    toast.success('已删除商品', { icon: '🗑️' })
  } catch {
    // 取消操作
  }
}

// 前往结算
const onCheckout = () => {
  router.push({ name: 'checkout' })
}

// 继续购物
const goShopping = () => {
  router.push({ name: 'home' })
}
</script>

<style scoped>
.cart-container {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--bg-secondary) 0%, #f0f4f8 100%);
  padding: var(--space-xl) var(--space-lg);
  padding-bottom: 100px;
}

/* 页面标题 */
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
  color: var(--primary-color);
}

.item-count {
  background: var(--primary-gradient);
  color: var(--text-inverse);
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
}

.header-actions {
  display: flex;
  gap: var(--space-md);
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

/* 购物车内容 */
.cart-content {
  max-width: 1000px;
  margin: 0 auto;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: var(--space-6xl);
  background: var(--bg-primary);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-md);
}

.empty-animation {
  position: relative;
  display: inline-block;
  margin-bottom: var(--space-3xl);
}

.empty-icon {
  font-size: 120px;
  color: var(--text-muted);
  position: relative;
  z-index: 2;
}

.empty-waves {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}

.wave {
  position: absolute;
  border: 2px solid var(--primary-color);
  border-radius: var(--radius-full);
  opacity: 0;
  animation: wave-animation 2s infinite;
}

.wave-1 {
  width: 100px;
  height: 100px;
  margin: -50px 0 0 -50px;
  animation-delay: 0s;
}

.wave-2 {
  width: 140px;
  height: 140px;
  margin: -70px 0 0 -70px;
  animation-delay: 0.5s;
}

.wave-3 {
  width: 180px;
  height: 180px;
  margin: -90px 0 0 -90px;
  animation-delay: 1s;
}

@keyframes wave-animation {
  0% {
    opacity: 1;
    transform: scale(0);
  }
  100% {
    opacity: 0;
    transform: scale(1);
  }
}

.empty-title {
  font-size: var(--font-size-2xl);
  color: var(--text-primary);
  margin: 0 0 var(--space-md) 0;
}

.empty-desc {
  color: var(--text-secondary);
  margin: 0 0 var(--space-3xl) 0;
  font-size: var(--font-size-lg);
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

/* 商品列表 */
.cart-items {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
  margin-bottom: var(--space-3xl);
}

.cart-item {
  background: var(--bg-primary);
  border-radius: var(--radius-2xl);
  padding: var(--space-xl);
  box-shadow: var(--shadow-md);
  display: flex;
  gap: var(--space-xl);
  transition: all var(--transition-normal);
  animation: slideInUp 0.6s ease-out;
  position: relative;
  overflow: hidden;
}

.cart-item::before {
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

.cart-item:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.cart-item:hover::before {
  opacity: 0.02;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 商品图片 */
.item-image {
  width: 100px;
  height: 100px;
  border-radius: var(--radius-xl);
  overflow: hidden;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-normal);
}

.cart-item:hover .item-image img {
  transform: scale(1.1);
}

/* 商品信息 */
.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  position: relative;
  z-index: 1;
}

.item-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0;
  line-height: var(--line-height-tight);
}

.item-spec {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  margin: 0;
  background: var(--bg-tertiary);
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-full);
  width: fit-content;
}

.item-price {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  margin-top: auto;
}

.price-label {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
}

.price-value {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--primary-color);
}

/* 商品控制区域 */
.item-controls {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  align-items: flex-end;
  position: relative;
  z-index: 1;
}

.quantity-control {
  display: flex;
  align-items: center;
  background: var(--bg-tertiary);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-inner);
}

.qty-btn {
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-normal);
  color: var(--text-primary);
  font-size: 16px;
}

.qty-btn:hover:not(:disabled) {
  background: var(--primary-color);
  color: var(--text-inverse);
}

.qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.qty-btn.minus:hover:not(:disabled) {
  background: var(--error-color);
}

.qty-btn.plus:hover:not(:disabled) {
  background: var(--success-color);
}

.qty-display {
  min-width: 50px;
  text-align: center;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  padding: 0 var(--space-sm);
}

.item-subtotal {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-xs);
}

.subtotal-label {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
}

.subtotal-value {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.remove-btn {
  width: 36px;
  height: 36px;
  background: var(--error-gradient);
  color: var(--text-inverse);
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.remove-btn:hover {
  transform: scale(1.1);
  box-shadow: var(--shadow-lg);
}

.remove-btn:active {
  transform: scale(0.95);
}

/* 结算区域 */
.checkout-section {
  background: var(--bg-primary);
  border-radius: var(--radius-2xl);
  padding: var(--space-3xl);
  box-shadow: var(--shadow-xl);
  position: sticky;
  bottom: var(--space-xl);
}

.price-summary {
  margin-bottom: var(--space-3xl);
  padding: var(--space-xl);
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md) 0;
  border-bottom: 1px solid var(--border-light);
}

.summary-row:last-child {
  border-bottom: none;
}

.summary-row.total {
  padding-top: var(--space-lg);
  border-top: 2px solid var(--border-medium);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
}

.summary-label {
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
}

.summary-value {
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.summary-value.free {
  color: var(--success-color);
}

.summary-row.total .summary-value {
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.checkout-actions {
  display: flex;
  gap: var(--space-lg);
}

.continue-shopping-btn, .checkout-btn {
  flex: 1;
  padding: var(--space-lg) var(--space-xl);
  border: none;
  border-radius: var(--radius-xl);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
}

.continue-shopping-btn {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 2px solid var(--border-light);
}

.checkout-btn {
  background: var(--primary-gradient);
  color: var(--text-inverse);
}

.continue-shopping-btn:hover, .checkout-btn:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .cart-container {
    padding: var(--space-lg) var(--space-md);
  }

  .page-header {
    flex-direction: column;
    gap: var(--space-lg);
    text-align: center;
  }

  .cart-item {
    flex-direction: column;
    gap: var(--space-lg);
  }

  .item-controls {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .checkout-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: var(--font-size-2xl);
  }

  .item-image {
    width: 80px;
    height: 80px;
  }

  .item-controls {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-md);
  }

  .quantity-control {
    align-self: center;
  }
}
</style>
